<<<<<<< HEAD


No install required.

```bash
# from this folder
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

Or just double-click `index.html` — everything works from `file://` too, since there's no backend.

**Try it:** Sign up with any name + a real-looking email (e.g. `you@gmail.com`) + a 6+ character
password → you're logged in → search something like "AI tools for writing" from Home.

## Folder structure

```
distill-frontend/
├── index.html          Public landing page (marketing/welcome)
├── login.html           Auth: log in
├── signup.html          Auth: create account
├── home.html             Post-login home: sidebar + hero + search
├── results.html          Recommendation results (1 best + 2 alternatives)
├── trendy.html           Grid of trending tools
├── offers.html           Grid of free/hybrid-tier tools
├── history.html          Full search history + clear all
├── dashboard.html        Stats cards, quick actions, recent activity
├── profile.html          Account details + log out
├── css/
│   └── styles.css        Design tokens (font, focus states, glass, motion)
├── js/
│   ├── tailwind-config.js  Tailwind CDN theme (colors, radii, shadows)
│   ├── data.js              Mock AI tool catalog + keyword search/rank
│   ├── auth.js               Mock signup/login/session (localStorage)
│   ├── history.js            Search history store (localStorage)
│   ├── components.js         Sidebar / top nav / mobile drawer / footer
│   ├── search.js             Search bar: suggestions, voice input, submit
│   ├── results.js             Results page: loading/error/success states
│   └── tools-grid.js          Card grid renderer (Trendy, Offers)
└── assets/
    └── favicon.svg
```

