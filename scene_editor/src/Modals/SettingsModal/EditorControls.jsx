import React from "react";

const EditorControls = () => {
  return (
    <table className="editor-controls-table">
      <tr>
        <td width="20%" style={{ padding: '10px' }}>
          <span className="editor-controls-key">
            Left click
          </span>
        </td>
        <td>
          Select a game object in the main area
        </td>
      </tr>

      <tr>
        <td width="20%" style={{ padding: '10px' }}>
          <span className="editor-controls-key">
            R
          </span>
        </td>
        <td>
          Switch to <strong>rotating</strong> the selected game object
        </td>
      </tr>

      <tr>
        <td width="20%" style={{ padding: '10px' }}>
          <span className="editor-controls-key">
            S
          </span>
        </td>
        <td>
          Switch to <strong>scaling</strong> the selected game object
        </td>
      </tr>
  
      <tr>
        <td width="20%" style={{ padding: '10px' }}>
          <span className="editor-controls-key">
            T
          </span>
        </td>
        <td>
          Switch to <strong>translating</strong> the selected game object
        </td>
      </tr>

      <tr>
        <td width="40%" style={{ padding: '10px' }}>
          <span className="editor-controls-key">
            Mouse Wheel
          </span>
        </td>
        <td>
          Zoom in/out
        </td>
      </tr>
  
      <tr>
        <td width="40%" style={{ padding: '10px' }}>
          <span className="editor-controls-key">
            Left Click
          </span>
          +
          Drag
        </td>
        <td>
          Rotate camera in main area
        </td>
      </tr>

      <tr>
        <td width="40%" style={{ padding: '10px' }}>
          <span className="editor-controls-key">
            Right Click
          </span>
          +
          Drag
        </td>
        <td>
          Pan camera in main area
        </td>
      </tr>
    </table>
  )
}

export default EditorControls;