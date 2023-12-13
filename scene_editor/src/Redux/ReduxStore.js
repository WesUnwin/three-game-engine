import { configureStore } from '@reduxjs/toolkit'

import projectFilesSlice from './ProjectFilesSlice.js'
import fileDataSlice from './FileDataSlice.js'
import selectedItemSlice from './SelectedItemSlice.js'

const store = configureStore({
  reducer: {
    projectFiles: projectFilesSlice.reducer,
    fileData: fileDataSlice.reducer,
    selectedItem: selectedItemSlice.reducer
  }
})

export default store