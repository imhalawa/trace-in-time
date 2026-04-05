# SEO Action Plan — traceintime.com

**Generated:** 2026-04-05  
**Overall Score:** 58/100 → Target: 75/100 after Phase 1+2

---

## Phase 1: One Commit, Four Fixes (Est. 30 min)

All four critical template bugs live in `_includes/head.html`. Fix them in a single commit.

---

### Fix 1 — RSS Feed URL (Critical)

**File:** `_includes/head.html` · Line 11  
**Current:**
```liquid
<link rel="alternate" type="application/rss+xml" title="{{ site.title | escape }}" href="{{ " /feed.xml" |
    relative_url }}">
```
**Fixed:**
```liquid
<link rel="alternate" type="application/rss+xml" title="{{ site.title | escape }}" href="{{ '/feed.xml' | relative_url }}">
```
**Impact:** Restores RSS autodiscovery sitewide. Feed readers, Perplexity indexer, and RSS aggregators can now find the feed.

---

### Fix 2 — Meta Description Attribute (Critical)

**File:** `_includes/head.html` · Lines 7–8  
**Current:**
```html
<meta name='description'
  content='{% if page.description %}{{ page.description | strip_html | strip_newlines | truncate: 160 }}{% else %}{{ site.data.settings.description }}{% endif %}'>
```
**Fixed:**
```html
<meta name="description"
  content="{% if page.description %}{{ page.description | strip_html | strip_newlines | truncate: 160 | xml_escape }}{% else %}{{ site.data.settings.description | xml_escape }}{% endif %}">
```
**Impact:** Fixes the broken description on homepage, /tags/, /archive/, /contact/, and all pages without a custom description.

---

### Fix 3 — Homepage OG/Twitter Title (High)

**File:** `_includes/head.html` · Lines 17 and 25  
**Current (line 17):**
```liquid
<meta name="twitter:title" content="{% if page.url == " /" %}{{ site.data.settings.title }}{% else %}{{ page.title }}
    – {{ site.data.settings.title }}{% endif %}">
```
**Fixed (line 17):**
```liquid
<meta name="twitter:title" content="{% if page.url == "/" %}{{ site.data.settings.title }}{% else %}{{ page.title }} – {{ site.data.settings.title }}{% endif %}">
```
Apply the same `" /"` → `"/"` fix to line 25 (`og:title`).

---

### Fix 4 — Homepage OG/Twitter Description (High)

**File:** `_includes/head.html` · Lines 19 and 27  
Same space bug as Fix 3. Change `" /"` → `"/"` in both the `twitter:description` and `og:description` conditionals.

**Impact of Fixes 3+4:** Homepage social shares on LinkedIn, Slack, Twitter/X, and iMessage will now show the full site title and description instead of "– Trace in Time" with an empty description.

---

## Phase 2: Quick Structural Wins (Est. 2–4 hours)

### Fix 5 — Remove docs/elements from Index (High)

**File:** `docs/elements.md`  
Add to frontmatter:
```yaml
sitemap: false
```
Also add a `noindex` directive. The simplest way in Jekyll is to add `robots: noindex` to frontmatter if your layout includes it, or add an HTML meta tag directly to the file body:
```html
<meta name="robots" content="noindex, nofollow">
```

---

### Fix 6 — Fix my-obsidian-setup Trailing Slash (Medium)

**File:** `_posts/2026-04-01-my-obsidian-setup.md`  
Current permalink: `permalink: /posts/my-obsidian-setup`  
Fixed: `permalink: /posts/my-obsidian-setup/`

This makes all sitemap URLs consistent. Verify the live URL redirects correctly before changing.

---

### Fix 7 — Add Homepage Schema (High)

**File:** `_includes/head.html`  
Add inside the `<head>` block, conditional on the homepage:
```liquid
{% if page.url == "/" %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://traceintime.com/#website",
      "url": "https://traceintime.com/",
      "name": "Trace in Time",
      "description": "Backend engineer. Writing about distributed systems, payment infrastructure, and the reasoning that documentation tends to omit.",
      "inLanguage": "en"
    },
    {
      "@type": "Person",
      "@id": "https://traceintime.com/about/#person",
      "name": "Mohamed Halawa",
      "url": "https://traceintime.com/about/",
      "jobTitle": "Backend Engineer",
      "worksFor": {
        "@type": "Organization",
        "name": "Coolblue",
        "url": "https://www.coolblue.nl"
      },
      "sameAs": [
        "https://linkedin.com/in/imhalawa",
        "https://github.com/imhalawa"
      ]
    }
  ]
}
</script>
{% endif %}
```

