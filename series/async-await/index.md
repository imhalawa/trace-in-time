---
layout: page
title: "Async/Await in C#"
permalink: /series/async-await/
series_slug: async-await
hide_page_title: true
---

{% assign series_data = site.data.series | where: "slug", page.series_slug | first %}

{% if series_data %}
{% assign series_posts = site.posts | where: "series", page.series_slug | sort: "part" %}
{% assign content_language = series_data.lang | default: page.lang | default: site.lang | default: "en" %}
{% assign base_language = content_language | split: "-" | first | downcase %}
{% assign t = site.data.translations[base_language] | default: site.data.translations.en %}
{% capture series_meta_text %}{{ series_posts.size }} {% if series_posts.size == 1 %}{{ t.article_singular }}{% else %}{{ t.article_plural }}{% endif %}{% endcapture %}
{% include series-hero.html series=series_data heading_tag="h1" class="series-page__hero" meta_text=series_meta_text %}

<div class="row grid">
  {% for post in series_posts %}
    {% include article.html class="article--flexible col col-6 col-t-12" %}
  {% endfor %}
</div>

{% endif %}
