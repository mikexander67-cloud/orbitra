(function(){
  'use strict';

  function onReady(fn){
    if(document.readyState !== 'loading'){fn();}
    else{document.addEventListener('DOMContentLoaded', fn);}
  }

  onReady(function(){
    // Reveal on scroll
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .hairline-draw');
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
      revealEls.forEach(function(el){ io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add('in-view'); });
    }

    // Sticky header state
    var header = document.querySelector('.site-header');
    if(header){
      var onScroll = function(){
        if(window.scrollY > 40){ header.classList.add('scrolled'); }
        else { header.classList.remove('scrolled'); }
      };
      onScroll();
      window.addEventListener('scroll', onScroll, {passive:true});
    }

    // Mobile nav toggle
    var toggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if(toggle && navLinks){
      toggle.addEventListener('click', function(){
        navLinks.classList.toggle('open');
      });
      navLinks.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
      });
    }

    // Smooth scroll for internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href');
        if(id.length > 1){
          var target = document.querySelector(id);
          if(target){
            e.preventDefault();
            target.scrollIntoView({behavior:'smooth', block:'start'});
          }
        }
      });
    });

    // Number counter animation
    function animateCount(el){
      var target = parseFloat(el.getAttribute('data-count') || el.textContent);
      if(isNaN(target)) return;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1400;
      var start = performance.now();
      var startVal = 0;
      function frame(now){
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(startVal + (target - startVal) * eased);
        el.textContent = prefix + val.toLocaleString() + suffix;
        if(p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    var counters = document.querySelectorAll('[data-count]');
    if(counters.length && 'IntersectionObserver' in window){
      var co = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      }, {threshold:0.4});
      counters.forEach(function(c){ co.observe(c); });
    }

    // Current year in footer
    document.querySelectorAll('[data-year]').forEach(function(el){
      el.textContent = new Date().getFullYear();
    });
  });
})();
