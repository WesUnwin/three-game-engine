import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import settingsSlice, { getSettings } from "../Redux/SettingsSlice";

const ShowColliders = () => {
    const dispatch = useDispatch();

    const { showColliders } = useSelector(getSettings());

    const onChange = () => {
        dispatch(settingsSlice.actions.changeSettings({
            showColliders: !showColliders
        }));
    };

    return (
        <div className="status-bar-item">
            <input type="checkbox" checked={showColliders} onChange={onChange} />
            Show colliders
        </div>
    );
};

export default ShowColliders;