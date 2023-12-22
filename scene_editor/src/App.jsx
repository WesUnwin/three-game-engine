import React, { useState } from 'react';
import ReduxProvider from "./Redux/ReduxProvider.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
import MainArea from './MainArea.jsx';
import 'react-tooltip/dist/react-tooltip.css'
import './styles.css';

const App = () => {
    const [dirHandle, setDirHandle] = useState(null);

    return (
        <ReduxProvider>
            <MainArea dirHandle={dirHandle} />
            <Sidebar dirHandle={dirHandle} setDirHandle={setDirHandle} />      
        </ReduxProvider>
    );
};

export default App;