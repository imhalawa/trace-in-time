---
layout: page
title: Series
permalink: /series/
---

Explore our ongoing series of in-depth articles on various topics.

<div class="row">
  {% for series in site.data.series %}
    {% assign series_post = series %}
    {% capture post_url %}{{ series.link }}{% endcapture %}
    {% capture post_title %}{{ series.title }}{% endcapture %}
    {% capture post_description %}{{ series.description }}{% endcapture %}
    {% capture post_image %}{{ series.image }}{% endcapture %}

    <div class="article article--flexible">
      <div class="article__inner">
        {% if series.image %}
        <div class="article__head">
          <a class="article__image" href="{{ series.link | relative_url }}">
            <img class="lazy" data-src="{{ series.image | relative_url }}" alt="{{ series.title }}">
          </a>
        </div>
        {% endif %}

        <div class="article__content">
          <h2 class="article__title">
            <a href="{{ series.link | relative_url }}">{{ series.title }}</a>
          </h2>

          <p class="article__excerpt">{{ series.description }}</p>

          <div class="article__meta">
            {% assign series_posts = site.posts | where: "series", series.slug %}
            <div class="article__minutes">
              {{ series_posts.size }} {% if series_posts.size == 1 %}article{% else %}articles{% endif %}
            </div>
          </div>
        </div>
      </div>
    </div>
  {% endfor %}
</div>
