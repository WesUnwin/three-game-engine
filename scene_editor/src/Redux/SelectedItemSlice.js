import { createSlice } from '@reduxjs/toolkit';

const selectedItemSlice = createSlice({
    name: 'selectedItem',
    initialState: {
        filePath: null, // null or a string to file related to selected item
        type: null, // null | gameJSON | sceneJSON | gameObjectTypeJSON | GameObject
        params: {} // identifying information (eg to identify which GameObject is selected)
    },
    reducers: {
        selectItem: (state, action) => {
            state.filePath = action.payload.filePath;
            state.type = action.payload.type;
            state.params = action.payload.params || {};
        }
    }
});

export const getSelectedItem = () => {
    return store => store.selectedItem.type === null ? null : store.selectedItem;
};

export const selectItem = (filePath, type, params) => {
    return selectedItemSlice.actions.selectItem({ filePath, type, params });
};

export default selectedItemSlice;