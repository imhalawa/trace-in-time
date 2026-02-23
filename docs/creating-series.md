# Creating Series, Lists, and Books

This guide explains how to create and maintain grouped content on the blog:

- Series (article sequences)
- Lists (apps, links, and other listable topics)
- Books (selective notes and opinions)

## Shared Model

All three concepts use the same architecture:

1. Metadata entry in `_data/*.yml`
2. Detail page at `/concept/{slug}/`
3. Member posts in `_posts/...` linked by front matter slug
4. Timeline shows one grouped card instead of individual member posts

Draftability is supported at two levels:

- Entity-level: `draft: true` in data file (hides grouped cards and landing cards)
- Post-level: `published: false` in post front matter

---

## Series

### 1) Add metadata in `_data/series.yml`

```yaml
- slug: async-await
  title: "Async/Await in C#"
  subtitle: "Practical patterns for writing calm, reliable asynchronous code."
  description: "A reflective, hands-on journey through asynchronous programming in C#."
  cover_color: "#5B4BFF"
  link: "/series/async-await/"
  draft: false
```

### 2) Create detail page

Create `series/{slug}/index.md` and set:

```yaml
series_slug: your-series-slug
permalink: /series/your-series-slug/
```

### 3) Create posts

Place posts under `_posts/series/{folder}/` and include:

```yaml
series: your-series-slug
part: 1
published: true
```

---

## Lists

Lists are for any listable content (apps, links, etc.).

### 1) Add metadata in `_data/lists.yml`

```yaml
- slug: engineering-toolbox
  title: "Engineering Toolbox"
  subtitle: "Apps, tools, and links that help me think and ship faster."
  description: "A curated list of tools and resources I rely on for focused engineering work."
  cover_color: "#0D9488"
  link: "/lists/engineering-toolbox/"
  draft: true
```

### 2) Create detail page

Create `lists/{slug}/index.md` and set:

```yaml
list_slug: engineering-toolbox
permalink: /lists/engineering-toolbox/
```

### 3) Create list posts

Place posts under `_posts/lists/` and include:

```yaml
list: engineering-toolbox
published: false
```

Cards and page listings use post front matter title/subtitle.

---

## Books

Books are grouped as notes. Timeline cards show `x notes`.

### 1) Add metadata in `_data/books.yml`

```yaml
- slug: clean-code
  title: "Clean Code"
  subtitle: "Notes and reflections while revisiting core software craftsmanship ideas."
  description: "Selective notes and opinions on practical chapters and trade-offs from Clean Code."
  cover_color: "#7C3AED"
  link: "/books/clean-code/"
  draft: true
```

### 2) Create detail page

Create `books/{slug}/index.md` and set:

```yaml
book_slug: clean-code
permalink: /books/clean-code/
```

### 3) Create book notes

Place notes under `_posts/books/{book-slug}/` and include:

```yaml
book: clean-code
part: 1
published: false
```

`part` is optional but recommended for ordered notes.

---

## Directory Examples

```text
_data/
  series.yml
  lists.yml
  books.yml

_pages/
  series.md
  lists.md
  books.md

series/
  your-series-slug/
    index.md

lists/
  your-list-slug/
    index.md

books/
  your-book-slug/
    index.md

_posts/
  series/
    your-series-folder/
      2026-01-01-series-post.md
  lists/
    2026-01-02-list-post.md
  books/
    your-book-slug/
      2026-01-03-book-note.md
```

---

## Timeline Behavior

- Normal posts render individually.
- Posts that belong to `series`, `list`, or `book` do not render individually on timeline.
- Instead, one grouped concept card is rendered per published, non-draft entity.
- Book grouped cards display note counts (`x notes`).
