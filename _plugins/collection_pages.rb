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

  class ListsPageGenerator < Jekyll::Generator
    safe true
    priority :normal

    def generate(site)
      (site.data["lists"] || []).each do |list|
        slug = list["slug"]
        next if slug.nil? || slug.empty?

        page_data = {
          "layout"         => "list-landing",
          "title"          => list["title"] || slug,
          "permalink"      => "/lists/#{slug}/",
          "list_slug"      => slug,
          "hide_page_title"=> true,
        }
        page_data["lang"]  = list["lang"]  if list["lang"]
        page_data["draft"] = list["draft"] if list.key?("draft")

        site.pages << GeneratedPage.new(site, site.source, "/lists/#{slug}", "index.html", page_data)
      end
    end
  end
end
