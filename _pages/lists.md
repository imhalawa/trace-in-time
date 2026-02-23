---
layout: page
title: Lists
permalink: /lists/
---

Explore curated lists of apps, links, and practical resources.

<div class="row grid">
  {% assign list_posts = site.posts | where_exp: "post", "post.list" %}
  {% for post in list_posts %}
    {% include list-post-card.html class="article--flexible col col-6 col-t-12" %}
  {% endfor %}
</div>
