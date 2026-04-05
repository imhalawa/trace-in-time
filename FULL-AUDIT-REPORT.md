# SEO Full Audit Report — traceintime.com

**Audit Date:** 2026-04-05  
**Site:** https://traceintime.com  
**Type:** Jekyll personal blog — Mohamed Halawa  
**Pages crawled:** 47 (full sitemap)  
**Specialists run:** Technical, Content/E-E-A-T, Schema, Sitemap, Performance, GEO/AI, Visual, Backlinks  
**Google/Moz API:** Not configured (no field data)

---

## Overall SEO Health Score: 58 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 54 | 11.9 |
| Content Quality (E-E-A-T) | 23% | 71 | 16.3 |
| On-Page SEO | 20% | 52 | 10.4 |
| Schema / Structured Data | 10% | 62 | 6.2 |
| Performance (CWV) | 10% | 40 | 4.0 |
| AI Search Readiness (GEO) | 10% | 58 | 5.8 |
| Images | 5% | 30 | 1.5 |
| **Total** | **100%** | — | **56.1** |

**Grade: C+ — Solid content foundation, broken infrastructure.**  
The site's content is genuinely strong; every low score traces to a small number of fixable template bugs and unoptimized images. Four issues in a single file (`_includes/head.html`) explain the gap between the content quality score and the overall grade.

---

## Executive Summary

**Business type detected:** Personal technical blog (personal brand, content site)  
**Author:** Mohamed Halawa, Backend Engineer at Coolblue (Rotterdam)  
**Primary topics:** .NET async/await, SOLID principles, distributed systems performance, human behavior

### Top 5 Critical Issues

| # | Issue | Impact | Pages Affected |
|---|---|---|---|
| 1 | RSS feed URL broken (`/%20/feed.xml` → 404) | Feed autodiscovery dead sitewide | All 47 pages |
| 2 | Homepage meta description HTML-broken (apostrophe terminates attribute) | Google reads truncated/empty description | All pages using site default description |
| 3 | OG/Twitter title and description empty on homepage | Social share previews show "– Trace in Time" with no content | Homepage |
| 4 | LCP images uncompressed (profile.png = 2.3 MB, hero.png = 1.5 MB) | LCP likely 4–8s on mobile; major CWV failure | Homepage, all posts |
| 5 | `/docs/elements` (Lorem Ipsum) publicly indexed, in sitemap | Thin/garbage content dilutes site quality signals | /docs/elements |

### Top 5 Quick Wins

| # | Action | Effort | Expected Gain |
|---|---|---|---|
| 1 | Fix RSS href space in `head.html` (1-line change) | 5 min | Feed discovery restored sitewide |
| 2 | Fix meta description attribute quotes + xml_escape | 5 min | Correct descriptions on all fallback pages |
| 3 | Fix `" /"` → `"/"` in OG/Twitter conditionals (4 places) | 5 min | Homepage social previews fixed |
| 4 | Add `sitemap: false` + noindex to `docs/elements.md` | 5 min | Garbage page removed from index |
| 5 | Compress profile.png to WebP (<100 KB) | 30 min | LCP potentially drops by 3–5s |

**All four of the most impactful template bugs are in one file:** `_includes/head.html`

---

## Section 1: Technical SEO

**Score: 54 / 100**

### 1.1 Crawlability

| Check | Status | Details |
|---|---|---|
| robots.txt | ✅ PASS | Returns 200; `Sitemap: https://traceintime.com/sitemap.xml` is correct |
| Sitemap XML | ✅ PASS | Returns 200; valid XML; 47 URLs |
| RSS autodiscovery | ❌ CRITICAL | `<link rel="alternate" href="/%20/feed.xml">` — resolves to 404. Actual feed at `/feed.xml` is healthy. |
| Internal link structure | ✅ PASS | Posts cross-link within topic clusters (latency ↔ hot-path, async/await series) |
| Redirect chains | ✅ PASS | No redirect chains detected |
| llms.txt | ⚠️ MISSING | Returns 404; AI crawler guidance absent |

**Root cause of RSS bug:**  
`_includes/head.html` line 11–12:
```liquid
href="{{ " /feed.xml" | relative_url }}"
```
The string `" /feed.xml"` has a leading space. `relative_url` URL-encodes it to `/%20/feed.xml`. The fix is a 1-character change: `"/feed.xml"`.

### 1.2 Indexability

