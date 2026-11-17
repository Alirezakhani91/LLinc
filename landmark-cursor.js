/* Landmark Living — Global Mouse Follower v1
 * 32px decorative cursor shadow; expands to 64px on interactive targets.
 * Independent of Webflow sliders, images, menu and animations.
 * One instance per page; disabled on touch and reduced-motion devices.
 */
(function () {
  'use strict';
  if (window.__landmarkGlobalCursorInstalled) return;
  window.__landmarkGlobalCursorInstalled = true;

  const media = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  if (!media || !media.matches) return;

  const css = `
  .ll-global-cursor {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 0 !important;
    height: 0 !important;
    pointer-events: none !important;
    z-index: 2147483000 !important;
    opacity: 0;
    visibility: hidden;
    transform: translate3d(-100px,-100px,0);
    will-change: transform;
    transition: opacity .19s ease, visibility .19s ease;
  }
  .ll-global-cursor.ll-is-visible {opacity:1;visibility:visible;}
  .ll-global-cursor__shadow {
    position: absolute;
    left: -16px;
    top: -16px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-sizing: border-box;
    background: rgba(18,22,27,.24);
    border: 1px solid rgba(240,240,240,.28);
    box-shadow: 0 5px 16px rgba(0,0,0,.17),inset 0 0 2px rgba(255,255,255,.18);
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform .28s cubic-bezier(.22,.61,.36,1),
                background .28s ease,
                box-shadow .28s ease;
  }
  .ll-global-cursor.ll-on-action .ll-global-cursor__shadow {
    transform: scale(2);
    background: rgba(18,22,27,.16);
    box-shadow: 0 6px 23px rgba(0,0,0,.15),inset 0 0 2px rgba(255,255,255,.20);
  }
  @media (hover:none), (pointer:coarse), (prefers-reduced-motion:reduce) {
    .ll-global-cursor {display:none !important;}
  }
  `;
  const style = document.createElement('style');
  style.id = 'landmark-global-cursor-style';
  style.textContent = css;
  document.head.appendChild(style);

  const outer = document.createElement('span');
  outer.className = 'll-global-cursor';
  outer.setAttribute('aria-hidden', 'true');
  outer.innerHTML = '<span class="ll-global-cursor__shadow"></span>';
  document.body.appendChild(outer);

  const selector = [
    'a[href]', 'button:not(:disabled)', 'input:not([type="hidden"]):not(:disabled)',
    'textarea:not(:disabled)', 'select:not(:disabled)', 'label[for]', 'summary',
    '[role="button"]', '[role="link"]', '[role="checkbox"]', '[role="switch"]',
    '[tabindex]:not([tabindex="-1"])', '[onclick]',
    '.w-slider-arrow-left', '.w-slider-arrow-right', '.w-slider-dot',
    '.w-nav-button', '.llp-arrow', '.llp-progress-dot', '[data-cursor-clickable]'
  ].join(',');

  function isAction(target) {
    if (!(target instanceof Element)) return false;
    const match = target.closest(selector);
    if (match && !match.matches(':disabled,[aria-disabled="true"]')) return true;
    // Covers Webflow interactions that set cursor:pointer on a wrapper.
    let node = target;
    for (let i = 0; node && i < 5; i++, node = node.parentElement) {
      if (node === outer) return false;
      const computed = window.getComputedStyle(node);
      if (computed.cursor === 'pointer') return true;
    }
    return false;
  }

  let x = 0, y = 0, destX = 0, destY = 0;
  let hasPosition = false, active = false, raf = 0;

  function animate() {
    raf = 0;
    if (!active) return;
    const dx = destX - x;
    const dy = destY - y;
    x += dx * .15;
    y += dy * .15;
    if (Math.abs(dx) < .12) x = destX;
    if (Math.abs(dy) < .12) y = destY;
    outer.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    if (x !== destX || y !== destY) raf = requestAnimationFrame(animate);
  }
  function showAt(event) {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return;
    destX = event.clientX;
    destY = event.clientY;
    if (!hasPosition) {
      x = destX;
      y = destY;
      hasPosition = true;
      outer.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    }
    active = true;
    outer.classList.add('ll-is-visible');
    outer.classList.toggle('ll-on-action', isAction(event.target));
    if (!raf) raf = requestAnimationFrame(animate);
  }
  function hide() {
    active = false;
    outer.classList.remove('ll-is-visible', 'll-on-action');
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    hasPosition = false;
  }
  function refreshTarget() {
    if (!active) return;
    const target = document.elementFromPoint(destX, destY);
    outer.classList.toggle('ll-on-action', isAction(target));
  }

  document.addEventListener('pointermove', showAt, {passive:true});
  document.addEventListener('pointerover', showAt, {passive:true});
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', function () {if (document.hidden) hide();});
  window.addEventListener('scroll', refreshTarget, {passive:true});
  window.addEventListener('resize', refreshTarget, {passive:true});
  media.addEventListener && media.addEventListener('change', function () {
    if (!media.matches) hide();
  });
})();
