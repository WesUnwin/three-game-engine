import React from 'react'

const ExamplesSidebar = ({ examples, currentExample, setCurrentExample }) => {
  return (
    <div className="examples-sidebar">
      {examples.map(example => (
        <div
          key={example.name}
          className={`examples-sidebar__example ${currentExample?.name === example.name ? 'active' : ''}`}
          onClick={() => setCurrentExample(example)}
        >
          <img src={example.thumbnail} />
          <p className='examples-sidebar__example-label'>
            {example.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ExamplesSidebar