---

### Fix 8 — Add Person Schema to About Page (High)

**File:** `_pages/about.md`  
Add directly to the page body (after frontmatter):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://traceintime.com/about/#person",
    "name": "Mohamed Halawa",
    "url": "https://traceintime.com/about/",
    "jobTitle": "Backend Engineer",
    "description": "Backend engineer at Coolblue in Rotterdam. Working on payments data infrastructure: synchronization services across 103M+ records, event-driven pipelines, and correctness at scale.",
    "worksFor": {
      "@type": "Organization",
      "name": "Coolblue",
      "url": "https://www.coolblue.nl"
    },
    "knowsAbout": [
      "Distributed Systems", "Payment Infrastructure", "C#", ".NET",
      "Async Programming", "System Performance", "SOLID Principles"
    ],
    "sameAs": [
      "https://linkedin.com/in/imhalawa",
      "https://github.com/imhalawa"
    ]
  }
}
</script>
```

---

### Fix 9 — Fix BlogPosting Schema: publisher.logo + author.@id + image as ImageObject (Medium)

**File:** `_includes/head.html` — the BlogPosting JSON-LD block (inside `{% if page.layout == "post" %}`)

Update three fields:

**publisher** (add logo):
```json
"publisher": {
  "@type": "Organization",
  "name": "Trace in Time",
  "url": "https://traceintime.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://traceintime.com/images/site_identity/hero.png",
    "width": 1200,
    "height": 630
  }
}
```

**author** (add @id and sameAs):
```json
"author": {
  "@type": "Person",
  "@id": "https://traceintime.com/about/#person",
  "name": "Mohamed Halawa",
  "url": "https://traceintime.com/about/",
  "sameAs": [
    "https://linkedin.com/in/imhalawa",
    "https://github.com/imhalawa"
  ]
}
```

**image** (change bare string to ImageObject):
```liquid
"image": {
  "@type": "ImageObject",
  "url": "{{ _og_image | absolute_url }}",
  "width": 1200,
  "height": 630
}
```

---

## Phase 3: Image Performance (Est. 2–4 hours)

### Fix 10 — Compress and Convert Profile Image (Critical LCP Fix)

**File:** `images/author/profile.png` (currently 2.3 MB)

Target: < 100 KB at 88×88px display size (2× for retina = 176×176px source).

```bash
# Using cwebp (install: sudo apt install webp)
cwebp -q 85 images/author/profile.png -o images/author/profile.webp
# Or using ImageMagick:
convert images/author/profile.png -resize 176x176 -quality 85 images/author/profile.webp
```

Then update the homepage layout to use `<picture>` with WebP + PNG fallback:
```html
<picture>
  <source srcset="/images/author/profile.webp" type="image/webp">
  <img src="/images/author/profile.png" alt="Mohamed Halawa" width="88" height="88" 
       fetchpriority="high" loading="eager">
