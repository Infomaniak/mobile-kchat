# frozen_string_literal: true

require 'uri'

# Pure extraction of "Fixes <REF>" refs from MR descriptions.
# No network: fully testable module (see test/sentry_refs_test.rb).
# All identifiers in comments and fixtures are FICTIONAL.
#
# Convention (agreed 2026-10-19):
# - a ref counts only when preceded by a resolution keyword (native Sentry
#   set: Fix/Fixes/Fixed/Close/Closes/Closed/Resolve/Resolves/Resolved,
#   case-insensitive);
# - a ref without a keyword = bare mention, no action;
# - accepted shapes: RM-XXXXXX, Redmine URL, Sentry short ID
#   (WEBAPP|MOBILE|DESKTOP)-XXXX, Sentry URL;
# - multi-refs separated by spaces , ; + & / ( ) [ ] : and/et, bullet lists
#   as continuation lines;
# - code blocks, quotes and HTML comments are ignored;
# - negations ("not fix", "won't fix") neutralize the keyword;
# - the template placeholder (WEBAPP-XXX) lands in :placeholders (warning),
#   never as a ref.

module SentryRefs
  KEYWORD = /\b(?:fix|fixes|fixed|close|closes|closed|resolve|resolves|resolved)\b/i

  # Single source of truth for the instance hosts: derived from env with the
  # production defaults, reused by the orchestrators (sentry_resolve.rb and
  # sentry_api.rb) so extraction and writes can never drift apart. SENTRY_HOST
  # derives from SENTRY_URL first, so extraction follows the same host as writes.
  SENTRY_HOST = ((URI.parse(ENV['SENTRY_URL'].to_s).host rescue nil) || ENV['SENTRY_HOST'] || 'sentry-kchat.infomaniak.com')
  REDMINE_DOMAIN = ENV['REDMINE_DOMAIN'] || 'redmine.infomaniak.ch'
  SURL = %r{\Ahttps?://#{Regexp.escape(SENTRY_HOST)}/\S*?/issues/(\d+)}i
  RURL = %r{\Ahttps?://#{Regexp.escape(REDMINE_DOMAIN)}/issues/(\d+)}i
  SHORT = /\A(WEBAPP|MOBILE|DESKTOP)-([A-Z0-9]{2,8})(?![A-Za-z0-9])/i
  RM = /\ARM-(\d{1,10})(?!\d)/i

  NEGATION = /\b(?:not|no|never|wont|won't|doesnt|doesn't|dont|don't|cant|can't|cannot|sans|pas)\b[\s,.:!-]*\z/i
  SEP_CHARS = /[\s,;+&\/()\[\]:]/
  BULLET = /\A[-*+]\s+/

  class << self
    # Returns:
    #   own_short_ids    : short IDs of this repo's project (["WEBAPP-A1B2"])
    #   cross_short_ids  : short IDs of other projects (warn, never PUT)
    #   sentry_issue_ids : numeric ids from Sentry URLs (project checked at
    #                      the API STEP, the URL carries no project)
    #   redmine_ids      : numeric Redmine ids (RM-N and deduped URLs)
    #   placeholders     : detected template placeholders (WEBAPP-XXX)
    # own_prefix nil = no filtering, everything goes to own_short_ids.
    def extract(description, own_prefix: nil)
      acc = Accumulator.new(own_prefix)
      return acc.result if description.nil?

      lines = preprocess(description.to_s)
      lines.each_with_index do |line, i|
        scan_line(acc, lines, i, line)
      end
      acc.result
    end

    private

    def scan_line(acc, lines, i, line)
      pos = 0
      while (m = KEYWORD.match(line, pos))
        kw_begin = m.begin(0)
        kw_end = m.end(0)
        pos = kw_end
        next if negated?(line, kw_begin)

        refs, reached_eol = scan_forward(line, kw_end)
        acc.add_all(refs)
        collect_continuation(acc, lines, i) if reached_eol
      end
    end

    def collect_continuation(acc, lines, i)
      j = i + 1
      while j < lines.length
        crefs, pure = scan_pure(lines[j])
        break unless pure && !crefs.empty?

        acc.add_all(crefs)
        j += 1
      end
    end

    def negated?(line, kw_begin)
      pre = line[0...kw_begin]
      # Short window: no negative slice (nil for lines < 30 chars).
      # The \z anchor makes a whole-line scan equivalent and cheap.
      pre.to_s.match?(NEGATION)
    end

    # Consumes separators (spaces, punctuation, isolated and/et).
    def skip_seps(line, pos)
      n = line.length
      loop do
        pos += 1 while pos < n && line[pos].match?(SEP_CHARS)
        break if pos >= n

        rest = line[pos..-1]
        m = rest.match(/\A(and|et)(?![A-Za-z0-9])/i)
        break unless m

        after = pos + m[0].length
        break unless after >= n || line[after].match?(SEP_CHARS)

        pos = after
      end
      pos
    end

    def match_ref(line, pos)
      rest = line[pos..-1]
      return nil, pos unless rest

      if (m = SURL.match(rest))
        return { type: :sentry_issue, value: m[1] }, pos + m.end(1)
      end
      if (m = RURL.match(rest))
        return { type: :redmine, value: m[1] }, pos + m.end(1)
      end
      if (m = SHORT.match(rest))
        prefix = m[1].upcase
        id = m[2].upcase
        full = "#{prefix}-#{id}"
        if id == 'XXX'
          return { type: :placeholder, value: full }, pos + m.end(0)
        end
        return { type: :sentry_short, value: full, prefix: prefix, id: id }, pos + m.end(0)
      end
      if (m = RM.match(rest))
        return { type: :redmine, value: m[1] }, pos + m.end(1)
      end
      [nil, pos]
    end

    # Forward list after a keyword: (SEP* REF)*, stops at the first token
    # that is neither a separator nor a ref. reached_eol = the line ended on
    # a separator or a ref (the list may continue on the next line).
    def scan_forward(line, pos)
      refs = []
      loop do
        pos = skip_seps(line, pos)
        return refs, true if pos >= line.length

        ref, npos = match_ref(line, pos)
        return refs, false unless ref

        refs << ref
        pos = npos
      end
    end

    # "Pure" line = only refs/separators (optional bullet), >= 1 ref.
    def scan_pure(line)
      s = line.strip
      s = s.sub(BULLET, '')
      return [], false if s.empty?

      ref, pos = match_ref(s, 0)
      return [], false unless ref

      refs = [ref]
      loop do
        pos = skip_seps(s, pos)
        break if pos >= s.length

        r, npos = match_ref(s, pos)
        break unless r

        refs << r
        pos = npos
      end
      tail = s[pos..-1].to_s
      pure = tail.match?(/\A[\s,;+&\/()\[\]:]*\z/)
      [refs, pure]
    end

    def preprocess(text)
      t = text.gsub(/<!--.*?-->/m, ' ')
      t = t.gsub(/```.*?```/m, ' ')
      t = t.gsub(/~~~.*?~~~/m, ' ')
      t = t.gsub(/^\s*>.*\n?/, '')
      t.lines(chomp: true)
    end
  end

  class Accumulator
    def initialize(own_prefix)
      @own_prefix = own_prefix&.upcase
      @own = []
      @cross = []
      @sids = []
      @rm = []
      @ph = []
    end

    def add_all(refs)
      refs.each { |r| add(r) }
    end

    def add(r)
      case r[:type]
      when :sentry_short
        if @own_prefix.nil? || r[:prefix] == @own_prefix
          @own << r[:value] unless @own.include?(r[:value])
        else
          @cross << r[:value] unless @cross.include?(r[:value])
        end
      when :sentry_issue
        @sids << r[:value] unless @sids.include?(r[:value])
      when :redmine
        @rm << r[:value] unless @rm.include?(r[:value])
      when :placeholder
        @ph << r[:value] unless @ph.include?(r[:value])
      end
    end

    def result
      {
        own_short_ids: @own,
        cross_short_ids: @cross,
        sentry_issue_ids: @sids,
        redmine_ids: @rm,
        placeholders: @ph
      }
    end
  end
end
