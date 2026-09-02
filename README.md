# CodeUnity Website

A modern React-based website for CodeUnity built with React 18 and Bootstrap 4.

## Prerequisites

- **Node.js 22.x or higher** (Required)
- **npm 10.x or higher** (Comes with Node.js 22)

## Quick Start

### Installation

1. **Install Node.js 22**
   
   Using Node Version Manager (nvm):
   ```bash
   nvm install 22
   nvm use 22
   ```
   
   Or download directly from [nodejs.org](https://nodejs.org/)

2. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd CodeUnityWebsite
   npm install
   ```

### Development

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Production

Build and run the production version:
```bash
npm run prod
```

This will build the optimized production bundle and start the server on port 3000.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build production bundle
- `npm run prod` - Build and start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Analytics (GA4)

The site reports to the GA4 property **CodeUnity** (`G-FHYCLZNV8Z`) in the
`zalgo-projects` account.

Set `REACT_APP_GA_KEY` to that measurement id. Copy `.env.example` to
`.env.local` for local work, and add the same variable in Vercel under
Project Settings -> Environment Variables. Without the key every analytics call
is a safe no-op, so preview builds send nothing.

All tracking lives in two files:

- `src/utils/analytics.js` - loads gtag and exposes one bounded helper per
  event. Free-form values (field contents, emails, phone numbers, query
  strings) are stripped before anything is sent.
- `src/components/Analytics/Analytics.jsx` - mounted once in `App.js`. Sends a
  page view per route change, records scroll depth, and catches every link and
  button click through one delegated listener.

### Events

| Event | When | Key parameters |
| --- | --- | --- |
| `page_view` | Every route change | `page_path`, `page_title` |
| `ui_click` | Any link or button click | `click_type`, `click_area`, `click_label`, `click_target` |
| `outbound_click` | A click that leaves the site | `link_domain`, `link_path`, `click_area` |
| `app_store_click` | App Store / website buttons | `app_slug`, `placement`, `destination` |
| `app_card_click` | An app card was opened | `app_slug`, `click_area` |
| `app_view` | An app detail page was opened | `app_slug` |
| `form_interaction` | Contact, newsletter, project forms | `form_name`, `form_status`, `error_type` |
| `scroll_depth` | 25 / 50 / 75 / 90 percent | `percent_scrolled`, `page_path` |
| `video_play` | A video modal was opened | `click_area` |

To break these down in GA4, register the parameters you care about under
Admin -> Custom definitions -> Custom dimensions (event scope). The useful
ones are `app_slug`, `placement`, `click_area`, `click_label` and `form_name`.
Mark `app_store_click` and `form_interaction` as conversions.

Page views are sent by hand, with titles read from `src/data/seo/pages.json`
and `src/data/apps/apps.json` rather than `document.title`, so the title is
deterministic and does not depend on when react-helmet-async runs its effect.
The stream's enhanced measurement therefore has "Page changes based on browser
history events" turned off, so a route change is counted once rather than twice.

### Adding tracking to new markup

The delegated listener covers new links and buttons with no extra work. Three
opt-in attributes fine-tune it:

- `data-analytics-area="cta"` on a container labels everything inside it.
- `data-analytics-label="Back to top"` names an icon-only button.
- `data-analytics-skip` on an element (or its container) stops the generic
  `ui_click`, for elements that already fire their own named event.

## Technology Stack

- **React 18.3.1** - UI Framework
- **React Router 6.x** - Client-side routing
- **Bootstrap 4.5.3** - CSS Framework
- **Swiper 11.x** - Touch slider
- **AOS** - Animate on scroll library
- **Sass 1.93.2** - CSS preprocessor

## Node.js Version

This project requires **Node.js 22** or higher. The `.nvmrc` file is included for easy version switching with nvm.

## Deployment

The application is configured to serve static files from the `build` directory. The `server.js` file provides a simple Express server for hosting the built application.