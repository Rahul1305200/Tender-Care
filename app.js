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

  /* ---------- video playlist: swap the player instead of leaving the page ---------- */
  var player = document.getElementById('vplayer');
  var vitems = Array.prototype.slice.call(document.querySelectorAll('[data-video]'));
  if (player && vitems.length) {
    var vtitle = document.getElementById('vtitle');
    vitems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        player.src = 'https://www.youtube-nocookie.com/embed/' + item.dataset.video + '?rel=0&autoplay=1';
        var name = item.querySelector('.vitem__title');
        if (name) {
          player.title = name.textContent;
          if (vtitle) vtitle.textContent = name.textContent;
        }
        vitems.forEach(function (v) { v.removeAttribute('aria-current'); });
        item.setAttribute('aria-current', 'true');
        if (window.innerWidth < 1081) player.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
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
