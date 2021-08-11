import React from "react";
import SEO from "../components/SEO";
import Header from "../partials/header/Header";
import Breadcrumb from "../container/Breadcrumb/Breadcrumb";
import AboutFour from "../container/About/AboutFour";
import TeamOne from "../container/Team/TeamOne";

//import Video from '../container/Video/Video';
//import AboutFive from '../container/About/AboutFive';
import TestimonialContainer from "../container/Testimonial/TestimonialContainer";
import CallToActionTwo from "../container/CallToAction/CallToActionTwo";
import Footer from "../container/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop.jsx";

const AboutUs = () => {
  return (
    <React.Fragment>
      <SEO title="About - CodeUnity" />
      <Header />
      <Breadcrumb
        image="images/bg/breadcrumb-bg.jpg"
        title="Who We Are"
        content="Home"
        contentTwo="About Us"
      />
      <AboutFour />
      {/* <Video /> */}
      {/* <AboutFive /> */}
      <TestimonialContainer classOption="bg-primary-blue" />
      <TeamOne />
      <CallToActionTwo />
      <Footer />
      <ScrollToTop />
    </React.Fragment>
  );
};

export default AboutUs;
