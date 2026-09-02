import React, { useRef } from 'react';
import { useForm } from "react-hook-form";
import { trackFormEvent } from "../../utils/analytics";

const EMAIL_PATTERN = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: "invalid email address"
};

const ProjectForm = () => {
    // react-hook-form v7: errors live on formState, and register() is spread
    // onto the field instead of being passed as a ref.
    const { register, formState: { errors } } = useForm({
        mode: "onBlur"
    });

    // Native POST to getform.io, so only the first interaction and the submit
    // are recorded. No field value is ever sent.
    const startTracked = useRef(false);

    const onFirstInteraction = () => {
        if (startTracked.current) return;
        startTracked.current = true;
        trackFormEvent({ form: "project_brief", status: "start" });
    };

    const onSubmit = () => {
        trackFormEvent({ form: "project_brief", status: "submit" });
    };

    return (
        <div className="contact-form" data-aos="fade-up" data-aos-delay="300">
            <form
                action="https://getform.io/f/dd18497c-29fb-4aef-b9cf-922c35026b9d"
                method="POST"
                onFocus={onFirstInteraction}
                onSubmit={onSubmit}
            >
                <div className="row mb-n4">
                    <div className="col-md-12 col-12 mb-4">
                        <input type="text" placeholder="Your Name *" {...register("name", { required: 'Name is required' })} />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <div className="col-md-12 col-12 mb-4">
                        <input type="email" placeholder="Email *" {...register("email", { required: 'Email is required', pattern: EMAIL_PATTERN })} />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>
                    <div className="col-12 mb-6">
                        <textarea placeholder="Message" {...register("message", { required: 'Message is required' })}></textarea>
                        {errors.message && <p>{errors.message.message}</p>}
                    </div>
                    <div className="col-12 text-center mb-4">
                        <button className="btn btn-primary btn-hover-secondary">Get a free consultation</button>
                    </div>
                </div>
            </form>
        </div>

    )
}

export default ProjectForm;
