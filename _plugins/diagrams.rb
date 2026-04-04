# frozen_string_literal: true

require "nokogiri"
require "open3"

# Renders diagram code fences at build time — no external services, no client-side JS:
#   ```plantuml  →  inline SVG via local plantuml.jar
#   ```vegalite  →  div+JSON for vega-embed (client-side, charts only)
#
# PlantUML JAR location (in order of preference):
#   1. PLANTUML_JAR environment variable
#   2. vendor/plantuml.jar in repo root
module Jekyll
  class DiagramConverter
    DIAGRAM_TAGS = %w[code div].freeze
    JAR_PATH = ENV.fetch("PLANTUML_JAR", File.join(File.dirname(__FILE__), "..", "vendor", "plantuml.jar"))
    @java_missing_warned = false

    class << self
      attr_accessor :java_missing_warned
    end

    def self.convert(doc)
      return unless doc.output_ext == ".html"
      return unless doc.is_a?(Jekyll::Page) || doc.write?

      parsed = Nokogiri::HTML(doc.output)
      changed = false
      vl_index = 0

      DIAGRAM_TAGS.each do |tag|
        parsed.css("#{tag}[class~='language-plantuml']").each do |el|
          svg = render_plantuml(el.text)
          next unless svg

          figure = build_figure(parsed)
          figure.inner_html = svg
          el.replace(figure)
          changed = true
        end

        parsed.css("#{tag}[class~='language-vegalite']").each do |el|
          vl_index += 1
          figure = build_figure(parsed)

          vl_div = Nokogiri::XML::Node.new("div", parsed)
          vl_div["class"] = "vegalite-diagram"
          vl_div["id"] = "vl-#{vl_index}"

          spec_script = Nokogiri::XML::Node.new("script", parsed)
          spec_script["type"] = "application/json"
          spec_script.content = el.text.strip

          vl_div.add_child(spec_script)
          figure.add_child(vl_div)
          el.replace(figure)
          changed = true
        end
      end

      doc.output = parsed.to_html if changed
    end

    def self.render_plantuml(source)
      unless File.exist?(JAR_PATH)
        warn "[diagrams] plantuml.jar not found at #{JAR_PATH}. Run: make plantuml-jar"
        return nil
      end

      cmd = ["java", "-jar", JAR_PATH, "-tsvg", "-pipe", "-charset", "UTF-8", "-nometadata"]
      stdout, stderr, status = Open3.capture3(*cmd, stdin_data: source)

      unless status.success?
        warn "[diagrams] PlantUML render failed: #{stderr.strip}"
        return nil
      end

      sanitize_svg(stdout)
    rescue Errno::ENOENT
      unless self.java_missing_warned
        warn "[diagrams] java not found in PATH — PlantUML diagrams will be skipped locally. Run: make plantuml-jar && install Java"
        self.java_missing_warned = true
      end
      nil
    end

    def self.sanitize_svg(raw)
      parsed = Nokogiri::XML(raw)
      parsed.xpath('//*[name()="script"]').each(&:remove)

      svg = parsed.at_xpath('//*[name()="svg"]')
      if svg
        # Extract natural dimensions before stripping style
        w = svg["width"].to_s.gsub("px", "").to_i
        h = svg["height"].to_s.gsub("px", "").to_i

        svg.remove_attribute("style")
        svg["preserveAspectRatio"] = "xMidYMid meet"

        # Add viewBox so the SVG scales correctly when CSS max-width shrinks it.
        # Without viewBox, scaling the element clips content instead of scaling it.
        if svg["viewBox"].nil? || svg["viewBox"].empty?
          svg["viewBox"] = "0 0 #{w} #{h}" if w > 0 && h > 0
        end
      end

      parsed.to_xml
    end

    def self.build_figure(doc)
      figure = Nokogiri::XML::Node.new("div", doc)
      figure["class"] = "diagram-figure"
      figure
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  Jekyll::DiagramConverter.convert(doc)
end
