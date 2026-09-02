import PropTypes from "prop-types";
import React from 'react';
import {Helmet} from "react-helmet-async";
import PagesSEO from '../data/seo/pages.json';

const SITE_URL = "https://www.codeunity.in";
const DEFAULT_IMAGE = "/images/logo/CodeUnityLogo.png";

// Every page passes `path`; the copy lives in src/data/seo/pages.json so the
// build-time injector (scripts/seo-postbuild.js) emits exactly the same tags.
const SEO = ({path, title, description, image, noindex}) => {
    const page = PagesSEO[path] || {};

    const finalTitle = title || page.title || "CodeUnity";
    const finalDescription = description || page.description || PagesSEO["/"].description;
    const finalImage = image || page.image || DEFAULT_IMAGE;
    const finalNoindex = noindex !== undefined ? noindex : Boolean(page.noindex);
    const canonicalPath = page.canonical || path || "/";
    const canonical = SITE_URL + canonicalPath;

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={canonical} />
            <meta name="robots" content={finalNoindex ? "noindex, follow" : "index, follow, max-image-preview:large"} />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="CodeUnity" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={SITE_URL + finalImage} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={SITE_URL + finalImage} />
        </Helmet>
    )
}

SEO.propTypes = {
    path: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    noindex: PropTypes.bool
};

export default SEO;
