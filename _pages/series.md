---
layout: page
title: Series
permalink: /series/
---

## Async/Await in C #

A reflective, hands-on journey through asynchronous programming in C#.

{% assign s = site.posts | where_exp: "p", "p.tags contains 'async-await' and p.tags contains 'series'" %}
{% assign s = s | sort: "part" %}
{% for p in s %}
[{{ p.title }}]({{ p.url }})
{% endfor %}
