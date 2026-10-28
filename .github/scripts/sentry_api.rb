# frozen_string_literal: true

require 'json'
require 'net/http'

require_relative 'sentry_refs'

# Sentry resolution at release time (GET-first, fail-open, triage protected,
# never PUT outside the project). "Fixes <REF>" convention: see sentry_refs.rb.
SENTRY_URL = (ENV['SENTRY_URL'] || "https://#{SentryRefs::SENTRY_HOST}").to_s.sub(%r{/+\z}, '')
SENTRY_ORG = ENV['SENTRY_ORG'] || 'sentry'
SENTRY_PROJECT = ENV['SENTRY_PROJECT'] || 'webapp'
SENTRY_AUTH_TOKEN = ENV['SENTRY_AUTH_TOKEN']

# Raw GET/POST/PUT against the Sentry API. Returns [code, parsed body or nil].
# Raises on network errors; the caller rescues.
def sentry_api(method, path, body = nil)
  uri = URI.parse("#{SENTRY_URL}/api/0#{path}")
  request_class = { get: Net::HTTP::Get, post: Net::HTTP::Post, put: Net::HTTP::Put }.fetch(method)
  request = request_class.new(uri.request_uri)
  request['Authorization'] = "Bearer #{SENTRY_AUTH_TOKEN}"
  request['Content-Type'] = 'application/json'
  request.body = JSON.dump(body) if body

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https', open_timeout: 10, read_timeout: 30) do |http|
    http.request(request)
  end
  parsed = begin
    JSON.parse(response.body)
  rescue StandardError
    nil
  end
  [response.code.to_i, parsed]
end

def sentry_configured?
  host = begin
    URI.parse(SENTRY_URL).host
  rescue StandardError
    nil
  end
  !host.to_s.empty? && !SENTRY_AUTH_TOKEN.to_s.empty?
end

# Pure decision (testable): what to do with an issue from its GET payload.
def sentry_issue_action(issue)
  status = issue['status'].to_s
  anchor = (issue['statusDetails'] || {})['inRelease'].to_s
  # Triage protection: archived_* covers serializations across Sentry versions.
  return :skip_ignored if status == 'ignored'
  return :skip_archived if status == 'archived'
  return :skip_archived if issue['substatus'].to_s.start_with?('archived')
  return :skip_anchored if status == 'resolved' && !anchor.empty?
  return :resolve_backlog if status == 'resolved'

  :resolve
end

# Merges the Sentry refs of all merged MRs of the range (dedup).
# own_prefix: short ID prefix owned by this repo (WEBAPP).
def aggregate_sentry_refs(merged_mrs, own_prefix:)
  out = { issue_ids: [], short_ids: [], cross_short_ids: [], placeholders: [] }
  (merged_mrs || []).each do |mr|
    refs = SentryRefs.extract(mr['description'].to_s, own_prefix: own_prefix)
    refs[:sentry_issue_ids].each { |i| out[:issue_ids] << i unless out[:issue_ids].include?(i) }
    refs[:own_short_ids].each { |s| out[:short_ids] << s unless out[:short_ids].include?(s) }
    refs[:cross_short_ids].each { |c| out[:cross_short_ids] << c unless out[:cross_short_ids].include?(c) }
    refs[:placeholders].each { |p| out[:placeholders] << p unless out[:placeholders].include?(p) }
  end
  out
end

# Short ID => numeric issue id (the list ?shortId= filter is broken).
def sentry_shortid_to_issue_id(short_id)
  code, data = sentry_api(:get, "/organizations/#{SENTRY_ORG}/shortids/#{URI.encode_www_form_component(short_id)}/")
  raise "shortid #{short_id} => HTTP #{code}" unless code == 200 && data.is_a?(Hash) && data.dig('group', 'id')

  data['group']['id'].to_s
end

def sentry_put_resolve(issue_id, release_name)
  code, body = sentry_api(
    :put,
    "/organizations/#{SENTRY_ORG}/issues/#{issue_id}/",
    { 'status' => 'resolved', 'statusDetails' => { 'inRelease' => release_name } }
  )
  raise "PUT resolve issue #{issue_id} => HTTP #{code} #{(body || {}).to_s[0, 200]}" unless code == 200
end

# create-or-verify: release:sentry finalizes in parallel, order not guaranteed.
def sentry_ensure_release(release_name)
  code, _body = sentry_api(:get, "/organizations/#{SENTRY_ORG}/releases/#{URI.encode_www_form_component(release_name)}/")
  return true if code == 200

  if code == 404
    ccode, cbody = sentry_api(
      :post,
      "/organizations/#{SENTRY_ORG}/releases/",
      { 'version' => release_name, 'projects' => [SENTRY_PROJECT] }
    )
    if ccode == 201
      return true
    end
    # create-or-verify race: already created meanwhile = success.
    if [400, 409].include?(ccode)
      vcode, _vbody = sentry_api(:get, "/organizations/#{SENTRY_ORG}/releases/#{URI.encode_www_form_component(release_name)}/")
      return true if vcode == 200
    end
    raise "POST release #{release_name} => HTTP #{ccode} #{(cbody || {}).to_s[0, 200]}"
  end
  raise "GET release #{release_name} => HTTP #{code}"
end

# One action for an issue. Raises on API error; the caller rescues.
def sentry_resolve_issue(issue_id, release_name)
  code, issue = sentry_api(:get, "/organizations/#{SENTRY_ORG}/issues/#{issue_id}/")
  raise "GET issue #{issue_id} => HTTP #{code}" unless code == 200 && issue.is_a?(Hash)

  project = issue.dig('project', 'slug').to_s
  return "WARN issue #{issue_id}: project '#{project}' != '#{SENTRY_PROJECT}', skip (never PUT outside project)" unless project == SENTRY_PROJECT

  case sentry_issue_action(issue)
  when :skip_ignored
    "SKIP issue #{issue_id}: ignored (triage), no action"
  when :skip_archived
    "SKIP issue #{issue_id}: archived, no action"
  when :skip_anchored
    "SKIP issue #{issue_id}: already resolved in #{issue.dig('statusDetails', 'inRelease')}"
  when :resolve_backlog
    sentry_put_resolve(issue_id, release_name)
    "RESOLVED issue #{issue_id}: was resolved without anchor (backlog), re-anchored => #{release_name}"
  else
    sentry_put_resolve(issue_id, release_name)
    "RESOLVED issue #{issue_id} => #{release_name}"
  end
end
