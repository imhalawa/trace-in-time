---
layout: page
title: "Grokking Algorithms"
permalink: /books/grokking-algorithms/
book_slug: grokking-algorithms
hide_page_title: true
---

{% assign book_data = site.data.books | where: "slug", page.book_slug | first %}

{% if book_data %}
{% unless book_data.draft == true %}
{% assign book_posts = site.posts | where: "book", page.book_slug | sort: "part" %}
{% assign published_book_posts = "" | split: "," %}
{% for book_post in book_posts %}
  {% unless book_post.published == false %}
    {% assign published_book_posts = published_book_posts | push: book_post %}
  {% endunless %}
{% endfor %}
{% assign content_language = book_data.lang | default: page.lang | default: site.lang | default: "en" %}
{% assign base_language = content_language | split: "-" | first | downcase %}
{% assign t = site.data.translations[base_language] | default: site.data.translations.en %}
{% capture book_meta_text %}{{ published_book_posts.size }} {% if published_book_posts.size == 1 %}{{ t.note_singular }}{% else %}{{ t.note_plural }}{% endif %}{% endcapture %}
{% include concept-hero.html item=book_data type="book" heading_tag="h1" class="series-page__hero" meta_text=book_meta_text %}

{% include stepper.html posts=book_posts slug=book_data.slug lang=content_language t=t %}
{% endunless %}
{% endif %}
