import React from "react";
import SectionTitle from "../../components/SectionTitles/SectionTitle.jsx";
import TeamData from "../../data/team/team.json";
import SingleTeam from "../../components/Team/SingleTeam.jsx";

const Team = () => {
  return (
    <div className="section section-padding bg-primary-blue">
      <div className="container">
        <SectionTitle titleOption="text-center mb-12" title="Team Members" />

        <div className="row row-cols-lg-4 row-cols-sm-2 row-cols-1 mb-n6">
          {TeamData &&
            TeamData.map((single, key) => {
              return (
                <div
                  key={key}
                  className="col mb-6"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <SingleTeam data={single} key={key} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Team;
