# frozen_string_literal: true

require 'json'
require 'net/http'
require 'open3'
require 'set'
require 'time'

require_relative 'sentry_refs'
require_relative 'sentry_api'

# Sentry + Redmine resolution at mobile release time (GitHub Actions).
# "Fixes <REF>" convention (see sentry_refs.rb): resolve at the tag,
# GET-first, fail-open, triage protected, Redmine on stable/store only.

GITLAB_API_BASE = ENV['GITLAB_BASE_URL'] ? "#{ENV['GITLAB_BASE_URL']}/api/v4" : 'https://gitlab.infomaniak.ch/api/v4'
GITLAB_ACCESS_TOKEN = ENV['GITLAB_API_TOKEN']
# Single source of truth lives in SentryRefs (extraction and writes aligned).
REDMINE_DOMAIN = SentryRefs::REDMINE_DOMAIN
REDMINE_API_KEY = ENV['REDMINE_API_KEY']
TAG = ENV['GITHUB_REF_NAME'].to_s
SENTRY_RELEASE_BUNDLE_ID = 'com.infomaniak.chat'

STABLE_DELIVERY_GUARD_REPOS = ['webapp', 'desktop', 'mobile']
RC_TAG = /\A(\d+)\.(\d+)\.(\d+)-rc\.(\d+)\.android\z/
STORE_TAG = /\A(\d+)\.(\d+)\.(\d+)\.android\z/

def get_http(uri)
  Net::HTTP.new(uri.host, uri.port).tap do |http|
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    http.open_timeout = 10
    http.read_timeout = 60
  end
end

# Pure (testable): [:rc|:store, major, minor, patch, candidate?] or nil.
def parse_mobile_tag(tag)
  if (m = RC_TAG.match(tag))
    [:rc] + m.captures.map(&:to_i)
  elsif (m = STORE_TAG.match(tag))
    [:store] + m.captures.map(&:to_i)
  end
end

# compute-android-version formula: major + %02d minor + %03d patch + %03d candidate.
def android_version_code(major, minor, patch, candidate)
  format('%d%02d%03d%03d', major, minor, patch, candidate)
end

# Store candidate = last rc/beta + 1 (same rule as compute-android-version).
def store_candidate(last_prerelease_candidate)
  (last_prerelease_candidate || 0) + 1
end

# Last prerelease (rc/beta) candidate of the version, from local tags.
def last_prerelease_candidate(major, minor, patch)
  tags = `git tag --list '#{major}.#{minor}.#{patch}-*.*.android'`.split("\n")
  tags.filter_map { |t| t.match(/\A\d+\.\d+\.\d+-(?:rc|beta)\.(\d+)\.android\z/)&.captures&.first&.to_i }.max
end

# Previous Android tag (rc or store, same string family), for the range.
# Numeric sort by segments (lexicographic sorts rc.10 before rc.9).
# all_tags injectable to test without touching repo tags.
def previous_android_tag(tag, all_tags = nil)
  tags = (all_tags || `git tag --list '*.android'`.split("\n"))
  tags.sort_by! { |t| t.scan(/\d+/).map(&:to_i) }
  idx = tags.rindex(tag)
  return nil if idx.nil? || idx.zero?

  tags[idx - 1]
end

