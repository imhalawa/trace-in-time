---
layout: page
title: bricks
permalink: /bricks/
description: Because Writing Code Was Only the Easy Part
nav: true
nav_order: 2
display_categories: [Data Structures, Algorithms, DNS]
horizontal: true
---

<!-- pages/bricks.md -->
<div class="projects">
{% if site.enable_bricks_categories and page.display_categories %}
  <!-- Display categorized bricks -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_bricks = site.bricks | where: "category", category %}
  {% assign sorted_bricks = categorized_bricks | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_bricks %}
      {% include bricks_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_bricks %}
      {% include bricks.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display bricks without categories -->

{% assign sorted_bricks = site.bricks | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_bricks %}
      {% include bricks_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_bricks %}
      {% include bricks.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
