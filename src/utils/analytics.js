// GA4 analytics for codeunity.in.
//
// Same shape as the ToolGenie setup (my-dev-tools/src/lib/analytics.ts): the
// gtag script is loaded from an env-provided measurement id, every event goes
// through one bounded helper, and nothing free-form (user input, raw errors,
// query strings, emails) is ever forwarded. Every export no-ops safely when GA
// is not configured, so the site never breaks because of analytics.

export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_KEY || "";

const MAX_LABEL_LENGTH = 100;

// Bounded vocabularies. Anything outside these is dropped rather than sent, so
// a typo in a call site can never create a junk dimension in GA4.
const CLICK_AREAS = [
    "header",
    "mobile_menu",
    "hero",
    "app_card",
    "app_detail",
    "cta",
    "portfolio",
    "blog",
    "team",
    "testimonial",
    "contact",
    "newsletter",
    "footer",
    "scroll_top",
    "body",
];

const CLICK_TYPES = ["link", "button", "outbound", "email", "phone", "social"];

const STORE_PLACEMENTS = ["app_card", "app_detail_top", "app_detail_footer"];

const FORM_NAMES = ["contact", "newsletter", "project_brief"];

const FORM_STATUSES = ["start", "submit", "success", "error"];

const FORM_ERROR_TYPES = [
    "validation_error",
    "network_error",
    "invalid_email",
    "empty_email",
    "unknown_error",
];

const CLICK_AREA_SET = new Set(CLICK_AREAS);
const CLICK_TYPE_SET = new Set(CLICK_TYPES);
const STORE_PLACEMENT_SET = new Set(STORE_PLACEMENTS);
const FORM_NAME_SET = new Set(FORM_NAMES);
const FORM_STATUS_SET = new Set(FORM_STATUSES);
const FORM_ERROR_TYPE_SET = new Set(FORM_ERROR_TYPES);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let initialised = false;

const isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

const isLocalHost = () =>
    isBrowser() &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

/**
 * Strip anything that could carry personal data out of a click label. Labels
 * come from site copy (button and link text), but a defensive scrub keeps an
 * accidental email address or long number out of GA4.
 */
export function sanitiseLabel(value) {
    if (typeof value !== "string") return "";
    return value
        .replace(/\s+/g, " ")
        .replace(/[\w.+-]+@[\w.-]+\.\w+/g, "[email]")
        .replace(/\+?\d[\d\s()-]{6,}\d/g, "[number]")
        .trim()
        .slice(0, MAX_LABEL_LENGTH);
}

/**
 * Reduce a URL to host plus path. Query strings and hashes are dropped because
 * they are the most likely place for a stray identifier to hide.
 */
export function safeUrlParts(rawHref) {
    if (typeof rawHref !== "string" || !rawHref) return null;
    try {
        const base = isBrowser() ? window.location.href : "https://www.codeunity.in";
        const url = new URL(rawHref, base);
        if (url.protocol === "mailto:") return { scheme: "mailto", domain: "", path: "" };
        if (url.protocol === "tel:") return { scheme: "tel", domain: "", path: "" };
        if (url.protocol !== "http:" && url.protocol !== "https:") return null;
        return {
            scheme: "http",
            domain: url.hostname.replace(/^www\./, ""),
            path: url.pathname.slice(0, MAX_LABEL_LENGTH),
        };
    } catch {
        return null;
    }
}

/**
 * Load the gtag script once. Called from the Analytics component on mount.
 * Does nothing without a measurement id, so local dev and preview builds stay
 * silent unless REACT_APP_GA_KEY is set.
 */
export function initAnalytics() {
    if (!isBrowser() || initialised || !GA_MEASUREMENT_ID) return;
    initialised = true;

    window.dataLayer = window.dataLayer || [];
    // gtag must forward `arguments`, not rest args, for GA to read the payload.
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    // Page views are sent by hand on every route change instead, so the SPA
    // does not double count the first load.
    window.gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: false,
        debug_mode: isLocalHost(),
    });
}

/**
 * Fire a GA4 event when gtag is available. Falls back to the dataLayer so an
 * event fired before the script finishes loading is still delivered.
 */
