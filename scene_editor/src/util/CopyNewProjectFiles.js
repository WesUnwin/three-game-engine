import * as FileHelpers from './FileHelpers';

import gameJSON from '../../NewProjectFiles/game.json';

const newProjectFiles = [
  { fileName: 'game.json', data: JSON.stringify(gameJSON, null, 4) }
];

/**
 * Copies all files recursively in scene_editor/NewProjectFiles to a folder
 * of your choosing, as part of the functionality of creating a new project/game.
 */
const copyNewProjectFiles = async (destinationDirHandle) => {
  for (let newProjectFile of newProjectFiles) {
    await FileHelpers.writeFile(destinationDirHandle, newProjectFile.fileName, newProjectFile.data, true);
  }
};

export default copyNewProjectFiles;