require 'net/http'
require 'json'
require 'uri'
require 'fileutils'

# YouTubeEnricher
# ─────────────────────────────────────────────────────────────
# Reads _data/music.yml after Jekyll loads site data and fills
# in missing fields (title, artist) by calling the public
# YouTube oEmbed endpoint — no API key required.
#
# Only fields that are ABSENT in the YAML are fetched; any
# value you write manually is left untouched, letting you
# override channel names, shorten titles, etc.
#
# Minimal YAML entry:
#
#   - youtube_id: "dQw4w9WgXcQ"
#     genre: "Pop"          # optional
#     note:  "..."          # optional
#
# Results are cached to _data/.youtube_cache.json so repeated
# builds don't re-fetch unchanged IDs.
# ─────────────────────────────────────────────────────────────

module YouTubeEnricher
  OEMBED = "https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=%s"
  # Stored outside _data/ so Jekyll --watch does not see it as a data
  # change and trigger an infinite rebuild loop.
  CACHE_FILE = File.join(".jekyll-cache", "youtube_enricher.json")

  class Generator < Jekyll::Generator
    safe  true
    priority :high

    def generate(site)
      cache   = load_cache
      changed = false

      # Music: auto-fills title + artist
      changed |= enrich_tracks(site.data["music"], cache, "artist")

      # Podcasts: auto-fills title + podcast (show name)
      changed |= enrich_tracks(site.data["podcasts"], cache, "podcast")

      save_cache(cache) if changed
    end

    def enrich_tracks(tracks, cache, author_field)
      return false unless tracks.is_a?(Array) && !tracks.empty?

      changed = false
      tracks.each do |track|
        id = track["youtube_id"]
        next if id.nil? || id.empty?

        # Only fetch if at least one auto-field is missing
        next if track["title"] && track[author_field]

        data = cache[id] || fetch_oembed(id)
        next unless data

        unless cache[id]
          cache[id] = data
          changed = true
        end
        track["title"]      ||= data["title"]
        track[author_field] ||= clean_author(data["author_name"])
      end
      changed
    end

    private

    def fetch_oembed(video_id)
      url = URI(OEMBED % video_id)
      response = Net::HTTP.get_response(url)
      return nil unless response.is_a?(Net::HTTPSuccess)
      JSON.parse(response.body)
    rescue => e
      Jekyll.logger.warn "YouTubeEnricher:", "Could not fetch metadata for #{video_id}: #{e.message}"
      nil
    end

    # Strip common YouTube channel suffixes like " - Topic", "VEVO", " Official"
    def clean_author(name)
      return name if name.nil?
      name
        .sub(/ - Topic$/i, "")
        .sub(/VEVO$/i, "")
        .sub(/ Official(?: Channel)?$/i, "")
        .strip
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
      Jekyll.logger.warn "YouTubeEnricher:", "Could not write cache: #{e.message}"
    end
  end
end
