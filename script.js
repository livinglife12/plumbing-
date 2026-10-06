(() => {
  const config = window.PLUMBING_SITE_CONFIG || {};
  const fallbackFor = (node) => node.dataset.fallback || ("Add " + node.dataset.config);

  document.querySelectorAll("[data-config]").forEach((node) => {
    const value = config[node.dataset.config];
    node.textContent = value && value.trim() ? value : fallbackFor(node);
  });

  const phoneLink = document.querySelector("[data-contact-phone]");
  if (phoneLink && config.phoneHref) phoneLink.href = "tel:" + config.phoneHref.replace(/[^\d+]/g, "");

  const emailLink = document.querySelector("[data-contact-email]");
  if (emailLink && config.emailAddress) emailLink.href = "mailto:" + config.emailAddress;

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
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!config.emailAddress || !config.emailAddress.includes("@")) {
        status.textContent = "Add your business email in site-config.js before enabling this request form.";
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
      status.textContent = "Your email app should open with the request ready to send.";
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
