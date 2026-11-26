// Header state, mobile menu, mobile channel bar, industries tabs, systems disclosure. Content works without this file.
const header = document.querySelector<HTMLElement>("[data-header]");
const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu-btn]");
const nav = document.querySelector<HTMLElement>("[data-nav]");

// Thin line under the header after the page moves.
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Mobile menu: button toggles the nav; Escape and anchor clicks close it.
if (menuBtn && nav) {
  const setOpen = (open: boolean) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  menuBtn.addEventListener("click", () => setOpen(menuBtn.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); menuBtn.focus(); }
  });
  window.matchMedia("(min-width: 75.0625rem)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
}

// Mobile channel bar: slides in once the hero has left the screen.
const bar = document.querySelector<HTMLElement>("[data-bar]");
const hero = document.getElementById("hero");
if (bar && hero && "IntersectionObserver" in window) {
  bar.classList.add("is-armed");
  new IntersectionObserver(([e]) => bar.classList.toggle("is-shown", !e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 }).observe(hero);
}

// Industries: vertical tabs (horizontal strip on a phone) with roving focus and a sliding marker.
document.querySelectorAll<HTMLElement>("[data-tabs]").forEach((root) => {
  const list = root.querySelector<HTMLElement>("[role=tablist]");
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[role=tab]"));
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls") || "") as HTMLElement);
  const marker = root.querySelector<HTMLElement>("[data-marker]");
  if (!list || !tabs.length) return;
  root.classList.add("is-tabs");

  const place = () => {
    const active = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
    if (!marker) return;
    const horizontal = getComputedStyle(list).flexDirection === "row";
    marker.dataset.axis = horizontal ? "x" : "y";
    marker.style.transform = horizontal
      ? `translateX(${active.offsetLeft}px) scaleX(${active.offsetWidth})`
      : `translateY(${active.offsetTop}px) scaleY(${active.offsetHeight})`;
  };
  const select = (i: number, focus = false) => {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    if (focus) tabs[i].focus();
    if (list.scrollWidth > list.clientWidth) {
      const t = tabs[i];
      list.scrollTo({ left: t.offsetLeft - (list.clientWidth - t.offsetWidth) / 2, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    place();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", (e) => {
      const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) { e.preventDefault(); select((i + keys[e.key] + tabs.length) % tabs.length, true); }
      else if (e.key === "Home") { e.preventDefault(); select(0, true); }
      else if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
    });
  });
  select(0);
  window.addEventListener("resize", place);
  document.fonts?.ready.then(place);
});

// Systems: groups open on wide screens, collapsed except the first on a phone.
const phone = window.matchMedia("(max-width: 40rem)");
if (phone.matches) {
  document.querySelectorAll<HTMLDetailsElement>("[data-group]").forEach((d, i) => { if (i > 0) d.open = false; });
}
