import React from 'react';
import SEO from '../components/SEO';
import Header from "../partials/header/Header";
import IntroSlider from '../container/IntroSlider/IntroSlider';
import AppsShowcase from '../container/Apps/AppsShowcase';
import HomeAbout from '../components/About/HomeAbout.jsx';
import ServiceIconBox from '../container/service/ServiceIconBox';
// import HomeSuccess from '../components/Success/HomeSuccess';
// import Portfolio from '../container/Portfolio/Portfolio';
// import HomeBlog from '../container/BlogGrid/HomeBlog';
// import Newsletter from '../container/Newsletter/Newsletter';
import ContactInformation from '../container/ContactInformation/ContactInformation';
import Footer from '../container/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop.jsx';



const HomeOne = () => {
    return (
        <React.Fragment>
            <SEO path="/" />
            <Header />
            <IntroSlider />
            {/* Apps come first: they are what the studio is known for. */}
            <AppsShowcase
                title="OUR APPS"
                subTitle="Small, focused apps for iPhone, Mac and the web. No ads, no accounts you do not need."
                featuredOnly={true}
                showAllLink={true}
            />
            <HomeAbout />
            {/* Consulting stays on the page, but below the products. */}
            <ServiceIconBox classOption="bg-color-1" />
            {/* <HomeSuccess /> */}
            {/* <Portfolio /> */}
            {/* <HomeBlog /> */}
            {/* <Newsletter /> */}
            <ContactInformation />
            <Footer />
            <ScrollToTop />
        </React.Fragment>
    )
}

export default HomeOne;
