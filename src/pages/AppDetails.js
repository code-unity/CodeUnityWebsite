import React from 'react';
import {useParams, Link} from "react-router-dom";
import SEO from '../components/SEO';
import Header from "../partials/header/Header";
import Breadcrumb from '../container/Breadcrumb/Breadcrumb';
import AppDetail from '../container/Apps/AppDetail';
import AppsData from '../data/apps/apps.json';
import Footer from '../container/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop.jsx';

const AppDetails = () => {
    const {slug} = useParams();
    const app = AppsData.find(item => item.slug === slug);

    if (!app) {
        return (
            <React.Fragment>
                <SEO title="App not found | CodeUnity" noindex={true} />
                <Header />
                <Breadcrumb
                    image="images/bg/breadcrumb-bg-three.jpg"
                    title="We could not find that app"
                    content="Home"
                    contentTwo="Apps"
                />
                <div className="section section-padding-t90-b100">
                    <div className="container text-center">
                        <p>That page does not exist. Every app we have shipped is listed on one page.</p>
                        <Link className="btn btn-primary btn-hover-secondary" to={process.env.PUBLIC_URL + "/apps"}>
                            See all CodeUnity apps
                        </Link>
                    </div>
                </div>
                <Footer />
                <ScrollToTop />
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <SEO
                path={`/apps/${app.slug}`}
                title={`${app.seoTitle} | CodeUnity`}
                description={app.seoDescription}
                image={app.icon || undefined}
            />
            <Header />
            <Breadcrumb
                image="images/bg/breadcrumb-bg-three.jpg"
                title={app.name}
                content="Home"
                contentTwo="Apps"
            />
            <AppDetail app={app} />
            <Footer />
            <ScrollToTop />
        </React.Fragment>
    )
}

export default AppDetails;
