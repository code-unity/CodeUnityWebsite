import PropTypes from "prop-types";
import React from 'react';
import {Helmet} from "react-helmet";

const SITE_URL = "https://www.codeunity.in";

const SEO = ({title, description, image}) => {
    const canonical = typeof window !== "undefined"
        ? SITE_URL + window.location.pathname
        : SITE_URL;

    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <link rel="canonical" href={canonical} />

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="CodeUnity" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={SITE_URL + image} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={SITE_URL + image} />
        </Helmet>
    )
}

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string
};

SEO.defaultProps = {
    title: "CodeUnity",
    description: "CodeUnity builds small, focused apps for iPhone, Mac and the web — including Pocket AI, LLM Radar and ToolGenie — and takes on software consulting work.",
    image: "/images/logo/CodeUnityLogo.png"
};

export default SEO;
