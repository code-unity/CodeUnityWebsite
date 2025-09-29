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