export function trackEvent(name, params) {
    if (!isBrowser() || !name) return;
    try {
        const payload = { ...params };
        if (isLocalHost()) {
            payload.debug_mode = true;
            // eslint-disable-next-line no-console
            console.debug("[analytics]", name, JSON.stringify(payload));
        }

        if (typeof window.gtag === "function") {
            window.gtag("event", name, payload);
            return;
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ...payload, event: name });
    } catch {
        // Analytics must never break product UX.
    }
}

/**
 * Send one page_view per SPA route change. Only the path is forwarded; query
 * strings and hashes are dropped.
 */
export function trackPageView(pathname, title) {
    if (!isBrowser() || typeof pathname !== "string") return;
    trackEvent("page_view", {
        page_path: pathname.slice(0, MAX_LABEL_LENGTH),
        page_location: window.location.origin + pathname,
        page_title: sanitiseLabel(title || document.title),
    });
}

/**
 * Every click on a link or button on the site. `area` says where on the page
 * the element lives, `label` is its visible text, `target` is an internal path
 * or an external domain.
 */
export function trackClick({ type, area, label, target, domain }) {
    const params = {
        click_type: CLICK_TYPE_SET.has(type) ? type : "link",
        click_area: CLICK_AREA_SET.has(area) ? area : "body",
    };

    const safeLabel = sanitiseLabel(label);
    if (safeLabel) params.click_label = safeLabel;
    if (typeof target === "string" && target) {
        params.click_target = target.slice(0, MAX_LABEL_LENGTH);
    }
    if (typeof domain === "string" && domain) {
        params.link_domain = domain.slice(0, MAX_LABEL_LENGTH);
    }

    trackEvent("ui_click", params);
}

/** A click that leaves codeunity.in. Reported separately so it is easy to chart. */
export function trackOutboundClick({ domain, path, label, area }) {
    if (typeof domain !== "string" || !domain) return;
    trackEvent("outbound_click", {
        link_domain: domain.slice(0, MAX_LABEL_LENGTH),
        link_path: typeof path === "string" ? path.slice(0, MAX_LABEL_LENGTH) : "",
        click_label: sanitiseLabel(label),
        click_area: CLICK_AREA_SET.has(area) ? area : "body",
    });
}

/** An app detail page was opened. */
export function trackAppView(slug) {
    if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) return;
    trackEvent("app_view", { app_slug: slug });
}

/** An app card was opened from a listing or a related-apps block. */
export function trackAppCardClick(slug, area) {
    if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) return;
    trackEvent("app_card_click", {
        app_slug: slug,
        click_area: CLICK_AREA_SET.has(area) ? area : "app_card",
    });
}

/**
 * The money event: someone left for the App Store or an app's own website.
 * `placement` says which of the three buttons on the site they used.
 */
export function trackStoreClick({ slug, placement, destination, label }) {
    if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) return;
    if (!STORE_PLACEMENT_SET.has(placement)) return;
    trackEvent("app_store_click", {
        app_slug: slug,
        placement,
        destination: destination === "website" ? "website" : "store",
        click_label: sanitiseLabel(label),
    });
}

/** Contact and newsletter form lifecycle. */
export function trackFormEvent({ form, status, errorType }) {
    if (!FORM_NAME_SET.has(form) || !FORM_STATUS_SET.has(status)) return;
    const params = { form_name: form, form_status: status };
    if (status === "error") {
        params.error_type = FORM_ERROR_TYPE_SET.has(errorType) ? errorType : "unknown_error";
    }
    trackEvent("form_interaction", params);
}

/** How far down a page people read. Fired once per depth per page view. */
export function trackScrollDepth(percent, pathname) {
    if (![25, 50, 75, 90].includes(percent)) return;
    trackEvent("scroll_depth", {
        percent_scrolled: percent,
        page_path: typeof pathname === "string" ? pathname.slice(0, MAX_LABEL_LENGTH) : "",
    });
}

/** A video was played (home page and skill sections use react-modal-video). */
export function trackVideoPlay(area) {
    trackEvent("video_play", {
        click_area: CLICK_AREA_SET.has(area) ? area : "body",
    });
}
