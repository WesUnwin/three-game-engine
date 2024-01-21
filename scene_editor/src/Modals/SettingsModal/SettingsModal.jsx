import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import currentModalSlice from '../../Redux/CurrentModalSlice';
import Modal from '../Modal.jsx';
import EditorControls from './EditorControls.jsx';

const SettingsModal = () => {
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState('controls');

  const closeModal = () => {
    dispatch(currentModalSlice.actions.closeModal());
  };

  const settingsTabs = {
    controls: <EditorControls />
  };

  return (
    <Modal
      title={`Editor Settings`}
      footer={
          <>   
              <button type="submit" onClick={closeModal}>
                  Close
              </button>
          </>
      }
    >
      <div className="settings">
        <div className="settings-sidebar">
          {Object.keys(settingsTabs).map(tabName => (
            <div className={`settings-sidebar-tab ${tabName === currentTab ? 'active' : ''}`} onClick={() => setCurrentTab(tabName)}>
              {tabName}
            </div>
          ))}
        </div>
        <div className="settings-content">
          {settingsTabs[currentTab]}
        </div>
      </div>
    </Modal>
  );
}

export default SettingsModal;