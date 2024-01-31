import { configureStore } from '@reduxjs/toolkit';

import projectFilesSlice from './ProjectFilesSlice.js';
import fileDataSlice from './FileDataSlice.js';
import selectedItemSlice from './SelectedItemSlice.js';
import currentModalSlice from './CurrentModalSlice.js';
import settingsSlice from './SettingsSlice.js';

const store = configureStore({
  reducer: {
    projectFiles: projectFilesSlice.reducer,
    fileData: fileDataSlice.reducer,
    selectedItem: selectedItemSlice.reducer,
    currentModal: currentModalSlice.reducer,
    settings: settingsSlice.reducer
  }
});

export default store