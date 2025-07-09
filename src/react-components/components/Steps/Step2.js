import React, { useState } from 'react';
import QuestionInput from '../QuestionInput';

const Step2 = ({ formData, setFormData }) => {
    const [validationState, setValidationState] = useState({});

    const questions = [
        { type: 'select', label: 'MAKE', id: 'make', options: ['SELECT ONE', 'BETA', 'COBRA', 'GAS GAS', 'HONDA', 'HUSABERG', 'HUSQVARNA', 'KAWASAKI', 'KTM', 'SHERCO', 'SUZUKI', 'TM', 'YAMAHA']},
        { type: 'text', label: 'MODEL', id: 'model' },
        { type: 'text', label: 'YEAR', id: 'year' },
        { type: 'select', label: 'STROKE', id: 'stroke', options: ['SELECT ONE', '2-Stroke', '4-Stroke'] }
    ];

    const validateYear = (year) => {
        const currentYear = new Date().getFullYear();
        return !isNaN(year) && year > 1900 && year <= currentYear + 1;
      };  

    const handleInputChange = (id, value) => {
        const updatedData = { ...formData, [id]: value };
      
        // Check for year validation
        if (id === 'year') {
          const isValidYear = validateYear(value);
          setValidationState({ ...validationState, [id]: isValidYear });
        }
      
        setFormData(updatedData);
      };
      

    Step2.questions = questions;

    return (
        <>
            <h1 className="step-title">BIKE DETAILS</h1>
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

export default Step2;
