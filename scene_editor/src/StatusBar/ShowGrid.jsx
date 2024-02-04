import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import settingsSlice, { getSettings } from "../Redux/SettingsSlice";

const ShowGrid = () => {
    const dispatch = useDispatch();

    const { showGrid } = useSelector(getSettings());

    const onChange = () => {
        dispatch(settingsSlice.actions.changeSettings({
            showGrid: !showGrid
        }));
    };

    return (
        <div className="status-bar-item">
            <input type="checkbox" checked={showGrid} onChange={onChange} />
            Show grid
        </div>
    );
};

export default ShowGrid;