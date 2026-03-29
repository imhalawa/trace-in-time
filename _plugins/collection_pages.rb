module CollectionPages
  class GeneratedPage < Jekyll::Page
    def initialize(site, base, dir, name, data)
      @site = site
      @base = base
      @dir  = dir
      @name = name

      self.process(@name)
      self.data = data
      self.content = ""
    end
  end

  class BooksPageGenerator < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      (site.data["books"] || []).each do |book|
        slug = book["slug"]
        next if slug.nil? || slug.empty?

        page_data = {
          "layout"         => "book-landing",
          "title"          => book["title"] || slug,
          "permalink"      => "/books/#{slug}/",
          "book_slug"      => slug,
          "hide_page_title"=> true,
        }
        page_data["lang"]  = book["lang"]  if book["lang"]
        page_data["draft"] = book["draft"] if book.key?("draft")

        site.pages << GeneratedPage.new(site, site.source, "/books/#{slug}", "index.html", page_data)
      end
    end
  end

  class SeriesPageGenerator < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      (site.data["series"] || []).each do |series|
        slug = series["slug"]
        next if slug.nil? || slug.empty?

        page_data = {
          "layout"         => "series-landing",
          "title"          => series["title"] || slug,
          "permalink"      => "/series/#{slug}/",
          "series_slug"    => slug,
          "hide_page_title"=> true,
        }
        page_data["lang"]  = series["lang"]  if series["lang"]
        page_data["draft"] = series["draft"] if series.key?("draft")

        site.pages << GeneratedPage.new(site, site.source, "/series/#{slug}", "index.html", page_data)
      end
    end
  end

  class PodcastsPageGenerator < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      (site.data["podcasts"] || []).each do |episode|
        slug = episode["slug"]
        next if slug.nil? || slug.empty?

        page_data = {
          "layout"          => "podcast-landing",
          "title"           => episode["title"] || slug,
          "permalink"       => "/podcasts/#{slug}/",
          "podcast_slug"    => slug,
          "hide_page_title" => true,
        }

        site.pages << GeneratedPage.new(site, site.source, "/podcasts/#{slug}", "index.html", page_data)
      end
    end
  end

  class ProjectsPageGenerator < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      (site.data["projects"] || []).each do |project|
        slug = project["slug"]
        next if slug.nil? || slug.empty?

        page_data = {
          "layout"          => "project-landing",
          "title"           => project["title"] || slug,
          "permalink"       => "/projects/#{slug}/",
          "project_slug"    => slug,
          "hide_page_title" => true,
        }

        site.pages << GeneratedPage.new(site, site.source, "/projects/#{slug}", "index.html", page_data)
      end
    end
  end

end
