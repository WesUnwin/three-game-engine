import React from 'react';
import ReduxProvider from "./Redux/ReduxProvider.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";

const App = () => {
    return (
        <ReduxProvider>
            <Sidebar />
        </ReduxProvider>
    );
};

export default App;