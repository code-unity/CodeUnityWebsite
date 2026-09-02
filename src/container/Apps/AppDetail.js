import PropTypes from "prop-types";
import React from 'react';
import {Link} from "react-router-dom";
import AppsData from '../../data/apps/apps.json';
import AppCard from '../../components/Apps/AppCard.jsx';
import SectionTitle from '../../components/SectionTitles/ContactSectionTitle';

const initialsOf = (name) => name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

const AppDetail = ({ app }) => {
    const others = AppsData.filter(other => other.slug !== app.slug).slice(0, 3);

    return (
        <React.Fragment>
            <div className="section section-padding-t90-b100">
                <div className="container">

                    <div className="app-detail">
                        <div className="app-detail__head">
                            {app.icon
                                ? <img className="app-detail__icon" src={process.env.PUBLIC_URL + app.icon} alt={`${app.name} app icon`} width="112" height="112" />
                                : <span className="app-detail__icon app-detail__icon--text" aria-hidden="true">{initialsOf(app.name)}</span>
                            }
                            <div>
                                <p className="app-detail__tagline">{app.tagline}</p>
                                <ul className="app-card__meta app-detail__meta">
                                    <li>{app.platform}</li>
                                    <li>{app.category}</li>
                                    <li>{app.price}</li>
                                </ul>
                                <div className="app-card__actions">
                                    <a className="app-card__btn" href={app.storeUrl} target="_blank" rel="noopener noreferrer">
                                        {app.storeLabel}
                                    </a>
                                    {app.siteUrl && (
                                        <a className="app-card__link" href={app.siteUrl} target="_blank" rel="noopener noreferrer">
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="app-detail__desc">{app.desc}</p>

                        {app.features && (
                            <React.Fragment>
                                <h2 className="app-detail__subtitle">What {app.name.split(/[—:-]/)[0].trim()} does</h2>
                                <div className="row row-cols-md-2 row-cols-1 mb-n4">
                                    {app.features.map((feature) => (
                                        <div key={feature.title} className="col mb-4">
                                            <div className="app-feature">
                                                <h3 className="app-feature__title">{feature.title}</h3>
                                                <p className="app-feature__text">{feature.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        )}

                        <div className="app-detail__footer">
                            <a className="app-card__btn" href={app.storeUrl} target="_blank" rel="noopener noreferrer">
                                {app.storeLabel}
                            </a>
                            <Link className="app-card__link" to={process.env.PUBLIC_URL + "/apps"}>
                                See all CodeUnity apps
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <div className="section section-padding-t90-b100 bg-color-1">
                <div className="container">
                    <SectionTitle
                        title="MORE FROM CODEUNITY"
                        subTitle="Other apps we build and keep up to date."
                    />
                    <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 mb-n6">
                        {others.map((other) => (
                            <div key={other.id} className="col mb-6">
                                <AppCard data={other} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

AppDetail.propTypes = {
    app: PropTypes.object.isRequired
};

export default AppDetail;
