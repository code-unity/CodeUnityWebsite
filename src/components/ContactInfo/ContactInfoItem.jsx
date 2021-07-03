import PropTypes from "prop-types";
import React from 'react';
import ReactVivus from 'react-vivus';

const ContactInfoItem = ({data}) => {
    return (
        <div className="contact-info">
            <div className="icon">
                <ReactVivus
                    id={`contactsvg-${data.id}`}
                    option={{
                        file: data.icon,
                        animTimingFunction: 'EASE',
                            type: 'oneByOne',
                            delay: 80
                    }}
                />
            </div>
            {data.title=="Give Us A Call" &&
            <a href="tel:+919030656522">
                <div className="info" >
                    <h4 className="title">{data.title}</h4>
                    <span className="info-text" >{data.info}</span>
                </div>
            </a>
            }
            {data.title == "Help Desk" &&
            <a href = "mailto: admin@codeunity.co">
                <div className="info">
                    <h4 className="title">{data.title}</h4>
                    <span className="info-text" dangerouslySetInnerHTML={{__html: data.info}}/>
                </div>
            </a>
            }
            {data.title == "Our Locations" &&
            <div className="info">
               <h4 className="title">{data.title}</h4>
               <span className="info-text" dangerouslySetInnerHTML={{__html: data.info}}/>
            </div>

            }
            
            
            
        </div>
    )
}

ContactInfoItem.propTypes = {
    data: PropTypes.object
};

export default ContactInfoItem;
