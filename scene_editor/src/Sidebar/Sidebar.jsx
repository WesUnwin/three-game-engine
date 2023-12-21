import React, { useState } from 'react';
import ProjectFiles from './ProjectFiles/ProjectFiles.jsx';
import Hierarchy from './Hierarchy/Hierarchy.jsx';
import SelectedFile from './SelectedFile/SelectedFile.jsx';

const Sidebar = () => {
    const [dirHandle, setDirHandle] = useState(null);

    return (
        <div className="sidebar">
            <ProjectFiles setDirHandle={setDirHandle} />

            <Hierarchy dirHandle={dirHandle} />

            <SelectedFile />
        </div>
    );
};

export default Sidebar;