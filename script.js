(() => {
  const config = window.PLUMBING_SITE_CONFIG || {};
  const fallbackFor = (node) => node.dataset.fallback || "";

  document.querySelectorAll("[data-config]").forEach((node) => {
    const value = config[node.dataset.config];
    node.textContent = typeof value === "string" && value.trim() ? value : fallbackFor(node);
    if (node.hasAttribute("data-hide-empty") && !(typeof value === "string" && value.trim())) node.hidden = true;
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

  document.querySelectorAll("[data-service-choice]").forEach((link) => {
    link.addEventListener("click", () => {
      const select = document.querySelector("#service-select");
      if (!select) return;
      const option = Array.from(select.options).find((item) => item.textContent === link.dataset.serviceChoice);
      if (option) select.value = option.value;
    });
  });

  const serviceSelect = document.querySelector("#service-select");
  const requestedService = new URLSearchParams(window.location.search).get("service");
  if (serviceSelect && requestedService) {
    const option = Array.from(serviceSelect.options).find((item) => item.textContent.trim() === requestedService);
    if (option) serviceSelect.value = option.value;
  }

  const mapNode = document.querySelector("#service-map");
  if (mapNode && window.L) {
    const map = L.map(mapNode, { scrollWheelZoom: false }).setView(
      [Number(config.mapCenterLat), Number(config.mapCenterLng)],
      Number(config.mapZoom) || 11
    );
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    const latitude = document.querySelector("#location-lat");
    const longitude = document.querySelector("#location-lng");
    const locationStatus = document.querySelector("#map-status");
    const locationInput = document.querySelector("#job-location");
    let marker = null;
    let lastSearchAt = 0;

    const setPin = (lat, lng, label) => {
      const point = [Number(lat), Number(lng)];
      if (locationInput && !locationInput.value.trim()) locationInput.value = "Pinned map location";
      if (marker) marker.setLatLng(point);
      else {
        marker = L.marker(point, { draggable: true, autoPan: true }).addTo(map);
        marker.on("dragend", () => {
          const position = marker.getLatLng();
          setPin(position.lat, position.lng, "Property pin moved.");
        });
      }
      latitude.value = point[0].toFixed(6);
      longitude.value = point[1].toFixed(6);
      locationStatus.textContent = label || "Property pin set. Drag it to adjust.";
    };

    map.on("click", (event) => setPin(event.latlng.lat, event.latlng.lng));

    document.querySelector("#use-location").addEventListener("click", () => {
      if (!navigator.geolocation) {
        locationStatus.textContent = "Location access is unavailable here. Pin the map instead.";
        return;
      }
      locationStatus.textContent = "Finding your location…";
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const point = [position.coords.latitude, position.coords.longitude];
          map.setView(point, 16);
          setPin(point[0], point[1], "Location pinned. Drag the marker to adjust.");
        },
        () => { locationStatus.textContent = "Location unavailable. Search an area or pin the map instead."; },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    });

    document.querySelector("#find-location").addEventListener("click", async () => {
      const query = locationInput.value.trim();
      if (!query) {
        locationStatus.textContent = "Enter a street, suburb or landmark first.";
        locationInput.focus();
        return;
      }
      if (Date.now() - lastSearchAt < 1100) {
        locationStatus.textContent = "Please wait a moment before searching again.";
        return;
      }
      lastSearchAt = Date.now();
      const searchButton = document.querySelector("#find-location");
      searchButton.disabled = true;
      locationStatus.textContent = "Searching the map…";
      try {
        const endpoint = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" + encodeURIComponent(query);
        const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Map search failed");
        const places = await response.json();
        if (!places.length) throw new Error("No matching place found");
        const place = places[0];
        map.setView([Number(place.lat), Number(place.lon)], 16);
        setPin(place.lat, place.lon, "Map centered on " + place.display_name.split(",")[0] + ".");
      } catch {
        locationStatus.textContent = "Map search is unavailable. Pin the map instead.";
      } finally {
        searchButton.disabled = false;
      }
    });

    locationInput.addEventListener("input", () => {
      locationInput.setCustomValidity("");
      if (marker && locationInput.value.trim() !== "Pinned map location") {
        map.removeLayer(marker);
        marker = null;
        latitude.value = "";
        longitude.value = "";
        locationStatus.textContent = "Search this address or place a new pin on the map.";
      }
    });
    document.querySelector("#request-form").addEventListener("submit", (event) => {
      if (!locationInput.value.trim() && !latitude.value) {
        event.preventDefault();
        locationInput.setCustomValidity("Enter an address or pin the property on the map.");
        locationInput.reportValidity();
      }
    });
  }

  document.querySelectorAll("[data-whatsapp-template]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const phone = String(config.whatsappNumber || "").replace(/\D/g, "");
      const status = document.querySelector("#whatsapp-status");
      if (!phone) {
        event.preventDefault();
        if (status) status.textContent = "WhatsApp is not connected yet.";
        return;
      }
      const name = document.querySelector('[name="name"]')?.value.trim();
      const contact = document.querySelector('[name="contact"]')?.value.trim();
      const location = document.querySelector("#job-location")?.value.trim();
      const lat = document.querySelector("#location-lat")?.value;
      const lng = document.querySelector("#location-lng")?.value;
      const service = document.querySelector("#service-select")?.value;
      const details = document.querySelector('[name="details"]')?.value.trim();
      const messageTemplates = {
        general: "Hello Pipeworks, I would like to request plumbing service.",
        repair: "Hello Pipeworks, I need help with a plumbing repair.",
        drain: "Hello Pipeworks, I need help with a drain or toilet.",
        bathroom: "Hello Pipeworks, I would like to ask about bathroom plumbing."
      };
      const message = [
        messageTemplates[link.dataset.whatsappTemplate] || "Hello Pipeworks, I would like to request plumbing service.",
        name && "Name: " + name,
        contact && "Contact: " + contact,
        service && "Service: " + service,
        location && "Property: " + location,
        lat && lng && "Map pin: " + lat + ", " + lng,
        details && "Details: " + details
      ].filter(Boolean).join("\n");
      link.href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
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
        "Property: " + details.get("location"),
        "Map pin: " + [details.get("latitude"), details.get("longitude")].filter(Boolean).join(", "),
        "Details: " + (details.get("details") || "Not provided")
      ].join("\n");
      window.location.href = "mailto:" + config.emailAddress + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  const reviews = Array.isArray(config.reviews) ? config.reviews.filter((review) => review && review.quote && review.author) : [];
  const reviewSection = document.querySelector("#customer-reviews");
  const reviewTrack = document.querySelector(".review-track");
  const accessibleReviews = document.querySelector("#review-accessible");
  if (reviews.length && reviewSection && reviewTrack && accessibleReviews) {
    const createSet = (hideFromScreenReader) => {
      const set = document.createElement("div");
      set.className = "review-set";
      if (hideFromScreenReader) set.setAttribute("aria-hidden", "true");
      reviews.forEach((review) => {
        const card = document.createElement("blockquote");
        card.className = "review-card";
        const quote = document.createElement("p");
        quote.textContent = "“" + review.quote + "”";
        const author = document.createElement("cite");
        author.textContent = [review.author, review.area].filter(Boolean).join(" · ");
        card.append(quote, author);
        set.append(card);
      });
      return set;
    };
    reviewTrack.append(createSet(false), createSet(true));
    accessibleReviews.textContent = reviews.map((review) => review.quote + " — " + [review.author, review.area].filter(Boolean).join(", ")).join(". ");
    reviewSection.hidden = false;
  }
})();
