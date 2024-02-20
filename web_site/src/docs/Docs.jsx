import React, { useEffect, useState } from 'react';
import TableOfContents from './TableOfContents.jsx';
import Markdown from 'react-markdown';

const docsFolder = `https://raw.githubusercontent.com/WesUnwin/three-game-engine/main/docs/`;

const toc = [
  { label: 'Getting started', key: 'getting_started' },
  { label: 'Assets', key: 'assets' },
  { label: 'Input', key: 'input' },
  { label: 'game.json', key: 'game_json', path: 'game_json.md' },
  { label: 'Scenes', key: 'scenes', children: [
      { label: 'About scenes', key: 'about_scenes' },
      { label: 'Scene JSON files', key: 'scene_json' },
      { label: 'Scene sounds', key: 'scene_sounds' }
    ]
  },
  { label: 'GameObjects', key: 'game_objects', children: [
      { label: 'About GameObjects', key: 'about_game_objects'},
      { label: 'GameObject JSON', key: 'game_object_json'},
      { label: 'GameObject Types', key: 'game_object_types', children: [
          { label: 'GameObject Type JSON Files', key: 'gameobject_type_json' }
        ]
      }
    ]
  }  
];

const Docs = () => {
  const [selectedEntry, setSelectedEntry] = useState(toc[0]);
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null)
    if (!selectedEntry) {
      setFileData(null);
    } else if (selectedEntry.path) {
      setLoading(true);
      setFileData(null);
      window.fetch(`${docsFolder}${selectedEntry.path}`)
            .then(response => response.text())
            .then(text => setFileData(text))
            .catch(error => setError(error))
            .then(() => setLoading(false));
    } else {
      setError(new Error('No MD file for topic: ' + selectedEntry.key));
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
          <p>ERROR: {error.message}</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : fileData ? (
          <Markdown>{fileData}</Markdown>
        ) : null}
      </div>
    </div>
  );
};

export default Docs;