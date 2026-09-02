import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    initAnalytics,
    trackPageView,
    trackClick,
    trackOutboundClick,
    trackScrollDepth,
    safeUrlParts,
} from "../../utils/analytics";

// One mount point for site-wide analytics: it loads gtag, sends a page_view on
// every route change, records scroll depth, and catches every click on a link
// or a button through one delegated listener. High-value conversions (store
// buttons, form submits) also fire their own named events at the call site --
// this listener is the safety net that covers everything else.

const SCROLL_DEPTHS = [25, 50, 75, 90];

// Maps a DOM ancestor to one of the bounded click areas in utils/analytics.
// Ordered most specific first, because a card sits inside a section.
const AREA_SELECTORS = [
    [".site-main-mobile-menu", "mobile_menu"],
    [".scroll-top", "scroll_top"],
    [".header-section", "header"],
    [".footer-section", "footer"],
    [".app-card", "app_card"],
    [".app-detail", "app_detail"],
    [".newsletter-section", "newsletter"],
    [".newsletter-form", "newsletter"],
    [".contact-form-section", "contact"],
    [".contact-section", "contact"],
    [".contact-form", "contact"],
    [".cta-section", "cta"],
    [".intro-section", "hero"],
    [".intro-slider-wrap", "hero"],
    [".page-title-section", "hero"],
    [".testimonial-section", "testimonial"],
    [".team-section", "team"],
    [".blog-section", "blog"],
    [".ag-masonary-wrapper", "portfolio"],
];

/**
 * Work out which part of the page an element sits in. An explicit
 * `data-analytics-area` on any ancestor always wins, so a call site can label
 * a block without touching this list.
 */
function resolveArea(element) {
    const tagged = element.closest("[data-analytics-area]");
    if (tagged) return tagged.getAttribute("data-analytics-area");

    for (const [selector, area] of AREA_SELECTORS) {
        if (element.closest(selector)) return area;
    }
    return "body";
}

/**
 * Best-effort visible label for an element: its own text, else an explicit
 * analytics label, else an accessible name, else the icon class. Keeps
 * icon-only buttons (social links, menu toggle) from reporting as blank.
 */
function resolveLabel(element) {
    const explicit = element.getAttribute("data-analytics-label");
    if (explicit) return explicit;

    const text = (element.textContent || "").trim();
    if (text) return text;

    const aria = element.getAttribute("aria-label") || element.getAttribute("title");
    if (aria) return aria;

    const icon = element.querySelector("i[class]");
    if (icon) {
        const match = icon.className.match(/fa-([a-z0-9-]+)/);
        if (match) return match[1].replace(/-/g, " ");
    }

    const image = element.querySelector("img[alt]");
    if (image && image.alt) return image.alt;

    return "";
}

const Analytics = () => {
    const location = useLocation();
    const firedDepths = useRef(new Set());
    // Read inside listeners so they can stay registered for the whole session
    // instead of being torn down and rebuilt on every navigation.
    const pathRef = useRef(location.pathname);

    useEffect(() => {
        initAnalytics();
    }, []);

    // One page_view per route change. The title is read after a tick so
    // react-helmet has had a chance to swap it in.
    useEffect(() => {
        pathRef.current = location.pathname;
        firedDepths.current = new Set();

        const timer = window.setTimeout(() => {
            trackPageView(location.pathname, document.title);
        }, 60);

        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    // Delegated click tracking for every link and button on the site.
    useEffect(() => {
        const onClick = (event) => {
            const target = event.target;
            if (!target || typeof target.closest !== "function") return;

            const element = target.closest("a, button, [role='button']");
            if (!element) return;

            // Anything that fires its own named event opts out here so a store
            // click is not also counted as a generic ui_click.
            if (element.closest("[data-analytics-skip]")) return;

            const area = resolveArea(element);
            const label = resolveLabel(element);
            const href = element.getAttribute("href");

            if (!href) {
                trackClick({ type: "button", area, label });
                return;
            }

            const parts = safeUrlParts(href);
            if (!parts) {
                trackClick({ type: "button", area, label });
                return;
            }

            if (parts.scheme === "mailto") {
                trackClick({ type: "email", area, label, target: "mailto" });
                return;
            }
            if (parts.scheme === "tel") {
                trackClick({ type: "phone", area, label, target: "tel" });
                return;
            }

            const isInternal = parts.domain === window.location.hostname.replace(/^www\./, "");
            if (isInternal) {
                trackClick({ type: "link", area, label, target: parts.path });
                return;
            }

            trackClick({
                type: "outbound",
                area,
                label,
                target: parts.domain + parts.path,
                domain: parts.domain,
            });
            trackOutboundClick({ domain: parts.domain, path: parts.path, label, area });
        };

        // Capture phase so the event is recorded even when a handler further
        // down calls stopPropagation or navigates away.
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, []);

    // Scroll depth, reset on every route change by the effect above.
    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - window.innerHeight;
            if (scrollable <= 0) return;

            const percent = ((window.scrollY || doc.scrollTop) / scrollable) * 100;
            for (const depth of SCROLL_DEPTHS) {
                if (percent >= depth && !firedDepths.current.has(depth)) {
                    firedDepths.current.add(depth);
                    trackScrollDepth(depth, pathRef.current);
                }
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return null;
};

export default Analytics;
