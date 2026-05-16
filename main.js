(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-stagger, .hairline-draw');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var update = function () {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initMobileNav() {
    var btn = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.nav-mobile');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  function animateNumber(el) {
    var target = parseFloat(el.getAttribute('data-count') || el.textContent);
    if (isNaN(target)) return;
    var duration = 1400;
    var start = performance.now();
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    function frame(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(target * eased);
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window)) { nums.forEach(animateNumber); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateNumber(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  function setYear() {
    var y = document.querySelectorAll('[data-year]');
    y.forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  onReady(function () {
    initReveal();
    initSmoothScroll();
    initHeaderScroll();
    initMobileNav();
    initCounters();
    setYear();
  });
})();