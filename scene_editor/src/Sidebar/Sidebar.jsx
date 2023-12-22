import React from 'react';
import ProjectFiles from './ProjectFiles/ProjectFiles.jsx';
import Hierarchy from './Hierarchy/Hierarchy.jsx';
import SelectedFile from './SelectedFile/SelectedFile.jsx';

const Sidebar = ({ dirHandle, setDirHandle }) => {
    return (
        <div className="sidebar">
            <ProjectFiles setDirHandle={setDirHandle} />

            <Hierarchy dirHandle={dirHandle} />

            <SelectedFile />
        </div>
    );
};

export default Sidebar;