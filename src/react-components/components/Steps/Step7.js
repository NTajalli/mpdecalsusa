import React, { useState, useEffect } from 'react';
import './Step7.css';
import { PRICES_COLORS, getPriceByColorAndSize } from '../priceConstants';
import { calculateTotalPrice } from '../calculateTotalPrice';

const Step7 = ({ formData, setFormData, price, setPrice }) => {
    // Convert color names and prices into an array of options
    const options = Object.entries(PRICES_COLORS).map(([name]) => ({
        name,
        price: getPriceByColorAndSize(name, formData.bikeSize)
    }));

    // Function to initialize color selection
    const initializeColors = () => {
        if (formData.colors) {
            return formData.colors;
        }
        return options.reduce((acc, option) => {
            acc[option.name] = { selected: option.name === "Standard", price: option.price };
            return acc;
        }, {});
    };

    // State to keep track of selected options
    const [selectedOptions, setSelectedOptions] = useState(initializeColors);

    // Effect to update formData when component mounts
    useEffect(() => {
        // Only set formData if colors is not already set
        if (!formData.colors) {
            setFormData(prevData => ({
                ...prevData,
                colors: initializeColors()
            }));
        }
    }, []); // Empty dependency array ensures this effect runs once on mount

    useEffect(() => {
        // Update the price whenever selected options change
        setPrice(calculateTotalPrice({ ...formData, colors: selectedOptions }));
    }, [selectedOptions, formData, setPrice]);

    const toggleOption = (name) => {
        // Determine price based on color and bike size
        const optionPrice = getPriceByColorAndSize(name, formData.bikeSize);

        // Update selected options state
        const updatedOptions = {
            ...selectedOptions,
            [name]: { selected: !selectedOptions[name].selected, price: optionPrice }
        };

        // Update local state and formData with new selections
        setSelectedOptions(updatedOptions);
        setFormData(prevData => ({
            ...prevData,
            colors: updatedOptions
        }));
    };

    Step7.questions = [];
    return (
        <>
            <h1 className="step-title">COLORS DETAILS</h1>
            <div className="step7-container">
                {options.map(option => (
                    <div key={option.name} className="color-option">
                        <div className="color-label">{option.name}</div>
                        <button
                            className={`color-toggle ${selectedOptions[option.name].selected ? 'active' : ''}`}
                            onClick={() => toggleOption(option.name)}
                        >
                            {selectedOptions[option.name].selected ? '✓' : '×'}
                        </button>
                        {/* Display the price based on the bike size */}
                        <div className="color-price">${selectedOptions[option.name].price.toFixed(2)} {option.name != 'Standard' ? ` for ${formData.bikeSize}` : ''}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Step7;