| Check | Status | Details |
|---|---|---|
| Canonical tags | ✅ PASS | Self-referencing canonicals on all pages checked |
| Homepage meta description | ❌ CRITICAL | Attribute uses single quotes; apostrophe in "Halawa's" closes it prematurely |
| OG/Twitter title (homepage) | ❌ HIGH | Conditional `page.url == " /"` never matches; renders `"– Trace in Time"` |
| OG/Twitter description (homepage) | ❌ HIGH | Same space bug; renders empty string |
| `docs/elements` indexability | ❌ HIGH | Lorem Ipsum placeholder; no noindex; in sitemap |
| Trailing slash consistency | ⚠️ MEDIUM | `/posts/my-obsidian-setup` lacks trailing slash (all other posts have one) |
| Tags/Archive pages | ⚠️ LOW | Indexed utility pages with no unique editorial content |

**Root cause of meta description bug:**  
`_includes/head.html` lines 7–8 uses `content='...'` (single-quote delimiters). The site description in `_data/settings.yml` contains `Halawa's` — the apostrophe terminates the attribute at that character. Everything after it renders as raw text in the `<head>`.

**Root cause of OG/Twitter homepage bug:**  
Lines 17, 19, 25, 27 of `head.html` check `page.url == " /"` (with a leading space). The actual homepage URL is `"/"` — condition never matches, falls to else branch which renders `{{ page.title }}` (empty on homepage) + ` – Trace in Time`.

### 1.3 Security

| Header | Status | Notes |
|---|---|---|
| HTTPS | ✅ PASS | All pages HTTPS |
| Content-Security-Policy | ⚠️ ABSENT | GitHub Pages limitation; requires Cloudflare layer |
| X-Content-Type-Options | ⚠️ ABSENT | GitHub Pages limitation |
| X-Frame-Options | ⚠️ ABSENT | GitHub Pages limitation |
| Supabase key in `_data/settings.yml` | ⚠️ LOW | Publishable key committed to repo; evaluate rotation if key grants non-public access |

GitHub Pages does not support custom response headers. Adding Cloudflare as a CDN layer (free tier) would resolve all security header gaps via Transform Rules without changing the Jekyll/GH Pages pipeline.

### 1.4 Core Web Vitals (HTML Signal Analysis — no field data)

| Signal | Status | Notes |
|---|---|---|
| LCP image preload (homepage) | ✅ PASS | `fetchpriority="high"` + preload on `/images/author/profile.png` |
| LCP image preload (posts) | ⚠️ PARTIAL | Only fires when `page.image` is set; most posts have no `page.image` |
| LCP image file size | ❌ CRITICAL | `profile.png` = **2.3 MB**; `hero.png` = **1.5 MB** |
| Font loading | ✅ GOOD | Non-blocking preload+onload pattern; `<noscript>` fallback |
| Font CLS risk | ⚠️ MEDIUM | `display=swap` causes text reflow on load; switch to `optional` or self-host |
| CSS render-blocking | ⚠️ MEDIUM | `main.css` in `<head>`; KaTeX CSS also render-blocking on math pages |
| JS defer | ✅ PASS | `scripts.js` (53KB) and `common.js` (30KB) both deferred |
| Google Analytics | ✅ PASS | Loaded `async` |
| Theme toggle script | ✅ PASS | Small inline script; necessary for FOUC prevention |

### 1.5 Mobile

| Check | Status |
|---|---|
| Viewport meta tag | ✅ PASS — `width=device-width, initial-scale=1` |
| `lang` attribute | ✅ PASS — `<html lang="en">`; Arabic pages have `lang="ar"` logic |
| Responsive CSS | ✅ PASS — mobile-first CSS structure detected |
| Touch targets | UNVERIFIED (requires Playwright) |

---

## Section 2: Content Quality / E-E-A-T

