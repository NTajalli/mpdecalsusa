import React, { useState, useEffect } from 'react';
import QuestionInput from '../QuestionInput';
import { calculateTotalPrice } from '../calculateTotalPrice';


const Step1 = ({ formData, setFormData, price, setPrice }) => {
    const [validationState, setValidationState] = useState({});

    const questions = [
        { type: 'select', label: 'SELECT YOUR BIKE SIZE', id: 'bikeSize', options: ['SELECT ONE', 'Pit Bike 50cc', 'Mini Bike 65-85cc', 'Big Bikes 125-400cc'] }
    ];

    const handleInputChange = (id, value) => {
        const updatedData = { ...formData, [id]: value };
        setFormData(updatedData);
        // Use the centralized price calculator after each change
        setPrice(calculateTotalPrice(updatedData));
    };

    Step1.questions = questions;

    useEffect(() => {
        // Recalculate the price when component mounts
        setPrice(calculateTotalPrice(formData));
    }, [formData]);

    return (
        <>
            <h1 className="step-title">BIKE SIZE</h1>
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

export default Step1;
