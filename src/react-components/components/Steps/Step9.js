import React, { useState, useEffect } from 'react';
import QuestionInput, { validateField } from '../QuestionInput';

const Step9 = ({ formData, setFormData }) => {
    const [validationState, setValidationState] = useState({});

    const questions = [
        { type: 'text', label: 'NAME', id: 'name' },
        { type: 'text', label: 'EMAIL', id: 'email' },
        { type: 'text', label: 'ADDRESS', id: 'address' },
        { type: 'text', label: 'CITY', id: 'city' },
        { type: 'text', label: 'STATE', id: 'state' },
        { type: 'text', label: 'COUNTRY', id: 'country' },
        { type: 'text', label: 'ZIP CODE', id: 'zipCode'},
        { type: 'tel', label: 'PHONE NUMBER (OPTIONAL)', id: 'phoneNumber'},
    ];
    
    useEffect(() => {
        setFormData({ ...formData, phoneNumber: formData.phoneNumber || '' });
    }, []);    

    const handleInputChange = (id, value) => {
        const updatedData = { ...formData, [id]: value };
      
        // Use the imported validation function
        const validation = validateField(id, value);
        setValidationState({ ...validationState, [id]: validation.isValid });
      
        // If valid, update the formData
        setFormData(updatedData);
      };
    
    Step9.questions = questions;

    return (
        <>
            <h1 className="step-title">CUSTOMER INFORMATION</h1>
            <div className="step-content">
                {questions.map((q) => (
                    <QuestionInput
                        key={q.id}
                        question={q}
                        onInputChange={handleInputChange}
                        initialValue={formData[q.id]}
                        validationState={validationState}
                        setValidationState={setValidationState}
                    />
                ))}
            </div>
        </>
    );
};

export default Step9;
