import React from 'react';
import SEO from '../components/SEO';
import Header from "../partials/header/Header";
import Breadcrumb from '../container/Breadcrumb/Breadcrumb';
import AppsShowcase from '../container/Apps/AppsShowcase';
import ContactInformationThree from '../container/ContactInformation/ContactInformationThree';
import Footer from '../container/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop.jsx';


const Apps = () => {
    return (
        <React.Fragment>
            <SEO
                title="Apps - CodeUnity"
                description="Every app CodeUnity has shipped for iPhone, Mac and the web — including Pocket AI, LLM Radar and ToolGenie. Download links for all of them in one place."
            />
            <Header />
            <Breadcrumb
                image="images/bg/breadcrumb-bg-three.jpg"
                title="Every app we have shipped, in one place"
                content="Home"
                contentTwo="Apps"
            />
            <AppsShowcase
                title="ALL PRODUCTS"
                subTitle="Download links for every CodeUnity app on iPhone, Mac and the web."
            />
            <ContactInformationThree />
            <Footer />
            <ScrollToTop />
        </React.Fragment>
    )
}

export default Apps;
