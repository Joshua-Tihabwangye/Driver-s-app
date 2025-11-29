# EVzone Driver App – Supervisor Preview (D01–D102, `.jsx` screens)

This project is a **Create React App (CRA)** setup using:

- **JavaScript** (no TypeScript)
- **React**
- **Material UI (MUI)** for theming
- **Tailwind CSS** utility classes
- **lucide-react** icons

It exposes a **supervisor preview** that lets you choose any of the **D01–D102**
driver screens from a dropdown and see it rendered inside a 375×812 mobile frame.

All 102 screens are represented as individual **`.jsx` files** under
`src/screens/` (e.g. `D01.jsx`, `D42.jsx`, `D100.jsx`), ready for you to
replace their placeholder content with your full canvases.

## Getting started

```bash
npm install
npm start
```

Then open your browser at http://localhost:3000/

- Use the dropdown at the top to select any Dxx screen.
- The selected screen component is rendered below in the EVzone phone frame.

## Project structure

- `public/`
  - `index.html` – standard CRA entry HTML

- `src/`
  - `index.js` – React entry point (JS, as CRA expects)
  - `index.css` – Tailwind directives + global utilities (e.g. `scrollbar-hide`)
  - `theme.js` – MUI theme with EVzone colors
  - `App.jsx` – supervisor shell with the **D01–D102** selector
  - `components/`
    - `PhoneFrame.jsx` – generic 375x812 phone frame shell
    - `BottomNav.jsx` – shared bottom navigation bar
  - `screens/`
    - `D01.jsx` … `D102.jsx` – **one React component per screen**, all authored as `.jsx`

Each `Dxx.jsx` file currently renders a **safe placeholder**:

- Header with:
  - Subtitle: `EVzone Driver App`
  - Screen title (e.g. `Driver App – Ride Request Incoming`)
  - The `Dxx` ID in EVzone green
- A centered body with:
  - A line showing `{Dxx} – {title}`
  - Placeholder text explaining that this is where your final JSX canvas should go
  - The filename (`src/screens/Dxx.jsx`) so your team can find it quickly
- The shared `BottomNav` at the bottom.

## Tailwind

Tailwind is configured via:

- `tailwind.config.js` – `content` points to `./src/**/*.{js,jsx}` and defines:

  - `evzone.green` – `#03CD8C`
  - `evzone.orange` – `#F77F00`
  - `evzone.navy` – `#0f172a`

- `postcss.config.js` – Tailwind + Autoprefixer plugins
- `src/index.css` – includes Tailwind directives and a `scrollbar-hide` utility so
  phone-frame `<main>` areas are swipe-scrollable without visible scrollbars.

## MUI theme & EVzone colors

The theme in `src/theme.js` defines:

- Primary: `#03CD8C` (EVzone green)
- Secondary: `#F77F00` (EVzone orange)
- Background default: `#0f172a` (dark navy)
- Buttons: rounded, pill-shaped

`index.js` wraps the app in a `ThemeProvider` + `CssBaseline` so any MUI
components you add will use this theme.

## How to plug in your real `.jsx` canvases

For each designed canvas (for example, the actual file you have for D42, D72, D100, etc.):

1. Open the matching screen file in this project:

   ```text
   src/screens/D42.jsx
   ```

2. Replace the placeholder `export default function D42Screen() { ... }`
   body with your full JSX implementation for that screen.

   - Keep the default export name (e.g. `D42Screen`) or update both the
     component and the import in `App.jsx` if you change it.
   - You can keep using `PhoneFrame` and `BottomNav`, or fully own the
     frame inside your canvas – it’s your choice.

3. Add any extra imports your canvas needs (e.g. from `lucide-react` or MUI).

The selector in `App.jsx` will continue to work as long as each file:

- Exists at `src/screens/Dxx.jsx`, and
- Exports a default React component.

This gives your team a **plug‑and‑play, non‑fragile** base: all 102 screens
are already wired, themed and selectable. Your designers and engineers can now
swap in the world‑class canvases without worrying about build config, routing
or theming.
