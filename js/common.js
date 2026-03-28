---
---
document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  /* =======================================================
  // New / New Article Badges — last-visit awareness
  ======================================================= */
  (function () {
    var now = Date.now();
    var prevVisit = parseInt(localStorage.getItem('tit_last_visit') || '0', 10);

    function isNew(isoDate, card) {
      if (!isoDate) return false;
      var days = parseInt((card && card.dataset.newBadgeDays) || '15', 10);
      var thresholdMs = days * 24 * 60 * 60 * 1000;
      var t = new Date(isoDate).getTime();
      return (now - t < thresholdMs) || (prevVisit > 0 && t > prevVisit);
    }

    function getOrCreateBadgesContainer(card, isOverlay) {
      var existing = card.querySelector(isOverlay ? '.article__head .article__badges' : '.article__content .article__badges--inline');
      if (existing) return existing;
      var wrap = document.createElement('div');
      wrap.className = isOverlay ? 'article__badges' : 'article__badges article__badges--inline';
      if (isOverlay) {
        var head = card.querySelector('.article__head');
        if (head) head.appendChild(wrap);
        else return null;
      } else {
        var content = card.querySelector('.article__content');
        if (content) content.insertBefore(wrap, content.firstChild);
        else return null;
      }
      return wrap;
    }

    function ensureBadge(card, badgeAttr, labelDataKey, extraClass) {
      var label = card.dataset[labelDataKey];
      if (!label) return;
      var hasImage = !!card.querySelector('.article__head');
      var container = getOrCreateBadgesContainer(card, hasImage);
      if (!container) return;
      if (container.querySelector('[data-badge="' + badgeAttr + '"]')) return;
      var span = document.createElement('span');
      span.className = 'article__new-badge' + (extraClass ? ' ' + extraClass : '');
      span.dataset.badge = badgeAttr;
      span.textContent = label;
      container.appendChild(span);
    }

    function removeBadge(card, badgeAttr) {
      var el = card.querySelector('[data-badge="' + badgeAttr + '"]');
      if (el) {
        el.remove();
        // Remove empty container
        ['.article__head .article__badges', '.article__content .article__badges--inline'].forEach(function (sel) {
          var wrap = card.querySelector(sel);
          if (wrap && wrap.children.length === 0) wrap.remove();
        });
      }
    }

    // -- Individual article cards --
    document.querySelectorAll('.article[data-published]').forEach(function (card) {
      if (card.classList.contains('article--series-card')) return; // handled separately
      var published = card.dataset.published;
      if (isNew(published, card)) {
        ensureBadge(card, 'new', 'newLabel', '');
      } else {
        removeBadge(card, 'new');
      }
    });

    // -- Series / concept cards --
    document.querySelectorAll('.article--series-card[data-series-newest]').forEach(function (card) {
      var newest = card.dataset.seriesNewest;
      var oldest = card.dataset.seriesOldest;

      // "New" badge: series itself is new (oldest post is new)
      if (isNew(oldest, card)) {
        ensureBadge(card, 'new', 'newLabel', '');
      } else {
        removeBadge(card, 'new');
      }

      // "New Article" badge: a new article exists, regardless of whether series is also new
      if (isNew(newest, card)) {
        ensureBadge(card, 'new-article', 'newArticleLabel', 'article__new-badge--article');
      } else {
        removeBadge(card, 'new-article');
      }
    });

    // Save current visit timestamp for next visit
    localStorage.setItem('tit_last_visit', String(now));

    // -- Recent posts widget: hide items older than last visit (threshold already applied server-side) --
    document.querySelectorAll('.widget-recent-posts').forEach(function (widget) {
      if (prevVisit === 0) return; // first visit — show all (threshold already applied by Jekyll)
      var days = parseInt(widget.dataset.newBadgeDays || '15', 10);
      var thresholdMs = days * 24 * 60 * 60 * 1000;
      var items = widget.querySelectorAll('.post-recent-content[data-published]');
      var visible = 0;
      items.forEach(function (item) {
        var t = new Date(item.dataset.published).getTime();
        if (t > prevVisit || (now - t < thresholdMs)) {
          visible++;
        } else {
          item.style.display = 'none';
        }
      });
      if (visible === 0) widget.style.display = 'none';
    });
  })();

  const html = document.querySelector('html'),
    globalWrap = document.querySelector('.global-wrap'),
    body = document.querySelector('body'),
    menuToggle = document.querySelector(".hamburger"),
    menuList = document.querySelector(".main-nav"),
    searchOpenButton = document.querySelectorAll(".search-button, .hero__search"),
    searchCloseIcon = document.querySelector(".search__close"),
    searchOverlay = document.querySelector(".search__overlay"),
    searchInput = document.querySelector(".search__text"),
    search = document.querySelector(".search"),
    toggleTheme = document.querySelector(".toggle-theme"),
    blogViewButton = document.querySelector(".blog__toggle"),
    splides = document.querySelector(".logos"),
    imagesOverlay = document.querySelector('.images-overlay'),
    btnScrollToTop = document.querySelector(".top");


  /* =======================================================
  // Menu + Search + Theme Switcher + Blog List View
  ======================================================= */
  menuToggle.addEventListener("click", () => {
    menu();
  });

  searchOpenButton.forEach(button => {
    button.addEventListener("click", searchOpen);
  });

  searchCloseIcon.addEventListener("click", () => {
    searchClose();
  });

  searchOverlay.addEventListener("click", () => {
    searchClose();
  });

  if (blogViewButton) {
    blogViewButton.addEventListener("click", () => {
      viewToggle();
    });
  }


  // Menu
  function menu() {
    menuToggle.classList.toggle("is-open");
    menuList.classList.toggle("is-visible");
  }

  // Dropdown Menu
  document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();

      document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
        if (menu !== toggle.nextElementSibling) {
          menu.classList.remove('is-visible');
        }
      });

      this.nextElementSibling.classList.toggle('is-visible');
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav__item')) {
      document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
        menu.classList.remove('is-visible');
      });
    }
  });


  // Search
  function searchOpen() {
    search.classList.add("is-visible");
    body.classList.add("search-is-visible");
    globalWrap.classList.add("is-active");
    menuToggle.classList.remove("is-open");
    menuList.classList.remove("is-visible");
    setTimeout(function () {
      searchInput.focus();
    }, 250);
  }

  function searchClose() {
    search.classList.remove("is-visible");
    body.classList.remove("search-is-visible");
    globalWrap.classList.remove("is-active");
  }

  document.addEventListener('keydown', function(e){
    if (e.key == 'Escape') {
      searchClose();
    }
  });


  // Theme Switcher
  if (toggleTheme && isToggleEnabled) {
    toggleTheme.addEventListener("click", () => {
      const isDarkMode = html.classList.contains("dark-mode");
      if (isDarkMode) {
        setTheme("light");
        localStorage.setItem("theme", "light");
      } else {
        setTheme("dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }


  // Blog List View
  function viewToggle() {
    if (html.classList.contains('view-list')) {
      html.classList.remove('view-list');
      localStorage.removeItem("classView");
      document.documentElement.removeAttribute("list");
    } else {
      html.classList.add('view-list');
      localStorage.setItem("classView", "list");
      document.documentElement.setAttribute("list", "");
    }
  }


  /* ============================
  // Logos Slider
  ============================ */
  if (splides) {
    new Splide(splides, {
      direction: 'ltr',
      clones: 8,
      gap: 16,
      autoWidth: true,
      drag: true,
      arrows: false,
      pagination: false,
      type: 'loop',
      autoScroll: {
        autoStart: true,
        speed: 0.4,
        pauseOnHover: false,
        pauseOnFocus: false
      },
      intersection: {
        inView: {
          autoScroll: true,
        },
        outView: {
          autoScroll: false,
        }
      },
    }).mount(window.splide.Extensions);
  }


  /* ================================================================
  // Stop Animations During Window Resizing and Switching Theme Modes
  ================================================================ */
  let disableTransition;

  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      stopAnimation();
    });
  }

  window.addEventListener("resize", () => {
    stopAnimation();
  });

  function stopAnimation() {
    document.body.classList.add("disable-animation");
    clearTimeout(disableTransition);
    disableTransition = setTimeout(() => {
      document.body.classList.remove("disable-animation");
    }, 100);
  };


  // =====================
  // Simple Jekyll Search
  // =====================
  SimpleJekyllSearch({
    searchInput: document.getElementById("js-search-input"),
    resultsContainer: document.getElementById("js-results-container"),
    json: "/search.json",
    searchResultTemplate: '{article}',
    noResultsText: '<div class="no-results">No results found...</div>'
  });


  /* =======================
  // Responsive Videos
  ======================= */
  reframe(".post__content iframe:not(.reframe-off), .page__content iframe:not(.reframe-off)");


  /* =======================
  // LazyLoad Images
  ======================= */
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  })


  /* =======================
  // Zoom Image
  ======================= */
  if (imagesOverlay) {
    const images = document.querySelectorAll('.post__content img, .page__content img, .gallery__image img');

    const clearOverlay = () => {
      imagesOverlay.classList.remove('active');
      imagesOverlay.innerHTML = '';
    };

    const createImageElement = (src) => {
      const img = document.createElement('img');
      img.src = src;
      return img;
    };

    const createDescriptionElement = (description) => {
      const descriptionElem = document.createElement('p');
      descriptionElem.textContent = description;
      descriptionElem.classList.add('image-overlay__description');
      return descriptionElem;
    };

    images.forEach(image => {
      image.addEventListener('click', () => {
        const galleryImage = image.closest('.gallery__image');
        const description = galleryImage?.querySelector('.gallery__image__caption')?.textContent || '';
        imagesOverlay.classList.add('active');

        imagesOverlay.innerHTML = '';
        imagesOverlay.appendChild(createImageElement(image.dataset.src || image.src));

        if (description) {
          imagesOverlay.appendChild(createDescriptionElement(description));
        }
      });
    });

    imagesOverlay.addEventListener('click', clearOverlay);
  }


  // =====================
  // Copy Code Button
  // =====================
  document.querySelectorAll('.post__content pre.highlight, .page__content pre.highlight')
  .forEach(function (pre) {
    const existingGutter = pre.querySelector('.code-gutter');
    if (existingGutter) {
      existingGutter.remove();
    }

    if (pre.dataset.lang) {
      delete pre.dataset.lang;
    }

    const existingCopyButton = pre.querySelector('button');
    if (existingCopyButton) {
      existingCopyButton.remove();
    }

    const code = pre.querySelector('code');
    const sourceElement = code || pre;
    const lineText = (sourceElement.innerText || '').replace(/\n$/, '');
    const lineCount = Math.max(lineText.split('\n').length, 1);

    const gutter = document.createElement('span');
    gutter.className = 'code-gutter';
    gutter.setAttribute('aria-hidden', 'true');

    for (let line = 1; line <= lineCount; line += 1) {
      const lineNumber = document.createElement('span');
      lineNumber.textContent = String(line);
      gutter.appendChild(lineNumber);
    }

    pre.insertBefore(gutter, code);

    const button = document.createElement('button');
    const copyText = 'Copy';
    button.type = 'button';
    button.ariaLabel = 'Copy code to clipboard';
    button.innerText = copyText;
    button.addEventListener('click', function () {
      const copySource = pre.querySelector('code') || pre;
      let code = copySource.innerText;
      try {
        code = code.trimEnd();
      } catch (e) {
        code = code.trim();
      }
      navigator.clipboard.writeText(code);
      button.innerText = 'Copied!';
      setTimeout(function () {
        button.blur();
        button.innerText = copyText;
      }, 2e3);
    });
    pre.appendChild(button);
  });


  // =====================
  // Load More Posts
  // =====================
  var load_posts_button=document.querySelector(".load-more-posts");

  load_posts_button&&load_posts_button.addEventListener("click",function(e){e.preventDefault();var t=load_posts_button.textContent;load_posts_button.classList.add("button--loading"),load_posts_button.textContent="Loading";var o=document.querySelector(".pagination"),n=pagination_next_url.split("/page")[0]+"/page/"+pagination_next_page_number+"/";fetch(n).then(function(e){if(e.ok)return e.text()}).then(function(e){var n=document.createElement("div");n.innerHTML=e;for(var a=document.querySelector(".grid"),i=n.querySelectorAll(".grid__post"),l=0;l<i.length;l++)a.appendChild(i.item(l));new LazyLoad({elements_selector:".lazy"}),pagination_next_page_number++,pagination_next_page_number>pagination_available_pages_number&&(o.style.display="none")}).finally(function(){load_posts_button.classList.remove("button--loading"),load_posts_button.textContent=t})});


  /* =======================
  // Scroll Top Button
  ======================= */
  window.addEventListener("scroll", function () {
  window.scrollY > window.innerHeight ? btnScrollToTop.classList.add("is-active") : btnScrollToTop.classList.remove("is-active");
  });

  btnScrollToTop.addEventListener("click", function () {
    if (window.scrollY != 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    }
  });


  /* =======================================================
  // Supabase — Page Views + Search Analytics
  ======================================================= */
  (function () {
    var SUPABASE_URL = '{{ site.data.settings.supabase_url }}';
    var SUPABASE_KEY = '{{ site.data.settings.supabase_publishable_key }}';
    var API = SUPABASE_URL + '/rest/v1';
    var HEADERS = {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json'
    };

    // -- Page Views + Visitors --
    var viewsEl = document.querySelector('.post-views');
    if (viewsEl) {
      var slug = viewsEl.dataset.slug;
      var isAr = (viewsEl.dataset.lang || '').startsWith('ar');
      var sessionKey = 'viewed_' + slug;

      // Generate or retrieve anonymous visitor ID
      var visitorId = localStorage.getItem('tit_vid');
      if (!visitorId) {
        visitorId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        localStorage.setItem('tit_vid', visitorId);
      }

      var arViewLabel = function (n) {
        if (n >= 1000 || n === 1 || n >= 11) return 'مشاهدة';
        if (n === 2)  return 'مشاهدتان';
        if (n <= 10)  return 'مشاهدات';
        return 'مشاهدة';
      };

      var arVisitorLabel = function (n) {
        if (n >= 1000 || n === 1 || n >= 11) return 'زائر';
        if (n === 2)  return 'زائران';
        if (n <= 10)  return 'زوار';
        return 'زائر';
      };

      var formatNum = function (n, ar) {
        var locale = ar ? 'ar' : undefined;
        if (n >= 1000000) return (n / 1000000).toLocaleString(locale, { maximumFractionDigits: 1 }) + (ar ? ' مليون' : 'M');
        if (n >= 1000)    return (n / 1000).toLocaleString(locale, { maximumFractionDigits: 1 }) + (ar ? ' ألف' : 'K');
        return n.toLocaleString(locale);
      };

      var renderDisplay = function (views, visitors) {
        var viewsPart, visitorsPart;
        if (isAr) {
          viewsPart    = formatNum(views, true) + ' ' + arViewLabel(views);
          visitorsPart = formatNum(visitors, true) + ' ' + arVisitorLabel(visitors);
        } else {
          viewsPart    = formatNum(views, false) + (views === 1 ? ' view' : ' views');
          visitorsPart = formatNum(visitors, false) + (visitors === 1 ? ' visitor' : ' visitors');
        }
        viewsEl.textContent = viewsPart + ' · ' + visitorsPart;
      };

      var fetchAndDisplay = function () {
        Promise.all([
          fetch(API + '/page_views?slug=eq.' + encodeURIComponent(slug) + '&select=count', { headers: HEADERS }).then(function (r) { return r.json(); }),
          fetch(API + '/visitor_slugs?slug=eq.' + encodeURIComponent(slug) + '&select=visitor_id', { headers: Object.assign({}, HEADERS, { 'Prefer': 'count=exact' }) })
            .then(function (r) { return parseInt(r.headers.get('content-range').split('/')[1], 10) || 0; })
        ]).then(function (results) {
          var views    = (results[0] && results[0][0]) ? Number(results[0][0].count) : 0;
          var visitors = results[1];
          if (views > 0) renderDisplay(views, visitors);
        }).catch(function () { viewsEl.remove(); });
      };

      var isBot    = navigator.webdriver || /bot|crawl|spider|slurp|mediapartners/i.test(navigator.userAgent);
      var isAuthor = localStorage.getItem('tit_author') === '1';

      if (!isBot && !isAuthor && !sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, '1');
        // Increment view count and record unique visitor in parallel
        Promise.all([
          fetch(API + '/rpc/increment_view', {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({ page_slug: slug })
          }),
          fetch(API + '/visitor_slugs', {
            method: 'POST',
            headers: Object.assign({}, HEADERS, { 'Prefer': 'return=minimal,resolution=ignore-duplicates' }),
            body: JSON.stringify({ visitor_id: visitorId, slug: slug })
          })
        ]).then(fetchAndDisplay).catch(function () { viewsEl.remove(); });
      } else {
        fetchAndDisplay();
      }
    }

    // -- Search Analytics --
    var searchInput = document.querySelector('#js-search-input');
    var searchResults = document.querySelector('#js-results-container');
    if (searchInput && searchResults) {
      var searchTimer;
      searchInput.addEventListener('input', function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
          var query = searchInput.value.trim();
          if (query.length < 3) return;
          var resultsCount = searchResults.querySelectorAll('li').length;
          fetch(API + '/search_queries', {
            method: 'POST',
            headers: Object.assign({}, HEADERS, { 'Prefer': 'return=minimal' }),
            body: JSON.stringify({ query: query, results_count: resultsCount })
          }).catch(function () {});
        }, 1500);
      });
    }
  })();

});