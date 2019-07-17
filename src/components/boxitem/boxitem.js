import React from 'react';

import './boxitem.css'

const Boxitem = ({state, onMouseDown, onDragStart }) => {
        return (
            <div
                className="area"
                draggable={state.draggable}
                onDragStart={(e) => onDragStart(e)}
                style={
                    {
                        top: state.top + 'px',
                        left: state.left + 'px',
                        width: state.width + 'px',
                        height: state.height + 'px',
                    }
                }
            > { state.top}, { state.left}, { state.width}, { state.height}, {state.resizer}
                <div
                    className="corner left-top"
                    onMouseDown={(e) => onMouseDown(e)}
                ></div>
                <div
                    className="corner right-top"
                    onMouseDown={(e) => onMouseDown(e)}
                ></div>
                <div
                    className="corner left-bottom"
                    onMouseDown={(e) => onMouseDown(e)}
                ></div>
                <div
                    className="corner right-bottom"
                    onMouseDown={(e) => onMouseDown(e)}
                ></div>
            </div>
        );
    }

    export default Boxitem;