import React from 'react';
import { Provider } from 'react-redux';
import ReduxStore from './ReduxStore';

const ReduxProvider = ({ children }) => {
    return (
        <Provider store={ReduxStore}>
            {children}
        </Provider>
    );
};

export default ReduxProvider;