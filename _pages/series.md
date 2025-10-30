---
layout: page
title: Series
permalink: /series/
---

## Async/Await in Csharp

A reflective, hands-on journey through asynchronous programming in C#.

{% assign posts_sorted = site.posts | sort: "part" %}
<div class="row">
  {% for post in posts_sorted %}
    {% if post.tags contains 'async-await' and post.tags contains 'series' %}
      {% include article.html class="article--flexible" %}
    {% endif %}
  {% endfor %}
</div>
