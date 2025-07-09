import React, { useState } from 'react';
import QuestionInput from '../QuestionInput';
import './Step3.css'; 

const Step3 = ({ formData, setFormData }) => {
    const [validationState, setValidationState] = useState({});

    const questions = [
        { type: 'text', label: 'NAME', id: 'riderName' },
        { type: 'text', label: 'RACE NUMBER', id: 'raceNumber' },
        { type: 'text', label: 'RACE NUMBER COLOR', id: 'raceNumberColor' },
        { type: 'text', label: 'BACKGROUND COLOR', id: 'backgroundColor' },
        { type: 'select', label: 'NUMBER FONT SELECTION', id: 'numberFontSelection', options: ['SELECT ONE', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'] }
    ];

    const handleInputChange = (id, value) => {
        setFormData({ ...formData, [id]: value });
    };

    Step3.questions = questions;

    return (
        <>
            <h1 className="step-title">RIDER DETAILS</h1>
            <div className="step-content">
                {questions.map((q) => (
                    <QuestionInput
                    key={q.id}
                    question={q}
                    onInputChange={handleInputChange}
                    initialValue={formData[q.id]}
                    validationState={validationState}
                    setValidationState={setValidationState} // Pass this prop to QuestionInput
                  />
                ))}
                <a href="images/MP_NUMBER_STYLE.png" target="_blank" rel="noopener noreferrer">
                    <img
                        src="images/MP_NUMBER_STYLE.png"
                        alt="Number Style"
                        className="reference-image"
                    />
                </a>
            </div>
        </>
    );
};

export default Step3;
