import React from 'react';

const TableOfContents = ({ toc, selectedEntry, setSelectedEntry }) => {
  const renderEntry = entry => {
    const onClick = e => {
      e.stopPropagation();
      setSelectedEntry(entry);
    };

    return (
      <div className="toc-entry" onClick={onClick}>
        <div className={`toc-entry-label ${selectedEntry?.key === entry.key ? 'selected' : ''}`}>
          {entry.label}
        </div>

        {entry.children ? (
          <div className="toc-entry-children">
            {entry.children.map(childEntry => renderEntry(childEntry))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className='toc'>
      {toc.map(entry => renderEntry(entry))}
    </div>
  );
};

export default TableOfContents;