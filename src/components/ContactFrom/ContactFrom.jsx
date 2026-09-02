import React, { useRef } from 'react';
import { useForm } from "react-hook-form";
import { trackFormEvent } from "../../utils/analytics";

const EMAIL_PATTERN = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: "invalid email address"
};

const ContactFrom = () => {
    // react-hook-form v7: errors live on formState, and register() is spread
    // onto the field instead of being passed as a ref.
    const { register, formState: { errors } } = useForm({
        mode: "onBlur"
    });

    // The form does a native POST to getform.io, so there is no success
    // callback to hook. We record the first interaction and the submit; only
    // those two facts are sent, never any field value.
    const startTracked = useRef(false);

    const onFirstInteraction = () => {
        if (startTracked.current) return;
        startTracked.current = true;
        trackFormEvent({ form: "contact", status: "start" });
    };

    const onSubmit = () => {
        trackFormEvent({ form: "contact", status: "submit" });
    };

    return (
        <div className="contact-form" data-aos="fade-up" data-aos-delay="300">
            <form
                action="https://getform.io/f/dd18497c-29fb-4aef-b9cf-922c35026b9d"
                method="POST"
                onFocus={onFirstInteraction}
                onSubmit={onSubmit}
            >
                <div className="row mb-n6">
                    <div className="col-md-6 col-12 mb-6">
                        <input type="text" placeholder="Your Name *" {...register("name", { required: 'Name is required' })} />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <div className="col-md-6 col-12 mb-6">
                        <input type="email" placeholder="Email *" {...register("email", { required: 'Email is required', pattern: EMAIL_PATTERN })} />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>
                    <div className="col-md-12 col-12 mb-6">
                        <input type="text" placeholder="Subject *" {...register("subject", { required: 'Subject is required' })} />
                        {errors.subject && <p>{errors.subject.message}</p>}
                    </div>
                    <div className="col-12 mb-6">
                        <textarea placeholder="Message" {...register("message", { required: 'Message is required' })}></textarea>
                        {errors.message && <p>{errors.message.message}</p>}
                    </div>
                    <div className="col-12 text-center mb-6">
                        <button type="submit" className="btn btn-primary btn-hover-secondary">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ContactFrom;
