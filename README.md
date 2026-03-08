# GEICO-Pro.com

Independent insurance guidance website built with vanilla HTML, CSS, and JavaScript.

## Deployment

This project is configured for **Vercel** deployment:

1. Push this repo to GitHub
2. Import the repo in [Vercel Dashboard](https://vercel.com/new)
3. Vercel will auto-detect the configuration from `vercel.json`
4. Deploy — no build step required

## Local Development

```bash
npx serve public
```

## Structure

```
geico-pro/
├── public/
│   └── index.html      # Main website (single-page app)
├── vercel.json          # Vercel deployment config
├── package.json         # Project metadata
└── README.md            # This file
```

## Features

- Fully responsive single-page application
- 6 pages: Home, Compare, Connect Me, Deals, Coverage, FAQ
- Interactive popup with timer trigger
- Scroll-reveal animations with stagger
- Smooth page transitions
- FAQ accordion
- Mobile-first responsive design
- Custom SVG favicon and logo