def gitlab_merged_mrs_between(from_sha, to_sha)
  commits_range = `git log --format='%H' #{from_sha}..#{to_sha}`.split("\n").to_set
  puts "mobile-resolve: #{commits_range.length} commits in range #{from_sha}..#{to_sha}"
  return [] if commits_range.empty?

  merged_after_param = nil
  from_date = `git show -s --format=%cI '#{from_sha}'`.strip
  if from_date && !from_date.empty?
    merged_after_param = begin
      (Time.parse(from_date) - 86_400).utc.iso8601
    rescue StandardError
      nil
    end
  end

  all_mrs = []
  page = 1
  loop do
    query = "state=merged&target_branch=develop&per_page=100&page=#{page}"
    query += "&merged_after=#{URI.encode_www_form_component(merged_after_param)}" if merged_after_param
    uri = URI.parse("#{GITLAB_API_BASE}/projects/kchat%2Fmobile/merge_requests?#{query}")
    request = Net::HTTP::Get.new(uri.request_uri)
    request['PRIVATE-TOKEN'] = GITLAB_ACCESS_TOKEN

    response = get_http(uri).request(request)
    raise "GitLab MRs => HTTP #{response.code}" unless response.code.to_i == 200

    batch = JSON.parse(response.body)
    break if batch.empty?

    all_mrs.concat(batch)
    page += 1
    if page > 20
      puts 'mobile-resolve: WARNING more than 2000 merged MRs on kchat/mobile, truncated scan (older MRs were not scanned)'
      break
    end
  end

  matched = all_mrs.select do |mr|
    sha = mr['squash_commit_sha'] || mr['merge_commit_sha']
    sha && commits_range.include?(sha)
  end
  puts "mobile-resolve: #{all_mrs.length} merged MRs scanned, #{matched.length} in range"
  matched
end

# --- Redmine (store tag only) ------------------------------------------------

def redmine_request(issue_id, body)
  uri = URI.parse("https://#{REDMINE_DOMAIN}/issues/#{issue_id}.json")
  request = Net::HTTP::Put.new(uri)
  request.content_type = 'application/json'
  request['X-Redmine-API-Key'] = REDMINE_API_KEY
  request.body = JSON.dump({ 'issue' => body })

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https', open_timeout: 10, read_timeout: 30) do |http|
    http.request(request)
  end
  raise "Redmine PUT issue #{issue_id} => HTTP #{response.code}" unless response.is_a?(Net::HTTPSuccess)
end

def partial_delivery_blockers(issue_id, mrs_by_repo)
  mrs_by_repo.flat_map do |repo, mrs|
    mrs.select { |mr| SentryRefs.extract(mr['description'].to_s)[:redmine_ids].include?(issue_id.to_s) }
       .map { |mr| "#{repo} !#{mr['iid']}" }
  end
end

def fetch_open_mrs_by_repo(repos = STABLE_DELIVERY_GUARD_REPOS)
  repos.each_with_object({}) do |repo, acc|
    mrs = []
    page = 1
    loop do
      uri = URI.parse("#{GITLAB_API_BASE}/projects/kchat%2F#{repo}/merge_requests?state=opened&per_page=100&page=#{page}")
      request = Net::HTTP::Get.new(uri.request_uri)
      request['PRIVATE-TOKEN'] = GITLAB_ACCESS_TOKEN
      response = get_http(uri).request(request)
      raise "open MRs #{repo} => HTTP #{response.code}" unless response.code.to_i == 200

      batch = JSON.parse(response.body)
      mrs.concat(batch)
      page += 1
      if batch.length == 100 && page > 5
        puts "mobile-resolve: WARNING more than 500 open MRs on #{repo}, truncated scan (degraded partial delivery guard)"
        break
      end
      break if batch.length < 100
    end
    acc[repo] = mrs
  end
rescue StandardError => e
  puts "mobile-resolve: WARNING open MR scan failed (guard disabled, historical behavior): #{e.message}"
  nil
end

def handle_store_redmine(merged_mrs, version)
  issue_ids = merged_mrs.flat_map { |mr| SentryRefs.extract(mr['description'].to_s)[:redmine_ids] }.uniq
  return false if issue_ids.empty?

  open_mrs_by_repo = fetch_open_mrs_by_repo

  failed = false
  issue_ids.each do |issue_id|
    # Fail-open per ticket: a transient Redmine error must not abort the
    # remaining tickets of the batch.
    blockers = open_mrs_by_repo ? partial_delivery_blockers(issue_id, open_mrs_by_repo) : []
    unless blockers.empty?
      redmine_request(issue_id, { 'notes' => "fix released in stable version #{version}, but partially delivered: the following MRs are still open with Fixes RM-#{issue_id}: #{blockers.join(', ')}. Status unchanged, it will move to status 3 once every MR of the batch is shipped.", 'private_notes' => false })
      puts "mobile-resolve: Redmine ##{issue_id}: partial delivery (#{blockers.join(', ')}), status unchanged"
      next
    end
    redmine_request(issue_id, { 'notes' => "fix released in stable version #{version}", 'private_notes' => false })
    redmine_request(issue_id, { 'status_id' => 3 })
    puts "mobile-resolve: Redmine ##{issue_id}: comment + status 3 (#{version})"
  rescue StandardError => e
    puts "mobile-resolve: WARNING Redmine ##{issue_id} not processed (fail-open): #{e.message}"
    failed = true
    next
  end
  failed
