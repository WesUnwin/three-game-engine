import React from 'react';
import ProjectFiles from './ProjectFiles/ProjectFiles.jsx';
import Hierarchy from './Hierarchy/Hierarchy.jsx';
import SelectedItem from './SelectedItem/SelectedItem.jsx';

const Sidebar = ({ dirHandle, setDirHandle }) => {
    return (
        <div className="sidebar">
            <ProjectFiles setDirHandle={setDirHandle} />

            <Hierarchy dirHandle={dirHandle} />

            <SelectedItem />
        </div>
    );
};

export default Sidebar;