import React from 'react';
import { useForm } from "react-hook-form";

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

    return (
        <div className="contact-form" data-aos="fade-up" data-aos-delay="300">
            <form action="https://getform.io/f/dd18497c-29fb-4aef-b9cf-922c35026b9d" method="POST" >
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
