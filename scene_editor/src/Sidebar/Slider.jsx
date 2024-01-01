import React from "react";
import ReactSlider from "react-slider";

const Slider = ({ value, onChange }) => {
    const min = 0.0;
    const max = 64.0;

    const getSliderValueFromRads = rads => {
        return (max - min) * ((rads || 0) / (Math.PI * 2.0));
    };

    const getRadsFromSliderValue = val => {
        return (val / (max - min)) * (Math.PI * 2.0);
    };

    const onSliderChange = newSliderValue => {
        const newValueInRads = getRadsFromSliderValue(newSliderValue);
        onChange(newValueInRads);
    };

    const sliderValue = getSliderValueFromRads(value);

    return (
        <ReactSlider
            className="slider"
            thumbClassName="slider-thumb"
            trackClassName="slider-track"
            markClassName="slider-mark"
            min={min}
            marks={false}
            max={max}
            defaultValue={0}
            value={sliderValue}
            onChange={onSliderChange}
            renderMark={(props) => {
            if (props.key < sliderValue) {
                props.className = "slider-mark slider-mark-before";
            } else if (props.key === sliderValue) {
                props.className = "slider-mark slider-mark-active";
            }
            return <span {...props} />;
            }}
        />
    );
}

export default Slider;