import PropTypes from "prop-types";
import React from "react";

const SingleTeam = ({ data }) => {
  return (
    <div className="team">
      <div className="thumb">
        <img
          src={process.env.PUBLIC_URL + data.image}
          alt="team Images"
          height="350px"
          width="300px"
        />
      </div>
      <div className="team-info text-center">
        <div className="info">
          <h5>{data.name}</h5>
          <span>{data.designation}</span>
        </div>
      </div>
    </div>
  );
};

SingleTeam.propTypes = {
  data: PropTypes.object,
};

export default SingleTeam;
