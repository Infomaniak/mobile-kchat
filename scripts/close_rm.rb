require 'json'
require 'net/http'

# === ENV ===
REDMINE_DOMAIN = ENV['REDMINE_DOMAIN']
REDMINE_API_KEY = ENV['REDMINE_API_KEY']
BRANCH_NAME = ENV['GITHUB_REF_NAME']
GITHUB_SHA = ENV['GITHUB_SHA']
NOTIFY_CHANNEL = ENV['MATTERMOST_WEBHOOK_URL']

# === Redmine ===
def extract_redmine_links(text)
  text.scan(/https:\/\/#{Regexp.escape(REDMINE_DOMAIN)}\/issues\/(\d+)/).flatten
end

def leave_comment_on_redmine_ticket(issue_id, comment, is_private = false)
  uri = URI.parse("https://#{REDMINE_DOMAIN}/issues/#{issue_id}.json")
  request = Net::HTTP::Put.new(uri)
  request.content_type = "application/json"
  request['X-Redmine-API-Key'] = REDMINE_API_KEY
  request.body = JSON.dump({ "issue" => { "notes" => comment, "private_notes" => is_private } })
  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') { |http| http.request(request) }
  puts response.is_a?(Net::HTTPSuccess) ? "Comment added to Redmine ##{issue_id}" : "Failed to comment Redmine ##{issue_id}: #{response.body}"
end

# === GitHub ===
def get_commit_message(sha)
  uri = URI.parse("https://api.github.com/repos/#{ENV['GITHUB_REPOSITORY']}/commits/#{sha}")
  req = Net::HTTP::Get.new(uri.request_uri)
  req['Authorization'] = "token #{ENV['GITHUB_TOKEN']}"
  req['Accept'] = 'application/vnd.github+json'
  res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }
  return nil unless res.code.to_i == 200
  JSON.parse(res.body)['commit']['message']
end

# === MAIN ===
puts "Processing beta branch: #{BRANCH_NAME}"
commit_message = get_commit_message(GITHUB_SHA)
if commit_message.nil?
  puts "Failed to fetch commit message for #{GITHUB_SHA}"
  exit 1
end

redmine_links = extract_redmine_links(commit_message)
if redmine_links.empty?
  puts "No Redmine links found in commit #{GITHUB_SHA}"
else
  redmine_links.each do |issue_id|
    leave_comment_on_redmine_ticket(issue_id, "Fix released in iOS beta build #{BRANCH_NAME}")
  end
end
