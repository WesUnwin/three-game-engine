import React from 'react';
import PageLayout from './PageLayout.jsx';
import AppRoutes from './AppRoutes.jsx';
import { HashRouter } from 'react-router-dom';

import './styles.css';

const App = () => {
    return (
        <HashRouter>
            <PageLayout>
                <AppRoutes />
            </PageLayout>
        </HashRouter>
    );
};

export default App;