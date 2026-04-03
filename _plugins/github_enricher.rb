require 'net/http'
require 'json'
require 'uri'
require 'fileutils'

# GitHubEnricher
# ─────────────────────────────────────────────────────────────
# Reads _data/projects.yml and auto-fills missing `title` and
# `description` fields by calling the public GitHub REST API.
#
# Configuration (in _data/settings.yml):
#   github:
#     username: your-github-username
#
# The repo is resolved in this order:
#   1. `repo` field on the entry  (e.g. "mhalawa/trace-in-time")
#   2. Parsed from `github_url`   (e.g. "https://github.com/mhalawa/foo")
#
# Any value you write manually in the YAML is left untouched,
# so you can always override what the API returns.
#
# Results are cached to .jekyll-cache/github_enricher.json so
# repeated builds don't re-fetch unchanged repos.
#
# Rate limit: GitHub's unauthenticated API allows 60 req/hour.
# Set the GITHUB_TOKEN env variable to raise this to 5,000/hour:
#   export GITHUB_TOKEN=ghp_...
# ─────────────────────────────────────────────────────────────

module GitHubEnricher
  API_BASE    = "https://api.github.com/repos/%s"
  CACHE_FILE  = File.join(".jekyll-cache", "github_enricher.json")
  IMAGE_DIR   = File.join("images", "projects")

  class Generator < Jekyll::Generator
    safe     true
    priority :high

    def generate(site)
      projects = site.data["projects"]
      return unless projects.is_a?(Array) && !projects.empty?

      username = site.data.dig("settings", "github", "username")
      cache    = load_cache
      changed  = false

      projects.each do |project|
        repo = resolve_repo(project, username)
        next if repo.nil? || repo.empty?

        # Always ensure github_url is set — never requires an API call
        project["github_url"] ||= "https://github.com/#{repo}"

        # Always ensure a fallback title from the repo slug
        project["title"] ||= repo.split("/").last
                                  .gsub("-", " ").gsub("_", " ")
                                  .split.map(&:capitalize).join(" ")

        # Only hit the API if metadata or image is still missing
        needs_fetch = !project["description"] || !project["image"]
        next unless needs_fetch

        data = cache[repo] || fetch_repo(repo)
        next unless data

        unless cache[repo]
          cache[repo] = data
          changed = true
        end

        project["description"] ||= data["description"]

        # OG image auto-download removed — project cards use the
        # styled placeholder instead of the GitHub social card screenshot.
      end

      save_cache(cache) if changed
    end

    private

    def resolve_repo(project, default_username)
      repo_field = project["repo"]
      return nil if repo_field.nil? || repo_field.empty?

      # Already owner/repo format
      return repo_field if repo_field.include?("/")

      # Bare repo name — prepend configured username
      return nil if default_username.nil? || default_username.empty?
      "#{default_username}/#{repo_field}"
    end

    def download_og_image(repo, slug, source_dir)
      og_url  = "https://opengraph.githubassets.com/1/#{repo}"
      out_dir = File.join(source_dir, IMAGE_DIR)
      out_file = File.join(out_dir, "#{slug}.png")

      # Already downloaded — reuse
      return "/#{IMAGE_DIR}/#{slug}.png" if File.exist?(out_file)

      uri = URI(og_url)
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.get(uri.request_uri)
      end

      unless response.is_a?(Net::HTTPSuccess)
        Jekyll.logger.warn "GitHubEnricher:", "OG image fetch returned #{response.code} for #{repo}"
        return nil
      end

      FileUtils.mkdir_p(out_dir)
      File.binwrite(out_file, response.body)
      Jekyll.logger.info "GitHubEnricher:", "Saved OG image → #{IMAGE_DIR}/#{slug}.png"
      "/#{IMAGE_DIR}/#{slug}.png"
    rescue => e
      Jekyll.logger.warn "GitHubEnricher:", "Could not download OG image for #{repo}: #{e.message}"
      nil
    end

    def fetch_repo(repo)
      uri = URI(API_BASE % repo)
      req = Net::HTTP::Get.new(uri)
      req["Accept"]     = "application/vnd.github+json"
      req["User-Agent"] = "jekyll-github-enricher"

      token = ENV["GITHUB_TOKEN"]
      req["Authorization"] = "Bearer #{token}" if token && !token.empty?

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      unless response.is_a?(Net::HTTPSuccess)
        Jekyll.logger.warn "GitHubEnricher:", "API returned #{response.code} for #{repo}"
        return nil
      end

      JSON.parse(response.body)
    rescue => e
      Jekyll.logger.warn "GitHubEnricher:", "Could not fetch metadata for #{repo}: #{e.message}"
      nil
    end

    def load_cache
      return {} unless File.exist?(CACHE_FILE)
      JSON.parse(File.read(CACHE_FILE))
    rescue
      {}
    end

    def save_cache(cache)
      FileUtils.mkdir_p(File.dirname(CACHE_FILE))
      File.write(CACHE_FILE, JSON.pretty_generate(cache))
    rescue => e
      Jekyll.logger.warn "GitHubEnricher:", "Could not write cache: #{e.message}"
    end
  end
end
