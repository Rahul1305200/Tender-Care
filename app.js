/* ==========================================================================
   Tender Care — shared behaviour (home + photo gallery)
   Every block is guarded so a page missing an element never throws.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- current year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- sticky header shadow ---------- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* full-screen layouts (the location finder) size themselves below the sticky header */
    var setHeaderHeight = function () {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  }

  /* ---------- mobile drawer ---------- */
  var drawer = document.getElementById('drawer');
  var burger = document.getElementById('burger');
  if (drawer && burger) {
    var openDrawer = function (state) {
      drawer.classList.toggle('is-open', state);
      burger.setAttribute('aria-expanded', String(state));
      document.body.style.overflow = state ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { openDrawer(true); });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target.closest('a')) openDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) openDrawer(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var pos = Array.prototype.indexOf.call(el.parentElement.children, el);
          el.style.transitionDelay = Math.min(pos, 5) * 80 + 'ms';
          el.classList.add('is-in');
          io.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
    }
  }

  /* ---------- scrollspy: highlight the in-page link for the section being read ---------- */
  document.querySelectorAll('[data-scrollspy]').forEach(function (nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var targets = links.map(function (a) { return document.getElementById(a.hash.slice(1)); });
    if (!('IntersectionObserver' in window) || targets.some(function (t) { return !t; })) return;
    var mark = function (id) {
      links.forEach(function (a) {
        if (a.hash === '#' + id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) mark(entry.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
    /* above the first section, nothing is current */
    window.addEventListener('scroll', function () {
      if (targets[0].getBoundingClientRect().top > window.innerHeight * .45) mark(null);
    }, { passive: true });
  });

  /* ---------- marquee: clone each row once for a seamless loop ---------- */
  document.querySelectorAll('[data-row]').forEach(function (row) {
    Array.prototype.slice.call(row.children).forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      clone.removeAttribute('data-lb-item');
      row.appendChild(clone);
    });
  });

  /* ---------- gallery wall: columns drift at different rates on scroll ---------- */
  var wall = document.querySelector('[data-parallax]');
  if (wall) {
    var cols = Array.prototype.slice.call(wall.querySelectorAll('[data-speed]'));
    var wide = window.matchMedia('(min-width:1081px)');
    var ticking = false;

    var paint = function () {
      ticking = false;
      if (reduce || !wide.matches) {
        cols.forEach(function (c) { c.style.transform = ''; });
        return;
      }
      var r = wall.getBoundingClientRect();
      /* 0 when the wall is entering, 1 when it has fully passed */
      var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      p = Math.max(0, Math.min(1, p));
      cols.forEach(function (c) {
        var y = (p - 0.5) * parseFloat(c.dataset.speed);
        c.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0)';
      });
    };
    var request = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    if (wide.addEventListener) wide.addEventListener('change', request);
    /* expose for verification; harmless in production */
    wall.repaint = paint;
    paint();
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lb-item]'));
  if (lb && items.length) {
    var lbImg = document.getElementById('lb-img');
    var lbCount = document.getElementById('lb-count');
    var index = 0;
    var lastFocus = null;

    var show = function (i, animate) {
      index = (i + items.length) % items.length;
      var item = items[index];
      var src = item.getAttribute('data-full');
      var img = item.querySelector('img');
      var alt = img ? img.alt : '';
      var swap = function () {
        lbImg.src = src;
        lbImg.alt = alt;
        lbImg.classList.remove('is-swapping');
      };
      if (lbCount) lbCount.textContent = (index + 1) + ' / ' + items.length;
      if (!animate || reduce) { swap(); return; }
      lbImg.classList.add('is-swapping');
      setTimeout(swap, 160);
    };

    /* warm the neighbours so next/prev feel instant */
    var preload = function () {
      [index + 1, index - 1].forEach(function (i) {
        var item = items[(i + items.length) % items.length];
        var im = new Image();
        im.src = item.getAttribute('data-full');
      });
    };

    var openLb = function (i) {
      lastFocus = document.activeElement;
      show(i, false);
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('[data-lb-close]').focus();
      preload();
    };
    var closeLb = function () {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    var step = function (delta) { show(index + delta, true); preload(); };

    items.forEach(function (item, i) {
      item.addEventListener('click', function () { openLb(i); });
    });

    lb.querySelector('[data-lb-close]').addEventListener('click', closeLb);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { step(-1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* ---------- video gallery: choose from the playlist, play in place ---------- */
  var player = document.getElementById('vplayer');
  var vitems = Array.prototype.slice.call(document.querySelectorAll('[data-video]'));
  if (player && vitems.length) {
    var vstage = document.querySelector('[data-video-stage]');
    var vtitle = document.getElementById('vtitle');
    var vposter = document.getElementById('vposter');
    var vplay = document.getElementById('vplay');
    var vpos = document.getElementById('vpos');
    var vtime = document.getElementById('vtime');
    var vnote = document.getElementById('vnote');
    var currentVideo = vitems.filter(function (v) { return v.getAttribute('aria-pressed') === 'true'; })[0] || vitems[0];

    var stopVideo = function () {
      player.removeAttribute('src');
      player.hidden = true;
      vposter.hidden = false;
      vplay.hidden = false;
      vnote.hidden = true;
      vstage.classList.remove('is-playing');
      vitems.forEach(function (v) {
        v.classList.remove('is-playing');
        v.querySelector('.vg-item__state').textContent = 'Selected';
      });
    };

    var selectVideo = function (item) {
      if (item === currentVideo) return;
      currentVideo = item;
      stopVideo();
      var title = item.querySelector('.vg-item__title').textContent;
      var time = item.getAttribute('data-time');
      vtitle.textContent = title;
      vposter.src = item.getAttribute('data-poster');
      vplay.setAttribute('aria-label', 'Play ' + title);
      player.title = title;
      vpos.textContent = vitems.indexOf(item) + 1;
      vtime.hidden = !time;
      vtime.querySelector('span').textContent = time;
      vitems.forEach(function (v) { v.setAttribute('aria-pressed', v === item ? 'true' : 'false'); });
    };

    var playVideo = function () {
      vplay.hidden = true;
      /* YouTube refuses embeds from pages opened as local files (error 153) */
      if (window.location.protocol === 'file:') { vnote.hidden = false; return; }
      player.src = 'https://www.youtube-nocookie.com/embed/' + currentVideo.getAttribute('data-video') +
        '?rel=0&autoplay=1&playsinline=1&origin=' + encodeURIComponent(window.location.origin);
      player.hidden = false;
      vposter.hidden = true;
      vstage.classList.add('is-playing');
      currentVideo.classList.add('is-playing');
      currentVideo.querySelector('.vg-item__state').textContent = 'Now playing';
    };

    vitems.forEach(function (item) {
      item.addEventListener('click', function () {
        selectVideo(item);
        if (window.innerWidth < 961 && vstage.getBoundingClientRect().top < 0) {
          vstage.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        }
      });
    });
    vplay.addEventListener('click', playVideo);
  }

  /* ---------- site-wide location finder: first-visit prompt, floating button, lightbox ---------- */
  var script = document.currentScript || document.querySelector('script[src$="app.js"]');
  var embedded = window.self !== window.top || /[?&]compact=1\b/.test(window.location.search);
  if (script && !embedded) {
    var finderUrl = new URL('locations.html?compact=1', script.src).href;
    var onFinderPage = !!document.querySelector('[data-location-finder]');
    var store = {
      get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
      set: function (key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked */ } }
    };
    var PROMPT_KEY = 'tc-location-prompt';

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'tc-fab';
    fab.innerHTML = '<i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>Find your nearest center</span>';

    /* lift the button clear of the footer bar so it never covers its text */
    var footerBar = document.querySelector('.footer__bottom');
    if (footerBar && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        fab.style.setProperty('--lift', footerBar.offsetHeight + 'px');
        fab.classList.toggle('is-lifted', entries[0].isIntersecting);
      }).observe(footerBar);
    }
    document.body.appendChild(fab);

    /* on the locations page the finder is already here — step aside while it is on screen */
    if (onFinderPage && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        fab.classList.toggle('is-away', entries[0].isIntersecting);
      }, { threshold: 0.15 }).observe(document.querySelector('[data-location-finder]'));
    }

    var finderBox = null;
    var finderFrame = null;
    var finderReturn = null;

    var buildFinderBox = function () {
      finderBox = document.createElement('div');
      finderBox.className = 'tc-finderbox';
      finderBox.innerHTML =
        '<div class="tc-finderbox__scrim" data-finder-close></div>' +
        '<div class="tc-finderbox__dialog" role="dialog" aria-modal="true" aria-labelledby="tc-finderbox-title">' +
          '<div class="tc-finderbox__bar">' +
            '<p id="tc-finderbox-title"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Tender Care locations</p>' +
            '<button type="button" class="tc-finderbox__close" data-finder-close aria-label="Close locations"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
          '</div>' +
          '<div class="tc-finderbox__frame"><p class="tc-finderbox__loading">Loading the map…</p></div>' +
        '</div>';
      document.body.appendChild(finderBox);
      finderBox.addEventListener('click', function (e) {
        if (e.target.closest('[data-finder-close]')) closeFinder();
      });
      finderBox.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeFinder();
        if (e.key !== 'Tab') return;
        /* keep focus between the close button and the embedded finder */
        var close = finderBox.querySelector('.tc-finderbox__close');
        if (e.shiftKey && document.activeElement === close) { e.preventDefault(); finderFrame.focus(); }
        else if (!e.shiftKey && document.activeElement === finderFrame) { e.preventDefault(); close.focus(); }
      });
    };

    var openFinder = function () {
      dismissPrompt();
      if (onFinderPage) {
        document.querySelector('[data-location-finder]').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        return;
      }
      if (!finderBox) buildFinderBox();
      if (!finderFrame) {
        finderFrame = document.createElement('iframe');
        finderFrame.src = finderUrl;
        finderFrame.title = 'Tender Care location finder';
        finderFrame.addEventListener('load', function () { finderBox.classList.add('is-loaded'); });
        finderBox.querySelector('.tc-finderbox__frame').appendChild(finderFrame);
      }
      finderReturn = document.activeElement;
      finderBox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      finderBox.querySelector('.tc-finderbox__close').focus();
    };

    var closeFinder = function () {
      if (!finderBox) return;
      finderBox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (finderReturn && finderReturn.focus) finderReturn.focus();
    };

    fab.addEventListener('click', openFinder);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && finderBox && finderBox.classList.contains('is-open')) closeFinder();
    });

    var prompt = null;
    var dismissPrompt = function () {
      store.set(PROMPT_KEY, 'seen');
      if (!prompt) return;
      prompt.classList.remove('is-in');
      var gone = prompt;
      prompt = null;
      window.setTimeout(function () { gone.remove(); }, reduce ? 0 : 260);
    };

    if (!onFinderPage && store.get(PROMPT_KEY) !== 'seen') {
      window.setTimeout(function () {
        if (store.get(PROMPT_KEY) === 'seen') return;
        prompt = document.createElement('aside');
        prompt.className = 'tc-prompt';
        prompt.setAttribute('aria-labelledby', 'tc-prompt-title');
        prompt.innerHTML =
          '<button type="button" class="tc-prompt__close" data-prompt-dismiss aria-label="Dismiss"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
          '<img class="tc-prompt__bear" src="' + new URL('assets/bear.svg', script.src).href + '" alt="" width="64" height="109">' +
          '<div class="tc-prompt__body">' +
            '<p class="tc-prompt__title" id="tc-prompt-title">Looking for a center near you?</p>' +
            '<p>Explore all 20 Tender Care locations on our interactive map.</p>' +
            '<div class="tc-prompt__actions">' +
              '<button type="button" class="btn btn--rose btn--sm" data-prompt-open>Check locations</button>' +
              '<button type="button" class="tc-prompt__later" data-prompt-dismiss>Not now</button>' +
            '</div>' +
          '</div>';
        document.body.appendChild(prompt);
        prompt.addEventListener('click', function (e) {
          if (e.target.closest('[data-prompt-open]')) openFinder();
          else if (e.target.closest('[data-prompt-dismiss]')) dismissPrompt();
        });
        window.requestAnimationFrame(function () { if (prompt) prompt.classList.add('is-in'); });
      }, 2200);
    }
  }

  /* ---------- parent handbook: chapter nav, search, print ---------- */
  var hb = document.getElementById('handbook');
  if (hb) {
    var hbSide = hb.querySelector('.hb-side');
    var hbToggle = hb.querySelector('.hb-side__toggle');
    var hbToc = document.getElementById('hb-toc');
    var hbChapters = Array.prototype.slice.call(hb.querySelectorAll('.hb-ch'));
    var hbItems = Array.prototype.slice.call(hb.querySelectorAll('.hb-toc__ch'));
    var hbSubLinks = Array.prototype.slice.call(hb.querySelectorAll('.hb-toc__subs a'));
    var hbHeads = hbSubLinks.map(function (a) { return document.getElementById(a.hash.slice(1)); });
    var hbQ = document.getElementById('hb-q');
    var hbClear = hb.querySelector('.hb-search__clear');
    var hbStatus = document.getElementById('hb-status');
    var hbEmpty = document.getElementById('hb-empty');
    var hbParts = Array.prototype.slice.call(hb.querySelectorAll('.hb-part'));
    var hbOriginal = hbParts.map(function (p) { return p.innerHTML; });
    var dropdown = function () { return getComputedStyle(hbToggle).display !== 'none'; };

    /* "Chapters" dropdown on small screens */
    var setTocOpen = function (state) {
      hbSide.classList.toggle('is-open', state);
      hbToggle.setAttribute('aria-expanded', String(state));
    };
    hbToggle.addEventListener('click', function () { setTocOpen(!hbSide.classList.contains('is-open')); });
    document.addEventListener('click', function (e) {
      if (hbSide.classList.contains('is-open') && !hbSide.contains(e.target)) setTocOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hbSide.classList.contains('is-open')) { setTocOpen(false); hbToggle.focus(); }
    });

    /* highlight the chapter and heading being read; keep the sidebar link in view */
    var lastBefore = function (els, line) {
      var found = -1;
      els.forEach(function (el, i) {
        if (el.offsetParent !== null && el.getBoundingClientRect().top <= line) found = i;
      });
      return found;
    };
    var hbTick = false;
    var hbUpdate = function () {
      hbTick = false;
      var line = window.innerHeight * 0.3;
      var ch = lastBefore(hbChapters, line);
      var sub = lastBefore(hbHeads, line);
      hbItems.forEach(function (li, i) {
        li.classList.toggle('is-current', i === ch);
        var link = li.querySelector('.hb-toc__link');
        if (i === ch) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
      hbSubLinks.forEach(function (a, i) {
        var on = i === sub && hbChapters[ch] && hbChapters[ch].contains(hbHeads[i]);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (!dropdown()) {
        var active = hbToc.querySelector('.hb-toc__subs a[aria-current="true"]') || hbToc.querySelector('.hb-toc__link[aria-current="true"]');
        if (active) {
          var top = active.offsetTop, view = hbToc.scrollTop;
          if (top < view + 40 || top > view + hbToc.clientHeight - 60) hbToc.scrollTop = top - hbToc.clientHeight / 3;
        }
      }
    };
    var hbSchedule = function () { if (!hbTick) { hbTick = true; requestAnimationFrame(hbUpdate); } };
    window.addEventListener('scroll', hbSchedule, { passive: true });
    window.addEventListener('resize', hbSchedule);
    hbUpdate();

    /* search: show only the sections that mention the words, and mark them */
    var markText = function (root, needle) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var text = node.nodeValue, lower = text.toLowerCase(), at = lower.indexOf(needle);
        if (at < 0) return;
        var frag = document.createDocumentFragment(), from = 0;
        while (at > -1) {
          frag.appendChild(document.createTextNode(text.slice(from, at)));
          var mark = document.createElement('mark');
          mark.textContent = text.slice(at, at + needle.length);
          frag.appendChild(mark);
          from = at + needle.length;
          at = lower.indexOf(needle, from);
        }
        frag.appendChild(document.createTextNode(text.slice(from)));
        node.parentNode.replaceChild(frag, node);
      });
    };
    var runSearch = function () {
      var term = hbQ.value.trim().replace(/\s+/g, ' ');
      var needle = term.toLowerCase();
      var searching = needle.length > 1;
      var hits = 0;
      hbClear.hidden = !term;
      hbParts.forEach(function (p, i) {
        p.innerHTML = hbOriginal[i];
        var match = !searching || p.textContent.toLowerCase().indexOf(needle) > -1;
        p.hidden = !match;
        if (searching && match) { hits++; markText(p, needle); }
      });
      hbChapters.forEach(function (c, i) {
        c.hidden = searching && !c.querySelector('.hb-part:not([hidden])');
        hbItems[i].classList.toggle('is-dim', c.hidden);
      });
      hb.classList.toggle('is-searching', searching);
      hbEmpty.hidden = !searching || hits > 0;
      hbStatus.textContent = searching && hits ? hits + (hits === 1 ? ' section mentions “' : ' sections mention “') + term + '”' : '';
      if (searching) {
        var top = hb.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 96) - 20;
        if (window.scrollY > top) window.scrollTo(0, top);
      }
      hbUpdate();
    };
    var clearSearch = function () { hbQ.value = ''; runSearch(); };
    var hbTimer;
    hbQ.addEventListener('input', function () { clearTimeout(hbTimer); hbTimer = setTimeout(runSearch, 160); });
    hbQ.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hbQ.value) { e.stopPropagation(); clearSearch(); } });
    hbClear.addEventListener('click', function () { clearSearch(); hbQ.focus(); });
    hb.querySelectorAll('[data-hb-clear]').forEach(function (b) {
      b.addEventListener('click', function () { clearSearch(); hbQ.focus(); });
    });

    /* a contents link to a section hidden by the search clears the search first */
    hbToc.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var target = document.getElementById(a.hash.slice(1));
      if (target && target.offsetParent === null) clearSearch();
      setTocOpen(false);
    });

    /* print the whole handbook, or only the acknowledgement form */
    document.querySelectorAll('[data-hb-print]').forEach(function (b) {
      b.addEventListener('click', function () { if (hbQ.value) clearSearch(); window.print(); });
    });
    hb.querySelectorAll('[data-hb-print-form]').forEach(function (b) {
      b.addEventListener('click', function () {
        var done = function () {
          document.body.classList.remove('hb-print-form');
          window.removeEventListener('afterprint', done);
        };
        document.body.classList.add('hb-print-form');
        window.addEventListener('afterprint', done);
        window.print();
      });
    });
  }

  /* ---------- stat count-up ---------- */
  var nums = document.querySelectorAll('.stat__num[data-count]');
  if (nums.length) {
    var run = function (el) {
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix ? '<span>' + el.dataset.suffix + '</span>' : '';
      if (reduce) { el.innerHTML = target + suffix; return; }
      /* rAF is frozen in a background tab — wait for the page to be visible
         so the count actually animates instead of snapping to the total */
      if (document.hidden) {
        document.addEventListener('visibilitychange', function once () {
          document.removeEventListener('visibilitychange', once);
          run(el);
        });
        return;
      }
      var start = performance.now();
      var tick = function (now) {
        var p = Math.min((now - start) / 1500, 1);
        el.innerHTML = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      var nio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          nio.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      Array.prototype.forEach.call(nums, function (el) { nio.observe(el); });
    } else {
      Array.prototype.forEach.call(nums, run);
    }
  }
})();
