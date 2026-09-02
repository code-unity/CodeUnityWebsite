import PropTypes from "prop-types";
import React from 'react';
import {Link} from "react-router-dom";
import AppsData from '../../data/apps/apps.json';
import AppCard from '../../components/Apps/AppCard.jsx';
import SectionTitle from '../../components/SectionTitles/ContactSectionTitle';

const AppsShowcase = ({ classOption, title, subTitle, featuredOnly, showAllLink }) => {
    const apps = featuredOnly ? AppsData.filter(app => app.featured) : AppsData;

    return (
        <div className={`section section-padding-t90-b100 ${classOption}`}>
            <div className="container">

                <SectionTitle title={title} subTitle={subTitle} />

                <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 mb-n6">
                    {apps.map((single) => (
                        <div key={single.id} className="col mb-6" data-aos="fade-up">
                            <AppCard data={single} />
                        </div>
                    ))}
                </div>

                {showAllLink && (
                    <div className="row">
                        <div className="col text-center mt-8">
                            <Link to={process.env.PUBLIC_URL + "/apps"} className="btn btn-primary btn-hover-secondary">
                                See all {AppsData.length} products
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

AppsShowcase.propTypes = {
    classOption: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    featuredOnly: PropTypes.bool,
    showAllLink: PropTypes.bool
};

AppsShowcase.defaultProps = {
    classOption: "section section-padding-t90-b100",
    title: "OUR APPS",
    subTitle: "Small, focused apps for iPhone, Mac and the web — built and shipped by CodeUnity.",
    featuredOnly: false,
    showAllLink: false
};

export default AppsShowcase;
