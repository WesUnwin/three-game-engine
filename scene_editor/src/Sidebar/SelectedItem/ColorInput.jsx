import React, { useState } from 'react';
import { ChromePicker } from 'react-color'

// value will be an integer value, usually in hexadecimal
const ColorInput = ({ value, onChange }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);

    const colorAsHexString = `#${(value).toString(16)}`;

    const onColorPickerChange = ({ hex }) => {
        const newNumericValue = Number(hex.replace('#', '0x'));
        onChange(newNumericValue);
    }

    const popover = {
        position: 'absolute',
        zIndex: '2'
    };
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    };

    return (
        <span className="color-input">
            <div className="color-input-sample" style={{ backgroundColor: colorAsHexString }} />
            &nbsp;
            <button onClick={() => setShowColorPicker(!showColorPicker)}>
                Pick Color
            </button>
            {showColorPicker &&
                <div style={popover}>
                    <div style={cover} onClick={() => setShowColorPicker(false)} />
                    <ChromePicker
                        color={colorAsHexString}
                        onChange={onColorPickerChange}
                    />
                </div>
            }
        </span>
    );
};

export default ColorInput;