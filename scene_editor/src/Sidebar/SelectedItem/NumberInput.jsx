import React, { useState, useEffect } from 'react';
import RotationSlider from '../Slider.jsx';

const NumberInput = ({ label, value, onChange, showSlider, max }) => {
    const [text, setText] = useState(value); // independent state from value

    const [hasFocus, setHasFocus] = useState(false);

    const cleanseInput = rawInput => {
        let newValue = rawInput.trim();
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
        return sanitizedValue;
    }

    const onInputChange = event => {
        const sanitizedvalue = cleanseInput(event.target.value)
        setText(sanitizedvalue);
    };

    useEffect(() => {
        if (hasFocus) { // user is editing this input field
            const valueOfText = Number.parseFloat(text) || 0;
            const currentNumericValue = Number.parseFloat(value) || 0;
            if (valueOfText !== currentNumericValue) {
                onChange(valueOfText);
            }
        }
    }, [text]);

    useEffect(() => {
        if (!hasFocus) {
            setText(value);
        }
    }, [value]);

    return (
        <span className="number-input">
            {label}
            <input
                type="text" 
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
                value={text}
                onChange={onInputChange} />
            {showSlider &&
                <RotationSlider value={value} onChange={onChange} max={max} />
            }
        </span>
    );
};

export default NumberInput;