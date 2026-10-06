# Pipeworks plumbing website

A responsive, multi-page plumbing site built with plain HTML, CSS and JavaScript. No build step or framework is required.

## Run locally

Open index.html in a browser, or serve this folder with a local static server. For example, run python -m http.server 4173 from this folder and visit http://localhost:4173.

## Business details

Edit site-config.js to set the business name, service area, phone number, email, WhatsApp number and map starting point. The site has Home, Services, Bathrooms, About and Contact pages.

The map opens at an example Johannesburg coordinate. Set mapCenterLat, mapCenterLng and mapZoom to your service area.

The contact form includes an interactive OpenStreetMap pin. Visitors can search a typed address, tap the map or choose their device location; location access is requested only after they press its button. Address searches go to OpenStreetMap's public Nominatim service, limited here to one request per second with no autocomplete. Map tiles show OpenStreetMap attribution. The public tile service is best-effort and has no availability guarantee; use a hosted map provider for a commercial deployment that needs guaranteed availability.

The form prepares an email after a business email is configured. WhatsApp links use prewritten messages after an international-format WhatsApp number is configured. Both open an app on the visitor's device; the site does not store submissions.

The review rail appears after permission-cleared customer quotes are added to the reviews array in site-config.js.

## Image and font credits

Photo credits:

- “Modern minimalist style interior design of home bathroom with stone walls and oval white bathtub with chrome faucet,” by Max Vakhtbovych, Pexels: https://www.pexels.com/photo/contemporary-bathroom-interior-with-bathtub-7031564/
- “Stylish bathroom featuring a glass shower and elegant black vanity,” by Curtis Adams, Pexels: https://www.pexels.com/photo/bathroom-with-black-cabinets-round-mirrors-and-glass-shower-cabin-5502257/
- “An abstract close-up of vertically arranged wet black pipes with raindrops,” by Monstera Production, Pexels: https://www.pexels.com/photo/close-up-pipes-in-rain-7794404/
- Kitchen sink and running tap, Karolina Grabowska / Kaboompics: https://www.pexels.com/photo/water-flows-from-the-tap-to-sink-6256/
- Running shower head, Darya Grey_Owl: https://www.pexels.com/photo/shower-head-in-close-up-13444798/
- Bathroom basin and toilet, Max Vakhtbovych: https://www.pexels.com/photo/interior-of-bathroom-with-sink-and-toilet-7167081/
- Basin tap detail, Rodrigo Simoes: https://www.pexels.com/photo/faucet-in-a-bathroom-11209662/

These are stock photographs illustrating services and rooms. They are not presented as Pipeworks' completed projects or customer endorsements. The pipe logo is an original SVG.

Pexels allows these photos on websites; attribution is optional. See https://www.pexels.com/license/.

Barlow and Barlow Condensed are served locally from this repository. Their SIL Open Font License is in assets/fonts/OFL.txt.
