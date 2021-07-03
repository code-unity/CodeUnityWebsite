// import {useState, useEffect, useRef} from "react";
import SectionTitleTwo from '../../components/SectionTitles/SectionTitleTwo';
// import {Link} from "react-router-dom";
// import Tilt from 'react-parallax-tilt';
// import Parallax from 'parallax-js';

const AboutFive = () => {
    // const [scale] = useState(1.04);
    // const sceneEl = useRef(null);

    // useEffect(() => {
    //     const parallaxInstance = new Parallax(sceneEl.current, {
    //     relativeInput: true,
    //     })
        
    //     parallaxInstance.enable();

    //     return () => parallaxInstance.disable();

    // }, [])


    return (
        <div className="section section-padding-top section-padding-bottom-180">
            <div className="container">

                <div className="row">

                    {/* <div className="col-xl-7 col-lg-6 col-12" data-aos="fade-up">
                        <div className="about-image-area">
                            <div className="about-image">
                                <Tilt scale={scale} transitionSpeed={4000}>
                                    <img src={process.env.PUBLIC_URL + "images/about/about-3.jpg"} alt="" />
                                </Tilt>
                            </div>
                            <div className="about-image">
                                <Tilt scale={scale} transitionSpeed={4000}>
                                    <img src={process.env.PUBLIC_URL + "images/about/about-4.jpg"} alt="" />
                                </Tilt>
                            </div>

                            <div className="shape shape-1" id="scene" ref={sceneEl}>
                                <span data-depth="1"><img src={process.env.PUBLIC_URL + "images/shape-animation/about-shape-1.png"} alt="" /></span>
                            </div>

                        </div>
                    </div> */}

                    <div className="col-xl-5 col-lg-6 col-12" data-aos="fade-up" data-aos-delay="300">
                        <div className="about-content-area">
                            <SectionTitleTwo 
                                subTitle="Our Mission and Vision"
                               
                            />

<p>
1.Build replica of the Shirdi Sai Temple in Canada.
2.To Open a Food Bank where perishable and non-perishable food will be availabe at all times.
3.Establish a trust fund to help educate children with their higher studies who otherwise are unable to fulfil their dreams.
4.To build a Sai School where spiritual and religious books of all faiths will be available.
5.To provide a computer center for community.
6.To arrance Cmpus for spiritual progress for all ages. This consists of meditation, yoga and other activites.
7.To be able to present all Aarti’s and Bhajans live telecast on our website for anyone who would like to take HIS darshan and enjoy HIS bhajans from the comfort of their home, while travelling and so on.
8.To be able to provide a place for new immigrants to initially live ( Approximatly 14 Days ) to help them settle in Canada.
</p>

<SectionTitleTwo 
                                subTitle="Our Values"
                                
                            />


<p>
1.Build replica of the Shirdi Sai Temple in Canada.
2.To Open a Food Bank where perishable and non-perishable food will be availabe at all times.
3.Establish a trust fund to help educate children with their higher studies who otherwise are unable to fulfil their dreams.
4.To build a Sai School where spiritual and religious books of all faiths will be available.
5.To provide a computer center for community.
6.To arrance Cmpus for spiritual progress for all ages. This consists of meditation, yoga and other activites.
7.To be able to present all Aarti’s and Bhajans live telecast on our website for anyone who would like to take HIS darshan and enjoy HIS bhajans from the comfort of their home, while travelling and so on.
8.To be able to provide a place for new immigrants to initially live ( Approximatly 14 Days ) to help them settle in Canada.
</p>

                            {/* <Link className="btn btn-primary btn-hover-secondary mt-xl-12 mt-lg-8 mt-md-6 mt-4" to={process.env.PUBLIC_URL + "/"}>  </Link> */}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default AboutFive;
