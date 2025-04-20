Liquid::Template.register_tag('gallery', Class.new(Liquid::Tag) {
  def initialize(tag_name, input, tokens)
    super
    @folder = input.strip.empty? ? nil : input.strip
  end

  def render(context)
    page = context.registers[:page]
    site = context.registers[:site]
    slug = @folder || page["slug"] || File.basename(page["path"], File.extname(page["path"]))
    dir_path = File.join(site.source, "assets", "img", "galleries", slug)
    return "<!-- gallery not found: #{slug} -->" unless Dir.exist?(dir_path)

    images = Dir.entries(dir_path).select { |f| f =~ /\.(jpe?g|png|webp)$/i }.sort
    return "<!-- no images found in #{slug} -->" if images.empty?

    page["enable_masonry"] = true

    raw = +<<~HTML
      <div class="masonry-grid" data-masonry='{"itemSelector":".masonry-item", "percentPosition":true}'>
    HTML

    images.each do |img|
      raw += <<~LIQUID
        <div class="masonry-item mb-4">
          {% include figure.liquid path="assets/img/galleries/#{slug}/#{img}" class="img-fluid rounded z-depth-1" zoomable=true %}
        </div>
      LIQUID
    end

    raw += "</div>"

    Liquid::Template.parse(raw).render!(context)
  end
})
