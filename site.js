// Reveals each element once, when it scrolls into view. Content is visible without script
// (the .js class is only added by an inline script) and under reduced motion (CSS).
(() => {
  const els = document.querySelectorAll('.rise, .write, .pen, .draw-rule');
  const show = (el) => el.classList.add('in');
  // ?still shows everything at once (used for full-page captures).
  if (location.search.includes('still')) document.documentElement.classList.add('still');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('still')) {
    els.forEach(show);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        show(e.target);
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));
})();
