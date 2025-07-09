import React, { useState, useEffect } from 'react';
import QuestionInput from '../QuestionInput';
import { calculateTotalPrice } from '../calculateTotalPrice';

const Step8 = ({ formData, setFormData, price, setPrice }) => {
    const [validationState, setValidationState] = useState({});

    const questions = [
        { type: 'select', label: 'LAMINANT FINISHES', id: 'finishes', options: ['SELECT ONE', 'GLOSSY', 'MATTE']}
    ];

    const handleInputChange = (id, value) => {
        const updatedData = { ...formData, [id]: value };
        setFormData(updatedData);

        // Recalculate the total price
        const newPrice = calculateTotalPrice(updatedData);
        setPrice(newPrice);
    };

    useEffect(() => {
        // Recalculate the total price when the component mounts
        const initialPrice = calculateTotalPrice(formData);
        setPrice(initialPrice);
    }, []);

    Step8.questions = questions;

    return (
        <>
            <h1 className="step-title">FINISHES</h1>
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
        </>
    );
};

export default Step8;
