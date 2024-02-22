import React, { useEffect, useState } from 'react';
import TableOfContents from './TableOfContents.jsx';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate, useParams } from 'react-router-dom';

const docsFolder = `https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/`;

const toc = [
  { label: 'Getting started', key: 'getting_started' },
  { label: 'The Scene Editor', key: 'scene_editor' },
  { label: 'Project Files', key: 'project_files' },
  { label: 'Input Manager', key: 'input', children: [
      { label: 'Mouse Handler', key: 'mouse_handler' },
      { label: 'Keyboard Handler', key: 'keyboard_handler' },
      { label: 'Gamepad Handler', key: 'gamepad_handler' },
    ]
  },
  { label: 'Game API', key: 'game_api' },
  { label: 'game.json', key: 'game_json' },
  { label: 'Scenes', key: 'scenes', children: [
      { label: 'Scene API', key: 'scene_api' },
      { label: 'Scene JSON files', key: 'scene_json' },
      { label: 'Scene Fog', key: 'scene_fog' },
      { label: 'Scene sounds', key: 'scene_sounds' }
    ]
  },
  { label: 'GameObjects', key: 'game_objects', children: [
      { label: 'GameObject Scripts', key: 'game_object_scripts'},
      { label: 'GameObject API', key: 'game_object_api'},
      { label: 'GameObject Models', key: 'game_object_models'},
      { label: 'GameObject Lights', key: 'game_object_lights'},
      { label: 'GameObject Physics', key: 'game_object_physics'},
      { label: 'GameObject Sounds', key: 'game_object_sounds'},
      { label: 'GameObject User Interfaces', key: 'game_object_user_interfaces'},
      { label: 'GameObject JSON', key: 'game_object_json'},
      { label: 'GameObject Types', key: 'game_object_types', children: [
          { label: 'GameObject Type JSON Files', key: 'gameobject_type_json' }
        ]
      }
    ]
  },
  { label: 'VR/AR Support', key: 'vr_ar_support' },
];

const findEntry = (tocChildren, entryKey) => {
  const entry = tocChildren.find(e => e.key === entryKey);
  if (entry) {
    return entry;
  } else {
    for (let c = 0; c < tocChildren.length; c++) {
      const childEntry = tocChildren[c];
      const target = findEntry(childEntry.children || [], entryKey);
      if (target) {
        return target;
      }
    }
    return null;
  }
}

const Docs = () => {
  const routeParams = useParams();
  const navigate = useNavigate();
  console.log('==> routeParams: ', routeParams)
  const [selectedEntry, setSelectedEntry] = useState(routeParams.key ? findEntry(toc, routeParams.key) : toc[0]);
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedEntry && (routeParams.key !== selectedEntry?.key)) {
      // Update url to match selected entry
      navigate(`/docs/${selectedEntry.key}`)
    }
  }, [selectedEntry?.key])

  useEffect(() => {
    setError(null)
    if (!selectedEntry) {
      setFileData(null);
    } else if (selectedEntry.key) {
      setLoading(true);
      setFileData(null);
      const mdFileURL = `${docsFolder}${selectedEntry.key}.md`
      window.fetch(mdFileURL)
            .then(response => response.text())
            .then(text => setFileData(text))
            .catch(error => setError(error))
            .then(() => setLoading(false));
    } else {
      setError(new Error('No .md file for topic: ' + selectedEntry.key));
      setFileData(null);
    }
  }, [selectedEntry?.key]);

  return (
    <div className="docs">
      <div className="sidebar">
        <TableOfContents
          toc={toc}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
        />
      </div>
      <div className="main-area">
        {error ? (
          <p className="error-message">ERROR: {error.message}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : fileData ? (
          <div className="markdown">
            <Markdown remarkPlugins={[remarkGfm]}>
              {fileData}
            </Markdown>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Docs;