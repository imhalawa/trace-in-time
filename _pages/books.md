---
layout: page
title: Books
permalink: /books/
---

Book-focused notes and selective reviews by chapter and idea.

<div class="row grid">
  {% for book in site.data.books %}
    {% unless book.draft == true %}
      {% assign content_language = book.lang | default: site.lang | default: "en" %}
      {% assign base_language = content_language | split: "-" | first | downcase %}
      {% assign t = site.data.translations[base_language] | default: site.data.translations.en %}
      {% assign rtl_languages = "ar,arc,ckb,dv,fa,he,khw,ks,ku,ps,sd,ug,ur,yi" | split: "," %}
      {% assign content_direction = "ltr" %}
      {% if rtl_languages contains base_language %}
        {% assign content_direction = "rtl" %}
      {% endif %}

      <div class="col col-6 col-t-12 series-landing__item" lang="{{ content_language }}" dir="{{ content_direction }}">
        {% assign book_posts = site.posts | where: "book", book.slug %}
        {% assign published_book_posts = "" | split: "," %}
        {% for book_post in book_posts %}
          {% unless book_post.published == false %}
            {% assign published_book_posts = published_book_posts | push: book_post %}
          {% endunless %}
        {% endfor %}
        {% capture book_meta_text %}{{ published_book_posts.size }} {% if published_book_posts.size == 1 %}{{ t.note_singular }}{% else %}{{ t.note_plural }}{% endif %}{% endcapture %}
        {% include concept-hero.html item=book type="book" link=true class="series-landing__hero" heading_tag="h2" meta_text=book_meta_text %}
      </div>
    {% endunless %}
  {% endfor %}
</div>
