---
layout: page
title: Lists
permalink: /lists/
description: "Curated lists of tools, apps, music, and resources by Mohamed Halawa — practical picks and personal recommendations."
icon: 'fi fi-list'
---

Curated lists of tools, music, and practical resources worth returning to.

<div class="special-lists">
  {% assign active_books = site.data.books | where_exp: "b", "b.draft != true" %}
  <a href="{{ '/lists/books/' | relative_url }}" class="special-list-row">
    <span class="fi fi-book special-list-row__icon" aria-hidden="true"></span>
    <div class="special-list-row__body">
      <h2 class="special-list-row__title">Books <span class="article__series-label">Special</span></h2>
      <div class="special-list-row__meta">
        <span>{{ active_books | size }} books</span>
      </div>
    </div>
    <span class="fi fi-chevron-right special-list-row__pin" aria-hidden="true"></span>
  </a>
  <a href="{{ '/lists/music/' | relative_url }}" class="special-list-row">
    <span class="fi fi-music special-list-row__icon" aria-hidden="true"></span>
    <div class="special-list-row__body">
      <h2 class="special-list-row__title">Music <span class="article__series-label">Special</span></h2>
      <div class="special-list-row__meta">
        <span>{{ site.data.music | size }} tracks</span>
      </div>
    </div>
    <span class="fi fi-chevron-right special-list-row__pin" aria-hidden="true"></span>
  </a>
  <a href="{{ '/lists/podcasts/' | relative_url }}" class="special-list-row">
    <span class="fi fi-headphones special-list-row__icon" aria-hidden="true"></span>
    <div class="special-list-row__body">
      <h2 class="special-list-row__title">Podcasts <span class="article__series-label">Special</span></h2>
      <div class="special-list-row__meta">
        <span>{{ site.data.podcasts | size }} episodes</span>
      </div>
    </div>
    <span class="fi fi-chevron-right special-list-row__pin" aria-hidden="true"></span>
  </a>
  <a href="{{ '/lists/projects/' | relative_url }}" class="special-list-row">
    <span class="fi fi-github special-list-row__icon" aria-hidden="true"></span>
    <div class="special-list-row__body">
      <h2 class="special-list-row__title">Projects <span class="article__series-label">Special</span></h2>
      <div class="special-list-row__meta">
        <span>{{ site.data.projects | size }} projects</span>
      </div>
    </div>
    <span class="fi fi-chevron-right special-list-row__pin" aria-hidden="true"></span>
  </a>
</div>

{% assign list_posts = site.lists %}
{% if list_posts.size > 0 %}
  <div class="lists-section-divider">Other Lists</div>
  <div class="row grid">
    {% for post in list_posts %}
      {% include list-post-card.html class="article--flexible col col-6 col-t-12" %}
    {% endfor %}
  </div>
{% endif %}
