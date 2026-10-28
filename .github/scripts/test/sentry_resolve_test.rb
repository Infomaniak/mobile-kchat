# frozen_string_literal: true

# Tests des fonctions pures de l'orchestrateur mobile sentry_resolve.rb.
# Run: ruby .github/scripts/test/sentry_resolve_test.rb

require 'minitest/autorun'
require_relative '../sentry_resolve'

describe 'parse_mobile_tag' do
  it 'parse un tag rc Android (canal de test)' do
    _(parse_mobile_tag('1.0.46-rc.3.android')).must_equal [:rc, 1, 0, 46, 3]
  end

  it 'parse un tag store Android (production)' do
    _(parse_mobile_tag('1.0.46.android')).must_equal [:store, 1, 0, 46]
  end

  it 'ignore les tags iOS et inconnus (non cable v1)' do
    _(parse_mobile_tag('1.0.46-rc.3.ios')).must_be_nil
    _(parse_mobile_tag('1.0.46.ios')).must_be_nil
    _(parse_mobile_tag('garbage')).must_be_nil
  end
end

describe 'android_version_code' do
  it 'suit la formule compute-android-version (major + 2+3+3 digits)' do
    _(android_version_code(1, 0, 46, 4)).must_equal '100046004'
    _(android_version_code(1, 0, 46, 3)).must_equal '100046003'
    _(android_version_code(12, 34, 5, 67)).must_equal '1234005067'
  end
end

describe 'store_candidate' do
  it 'dernier rc + 1, 0 si aucun' do
    _(store_candidate(3)).must_equal 4
    _(store_candidate(nil)).must_equal 1
  end
end

describe 'previous_android_tag (tri numerique)' do
  it 'met rc.10 apres rc.9 et separe les familles beta/rc' do
    tags = ['1.1.0-rc.10.android', '1.2.0-rc.9.android', '1.2.0-rc.10.android', '1.2.0-beta.8.android']
    _(previous_android_tag('1.2.0-rc.10.android', tags)).must_equal '1.2.0-rc.9.android'
    _(previous_android_tag('1.2.0-rc.9.android', tags)).must_equal '1.2.0-beta.8.android'
    _(previous_android_tag('1.2.0-beta.8.android', tags)).must_equal '1.1.0-rc.10.android'
    _(previous_android_tag('1.2.0-rc.11.android', tags)).must_be_nil
  end
end

describe 'partial_delivery_blockers' do
  it 'detecte les MRs ouvertes qui revendiquent le meme ticket' do
    mrs = {
      'webapp' => [{ 'iid' => 101, 'description' => 'Fixes RM-111111' }],
      'mobile' => [{ 'iid' => 303, 'description' => 'bare mention https://redmine.infomaniak.ch/issues/111111' }]
    }
    _(partial_delivery_blockers('111111', mrs)).must_equal ['webapp !101']
  end
end

# Redmine write stubs: RM-111111 fails (transient 5xx), the others succeed.
def redmine_request(issue_id, _payload)
  raise StandardError, 'stub redmine 5xx' if issue_id == '111111'

  true
end

def fetch_open_mrs_by_repo
  nil
end

describe 'handle_store_redmine' do
  it 'returns true (WARN signal) when a ticket fails, and still processes the next one' do
    merged_mrs = [{ 'description' => 'Fixes RM-111111 and RM-222222' }]
    _(handle_store_redmine(merged_mrs, '1.2.3')).must_equal true
  end

  it 'returns false when every ticket is processed' do
    merged_mrs = [{ 'description' => 'Fixes RM-222222' }]
    _(handle_store_redmine(merged_mrs, '1.2.3')).must_equal false
  end
end
