window.lucide?.createIcons();

const header = document.querySelector(".site-header");
const navigation = document.querySelector("#site-nav");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

if (header && navigation) {
  const navigationAnchor = document.createComment("navigation-anchor");
  navigation.before(navigationAnchor);

  const menuButton = document.createElement("button");
  menuButton.className = "menu-toggle";
  menuButton.type = "button";
  menuButton.setAttribute("aria-controls", "site-nav");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  menuButton.innerHTML = `
    <span class="menu-toggle__line" aria-hidden="true"></span>
    <span class="menu-toggle__line" aria-hidden="true"></span>
    <span class="menu-toggle__line" aria-hidden="true"></span>
  `;
  document.body.append(menuButton);

  let ticking = false;

  const closeMenu = ({ restoreFocus = false } = {}) => {
    navigation.classList.remove("nav-bar--open");
    navigationAnchor.after(navigation);
    menuButton.classList.remove("menu-toggle--open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");

    if (restoreFocus) menuButton.focus();
  };

  const openMenu = () => {
    document.body.append(navigation);
    navigation.classList.add("nav-bar--open");
    menuButton.classList.add("menu-toggle--open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
    navigation.querySelector("a")?.focus();
  };

  const updateHeader = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const isNearTop = currentScrollY < 48;
    const isMenuAvailable = !isNearTop || window.innerWidth <= 1120;

    header.classList.toggle("site-header--hidden", !isNearTop);
    menuButton.classList.toggle(
      "menu-toggle--visible",
      isMenuAvailable,
    );
    menuButton.tabIndex = isMenuAvailable ? 0 : -1;

    if (!isNearTop && navigation.classList.contains("nav-bar--open")) {
      closeMenu();
    }

    ticking = false;
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu({ restoreFocus: true });
    } else {
      openMenu();
    }
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("nav-bar--open")) {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("nav-bar--open") &&
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", updateHeader);
  updateHeader();
}

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.setAttribute("aria-label", "Back to top");
backToTop.setAttribute("title", "Back to top");
backToTop.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2.5c3.4 2.4 5.4 5.7 5.4 9.4l-3.1 3.1H9.7l-3.1-3.1c0-3.7 2-7 5.4-9.4Z"></path>
    <circle cx="12" cy="9.6" r="1.6"></circle>
    <path d="m9.6 15.3-1.2 3.3 3.6-1.5 3.6 1.5-1.2-3.3"></path>
    <path class="back-to-top__flame" d="M12 18.1c1.1 1.1 1.2 2.2 0 3.4-1.2-1.2-1.1-2.3 0-3.4Z"></path>
  </svg>
`;
document.body.append(backToTop);

const updateBackToTop = () => {
  const isVisible = window.scrollY > 240;
  backToTop.classList.toggle("back-to-top--visible", isVisible);
  backToTop.tabIndex = isVisible ? 0 : -1;
  backToTop.setAttribute("aria-hidden", String(!isVisible));
};

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
  });
});

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();
