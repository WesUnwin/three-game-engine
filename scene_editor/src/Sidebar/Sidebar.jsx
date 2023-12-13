import React, { useState } from 'react';
import ProjectFiles from './ProjectFiles/ProjectFiles.jsx';
import Hierarchy from './Hierarchy/Hierarchy.jsx';
import SelectedFile from './SelectedFile/SelectedFile.jsx';

const Sidebar = () => {
    const [dirHandle, setDirHandle] = useState(null);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', backgroundColor: '#404040' }}>
            <ProjectFiles setDirHandle={setDirHandle} />

            <Hierarchy dirHandle={dirHandle} />

            <SelectedFile />
        </div>
    );
};

export default Sidebar;