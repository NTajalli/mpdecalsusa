import { validationRules } from './QuestionInput'

export const validateInputs = (questions, formData) => {
    let validationErrors = {};
    let allValid = true;

        
    questions.forEach(q => {
        const value = formData[q.id];
        const rule = validationRules[q.id];

        if (q.type === 'select' && (value === 'SELECT ONE' || !value)) {
            validationErrors[q.id] = `Please select an option for ${q.label}`;
            allValid = false;
        } else if (q.type === 'singleImage' && (!value || !value.dataURL)) {
            validationErrors[q.id] = `${q.label} is required`;
            allValid = false;
        } else if (q.type === 'image' && (!value || value.length === 0)) {
            validationErrors[q.id] = `${q.label} is required`;
            allValid = false;
        } else if (rule && !rule.validate(value)) {
            validationErrors[q.id] = rule.message;
            allValid = false;
        } else if (!value && q.type != 'tel') {
            validationErrors[q.id] = `${q.label} is required`;
            allValid = false;
        }
    });

    // Additional case to handle validation for Step7
    if (formData.colors && !formData.colors.Standard.selected) {
        validationErrors.colors = `Standard color option must be selected.`;
        allValid = false;
    }

    return {
        isValid: allValid,
        errors: validationErrors
    };
};
