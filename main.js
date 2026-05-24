/* ==========================================================================
   ORBITRA — main.js
   Minimal, defensive. Every feature isolated so one failure cannot
   break the others. Content is visible without JS; this only enhances.
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---- 1. Mobile hamburger menu ---- */
    try {
      var toggle = document.querySelector('.nav-toggle');
      var menu = document.querySelector('.mobile-menu');
      if (toggle && menu) {
        var setOpen = function (open) {
          toggle.classList.toggle('open', open);
          menu.classList.toggle('open', open);
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          document.body.style.overflow = open ? 'hidden' : '';
        };
        toggle.addEventListener('click', function () {
          setOpen(!menu.classList.contains('open'));
        });
        toggle.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!menu.classList.contains('open'));
          }
        });
        menu.addEventListener('click', function (e) {
          if (e.target.tagName === 'A') setOpen(false);
        });
      }
    } catch (e) { /* ignore — menu still renders */ }

    /* ---- 2. Header bottom-border on scroll ---- */
    try {
      var header = document.querySelector('.site-header');
      if (header) {
        var onScroll = function () {
          header.classList.toggle('scrolled', window.scrollY > 8);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
      }
    } catch (e) { /* ignore */ }

    /* ---- 3. Scroll-reveal (additive — content already visible) ---- */
    try {
      var revealEls = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window && revealEls.length) {
        var ro = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              ro.unobserve(entry.target);
            }
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { ro.observe(el); });
      } else {
        /* No observer support — show everything */
        revealEls.forEach(function (el) { el.classList.add('in-view'); });
      }
    } catch (e) {
      /* On any failure, force everything visible */
      try {
        document.querySelectorAll('.reveal').forEach(function (el) {
          el.classList.add('in-view');
        });
      } catch (e2) { /* ignore */ }
    }

    /* ---- 4. Sticky strip active-section highlight (homepage only) ---- */
    try {
      var stripLinks = document.querySelectorAll('.section-strip a');
      if (stripLinks.length && 'IntersectionObserver' in window) {
        var linkFor = {};
        stripLinks.forEach(function (a) {
          var id = (a.getAttribute('href') || '').replace('#', '');
          if (id) linkFor[id] = a;
        });
        var sections = [];
        Object.keys(linkFor).forEach(function (id) {
          var s = document.getElementById(id);
          if (s) sections.push(s);
        });
        var so = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              stripLinks.forEach(function (a) { a.classList.remove('is-active'); });
              var active = linkFor[entry.target.id];
              if (active) active.classList.add('is-active');
            }
          });
        }, { rootMargin: '-30% 0px -60% 0px' });
        sections.forEach(function (s) { so.observe(s); });
      }
    } catch (e) { /* ignore — strip still works as plain links */ }

  });
})();
