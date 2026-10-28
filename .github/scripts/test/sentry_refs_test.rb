# frozen_string_literal: true

# TDD tests for the "Fixes <REF>" extraction in MR descriptions.
# Grammar validated adversarially (43 fixtures, reviews 2026-10-19).
# All identifiers below are FICTIONAL (short IDs, issue numbers, MR numbers).
# Run: ruby .gitlab/test/sentry_refs_test.rb

require 'minitest/autorun'
require 'open3'
require 'rbconfig'
require_relative '../sentry_refs'

SENTRY_URL = 'https://sentry-kchat.infomaniak.com/organizations/sentry/issues/'
REDMINE_URL = 'https://redmine.infomaniak.ch/issues/'
SENTRY_REFS_PATH = File.expand_path('../sentry_refs.rb', __dir__)

describe SentryRefs do
  # --- MR-shaped descriptions ----------------------------------------------------

  it 'extracts refs from a full MR description (shortid + URL dedup handled later)' do
    desc = <<~DESC
      ## Bug

      #### Fonctionnel
      Sentry crash (issue WEBAPP-A1B2, links below).

      ## Solution
      Guard undefined registrants.

      ## Ticket
      None (no ticket). Sentry: Fixes WEBAPP-A1B2 + WEBAPP-C3D4
      #{SENTRY_URL}111111/
      #{SENTRY_URL}222222/
    DESC
    r = SentryRefs.extract(desc, own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2', 'WEBAPP-C3D4']
    _(r[:sentry_issue_ids]).must_equal ['111111', '222222']
    _(r[:redmine_ids]).must_be_empty
    _(r[:cross_short_ids]).must_be_empty
  end

  it 'extracts the ref from a one-line MR description' do
    desc = "Sentry: Fixes WEBAPP-E5F6\n#{SENTRY_URL}333333/"
    r = SentryRefs.extract(desc, own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-E5F6']
    _(r[:sentry_issue_ids]).must_equal ['333333']
  end

  # --- Multi-ref forms -----------------------------------------------------------

  it 'accepts the + separator' do
    r = SentryRefs.extract('Fixes WEBAPP-A1B2 + WEBAPP-C3D4', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2', 'WEBAPP-C3D4']
  end

  it 'accepts comma, and/et, semicolon lists' do
    r = SentryRefs.extract('Fixes: WEBAPP-A1B2, WEBAPP-C3D4 and WEBAPP-E5F6', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2', 'WEBAPP-C3D4', 'WEBAPP-E5F6']
    r = SentryRefs.extract('Fixes WEBAPP-A1B2 et WEBAPP-C3D4', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2', 'WEBAPP-C3D4']
    r = SentryRefs.extract('Fixes WEBAPP-A1B2; WEBAPP-C3D4', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2', 'WEBAPP-C3D4']
  end

  it 'is case-insensitive and normalizes' do
    r = SentryRefs.extract('fixes webapp-e5f6', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-E5F6']
    r = SentryRefs.extract('FIXES WEBAPP-A1B2', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2']
  end

  it 'accepts the native Sentry keyword set' do
    %w[Fix Fixes Fixed Close Closes Closed Resolve Resolves Resolved].each do |kw|
      r = SentryRefs.extract("#{kw} WEBAPP-A1B2", own_prefix: 'WEBAPP')
      _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2'], "keyword #{kw}"
    end
  end

  it 'accepts two Fixes in the same description and on the same line' do
    r = SentryRefs.extract("Fixes WEBAPP-A1B2\nand also fixes WEBAPP-C3D4", own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2', 'WEBAPP-C3D4']
    r = SentryRefs.extract('Fixes WEBAPP-A1B2. Fixes WEBAPP-C3D4.', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2', 'WEBAPP-C3D4']
  end

  it 'accepts bullet-list continuation lines' do
    r = SentryRefs.extract("Fixes:\n- WEBAPP-A1B2\n- WEBAPP-C3D4", own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2', 'WEBAPP-C3D4']
  end

  it 'catches mid-line refs (template shape)' do
    r = SentryRefs.extract('Ticket: none. Sentry: Fixes WEBAPP-G7H8', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-G7H8']
  end

  it 'catches a markdown Redmine link as a single id' do
    r = SentryRefs.extract("Fixes [RM-123456](#{REDMINE_URL}123456)", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_equal ['123456']
  end

  it 'continues on pure lines with a Sentry URL' do
    r = SentryRefs.extract("Fixes WEBAPP-A1B2\n#{SENTRY_URL}111111/", own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2']
    _(r[:sentry_issue_ids]).must_equal ['111111']
  end

  # --- Stops and prose -----------------------------------------------------------

  it 'stops at prose after a ref' do
    r = SentryRefs.extract('Fixes WEBAPP-A1B2, this is the reducer crash.', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2']
    r = SentryRefs.extract('Fixes RM-123, otherwise see RM-456', own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_equal ['123']
    r = SentryRefs.extract("Fixes RM-1 (see also RM-2)", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_equal ['1']
  end

  it 'ignores negations' do
    r = SentryRefs.extract('This does NOT fix RM-123. It fixes RM-456.', own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_equal ['456']
    r = SentryRefs.extract("Fixes in progress", own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_be_empty
    r = SentryRefs.extract('Fixes:', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_be_empty
    r = SentryRefs.extract("won't fix RM-123 before the release", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_be_empty
  end

  it 'ignores bare mentions (no keyword)' do
    r = SentryRefs.extract('Sentry issues: WEBAPP-A1B2, WEBAPP-C3D4', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_be_empty
    r = SentryRefs.extract("linked to RM-123456 and #{SENTRY_URL}111111/", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_be_empty
    _(r[:sentry_issue_ids]).must_be_empty
    r = SentryRefs.extract("[RM-123456] also reported in #{REDMINE_URL}789012", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_be_empty
  end

  it 'ignores code blocks, quotes and HTML comments' do
    r = SentryRefs.extract("```\nFixes RM-111111\n```", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_be_empty
    r = SentryRefs.extract("> Fixes RM-111111", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_be_empty
    r = SentryRefs.extract("<!-- Fixes WEBAPP-G7H8 -->\nFixes RM-222222", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_equal ['222222']
    _(r[:own_short_ids]).must_be_empty
  end

  it 'neutralizes the template placeholder as a warning, not a ref' do
    r = SentryRefs.extract('Sentry: Fixes WEBAPP-XXX', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_be_empty
    _(r[:placeholders]).must_equal ['WEBAPP-XXX']
  end

  it 'ignores a non-pure URL in a continuation list' do
    r = SentryRefs.extract("Fixes WEBAPP-A1B2\n- reference link: #{SENTRY_URL}55555/", own_prefix: 'WEBAPP')
    _(r[:sentry_issue_ids]).must_be_empty
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2']
  end

  # --- False negatives -----------------------------------------------------------

  it 'accepts http Redmine URLs, query params, numeric and long shortids' do
    r = SentryRefs.extract("Fixes http://redmine.infomaniak.ch/issues/123456?query=1#note-3", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_equal ['123456']
    r = SentryRefs.extract('Fixes WEBAPP-C3D4', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-C3D4']
    r = SentryRefs.extract('Fixes WEBAPP-12345', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-12345']
    r = SentryRefs.extract("Fixes #{SENTRY_URL}111111?query=1", own_prefix: 'WEBAPP')
    _(r[:sentry_issue_ids]).must_equal ['111111']
  end

  it 'rejects a too-long shortid entirely (no truncation)' do
    r = SentryRefs.extract('Fixes WEBAPP-123456789', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_be_empty
  end

  it 'rejects a too-long RM id' do
    r = SentryRefs.extract('Fixes RM-1234567890123', own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_be_empty
  end

  # --- Cross-project -------------------------------------------------------------

  it 'routes cross-project refs to their own bucket (warn, never PUT)' do
    r = SentryRefs.extract('Fixes MOBILE-577 and DESKTOP-1234', own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_be_empty
    _(r[:cross_short_ids]).must_equal %w[MOBILE-577 DESKTOP-1234]
  end

  # --- Dedup ---------------------------------------------------------------------

  it 'deduplicates within a category' do
    r = SentryRefs.extract("Fixes WEBAPP-A1B2 + webapp-a1b2", own_prefix: 'WEBAPP')
    _(r[:own_short_ids]).must_equal ['WEBAPP-A1B2']
    r = SentryRefs.extract("Fixes RM-123456 et #{REDMINE_URL}123456", own_prefix: 'WEBAPP')
    _(r[:redmine_ids]).must_equal ['123456']
  end

  # --- Degenerate inputs ---------------------------------------------------------

  it 'handles nil and empty input' do
    _(SentryRefs.extract(nil, own_prefix: 'WEBAPP')[:own_short_ids]).must_be_empty
    _(SentryRefs.extract('', own_prefix: 'WEBAPP')[:redmine_ids]).must_be_empty
    _(SentryRefs.extract(nil, own_prefix: 'WEBAPP')).must_be_instance_of Hash
  end

  it 'without own_prefix, classifies everything as own (caller filters)' do
    r = SentryRefs.extract('Fixes WEBAPP-A1B2 + MOBILE-577')
    _(r[:own_short_ids]).must_equal %w[WEBAPP-A1B2 MOBILE-577]
    _(r[:cross_short_ids]).must_be_empty
  end

  # --- SENTRY_HOST derivation ----------------------------------------------------

  # Subprocess per case: SENTRY_HOST is frozen at require time, so env
  # isolation must be real (a fresh interpreter boots per case with BOTH
  # keys set explicitly in its environment; nil = unset).
  def sentry_host_for_env(sentry_url, sentry_host)
    env = ENV.to_h.merge('SENTRY_URL' => sentry_url, 'SENTRY_HOST' => sentry_host)
    out, = Open3.capture2e(env, RbConfig.ruby, '-e', "require #{SENTRY_REFS_PATH.inspect}; puts SentryRefs::SENTRY_HOST")
    out.strip
  end

  it 'derives the production default when both SENTRY_URL and SENTRY_HOST are unset' do
    _(sentry_host_for_env(nil, nil)).must_equal 'sentry-kchat.infomaniak.com'
  end

  it 'derives SENTRY_HOST from SENTRY_URL (production host)' do
    _(sentry_host_for_env('https://sentry-kchat.infomaniak.com', nil)).must_equal 'sentry-kchat.infomaniak.com'
  end

  it 'derives SENTRY_HOST from SENTRY_URL (other host, trailing slash)' do
    _(sentry_host_for_env('https://other.example.com/', nil)).must_equal 'other.example.com'
  end

  it 'derives the production default when SENTRY_URL is empty' do
    _(sentry_host_for_env('', nil)).must_equal 'sentry-kchat.infomaniak.com'
  end

  it 'uses the SENTRY_HOST env override when SENTRY_URL is unset' do
    _(sentry_host_for_env(nil, 'custom.example.com')).must_equal 'custom.example.com'
  end
end
