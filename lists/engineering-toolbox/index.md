---
layout: page
title: "Engineering Toolbox"
permalink: /lists/engineering-toolbox/
list_slug: engineering-toolbox
hide_page_title: true
---

{% assign list_data = site.data.lists | where: "slug", page.list_slug | first %}

{% if list_data %}
{% unless list_data.draft == true %}
{% assign list_posts = site.posts | where: "list", page.list_slug %}
{% assign published_list_posts = "" | split: "," %}
{% for list_post in list_posts %}
  {% unless list_post.published == false %}
    {% assign published_list_posts = published_list_posts | push: list_post %}
  {% endunless %}
{% endfor %}
{% assign content_language = list_data.lang | default: page.lang | default: site.lang | default: "en" %}
{% assign base_language = content_language | split: "-" | first | downcase %}
{% assign t = site.data.translations[base_language] | default: site.data.translations.en %}
{% capture list_meta_text %}{{ published_list_posts.size }} {% if published_list_posts.size == 1 %}{{ t.article_singular }}{% else %}{{ t.article_plural }}{% endif %}{% endcapture %}
{% include concept-hero.html item=list_data type="list" heading_tag="h1" class="series-page__hero" meta_text=list_meta_text %}

<div class="row grid">
  {% for post in published_list_posts %}
    {% include article.html class="article--flexible col col-6 col-t-12" %}
  {% endfor %}
</div>
{% endunless %}
{% endif %}
