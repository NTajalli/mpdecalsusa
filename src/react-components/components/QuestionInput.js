import React from 'react';

// You can add more validation functions here as needed
export const validationRules = {
    email: {
      validate: (value) => /\S+@\S+\.\S+/.test(value),
      message: 'Invalid email address',
    },
    year: {
      validate: (value) => {
        const currentYear = new Date().getFullYear();
        return !isNaN(value) && value > 1900 && value <= currentYear + 1;
      },
      message: 'Invalid year',
    },
    raceNumber: {
        validate: (value) => /^\d+$/.test(value),
        message: 'Race number must be numeric',
      },
      name: {
        validate: (value) => /^[a-zA-Z ]{2,100}$/.test(value),
        message: 'Name should only contain letters and spaces, and be 2-100 characters long.',
      },
      address: {
        validate: (value) => /^[a-zA-Z0-9\s,'-]{3,100}$/.test(value),
        message: 'Address should be 3-100 characters long.',
      },
      city: {
        validate: (value) => /^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']{2,50}$/.test(value),
        message: 'City should only contain letters and be 2-50 characters long.',
      },
      state: {
        validate: (value) => /^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']{2,50}$/.test(value),
        message: 'State should only contain letters and be 2-50 characters long.',
      },
      country: {
        validate: (value) => /^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']{2,56}$/.test(value),
        message: 'Country should only contain letters and be 2-56 characters long.',
      },
      zipCode: {
        validate: (value) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value),
        message: 'Invalid zip code'
      },
      phoneNumber: {
        validate: (value) => value === '' || /^\+?[0-9]{1,3}[ -]?[0-9]{6,14}$/.test(value),
        message: 'Invalid Phone Number'
      }
    // Add more validation rules here with custom messages as needed
  };

  export const validateField = (id, value) => {
    if (validationRules[id]) {
      return {
        isValid: validationRules[id].validate(value),
        message: validationRules[id].message,
      };
    }
    return { isValid: true, message: '' };
  };

const QuestionInput = ({ question, onInputChange, initialValue, validationState, setValidationState }) => {
    const handleChange = (e) => {
        const value = e.target.value;
        let isValid = true;
        
        // Perform validation if a rule exists for this question id
        if (validationRules[question.id]) {
          isValid = validationRules[question.id].validate(value);
          setValidationState({
            ...validationState,
            [question.id]: isValid,
          });
        }
    
        onInputChange(question.id, value);
      };

  const commonInputStyle = {
    flex: '1 0 30%',
    padding: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    height: '40px',
    width: '70%',
  };

  const inputStyle = {
    ...commonInputStyle,
    border: validationState[question.id] === false ? '4px solid red' : '1px solid #ccc',
  };

  const errorMessageStyle = {
    color: 'red',
    marginTop: '5px'
  };

  // Generate the input field based on the type
  const renderInputField = () => {
    if (question.type === 'select' && question.options) {
      const selectValue = question.options.includes(initialValue) ? initialValue : question.options[0];
      return (
        <select onChange={handleChange} value={selectValue} style={inputStyle}>
          {question.options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else if (question.type === 'text') {
      return (
        <input
          type="text"
          onChange={handleChange}
          value={initialValue || ""}
          style={inputStyle}
        />
      );
    } else if (question.type === 'tel') {
      return (
        <input
            type="tel"
            onChange={handleChange}
            value={initialValue || ""}
            placeholder="XXX-XXX-XXXX"  // Example format with 'X's
            style={inputStyle}
        />
    );
    }

    // You can add more input types here if needed

    return null;  // If the input type is not handled, return null
  };

  // Show error message if validation failed
  const renderErrorMessage = () => {
    if (validationState[question.id] === false) {
      const errorMessage = validationRules[question.id] ? validationRules[question.id].message : 'Invalid input';
      return <div style={errorMessageStyle}>{errorMessage}</div>;
    }
    return null;
  };


  return (
    <div className="question-input">
      <label>{question.label}</label>
      {renderInputField()}
      {renderErrorMessage()}
    </div>
  );
};

export default QuestionInput;
