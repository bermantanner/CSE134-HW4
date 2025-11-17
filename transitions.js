// Enable view transitions on link navigation
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");

  if (!link) return;
  const url = link.href;

  // Only intercept same-origin links
  if (!url.startsWith(location.origin)) return;

  // Only intercept left-click, no modifiers
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

  // If the browser doesn't support transitions, do nothing
  if (!document.startViewTransition) return;

  e.preventDefault();

  document.startViewTransition(() => {
    window.location.href = url;
  });
});
