---
layout: page
title: Series
permalink: /series/
---

Explore our ongoing series of in-depth articles on various topics.

<div class="row grid">
  {% for series in site.data.series %}
    {% assign content_language = series.lang | default: site.lang | default: "en" %}
    {% assign base_language = content_language | split: "-" | first | downcase %}
    {% assign t = site.data.translations[base_language] | default: site.data.translations.en %}
    {% assign rtl_languages = "ar,arc,ckb,dv,fa,he,khw,ks,ku,ps,sd,ug,ur,yi" | split: "," %}
    {% assign content_direction = "ltr" %}
    {% if rtl_languages contains base_language %}
      {% assign content_direction = "rtl" %}
    {% endif %}

    <div class="col col-6 col-t-12 series-landing__item" lang="{{ content_language }}" dir="{{ content_direction }}">
      {% assign series_posts = site.posts | where: "series", series.slug %}
      {% capture series_meta_text %}{{ series_posts.size }} {% if series_posts.size == 1 %}{{ t.article_singular }}{% else %}{{ t.article_plural }}{% endif %}{% endcapture %}
      {% include series-hero.html series=series link=true class="series-landing__hero" heading_tag="h2" meta_text=series_meta_text %}
    </div>
  {% endfor %}
</div>
