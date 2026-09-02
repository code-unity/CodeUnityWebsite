import PropTypes from "prop-types";
import React, { useEffect, useRef } from 'react';
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { trackFormEvent } from "../../utils/analytics";

const CustomForm = ({ status, message, onValidated }) =>{
    let email;
    // Only the outcome is reported. The address itself is never sent to GA4.
    const startTracked = useRef(false);
    const lastStatus = useRef(null);

    useEffect(() => {
        if (!status || status === lastStatus.current) return;
        lastStatus.current = status;
        if (status === "success") {
            trackFormEvent({ form: "newsletter", status: "success" });
        } else if (status === "error") {
            trackFormEvent({ form: "newsletter", status: "error", errorType: "network_error" });
        }
    }, [status]);

    const submit = (e) => {
        e.preventDefault();
        const value = email ? email.value : "";
        if (!value) {
            trackFormEvent({ form: "newsletter", status: "error", errorType: "empty_email" });
        } else if (value.indexOf("@") === -1) {
            trackFormEvent({ form: "newsletter", status: "error", errorType: "invalid_email" });
        } else {
            trackFormEvent({ form: "newsletter", status: "submit" });
            onValidated({
                EMAIL: value
            });
        }
        let emailInput = document.getElementById("mc-form-email");
        emailInput.value = "";
    };
    // Change Handaler
    const inputChangedHandler = () => {
        if (startTracked.current) return;
        startTracked.current = true;
        trackFormEvent({ form: "newsletter", status: "start" });
    }

    return (
        <div className="newsletter-form" data-aos="fade-up" data-aos-delay="300">
            {/* The subscribe button reports through trackFormEvent instead. */}
            <form data-analytics-skip>
                <input id="mc-form-email" className="email" type="email" onChange={(e)=>inputChangedHandler(e)} ref={node => (email = node)} placeholder="Ente your email" name="mail" />
                <button className="btn btn-primary btn-hover-secondary" onClick={submit}>Subscribe</button>
            </form>
            {status === "sending" && (
                <div style={{ color: "#3498db", fontSize: "12px" }}>sending...</div>
            )}
            {status === "error" && (
                <div
                style={{ color: "#e74c3c", fontSize: "12px" }}
                dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
            {status === "success" && (
                <div
                style={{ color: "#2ecc71", fontSize: "12px" }}
                dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
        </div>
    )
}

CustomForm.propTypes = {
    status: PropTypes.oneOf(["sending", "error", "success"]),
    message: PropTypes.string,
    onValidated: PropTypes.func
}

const NewsletterForm = (props) => {
    return (
        <MailchimpSubscribe
            url={props.mailchimpUrl}
            render={({ subscribe, status, message }) => (
            <CustomForm
                status={status}
                message={message}
                onValidated={formData => subscribe(formData)}
            />
            )}
        />
    )
}

NewsletterForm.propTypes = {
  mailchimpUrl: PropTypes.string
};

export default NewsletterForm;

