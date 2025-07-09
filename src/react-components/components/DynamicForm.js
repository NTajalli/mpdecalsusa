import React, { useState, useEffect } from 'react';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import Step6 from './Steps/Step6';
import Step7 from './Steps/Step7';
import Step8 from './Steps/Step8';
import Step9 from './Steps/Step9';
const FormSummary = require('./FormSummary');
import FormNavigation from './FormNavigation';
import { CSSTransition } from 'react-transition-group';
import './fadeTransition.css';
import { validateInputs } from './formValidationHelper';
import './spinner.css';


const DynamicForm = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [validationState, setValidationState] = useState({});
    const [stepValidations, setStepValidations] = useState([false, false, false, false]);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);


    const onSubmit = async () => {
        setLoading(true);
        try {
            const dataToSend = {
                ...formData,
                price
            };
    
            const response = await fetch('/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
            });
    
            if (response.status === 200) {
                setSubmitSuccess(true);
            } else {
                alert('Failed to submit the form. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    

    const getCurrentStepQuestions = (stepOverride) => {
        const actualStep = stepOverride !== undefined ? stepOverride : step;
    
        switch (actualStep) {
            case 0:
                return Step1.questions;
            case 1:
                return Step2.questions;
            case 2:
                return Step3.questions;
            case 3:
                return Step4.questions;
            case 4:
                return Step5.questions;
            case 5:
                return Step6.questions;
            case 6:
                return Step7.questions;
            case 7:
                return Step8.questions;
            case 8:
                return Step9.questions;
            default:
                return [];
        }
    };

    useEffect(() => {
        const currentQuestions = getCurrentStepQuestions();
        const validationResults = validateInputs(currentQuestions, formData);
    
        // Update validationState with the current errors.
        setValidationState(validationResults.errors);
    
        // Update stepValidations array with the current step validation result.
        const updatedStepValidations = [...stepValidations];
        updatedStepValidations[step] = validationResults.isValid;
        setStepValidations(updatedStepValidations);
    }, [step, formData]);

    const handleNext = () => {
        if (isNavigating) return; // Prevent double clicks
        setIsNavigating(true);

        const currentQuestions = getCurrentStepQuestions();
        const validationResults = validateInputs(currentQuestions, formData);
        
        setValidationState(validationResults.errors);

        if (!validationResults.isValid) return;

        fetch('/save-form-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(() => setStep(prevStep => prevStep + 1))
        .catch(error => console.error('Error saving form data:', error))
        .finally(() => setIsNavigating(false));
    };

    const handlePrev = () => {
        if (isNavigating) return; // Prevent double clicks
        setIsNavigating(true);

        fetch('/save-form-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(() => setStep(prevStep => prevStep - 1))
        .catch(error => console.error('Error saving form data:', error))
        .finally(() => setIsNavigating(false));
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return <Step1 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            case 1:
                return <Step2 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            case 2:
                return <Step3 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            case 3:
                return <Step4 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            case 4:
                return <Step5 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            case 5:
                return <Step6 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            case 6:
                return <Step7 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            case 7:
                return <Step8 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            case 8:
                return <Step9 formData={formData} setFormData={setFormData} validationState={validationState} setValidationState={setValidationState} price={price} setPrice={setPrice} />;
            default:
                return <FormSummary data={formData} price={price} />;
        }
    };

    return (
        <div className="dynamic-form">
            {submitSuccess ? (
                <div className="success-page">
                <div className="details-container">
                    <h1 className="success-message">We Have Received Your Details!</h1>
                    <p className="success-description">Thank you for your submission. Our team will review it and get back to you soon!</p>
                    <a href="/" className="go-home-link">Go Back to Home</a>
                </div>
                <div className="image-container">
                </div>
            </div>
            ) : (
                <>
                    {loading && <div className="spinner"></div>}
                    <div id="price-display">
                        Current Estimated Price: ${price}
                    </div>
                    <CSSTransition in={true} appear={true} timeout={1500} classNames="fade" key={step} unmountOnExit>
                        {(state) => (
                            <div className="step-wrapper">
                                {renderStep()}
                            </div>
                        )}
                    </CSSTransition>
                    <FormNavigation 
                        onNext={handleNext} 
                        onPrev={handlePrev} 
                        onSubmit={onSubmit}
                        currentStep={step} 
                        totalSteps={9} 
                        stepValidations={stepValidations} 
                        isNavigating={isNavigating}
                    />
                </>
            )}
        </div>
    );    
};

export default DynamicForm;