end

# --- Main --------------------------------------------------------------------

# Returns true on warning. A WARN result only surfaces as a GitHub warning
# annotation in the workflow log; no kChat alert is wired.
def run
  kind = parse_mobile_tag(TAG)
  if kind.nil?
    puts "mobile-resolve: SKIP tag #{TAG.inspect} (non-Android; iOS not wired in v1, see MR description)"
    return false
  end
  unless sentry_configured?
    puts 'mobile-resolve: SKIP: SENTRY_URL/SENTRY_AUTH_TOKEN not configured'
    return true
  end
  if GITLAB_ACCESS_TOKEN.to_s.empty?
    puts 'mobile-resolve: WARNING GITLAB_API_TOKEN missing, Sentry resolution + Redmine bookkeeping skipped'
    return true
  end

  major, minor, patch = kind[1, 3]
  candidate = kind[0] == :rc ? kind[4] : store_candidate(last_prerelease_candidate(major, minor, patch))
  version_code = android_version_code(major, minor, patch, candidate)
  version_name = "#{major}.#{minor}.#{patch}"
  release_name = "#{SENTRY_RELEASE_BUNDLE_ID}@#{version_name}+#{version_code}"
  puts "mobile-resolve: tag=#{TAG} release=#{release_name}"

  from_tag = previous_android_tag(TAG)
  merged_mrs = []
  if from_tag
    from_sha = Open3.capture2('git', 'rev-list', '-1', from_tag).first.to_s.strip
    to_sha = Open3.capture2('git', 'rev-list', '-1', TAG).first.to_s.strip
    merged_mrs = gitlab_merged_mrs_between(from_sha, to_sha) if !from_sha.empty? && !to_sha.empty?
  else
    puts 'mobile-resolve: SKIP range (first Android tag of the chain)'
  end

  report = []
  refs = aggregate_sentry_refs(merged_mrs, own_prefix: 'MOBILE')
  refs[:cross_short_ids].each do |c|
    report << "[mobile-resolve] WARN cross-project #{c}: no action from mobile (never PUT)"
  end
  refs[:placeholders].each do |p|
    report << "[mobile-resolve] WARN placeholder #{p} remains in a merged MR description"
  end
  issue_ids = refs[:issue_ids].dup
  refs[:short_ids].each do |sid|
    issue_ids << sentry_shortid_to_issue_id(sid)
  rescue StandardError => e
    report << "[mobile-resolve] WARN #{sid}: #{e.message}"
  end
  unless issue_ids.empty?
    sentry_ensure_release(release_name)
    issue_ids.uniq.each do |issue_id|
      report << "[mobile-resolve] #{sentry_resolve_issue(issue_id, release_name)}"
    rescue StandardError => e
      report << "[mobile-resolve] WARN issue #{issue_id}: #{e.message}"
    end
  end
  report.each { |line| puts line }
  warned = report.any? { |line| line.include?('WARN') }

  if kind[0] == :store
    if REDMINE_API_KEY.to_s.empty?
      puts 'mobile-resolve: WARNING REDMINE_API_KEY missing, store Redmine bookkeeping skipped'
      warned = true
    else
      warned = true if handle_store_redmine(merged_mrs, version_name)
    end
  end
  warned
rescue StandardError => e
  puts "mobile-resolve: WARNING phase aborted (fail-open, the release continues): #{e.class}: #{e.message}"
  true
end

if $PROGRAM_NAME == __FILE__
  warned = run
  puts "SENTRY_RESOLVE_RESULT: #{warned ? 'WARN' : 'OK'}"
  exit 0
end
