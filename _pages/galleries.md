---
layout: page
title: galleries
permalink: /galleries/
description: A collection of my snapshots
nav: true
nav_order: 3
display_categories: [netherlands]
horizontal: true
---

<!-- pages/galleries.md -->
<div class="projects">
{% if site.enable_gallery_categories and page.display_categories %}
  <!-- Display categorized galleries -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_galleries = site.galleries | where: "category", category %}
  {% assign sorted_galleries = categorized_galleries | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_galleries %}
      {% include galleries_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_galleries %}
      {% include galleries.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display galleries without categories -->

{% assign sorted_galleries = site.galleries | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_galleries %}
      {% include galleries_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_galleries %}
      {% include galleries.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
