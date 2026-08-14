document.addEventListener('DOMContentLoaded', function () {
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );

  var links = Array.prototype.slice.call(
    document.querySelectorAll('[data-section]')
  );

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === id);
    });
  }

  // Reveal sections as they enter the viewport.
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(function (element) {
      revealObserver.observe(element);
    });

    // Keep the desktop/mobile section navigation in sync with scrolling.
    var activeObserver = new IntersectionObserver(function (entries) {
      var visibleEntries = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });

      if (visibleEntries.length) {
        setActive(visibleEntries[0].target.id);
      }
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0.05, 0.2, 0.5]
    });

    sections.forEach(function (section) {
      activeObserver.observe(section);
    });
  } else {
    // Fallback for older browsers.
    document.querySelectorAll('.reveal').forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  // Smooth section navigation.
  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetSelector = link.getAttribute('href');
      var target = targetSelector ? document.querySelector(targetSelector) : null;

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setActive(link.dataset.section);
    });
  });
});
