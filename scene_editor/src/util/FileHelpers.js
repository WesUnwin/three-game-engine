import { reportFileError, addFileData } from "../Redux/FileDataSlice";

const readFilesRecursive = async (entry) => {
    const fileInfo = {
        kind: entry.kind,
        name: entry.name
    };

    if (entry.kind === 'file') {
        return fileInfo;
    } else if (entry.kind === 'directory') {
        let files = [];
        for await (const handle of entry.values()) {
            const fileInfo = await readFilesRecursive(handle);
            files.push(fileInfo);
        }

        fileInfo.files = files;

        return fileInfo;
    }
};

export const openProjectFolder = async (dirHandle) => {
    return await readFilesRecursive(dirHandle);
};

export const loadFile = async (dirHandle, path, dispatch, metaData) => {
    const handleFileError = (error, dispatch) => {
        const customErrorMessages = {
            'A requested file or directory could not be found at the time an operation was processed.': 'File not found'
        };

        const message = customErrorMessages[error.message] || error.message;
        dispatch(reportFileError(path, { message }));
    };

    const file = await getFileAtPath(dirHandle, path).catch(error => {
        handleFileError(error, dispatch);
        return null;
    });

    if (file) {
        const json = await readJSONFile(file).catch(error => {
            handleFileError(error, dispatch);
            return null;
        });
    
        if (json) {
            dispatch(addFileData(path, json, metaData));
        }
    }
};

export const getFileAtPath = async (dirHandle, path) => {
    let pathSegments = path.split('/');

    if (pathSegments[pathSegments.length - 1] === '/') {
        pathSegments = pathSegments.slice(0, pathSegments.length - 1);
    }

    let currentDirHandle = dirHandle;
    for (let i = 0; i<pathSegments.length; i++) {
        const currentSegment = pathSegments[i];
        if (i === (pathSegments.length - 1)) {
            const fileHandle = await currentDirHandle.getFileHandle(currentSegment);
            const file = await fileHandle.getFile();
            return file;
        } else {
            currentDirHandle = await currentDirHandle.getDirectoryHandle(currentSegment);
        }
    }
};

export const readJSONFile = async (file) => {  
    return await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = function() {
            let json = null;
            try {
                json = JSON.parse(fr.result);
            } catch(error) {
                reject(error);
            }
            resolve(json);
        };
        fr.readAsText(file);
    });
};
