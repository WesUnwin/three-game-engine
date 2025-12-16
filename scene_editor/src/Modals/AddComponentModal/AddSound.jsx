import React, { useEffect, useState } from 'react';

const AddSoundModal = ({ componentJSON, setComponentJSON, setErrors, dirHandle  }) => {
  const [name, setName] = useState('');
  const [assetPath, setAssetPath] = useState('');

  useEffect(() => {
    setComponentJSON({
      type: 'sound',
      name,
      assetPath
    })
  }, [name, assetPath])

  const selectSoundFile = async event => {
    event.preventDefault();
    event.stopPropagation();

    const fileHandle = await window.showOpenFilePicker({
        multiple: false,
        types: [
            {
                description: 'Sound File',
                accept: {
                    "audio/x-wav": ['.wav'],
                    "audio/mpeg": ['.mp3'],
                    "application/ogg": ['.ogg'],
                    "audio/x-aiff": ['.aifc'],
                    "audio/x-aiff": ['.aiff'],
                }
            }
        ]
    })

    const path = await dirHandle.resolve(fileHandle[0]);
    if (path === null) {
        alert('The selected file must exist somewhere within the project folder');
        return;
    }
    setAssetPath(path.join('/'));
  };

  return (
    <>
      <div className='row'>
        <label>
          Name:
        </label>
        &nbsp;
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <br />
      <div className='row'>
        <label>
          Path to sound file:
        </label>
        &nbsp;
        <input type="text" value={assetPath} disabled={true} />
        &nbsp;
        <button onClick={selectSoundFile}>
          Select sound file
        </button>
      </div>
    </>
  );
}

export default AddSoundModal;