import React from 'react';

const NumberInput = ({ label, value, onChange }) => {
    const onInputChange = event => {
        let newValue = event.target.value.trim();
        let dotFound = false;
        let sanitizedValue = '';
        for (let i = 0; i<newValue.length; i++) {
            const char = newValue[i];
            if (char.match(/\d/)) {
                sanitizedValue += char;
            } else if (char == '.' && !dotFound) {
                sanitizedValue += char;
                dotFound = true;
            } else if (char == '-' && i == 0) {
                sanitizedValue += char;
            }
        }
        onChange(sanitizedValue);
    };

    return (
        <span className="number-input">
            {label}
            <input type="text" value={value} onChange={onInputChange} />
        </span>
    );
};

export default NumberInput;