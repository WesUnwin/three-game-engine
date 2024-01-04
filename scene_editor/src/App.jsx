import React, { useState } from 'react';
import ReduxProvider from "./Redux/ReduxProvider.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
import MainArea from './MainArea.jsx';
import AutoSave from './AutoSave.jsx';
import 'react-tooltip/dist/react-tooltip.css'
import './styles.css';
import CurrentModal from './CurrentModal.jsx';

const App = () => {
    const [dirHandle, setDirHandle] = useState(null);

    return (
        <ReduxProvider>
            <AutoSave dirHandle={dirHandle}>
                <MainArea dirHandle={dirHandle} />
                <Sidebar dirHandle={dirHandle} setDirHandle={setDirHandle} />
                <CurrentModal />
            </AutoSave>
        </ReduxProvider>
    );
};

export default App;