import PropTypes from "prop-types";
import React from 'react';
import {Link} from "react-router-dom";
import {trackStoreClick, trackAppCardClick} from "../../utils/analytics";

// Fallback tile for products that have no store artwork (LLM Radar, ToolGenie).
const initialsOf = (name) => name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

const AppCard = ({ data }) => {
    return (
        <div className="app-card">
            <div className="app-card__head">
                {data.icon
                    ? <img className="app-card__icon" src={process.env.PUBLIC_URL + data.icon} alt={`${data.name} app icon`} width="72" height="72" loading="lazy" />
                    : <span className="app-card__icon app-card__icon--text" aria-hidden="true">{initialsOf(data.name)}</span>
                }
                <div className="app-card__heading">
                    {/* Skipped by the delegated listener so the title reports once, as app_card_click. */}
                    <h3 className="app-card__title"><Link to={process.env.PUBLIC_URL + `/apps/${data.slug}`} data-analytics-skip onClick={() => trackAppCardClick(data.slug, "app_card")}>{data.name}</Link></h3>
                    <p className="app-card__tagline">{data.tagline}</p>
                </div>
            </div>

            <p className="app-card__desc">{data.desc}</p>

            <ul className="app-card__meta">
                <li>{data.platform}</li>
                <li>{data.category}</li>
                <li>{data.price}</li>
            </ul>

            {/* Skipped by the delegated listener: both links fire their own named event. */}
            <div className="app-card__actions" data-analytics-skip>
                <a
                    className="app-card__btn"
                    href={data.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackStoreClick({slug: data.slug, placement: "app_card", destination: "store", label: data.storeLabel})}
                >
                    {data.storeLabel}
                </a>
                <Link
                    className="app-card__link"
                    to={process.env.PUBLIC_URL + `/apps/${data.slug}`}
                    onClick={() => trackAppCardClick(data.slug, "app_card")}
                >
                    Learn more
                </Link>
            </div>
        </div>
    )
}

AppCard.propTypes = {
    data: PropTypes.object
};

export default AppCard;
