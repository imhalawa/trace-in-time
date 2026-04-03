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

    SKINPARAM_THEME = <<~PUML
      skinparam backgroundColor transparent
      skinparam defaultFontName "JetBrains Mono"
      skinparam defaultFontSize 12
      skinparam defaultFontColor #1e1b4b
      skinparam ArrowColor #6b7280
      skinparam ArrowFontColor #6b7280

      skinparam class {
        BackgroundColor #f5f5ff
        BorderColor #c7d2fe
        HeaderBackgroundColor #e0e7ff
        FontColor #1e1b4b
        AttributeFontColor #374151
        StereotypeFontColor #4338ca
        BorderThickness 1
      }

      skinparam note {
        BackgroundColor #fffbeb
        BorderColor #fcd34d
        FontColor #78350f
      }

      skinparam rectangle {
        BackgroundColor #f5f5ff
        BorderColor #c7d2fe
        FontColor #1e1b4b
      }

      skinparam sequence {
        LifeLineBorderColor #c7d2fe
        LifeLineBackgroundColor #e0e7ff
        ParticipantBackgroundColor #f5f5ff
        ParticipantBorderColor #c7d2fe
        ParticipantFontColor #1e1b4b
        ArrowColor #6b7280
        ActorBackgroundColor #f5f5ff
        ActorBorderColor #c7d2fe
        DividerBackgroundColor #e0e7ff
        DividerBorderColor #c7d2fe
        GroupBackgroundColor #f5f5ff
        GroupBorderColor #c7d2fe
      }

      skinparam activity {
        BackgroundColor #f5f5ff
        BorderColor #c7d2fe
        FontColor #1e1b4b
        BarColor #6b7280
        StartColor #1e1b4b
        EndColor #1e1b4b
        DiamondBackgroundColor #e0e7ff
        DiamondBorderColor #c7d2fe
        DiamondFontColor #4338ca
      }

      skinparam swimlane {
        BorderColor #c7d2fe
        TitleFontColor #4338ca
        TitleBackgroundColor #e0e7ff
      }

      skinparam partition {
        BackgroundColor #f5f5ff
        BorderColor #c7d2fe
        FontColor #4338ca
      }

      skinparam component {
        BackgroundColor #f5f5ff
        BorderColor #c7d2fe
        FontColor #1e1b4b
      }

      skinparam interface {
        BackgroundColor #e0e7ff
        BorderColor #c7d2fe
        FontColor #4338ca
      }

      skinparam state {
        BackgroundColor #f5f5ff
        BorderColor #c7d2fe
        FontColor #1e1b4b
        StartColor #1e1b4b
        EndColor #1e1b4b
      }

      skinparam shadowing false
      skinparam roundcorner 0
    PUML

    def self.inject_theme(source)
      # Inject after @startuml (with optional diagram type / title on same line)
      source.sub(/(@start\w+[^\n]*)/) do |match|
        "#{match}\n#{SKINPARAM_THEME}"
      end
    end

    def self.render_plantuml(source)
      unless File.exist?(JAR_PATH)
        warn "[diagrams] plantuml.jar not found at #{JAR_PATH}. Run: make plantuml-jar"
        return nil
      end

      # Inject transparent background unless the diagram already sets one
      unless source.include?("backgroundColor")
        source = source.sub(/@startuml/, "@startuml\nskinparam backgroundColor transparent")
      end

      cmd = ["java", "-jar", JAR_PATH, "-tsvg", "-pipe", "-charset", "UTF-8", "-nometadata"]
      stdout, stderr, status = Open3.capture3(*cmd, stdin_data: inject_theme(source))

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
        # Strip only the redundant inline style — keep natural width/height attrs
        # so CSS max-width: 100% scales down large diagrams without distorting small ones
        svg.remove_attribute("style")
        svg["preserveAspectRatio"] = "xMidYMid meet"
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
