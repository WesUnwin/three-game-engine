import React, { useEffect } from 'react';

const AddModel = ({ componentJSON, setComponentJSON, setIsValid, dirHandle }) => {

  useEffect(() => {
    setIsValid(!!componentJSON.assetPath);
  }, [JSON.stringify(componentJSON)]);

  const selectModelFile = async event => {
    event.preventDefault();
    event.stopPropagation();

    const fileHandle = await window.showOpenFilePicker({
        multiple: false,
        types: [
            {
                description: 'GLTF/GLB Model File',
                accept: {
                    "model/gltf+json": ['.gltf'],
                    "model/gltf-binary": ['.glb']
                }
            }
        ]
    })

    const path = await dirHandle.resolve(fileHandle[0]);
    if (path === null) {
        alert('The selected file must exist somewhere within the project folder');
        return;
    }

    setComponentJSON({
      ...componentJSON,
      assetPath: path.join('/')
    });
  };

  return (
    <div className='row'>
      <label>
        Path to .gltf/.glb file:
      </label>
      &nbsp;
      <input type="text" value={componentJSON.assetPath} disabled={true} />
      &nbsp;
      <button onClick={selectModelFile}>
          Select Model file
      </button>
    </div>
  );
};

export default AddModel;