import PropTypes from "prop-types";
import React from "react";
// import { Link } from "react-router-dom";

const SectionTitle = ({
  title,
  subTitle1,
  subTitle2,
  //   subTitle3,
  titleOption,
  headingOption,
}) => {
  return (
    <div className={`section-title ${titleOption}`} data-aos="fade-up">
      <h2
        className={`title ${headingOption}`}
        dangerouslySetInnerHTML={{ __html: title }}
      ></h2>
      <p className="sub-title">{subTitle1}</p>
      <br />
      <p className="sub-title">{subTitle2}</p>
      {/* <p className="sub-title">
        {subTitle3}
        <Link to="contact" style={{ color: "#1292ee" }}>
          Let us know.
        </Link>
      </p> */}
    </div>
  );
};

SectionTitle.propTypes = {
  subTitle1: PropTypes.string,
  subTitle2: PropTypes.string,
  subTitle3: PropTypes.string,
  title: PropTypes.string,
  titleOption: PropTypes.string,
  headingOption: PropTypes.string,
};
SectionTitle.defaultProps = {
  titleOption: "text-center",
  headingOption: "title",
};

export default SectionTitle;
