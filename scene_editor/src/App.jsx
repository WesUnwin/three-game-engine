import React from 'react';
import ReduxProvider from "./Redux/ReduxProvider.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
import MainArea from './MainArea.jsx';
import 'react-tooltip/dist/react-tooltip.css'
import './styles.css';

const App = () => {
    return (
        <ReduxProvider>
            <MainArea />
            <Sidebar />      
        </ReduxProvider>
    );
};

export default App;