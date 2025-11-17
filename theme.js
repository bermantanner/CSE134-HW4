// theme.js

(function () {
  const storageKey = "site-theme";
  const root = document.documentElement;

  // this is so CSS will show the button!
  root.classList.add("js-enabled");

  // finding out the starting theme: saved -> system preference -> light
  const saved = localStorage.getItem(storageKey);
  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme =
    saved === "light" || saved === "dark"
      ? saved
      : systemPrefersDark
      ? "dark"
      : "light";

  root.dataset.theme = initialTheme;

  const toggleBtn = document.querySelector(".theme-toggle");
  if (!toggleBtn) return; // if this is a page without toggle, stop

  const textSpan = toggleBtn.querySelector(".theme-toggle-text");

  function updateButton(theme) {
    if (!textSpan) return;

    if (theme === "dark") {
      textSpan.textContent = "Light mode";
      toggleBtn.setAttribute("aria-label", "Switch to light theme");
    } else {
      textSpan.textContent = "Dark mode";
      toggleBtn.setAttribute("aria-label", "Switch to dark theme");
    }
  }

  // set initial button state
  updateButton(initialTheme);

  toggleBtn.addEventListener("click", () => {
    const current = root.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";

    root.dataset.theme = next;
    localStorage.setItem(storageKey, next);
    updateButton(next);
  });
})();
