import React, { useEffect } from 'react';

const AddModel = ({ componentJSON, setComponentJSON, setErrors, dirHandle }) => {
  const selectModelFile = async event => {
    event.preventDefault();
    event.stopPropagation();

    let fileHandle;
    try {
      fileHandle = await window.showOpenFilePicker({
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
      });
    } catch(Error) {
      if (Error.name === 'AbortError') {
        console.debug('AddModel: user aborted picking a model file');
        return;
      } else {
        throw Error;
      }
    }

    const pathSegments = await dirHandle.resolve(fileHandle[0]);
    if (!pathSegments.length) {
        alert('The selected file must exist somewhere within the project folder');
        return;
    }
    const assetPath = pathSegments.join('/');
    setComponentJSON({ ...componentJSON, assetPath });
  };

  useEffect(() => {
    const errors = [];
    if (!componentJSON.assetPath) {
      errors.push('An model file path is required');
    }
    setErrors(errors);
  }, [componentJSON.assetPath]);

  return (
    <div className='row'>
      <label>
        Path to .gltf/.glb file:
      </label>
      &nbsp;
      <input type="text" value={componentJSON.assetPath || ''} disabled={true} />
      &nbsp;
      <button onClick={selectModelFile}>
        Select Model file
      </button>
    </div>
  );
}

export default AddModel;