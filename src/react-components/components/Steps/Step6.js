import React, { useState, useEffect } from 'react';
import './Step6.css';

const Step6 = ({ formData, setFormData }) => {
    const [afterMarketPlastics, setAfterMarketPlastics] = useState(formData.afterMarketPlastics || "");

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            afterMarketPlastics: prevData.afterMarketPlastics || "",
        }));
    }, [setFormData]);
    
    const handleAfterMarketPlasticsChange = (event) => {
        const text = event.target.value;
        setAfterMarketPlastics(text);
        setFormData(prevData => ({
            ...prevData,
            afterMarketPlastics: text
        }));
    };

    Step6.questions = [];
    return (
        <>
            <h1 className="step-title">AFTER MARKET PARTS</h1>
            <div className="step6-container">
            <h2 className="step-title-2">Does your bike have any after market plastics fitted?
(eg. UFO restyle kit/POLISPORT restyle kit/CYCRA front plate/RTECH restyle kit)
</h2>
                <label className="step6-label">AFTER MARKET PLASTICS</label>
                <textarea
                    className="step6-textbox"
                    value={afterMarketPlastics}
                    onChange={handleAfterMarketPlasticsChange}
                    placeholder="Provide any additional details about after market plastics here..."
                    rows="3"
                />
            </div>
        </>
    );
};

export default Step6;
