---
layout: page
title: Series
permalink: /series/
---

## Async/Await in Csharp

A reflective, hands-on journey through asynchronous programming in C#.

{% assign posts_sorted = site.posts | sort: "part" %}
{% for p in posts_sorted %}
  {% if p.tags contains 'async-await' and p.tags contains 'series' %}
[{{ p.title }}]({{ p.url }})
  {% endif %}
{% endfor %}