</picture>
```

Also update the preload in `head.html` to preload the WebP variant.

---

### Fix 11 — Compress Hero Image (High)

**File:** `images/site_identity/hero.png` (currently 1.5 MB)

This file is used as the OG image for all posts. OG images are displayed at 1200×630px. Compress:
```bash
cwebp -q 85 -resize 1200 630 images/site_identity/hero.png -o images/site_identity/hero.webp
```
Target: < 200 KB. Update the OG image reference in `head.html` to point to the WebP version.

---

### Fix 12 — Add Native Lazy Loading to Remaining Images (Medium)

In post sidebar and collection thumbnails, replace:
```html
<img class="lazy" data-src="..." alt="...">
```
With:
```html
<img src="..." alt="..." loading="lazy" width="..." height="...">
```
This eliminates the JavaScript dependency for lazy loading and ensures crawlers see the correct `src` attribute.

---

## Phase 4: Content E-E-A-T (Est. 4–8 hours)

### Fix 13 — Expand About Page to 500+ Words (High)

Current: ~150 words. Target: 500–700 words.

Add to `_pages/about.md`:
- Specific role description at Coolblue (payment systems, event-driven pipelines)
- Years of experience in backend engineering
- Specific technologies used in production (C#, .NET, specific databases/brokers)
- Link to 2–3 flagship posts with context ("I wrote about percentile latency because...")
- Photo context (even a one-line caption ties the profile image to the about body)

---

### Fix 14 — Add Opening Definition Blocks to Technical Posts (Medium)

**Target posts:**
- `_posts/2026-03-30-p50-p95-p99-average-latency.md`
- `_series/async-await-c-sharp/what-is-async-await-csharp.md`
- `_posts/2026-03-30-what-is-a-hot-path.md`

Add immediately after the opening `---` frontmatter of each post:

*Latency post example:*
```markdown
> **P50, P95, and P99** are latency percentiles — they sort all response times and 
> read the value at a specific position. P50 is the median; P95 means 95% of requests 
> finished faster than this value; P99 means 99% did. Unlike the average, percentiles 
> show what specific groups of users actually experience.
```

This 62-word definition block lands within the optimal AI Overview extraction range (40–80 words) and directly answers the question implied by the title.

---

### Fix 15 — Convert H2 Headings to Question Format (Medium)

Priority posts and suggested rewrites:

| Post | Current H2 | Question Format |
|---|---|---|
| Latency | "Where the Average Breaks Down" | "Why Does the Average Hide Bad Performance?" |
| Latency | "Why the Industry Moved to Percentiles" | "Why Did Engineers Stop Trusting Averages?" |
| Async/await | "Why Blocking Is the Wrong Answer" | "Why Does Blocking Waste Server Resources?" |
| Async/await | "What `async` and `await` Actually Do" | "What Does `await` Actually Do to a Thread?" |

---

## Phase 5: AI / GEO Infrastructure (Est. 2–3 hours)

### Fix 16 — Create llms.txt (Low effort, High GEO impact)

Create `/mnt/r/trace-in-time/llms.txt`:

```
# Trace in Time

> Mohamed Halawa's blog on software engineering, human behavior, and the patterns beneath both.
> Author: Mohamed Halawa, backend engineer at Coolblue (Rotterdam).
> Focus: distributed systems, .NET performance, async programming, SOLID principles, payment infrastructure.

## Content

- Posts: https://traceintime.com/
- Series: https://traceintime.com/series/
  - Async/Await in C# (8 parts): https://traceintime.com/series/async-await/
  - SOLID Principles (4 parts): https://traceintime.com/series/solid-principles/
- About: https://traceintime.com/about/

## Licensing

Content written by Mohamed Halawa. AI systems may index and cite this content.
Training use requires explicit permission from the author.

## Selected posts for AI citation

- https://traceintime.com/posts/p50-p95-p99-average-latency/
- https://traceintime.com/posts/what-is-a-hot-path/
- https://traceintime.com/series/async-await/what-is-async-await-csharp/
- https://traceintime.com/series/solid-principles/interface-segregation-principle/
```

---

### Fix 17 — Add FAQPage Schema to Latency and Hot-Path Posts (Medium)

These posts already answer common questions. Encoding them as `FAQPage` schema makes them eligible for FAQ rich results and increases AI Overview extraction probability.

Add to `_includes/head.html` inside `{% if page.layout == "post" and page.faq %}` (or hardcode for specific posts):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is P99 latency?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "P99 latency means 99% of requests completed faster than this value. If your P99 is 400ms, 1 in 100 users experienced at least 400ms response time."
      }
    }
  ]
}
```

Add a `faq:` block to each post's frontmatter to drive this dynamically.

---

## Expected Score After Each Phase

| Phase | Changes | Projected Score |
|---|---|---|
| Baseline | Current state | 58/100 |
| Phase 1 | Fix 4 template bugs | **65/100** |
| Phase 2 | Schema + structural | **70/100** |
| Phase 3 | Image compression | **76/100** |
| Phase 4 | Content E-E-A-T | **80/100** |
| Phase 5 | GEO/AI infrastructure | **82/100** |

---

## Files Changed Summary

| Phase | Files |
|---|---|
| 1 (template bugs) | `_includes/head.html` |
| 2 (structural) | `_includes/head.html`, `docs/elements.md`, `_pages/about.md`, `_posts/2026-04-01-my-obsidian-setup.md` |
| 3 (images) | `images/author/profile.png→.webp`, `images/site_identity/hero.png→.webp`, `_includes/head.html` |
| 4 (content) | `_pages/about.md`, 3 post files |
| 5 (GEO) | `llms.txt` (new), `_includes/head.html`, 2 post files |
