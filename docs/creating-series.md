# Creating a New Series

This guide explains how to create a new series of related posts on the blog.

## Overview

The series feature allows you to group related blog posts together under a common theme. Each series has:

- A dedicated landing page listing all posts in the series
- An entry on the main `/series/` index page
- Metadata stored in `_data/series.yml`

## Step-by-Step Guide

### 1. Add Series Metadata

Edit `_data/series.yml` and add a new entry:

```yaml
- slug: your-series-slug
  title: "Your Series Title"
  description: "A brief description of what this series covers."
  image: "/images/series/your-series-slug/cover.png"
  link: "/series/your-series-slug/"
```

**Fields:**

- `slug`: URL-friendly identifier (lowercase, hyphens only)
- `title`: Display name of the series
- `description`: Short summary shown on series index page
- `image`: Path to series cover image
- `link`: Permalink to series landing page (must match pattern `/series/{slug}/`)

### 2. Create Series Landing Page

Create a new file: `series/{slug}/index.md`

```markdown
---
layout: page
title: "Your Series Title"
permalink: /series/your-series-slug/
---

{% assign series_data = site.data.series | where: "slug", "your-series-slug" | first %}

{% if series_data %}
{{ series_data.description }}

{% assign series_posts = site.posts | where: "series", "your-series-slug" | sort: "part" %}

<div class="row grid">
  {% for post in series_posts %}
    {% include article.html class="article--flexible col col-6 col-t-12" %}
  {% endfor %}
</div>

{% endif %}
```

**Important:** Replace `your-series-slug` in three places:

1. The permalink
2. The `where: "slug"` filter
3. The `where: "series"` filter

### 3. Create Series Directory Structure

Organize your posts in folders:

```
_posts/
  series/
    your-series-slug/
      2025-01-01-first-post.md
      2025-01-02-second-post.md
      ...
```

### 4. Tag Posts with Series

In each post's front matter:

```yaml
---
layout: post
title: "1. First Post Title"
series: your-series-slug
part: 1
description: "Post description"
date: 2025-01-01
tags: [relevant, tags, series]
image: /images/series/your-series-slug/post-image.png
permalink: /series/your-series-slug/first-post-title/
---
```

**Key fields:**

- `series`: Must match the slug in `series.yml`
- `part`: Numeric order (used for sorting)
- `tags`: Include `series` tag for consistency
- `permalink`: Follow pattern `/series/{slug}/{post-slug}/`

### 5. Add Series Cover Image

Place series images in:

```
images/
  series/
    your-series-slug/
      cover.png
      post-image-1.png
      post-image-2.png
```

## Example: Async/Await Series

Here's the existing series as a reference:

**`_data/series.yml`:**

```yaml
- slug: async-await
  title: "Async/Await in C#"
  description: "A reflective, hands-on journey through asynchronous programming in C#."
  image: "/images/series/async-await/async-await.png"
  link: "/series/async-await/"
```

**File structure:**

```
series/async-await/index.md
_posts/series/async-await-c-sharp/
  2025-10-20-the-art-of-not-waiting.md
  2025-10-21-understanding-async-and-await.md
  ...
```

**Post front matter:**

```yaml
series: async-await
part: 1
tags: [dotnet, 'async-await', series]
permalink: /series/async-await/the-art-of-not-waiting/
```

## How It Works

### Main Series Index (`/series/`)

The `_pages/series.md` file automatically loops through all entries in `_data/series.yml` and displays them as cards. Each card shows:

- Series cover image
- Series title (linked to landing page)
- Series description
- Article count

### Individual Series Page (`/series/{slug}/`)

The series landing page:

1. Fetches metadata from `series.yml` by slug
2. Filters all posts by `series: {slug}` front matter
3. Sorts posts by the `part` field
4. Displays posts in a responsive grid layout

## Tips

- **Consistent naming:** Use the same slug everywhere (series.yml, folder names, permalinks)
- **Part numbering:** Start from 1 and increment sequentially for proper ordering
- **Image dimensions:** Use consistent image sizes for series covers
- **Description length:** Keep descriptions concise (1-2 sentences)
- **Tags:** Always include the `series` tag for filtering

## Troubleshooting

**Series not showing up?**

- Check that slug matches exactly in all locations
- Verify the series entry exists in `series.yml`
- Ensure the landing page exists at `series/{slug}/index.md`

**Posts not appearing on series page?**

- Verify `series: {slug}` is set in post front matter
- Check that posts have the `part` field for sorting
- Ensure posts are published (date is not in the future)

**Broken links?**

- Verify `link` in series.yml matches the landing page permalink
- Check that permalinks follow the `/series/{slug}/` pattern
