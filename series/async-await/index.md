---
layout: page
title: "Async/Await in C#"
permalink: /series/async-await/
---

{% assign series_data = site.data.series | where: "slug", "async-await" | first %}

{% if series_data %}
{{ series_data.description }}

{% assign series_posts = site.posts | where: "series", "async-await" | sort: "part" %}

<div class="row grid">
  {% for post in series_posts %}
    {% include article.html class="article--flexible col col-6 col-t-12" %}
  {% endfor %}
</div>

{% endif %}
