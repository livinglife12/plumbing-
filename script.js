(() => {
  const config = window.PLUMBING_SITE_CONFIG || {};
  const fallbackFor = (node) => node.dataset.fallback || ("Add " + node.dataset.config);

  document.querySelectorAll("[data-config]").forEach((node) => {
    const value = config[node.dataset.config];
    node.textContent = value && value.trim() ? value : fallbackFor(node);
  });

  const phoneLink = document.querySelector("[data-contact-phone]");
  if (phoneLink && config.phoneHref) phoneLink.href = "tel:" + config.phoneHref.replace(/[^\d+]/g, "");
  if (phoneLink && !config.phoneDisplay) phoneLink.closest("div").hidden = true;

  const emailLink = document.querySelector("[data-contact-email]");
  if (emailLink && config.emailAddress) emailLink.href = "mailto:" + config.emailAddress;
  if (emailLink && !config.emailAddress) emailLink.closest("div").hidden = true;

  const contactDetails = document.querySelector(".contact__details");
  if (contactDetails && !contactDetails.querySelector("div:not([hidden])")) contactDetails.hidden = true;

  const footerPhone = document.querySelector("[data-footer-phone]");
  if (footerPhone && !config.phoneDisplay) footerPhone.hidden = true;

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");

  const closeMenu = () => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const ticker = document.querySelector(".trust-ticker");
  const tickerToggle = document.querySelector(".ticker-toggle");
  if (ticker && tickerToggle) {
    tickerToggle.addEventListener("click", () => {
      const isPaused = ticker.classList.toggle("is-paused");
      tickerToggle.setAttribute("aria-pressed", String(isPaused));
      tickerToggle.textContent = isPaused ? "Play" : "Pause";
      tickerToggle.setAttribute("aria-label", isPaused ? "Resume trusted by ticker" : "Pause trusted by ticker");
    });
  }

  document.querySelectorAll("[data-service-choice]").forEach((link) => {
    link.addEventListener("click", () => {
      const select = document.querySelector("#service-select");
      if (!select) return;
      const option = Array.from(select.options).find((item) => item.textContent === link.dataset.serviceChoice);
      if (option) select.value = option.value;
    });
  });

  const form = document.querySelector("#request-form");
  const status = document.querySelector("#form-status");
  if (form && status) {
    if (config.emailAddress && config.emailAddress.includes("@")) {
      status.textContent = "Your email app will open when you continue.";
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!config.emailAddress || !config.emailAddress.includes("@")) {
        status.textContent = "This request form needs a business email before it can send.";
        return;
      }

      const details = new FormData(form);
      const subject = "Plumbing request from " + details.get("name");
      const body = [
        "Name: " + details.get("name"),
        "Contact: " + details.get("contact"),
        "Service: " + details.get("service"),
        "Details: " + (details.get("details") || "Not provided")
      ].join("\n");
      window.location.href = "mailto:" + config.emailAddress + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
