import * as FileHelpers from './FileHelpers';

import gameJSON from '../../NewProjectFiles/game.json';
import sceneJSON from '../../NewProjectFiles/scenes/scene1.json';
import platformJSON from '../../NewProjectFiles/game-object-types/environment/platform.json';
import platformGLTF from '../../NewProjectFiles/models/environment/platform.json';

const newProjectFiles = [
  { fileName: 'game.json', data: gameJSON },
  { fileName: 'scenes/scene1.json', data: sceneJSON },
  { fileName: 'game-object-types/environment/platform.json', data: platformJSON },
  { fileName: 'models/environment/platform.gltf', data: platformGLTF },
];

/**
 * Copies all files recursively in scene_editor/NewProjectFiles to a folder
 * of your choosing, as part of the functionality of creating a new project/game.
 */
const copyNewProjectFiles = async (destinationDirHandle) => {
  for (let newProjectFile of newProjectFiles) {
    const prettyPrintedJSON = JSON.stringify(newProjectFile.data, null, 4);
    await FileHelpers.writeFile(destinationDirHandle, newProjectFile.fileName, prettyPrintedJSON, true);
  }
};

export default copyNewProjectFiles;