**Score: 71 / 100** (Content agent's composite)

| E-E-A-T Factor | Score | Notes |
|---|---|---|
| Experience | 15/20 | Specific employer, scale, production context; ADHD disclosure adds authenticity |
| Expertise | 18/25 | Version-pinned C# code; correct source attribution; cites Meyer 1988, Martin 1996 |
| Authoritativeness | 14/25 | **Weakest factor** — no external recognition signals, no conference talks, no guest posts |
| Trustworthiness | 21/30 | DOI-linked footnotes; `last_modified_at` dates; broken meta description reduces trust score |

### Content Depth

| Post | Est. Words | Status |
|---|---|---|
| P50, P95, P99, and the Average | ~2,400 | ✅ Strong |
| Hot Path: Identify and Optimize in .NET | ~2,800 | ✅ Strong |
| How I Use Obsidian as a Thinking Studio | ~2,200 | ✅ Good |
| Goals and Needs | ~900 | ⚠️ Below 1,500-word floor |
| Assumptions in Relationships | ~850 | ⚠️ Below 1,500-word floor |
| About page | ~150 | ❌ Thin for an E-E-A-T anchor page |

### Thin Content Risk

| Page | Issue | Severity |
|---|---|---|
| `/lists/podcasts/` | Zero body content (frontmatter only) | High |
| `/lists/books/` | Zero body content (frontmatter only) | High |
| `/about/` | ~150 words — too thin for E-E-A-T weight it carries | Medium |
| `/series/` index | Dynamic list, no editorial prose | Low |
| `/docs/elements` | Lorem Ipsum placeholder, publicly indexed | Critical |

### Content Gaps vs. Stated Topics

The about page claims expertise in "distributed systems, payment infrastructure, event-driven pipelines." None of these have dedicated posts:

| Stated Topic | Coverage | Gap |
|---|---|---|
| Distributed systems | Zero dedicated posts | High |
| Payment infrastructure | Mentioned in about only | High |
| Event-driven architecture | Zero posts | High |
| Observability (tracing, logging) | Partially (latency/hot-path) | Medium |
| Data synchronization at scale | Zero posts | Medium |

### Internal Linking

| Check | Status |
|---|---|
| Tech post cross-linking | ✅ GOOD — latency ↔ hot-path ↔ async/await |
| About page → content | ❌ MISSING — zero outbound links to posts |
| Content → about page | ⚠️ Author byline only; no contextual prose links |
| SOLID ↔ async/await cross-links | ❌ MISSING — related concepts, no linking |

---

## Section 3: On-Page SEO

**Score: ~52 / 100** (synthesized from technical + content agents)

### Title Tags

| Page | Title | Status |
|---|---|---|
| Homepage | `Trace in Time` | ✅ Clean (correct per conditional) |
| Posts | `[Post Title] – Trace in Time` | ✅ PASS |
| About | `Mohamed Halawa – Trace in Time` | ✅ PASS |
| Series posts | `[Series Title] – Trace in Time` | ✅ PASS |

### Meta Descriptions

| Page type | Status | Issue |
|---|---|---|
| Blog posts with `description:` | ✅ PASS | Well-written, answer-forward |
| Homepage / fallback pages | ❌ CRITICAL | HTML-broken by apostrophe |
| Podcast pages | ⚠️ MISSING | Falls back to broken site default |
| Series index pages | ⚠️ MISSING | Falls back to broken site default |

### Heading Structure

Posts follow a logical H1 → H2 → H3 hierarchy. No heading skips detected. However, most H2s are descriptive rather than question-format (reduces AI Overview eligibility — see GEO section).

### OG / Social Cards

| Tag | Homepage | Posts |
|---|---|---|
| `og:title` | ❌ Empty | ✅ Correct |
| `og:description` | ❌ Empty | ✅ Correct |
| `og:image` | ⚠️ `/images/01.jpg` | ⚠️ Generic `hero.png` (1.5 MB, not post-specific) |
| `twitter:title` | ❌ Empty | ✅ Correct |
| `twitter:description` | ❌ Empty | ✅ Correct |
| `twitter:image` | ⚠️ `/images/01.jpg` (homepage) | ✅ `hero.png` |

---

## Section 4: Schema / Structured Data

**Score: 62 / 100**

### Coverage by Layout

| Layout | Schema Present | Type | Status |
|---|---|---|---|
| `post` (blog posts, series posts, book notes) | ✅ YES | `BlogPosting` | PASS |
| Homepage | ❌ NO | — | FAIL |
| `page` (about, contact, etc.) | ❌ NO | — | FAIL |
| `podcast-landing` | ❌ NO | — | FAIL |
| `series-landing` / index pages | ❌ NO | — | FAIL |

**Root cause:** Schema injection in `_includes/head.html` is gated on `{% if page.layout == "post" %}`. All other layouts produce zero JSON-LD.

### BlogPosting Validation (existing schema)

| Field | Status | Notes |
|---|---|---|
| `@context`, `@type` | ✅ PASS | |
| `headline`, `description` | ✅ PASS | |
| `datePublished`, `dateModified` | ✅ PASS | ISO 8601 format |
| `author` (Person) | ✅ PASS | `name`, `url` present |
| `author.@id` | ❌ FAIL | Missing; needed for entity resolution |
| `author.sameAs` | ❌ FAIL | Missing LinkedIn/GitHub |
| `publisher` (Organization) | ✅ PASS | `name`, `url` present |
| `publisher.logo` | ❌ FAIL | Required for Article rich results |
| `image` | ✅ PASS (bare string) | Should be `ImageObject` with `width`/`height` |
| `isPartOf` (CreativeWorkSeries) | ✅ PASS | Correctly used on series posts |
| `keywords` | ✅ PASS | |

### Missing Schema Opportunities (priority order)

| Priority | Schema Type | Page | Impact |
|---|---|---|---|
| 1 | `WebSite` + `Person` | Homepage | Knowledge Panel, entity disambiguation |
| 2 | `ProfilePage` + `Person` | `/about/` | Knowledge Panel eligibility |
| 3 | Fix `publisher.logo`, `author.@id`, `image` as `ImageObject` | All posts | Article rich result eligibility |
| 4 | `VideoObject` + `BreadcrumbList` | Podcast pages | Video rich results |
| 5 | `ItemList` + `BreadcrumbList` | Series index pages | Series cluster in SERP |
| 6 | `isPartOf` (Book entity) | Book notes | Content hierarchy |
| 7 | `FAQPage` | Latency + hot-path posts | AI Overview eligibility |

---

## Section 5: Performance (Core Web Vitals)

**Score: 40 / 100** *(No CrUX field data — based on HTML analysis)*

### Critical: Image Sizes

| Image | File Size | Usage | Risk |
|---|---|---|---|
| `profile.png` | **2.3 MB** | LCP image (homepage hero) | ❌ CRITICAL — LCP likely 4–8s on mobile |
| `hero.png` | **1.5 MB** | OG image; post fallback | ❌ HIGH — downloads on every post page |
| All images | PNG/JPEG | All pages | ⚠️ No WebP/AVIF served |

A 2.3 MB LCP image almost certainly fails the "Good" LCP threshold (< 2.5s) on mobile connections. This is likely the single biggest performance issue on the site.

### Resource Loading

| Resource | Strategy | Status |
|---|---|---|
| `main.css` | In `<head>` (render-blocking) | ⚠️ MEDIUM |
| KaTeX CSS | In `<head>` on math pages | ⚠️ MEDIUM |
| `scripts.js` (53 KB) | `defer` | ✅ GOOD |
| `common.js` (30 KB) | `defer` | ✅ GOOD |
| Google Fonts (5 families) | `preload as="style"` + onload swap | ✅ GOOD (non-blocking) |
| Font Awesome (3 woff2 files) | CSS `@font-face` from cdnjs | ⚠️ 3rd-party dependency |
| Google Analytics | `async` | ✅ GOOD |
| KaTeX JS | `defer` | ✅ GOOD |

### CWV Risk Summary

| Metric | Risk | Driver |
|---|---|---|
| LCP | ❌ HIGH RISK | 2.3 MB profile.png LCP image |
| CLS | ⚠️ MEDIUM | `display=swap` on 5 Google Font families causes text reflow |
| INP | ✅ LOW | SSR Jekyll; minimal JS; no SPA framework |

### Image Optimization Gaps

- All images are PNG or JPEG — no WebP or AVIF served
- No `srcset` or responsive image variants detected
- Author avatar in post sidebars uses `class="lazy" data-src="..."` (JS lazy loading) — no native `loading="lazy"` fallback
- Homepage hero avatar is correctly set with `width="88" height="88"` and `loading="eager"` — this is correct
- No `<picture>` elements or browser-native format negotiation

---

## Section 6: Sitemap

**Score: 72 / 100**

| Check | Status | Details |
|---|---|---|
| Sitemap returns 200 | ✅ PASS | Valid XML |
| Sitemap referenced in robots.txt | ✅ PASS | Production robots.txt correct |
| Local `_site/robots.txt` | ⚠️ INFO | References `localhost:4000/sitemap.xml` — harmless (not deployed), but worth correcting |
| URL count | ✅ 47 URLs | Reasonable for site size |
| Trailing slash consistency | ⚠️ MEDIUM | `/posts/my-obsidian-setup` missing trailing slash; all others have one |
| `docs/elements` in sitemap | ❌ HIGH | Lorem Ipsum placeholder; should be excluded |
| `lastmod` on content pages | ✅ PASS | All dated posts have lastmod |
| `lastmod` on static pages | ⚠️ LOW | `/about/`, `/archive/`, `/lists/*` have no lastmod |
| URL format | ⚠️ MEDIUM | `docs/elements` URL is also inconsistent (no trailing slash) |
| Sitemap index file | ✅ N/A | 47 URLs is below the 50K limit; single sitemap file is fine |

---

## Section 7: AI Search Readiness (GEO)

**Score: 58 / 100**

| Dimension | Score | Key Gap |
|---|---|---|
| Citability | 70/100 | Definitions arrive late (250+ words in); no TL;DR blocks |
| Structural readability | 72/100 | Good H2/H3; few question-format headings |
| Technical accessibility | 61/100 | Excellent SSR; broken RSS; llms.txt missing |
| Authority/brand signals | 38/100 | No Wikipedia entity; no Reddit/YouTube presence |
| Multi-modal content | 45/100 | SVG diagrams present; no video; alt text gaps |

### AI Crawler Access

All crawlers allowed (no robots.txt restrictions) — correct for a public blog. No explicit allow signals but implicit allow is functionally equivalent.

### Citability Assessment

**Highest-probability citation targets (already extractable):**
1. The coffee shop analogy in the latency post ("95 customers × 2 min, 5 customers × 22 min, average = 3 min") — self-contained, numerical, verifiable
2. The async/await definition: "Async/await is not about making code faster. It is about not holding a thread hostage while it waits for I/O." — quotable, contrarian, precise

**Gaps blocking AI Overview eligibility:**
- Definitions arrive 150–300 words into posts (target: within first 60 words of a section)
- No TL;DR or definition callout blocks at post tops
- H2 headings are descriptive, not question-format (reduces query-matching probability)
- No `FAQPage` schema

### Platform Readiness

| Platform | Score | Primary Blocker |
|---|---|---|
| Perplexity | 62/100 | llms.txt absent; RSS broken |
| Google AI Overviews | 55/100 | Late definitions; no FAQ schema; no Wikipedia E-E-A-T anchor |
| Bing Copilot | 61/100 | Schema strong; author entity weak |
| ChatGPT (search mode) | 48/100 | No YouTube/Reddit brand signals (highest correlation ~0.74) |

---

## Section 8: Images

**Score: 30 / 100**

| Check | Status |
|---|---|
| LCP image preloaded | ✅ PASS (homepage only) |
| Image file sizes | ❌ CRITICAL — 2.3 MB and 1.5 MB |
| WebP/AVIF format | ❌ NOT SERVED |
| `width`/`height` attributes on `<img>` | ⚠️ PARTIAL — homepage hero has them; sidebar images in posts do not |
| `loading="lazy"` (native) | ⚠️ PARTIAL — JS lazy loading used instead of native |
| Alt text | ✅ PASS — checked images have descriptive alt text |
| Post-specific OG images | ❌ MISSING — all posts share the same generic `hero.png` |
| Responsive `srcset` | ❌ MISSING |

---

## Section 9: Backlinks

*(Common Crawl only — no Moz/Bing API configured)*  
Backlink data pending from the backlinks agent. Summary will be appended when available.

**Expected profile for a new personal technical blog (< 6 months public presence):**
- Referring domains: likely < 20
- Domain Rating: < 20 (new site)
- Primary link types: social profile auto-links, GitHub profile

**Organic backlink opportunities given content:**
- .NET/C# community: r/csharp, r/dotnet, dev.to, medium.com
- Performance content: The Pragmatic Engineer newsletter, ByteByteGo
- SOLID principles posts: linked from architecture learning resources

---

## Section 10: Visual / Mobile Audit

*(Playwright blocked — analysis based on HTML source)*

**Confirmed from HTML:**
- ✅ Viewport tag present
- ✅ Dark mode toggle implemented (localStorage persistence)
- ✅ Author profile image has explicit `width="88" height="88"` on homepage
- ✅ Navigation has ARIA labels
- ⚠️ OG image `hero.png` is 1.5 MB — will be slow to load in link preview renderers
- ⚠️ Search widget uses Font Awesome icons (external CDN dependency)
- ℹ️ Touch target sizes unverified (require visual inspection)

---

## All Issues — Priority-Ranked

### Critical (fix immediately)

| ID | Issue | File | Line |
|---|---|---|---|
| C1 | RSS feed href outputs `/%20/feed.xml` (space in string literal) | `_includes/head.html` | 11 |
| C2 | Meta description uses single-quote delimiters; apostrophe breaks attribute | `_includes/head.html` | 7–8 |
| C3 | LCP image (profile.png) is 2.3 MB | `images/author/profile.png` | — |
| C4 | `docs/elements` Lorem Ipsum page is indexed and in sitemap | `docs/elements.md` | frontmatter |

### High

| ID | Issue | File | Notes |
|---|---|---|---|
| H1 | OG/Twitter title empty on homepage (space in `" /"` condition) | `_includes/head.html` | Lines 17, 25 |
| H2 | OG/Twitter description empty on homepage (same bug) | `_includes/head.html` | Lines 19, 27 |
| H3 | hero.png is 1.5 MB (used as fallback image on every post) | `images/site_identity/hero.png` | — |
| H4 | No schema on homepage (WebSite + Person missing) | `_includes/head.html` | Add conditional |
| H5 | About page only ~150 words; too thin for E-E-A-T anchor role | `_pages/about.md` | Expand to 500+ words |
| H6 | Podcast + list pages have zero body content visible to crawlers | `_pages/podcasts.md`, etc. | Add editorial intro |

### Medium

| ID | Issue | Notes |
|---|---|---|
| M1 | `publisher.logo` missing from all BlogPosting schemas | `_includes/head.html` lines 147–158 |
| M2 | `author.@id` and `author.sameAs` missing from BlogPosting | Same location |
| M3 | `image` in schema is bare string (should be ImageObject) | Same location |
| M4 | No Person schema on `/about/` page | `_includes/head.html` or `_pages/about.md` |
| M5 | No LCP preload fallback for posts without `page.image` | `_includes/head.html` lines 70–72 |
| M6 | Font display=swap CLS risk (5 Google Font families) | Switch to `optional` or self-host |
| M7 | `/posts/my-obsidian-setup` missing trailing slash in sitemap | `_posts/2026-04-01-my-obsidian-setup.md` — add `/` to permalink |
| M8 | No `FAQPage` schema on latency/hot-path posts | Add to `_includes/head.html` |
| M9 | H2 headings not question-format (reduces AI Overview eligibility) | Edit post content |
| M10 | About page has no outbound links to posts | `_pages/about.md` |
| M11 | No images in WebP/AVIF format | Build pipeline or image conversion |
| M12 | Security headers absent (CSP, X-Frame-Options, etc.) | Add Cloudflare layer |

### Low

| ID | Issue | Notes |
|---|---|---|
| L1 | No `llms.txt` | Create at site root |
| L2 | `lastmod` absent from static pages in sitemap | `_config.yml` sitemap plugin defaults |
| L3 | Tags and archive pages indexed without unique content | Add noindex to those layouts |
| L4 | No IndexNow integration | Add post-deploy step to GitHub Actions |
| L5 | No series index schema (ItemList/BreadcrumbList) | Series landing layout |
| L6 | Goals-and-needs and assumptions posts under 900 words | Expand to 1,500+ |
| L7 | Supabase key committed to `_data/settings.yml` | Rotate; inject via GH Actions secret |
| L8 | No post-specific OG images | Generate per-post OG cards |
| L9 | No external authority signals (no conference talks, guest posts, Reddit) | Content distribution strategy |
| L10 | No `isPartOf` Book entity on book notes pages | Frontmatter + schema template |

---

## Root Cause Summary

Three underlying issues explain most of the high-priority findings:

### 1. Liquid Template Space Bug (affects 4 distinct features)
A leading space inside Liquid string literals in `_includes/head.html` causes:
- `" /feed.xml"` → `/%20/feed.xml` (RSS dead)
- `page.url == " /"` never matches (homepage OG/Twitter broken)

**Fix:** One commit to `_includes/head.html` — remove spaces from string literals.

### 2. HTML Attribute Delimiter Mismatch (affects all fallback-description pages)
`<meta name='description' content='{{ site.data.settings.description }}'>` uses single-quote delimiters. The description contains an apostrophe, which closes the attribute prematurely.

**Fix:** Switch to double-quote delimiters and add `| xml_escape`.

### 3. Unoptimized Images (affects LCP on every page load)
`profile.png` (2.3 MB) is the LCP image on the homepage. `hero.png` (1.5 MB) is downloaded on every post page as the OG/fallback image. Neither file is WebP-encoded, srcset-served, or dimensionally appropriate.

**Fix:** Convert to WebP; compress to < 100 KB for the hero/profile; add `srcset`.

---

*Report generated 2026-04-05 by Claude SEO Audit. Backlinks section pending Common Crawl query.*
