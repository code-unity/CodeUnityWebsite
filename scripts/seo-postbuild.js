#!/usr/bin/env node
/**
 * Create React App ships a single empty index.html for every route, so a crawler
 * that does not run JavaScript sees a blank page with the wrong <title>.
 *
 * This runs after `react-scripts build` and writes one real HTML file per route
 * into build/, carrying the correct title, description, canonical, robots,
 * Open Graph / Twitter tags, JSON-LD, and a <noscript> copy of the page text.
 * React still hydrates into #root exactly as before; the injected tags carry
 * data-react-helmet="true" so react-helmet replaces them instead of duplicating.
 *
 * It also generates build/sitemap.xml - there is no public/sitemap.xml, this is
 * the only source of truth for it.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const SITE_URL = 'https://www.codeunity.in';
const DEFAULT_IMAGE = '/images/logo/CodeUnityLogo.png';

const pages = require(path.join(ROOT, 'src/data/seo/pages.json'));
const apps = require(path.join(ROOT, 'src/data/apps/apps.json'));

const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const H = 'data-react-helmet="true"';

// ---------------------------------------------------------------- structured data

const organisation = {
    '@type': 'Organization',
    '@id': SITE_URL + '/#organization',
    name: 'CodeUnity',
    url: SITE_URL + '/',
    logo: SITE_URL + DEFAULT_IMAGE,
    description: pages['/'].description,
    sameAs: ['https://mypocketai.app/', 'https://toolgenie.org/']
};

const website = {
    '@type': 'WebSite',
    '@id': SITE_URL + '/#website',
    url: SITE_URL + '/',
    name: 'CodeUnity',
    publisher: {'@id': SITE_URL + '/#organization'},
    inLanguage: 'en'
};

const operatingSystemOf = (app) => {
    if (/mac/i.test(app.platform)) return 'macOS';
    if (/web/i.test(app.platform)) return 'Web browser';
    return 'iOS';
};

const softwareApplication = (app) => {
    const node = {
        '@type': 'SoftwareApplication',
        name: app.name,
        description: app.desc,
        applicationCategory: app.category,
        operatingSystem: operatingSystemOf(app),
        url: app.siteUrl || app.storeUrl,
        publisher: {'@id': SITE_URL + '/#organization'}
    };
    if (app.icon) node.image = SITE_URL + app.icon;
    if (/free/i.test(app.price)) {
        node.offers = {'@type': 'Offer', price: '0', priceCurrency: 'USD'};
    }
    return node;
};

const breadcrumb = (route, name) => ({
    '@type': 'BreadcrumbList',
    itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/'},
        {'@type': 'ListItem', position: 2, name, item: SITE_URL + route}
    ]
});

// Each app gets its own indexable route at /apps/<slug>, generated from
// src/data/apps/apps.json so adding an app to that file is all it takes.
const appRoutes = Object.fromEntries(apps.map((app) => [
    `/apps/${app.slug}`,
    {
        title: `${app.seoTitle} | CodeUnity`,
        description: app.seoDescription,
        heading: app.name,
        image: app.icon || undefined,
        app
    }
]));

const allRoutes = {...pages, ...appRoutes};

function jsonLdFor(route, page) {
    const graph = [organisation, website];

    if (page.app) {
        graph.push(Object.assign(
            {'@id': SITE_URL + route + '#app'},
            softwareApplication(page.app)
        ));
        graph.push({
            '@type': 'BreadcrumbList',
            itemListElement: [
                {'@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/'},
                {'@type': 'ListItem', position: 2, name: 'Apps', item: SITE_URL + '/apps'},
                {'@type': 'ListItem', position: 3, name: page.app.name, item: SITE_URL + route}
            ]
        });
        return JSON.stringify({'@context': 'https://schema.org', '@graph': graph});
    }

    if (route === '/' || route === '/apps') {
        graph.push({
            '@type': 'ItemList',
            '@id': SITE_URL + '/apps#applist',
            name: 'Apps by CodeUnity',
            numberOfItems: apps.length,
            itemListElement: apps.map((app, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: softwareApplication(app)
            }))
        });
    }
    if (route !== '/' && page.heading) {
        graph.push(breadcrumb(route, page.heading));
    }
    return JSON.stringify({'@context': 'https://schema.org', '@graph': graph});
}

// ---------------------------------------------------------------- noscript copy

function noscriptFor(route, page) {
    const nav = ['/', '/apps', '/about', '/service', '/contact']
        .map((r) => `<a href="${r}">${esc(pages[r].heading || 'Home')}</a>`).join(' | ');

    let body = `<h1>${esc(page.heading || page.title)}</h1><p>${esc(page.description)}</p>`;

    if (page.app) {
        const app = page.app;
        body = [
            `<h1>${esc(app.name)}</h1>`,
            `<p><strong>${esc(app.tagline)}</strong></p>`,
            `<p>${esc(app.desc)}</p>`,
            `<p>${esc(app.platform)} &middot; ${esc(app.category)} &middot; ${esc(app.price)}</p>`,
            `<p><a href="${esc(app.storeUrl)}">${esc(app.storeLabel)}</a>`,
            app.siteUrl ? ` &middot; <a href="${esc(app.siteUrl)}">Website</a>` : '',
            `</p>`,
            (app.features || []).map((f) => `<h2>${esc(f.title)}</h2><p>${esc(f.text)}</p>`).join(''),
            `<p><a href="/apps">See all CodeUnity apps</a></p>`
        ].join('');
    } else if (route === '/apps' || route === '/') {
        body += apps.map((app) => [
            `<h2><a href="/apps/${esc(app.slug)}">${esc(app.name)}</a></h2>`,
            `<p><strong>${esc(app.tagline)}</strong></p>`,
            `<p>${esc(app.desc)}</p>`,
            `<p>${esc(app.platform)} &middot; ${esc(app.category)} &middot; ${esc(app.price)}</p>`,
            `<p><a href="${esc(app.storeUrl)}">${esc(app.storeLabel)}</a>`,
            ` &middot; <a href="/apps/${esc(app.slug)}">Learn more</a></p>`
        ].join('')).join('');
    }

    return `<noscript><div><nav>${nav}</nav>${body}</div></noscript>`;
}

// ---------------------------------------------------------------- head injection

function headFor(route, page) {
    const title = page.title;
    const description = page.description;
    const image = SITE_URL + (page.image || DEFAULT_IMAGE);
    const canonical = SITE_URL + (page.canonical || route);
    const robots = page.noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1';

    const tags = [
        `<title ${H}>${esc(title)}</title>`,
        `<meta ${H} name="description" content="${esc(description)}"/>`,
        `<meta ${H} name="robots" content="${robots}"/>`,
        `<link ${H} rel="canonical" href="${esc(canonical)}"/>`,
        `<meta ${H} property="og:type" content="website"/>`,
        `<meta ${H} property="og:site_name" content="CodeUnity"/>`,
        `<meta ${H} property="og:locale" content="en_US"/>`,
        `<meta ${H} property="og:title" content="${esc(title)}"/>`,
        `<meta ${H} property="og:description" content="${esc(description)}"/>`,
        `<meta ${H} property="og:url" content="${esc(canonical)}"/>`,
        `<meta ${H} property="og:image" content="${esc(image)}"/>`,
        `<meta ${H} name="twitter:card" content="summary_large_image"/>`,
        `<meta ${H} name="twitter:title" content="${esc(title)}"/>`,
        `<meta ${H} name="twitter:description" content="${esc(description)}"/>`,
        `<meta ${H} name="twitter:image" content="${esc(image)}"/>`
    ];

    if (!page.noindex) {
        tags.push(`<script type="application/ld+json">${jsonLdFor(route, page)}</script>`);
    }
    return tags.join('');
}

// ---------------------------------------------------------------- write files

const template = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');

if (!/<\/head>/.test(template) || !/id="root"/.test(template)) {
    console.error('[seo] build/index.html does not look like the CRA shell - aborting.');
    process.exit(1);
}

// Strip the placeholder title and description that CRA copied from public/index.html
// so the per-route ones are the only ones present.
// Strip everything this script may have injected on an earlier run, plus the
// placeholder title/description/noscript CRA copies from public/index.html, so
// running the script twice produces the same result as running it once.
const stripped = template
    .replace(/<[a-z]+[^>]*\sdata-react-helmet="true"[^>]*>(?:[\s\S]*?<\/title>)?/gi, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '')
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/i, '');

function render(route, page) {
    return stripped
        .replace('</head>', headFor(route, page) + '</head>')
        .replace('<div id="root"></div>', noscriptFor(route, page) + '<div id="root"></div>');
}

const written = [];
for (const [route, page] of Object.entries(allRoutes)) {
    const html = render(route, page);
    const file = route === '/'
        ? path.join(BUILD, 'index.html')
        : path.join(BUILD, route.replace(/^\//, ''), 'index.html');

    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, html);
    written.push(route);
}

// ---------------------------------------------------------------- 404

// Without this, Vercel answers every unknown path with the SPA shell and a 200,
// which Google records as a soft 404 and keeps re-crawling.
fs.writeFileSync(path.join(BUILD, '404.html'), render('/404', {
    title: 'Page not found | CodeUnity',
    description: 'That page does not exist. Every app CodeUnity has shipped is listed on one page.',
    heading: 'Page not found',
    noindex: true
}));

// ---------------------------------------------------------------- llms.txt

// https://llmstxt.org - a plain-text map of the site for language models, which
// mostly do not run JavaScript. Generated from the same data as everything else.
const llmsTxt = [
    '# CodeUnity',
    '',
    `> ${pages['/'].description}`,
    '',
    'CodeUnity is an independent software studio. It builds and maintains the apps below,',
    'and takes on iOS, macOS and web consulting work. Every app page lists the platform,',
    'the price and where to download it.',
    '',
    '## Apps',
    '',
    ...apps.map((app) => `- [${app.name}](${SITE_URL}/apps/${app.slug}): ${app.tagline}. ${app.platform}. ${app.price}. Download: ${app.storeUrl}`),
    '',
    '## Pages',
    '',
    `- [All apps](${SITE_URL}/apps): ${pages['/apps'].description}`,
    `- [Services](${SITE_URL}/service): ${pages['/service'].description}`,
    `- [About](${SITE_URL}/about): ${pages['/about'].description}`,
    `- [Contact](${SITE_URL}/contact): ${pages['/contact'].description}`,
    '',
    '## Optional',
    '',
    `- [Full site text](${SITE_URL}/llms-full.txt): every app description and feature list in one file.`,
    ''
].join('\n');

fs.writeFileSync(path.join(BUILD, 'llms.txt'), llmsTxt);

const llmsFullTxt = [
    '# CodeUnity - full site text',
    '',
    `> ${pages['/'].description}`,
    '',
    `Source: ${SITE_URL}/  |  Last updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    '## Apps',
    '',
    ...apps.flatMap((app) => [
        `### ${app.name}`,
        '',
        `URL: ${SITE_URL}/apps/${app.slug}`,
        `Tagline: ${app.tagline}`,
        `Platform: ${app.platform}`,
        `Category: ${app.category}`,
        `Price: ${app.price}`,
        `Download: ${app.storeUrl}`,
        ...(app.siteUrl ? [`Website: ${app.siteUrl}`] : []),
        '',
        app.desc,
        '',
        ...(app.features || []).flatMap((f) => [`- ${f.title}: ${f.text}`]),
        ''
    ]),
    '## Consulting',
    '',
    pages['/service'].description,
    '',
    `Contact: ${SITE_URL}/contact`,
    ''
].join('\n');

fs.writeFileSync(path.join(BUILD, 'llms-full.txt'), llmsFullTxt);

// ---------------------------------------------------------------- sitemap

const priorities = {'/': '1.0', '/apps': '0.9', '/service': '0.7', '/about': '0.6', '/contact': '0.6'};
const priorityOf = (route) => priorities[route] || (route.startsWith('/apps/') ? '0.8' : '0.5');
const today = new Date().toISOString().slice(0, 10);

const urls = Object.entries(allRoutes)
    .filter(([, page]) => !page.noindex)
    .map(([route]) => [
        '  <url>',
        `<loc>${SITE_URL}${route}</loc>`,
        `<lastmod>${today}</lastmod>`,
        `<changefreq>${route === '/' || route === '/apps' ? 'weekly' : 'monthly'}</changefreq>`,
        `<priority>${priorityOf(route)}</priority>`,
        '</url>'
    ].join(''))
    .join('\n');

fs.writeFileSync(
    path.join(BUILD, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

console.log(`[seo] wrote ${written.length} route pages: ${written.join(', ')}`);
console.log(`[seo] wrote 404.html, llms.txt (${apps.length} apps) and llms-full.txt`);
console.log(`[seo] wrote sitemap.xml with ${urls.split('\n').length} indexable urls`);
