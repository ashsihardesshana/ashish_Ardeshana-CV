/**
 * script.js
 * Handles: scroll-spy highlighting on the floating side nav,
 * mobile profile-card drawer toggle, and dynamic footer year.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Scroll-spy: highlight the matching side-nav icon
     as each <section> enters the viewport
  --------------------------------------------------------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main .section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.side-nav__link'));

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var linkById = {};
    navLinks.forEach(function (link) {
      linkById[link.getAttribute('data-nav')] = link;
    });

    var setActive = function (id) {
      navLinks.forEach(function (link) { link.classList.remove('is-active'); });
      var match = linkById[id];
      if (match) match.classList.add('is-active');
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -50% 0px', // trigger when section is near vertical center
        threshold: 0
      }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------------------------------------------------------
     Scroll-reveal animations for sections & cards
     Progressive enhancement: elements only go invisible once
     the 'reveal' class below is added by JS, so content is
     never hidden if JavaScript fails to run.
  --------------------------------------------------------- */
  var STAGGER_STEP = 90;   // ms between siblings in the same group
  var STAGGER_MAX = 4;     // cap how many siblings actually stagger

  var applyReveal = function (elements, options) {
    options = options || {};
    Array.prototype.forEach.call(elements, function (el, i) {
      el.classList.add('reveal');
      if (options.pop) el.classList.add('reveal--pop');
      if (options.stagger) {
        var delay = Math.min(i, STAGGER_MAX) * STAGGER_STEP;
        el.style.setProperty('--reveal-delay', delay + 'ms');
      }
    });
  };

  // Section-level headings/intro copy — simple fade-up, no stagger
  applyReveal(document.querySelectorAll(
    '.section > .eyebrow, .section > .section-title, .section > .hero-title, ' +
    '.section > .section-desc, .section > .hero-desc, .section > .hero-stats'
  ));

  // Card groups — fade-up with a slight scale, staggered per group
  applyReveal(document.querySelectorAll('.service-card'), { pop: true, stagger: true });
  applyReveal(document.querySelectorAll('.skill-badge'), { pop: true, stagger: true });
  applyReveal(document.querySelectorAll('.portfolio-card'), { pop: true, stagger: true });
  applyReveal(document.querySelectorAll('.timeline__item'), { stagger: true });
  applyReveal(document.querySelectorAll('.profile-card'));

  var revealTargets = document.querySelectorAll('.reveal');

  if (revealTargets.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // No IntersectionObserver support — just show everything
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
