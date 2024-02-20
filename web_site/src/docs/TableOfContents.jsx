import React from 'react';

const TableOfContents = ({ toc, selectedEntry, setSelectedEntry }) => {
  const renderEntry = entry => {
    const onClick = e => {
      e.stopPropagation();
      setSelectedEntry(entry);
    };

    return (
      <li onClick={onClick}>
        <span className={selectedEntry?.key === entry.key ? 'selected' : ''}>
          {entry.label}
        </span>

        {entry.children ? (
          <ul>
            {entry.children.map(childEntry => renderEntry(childEntry))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <div className='table-of-contents'>
      <ul>
        {toc.map(entry => renderEntry(entry))}
      </ul>
    </div>
  );
};

export default TableOfContents;