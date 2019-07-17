import React, { Component } from 'react';
import Boxitem from "../boxitem";

import './app.css'


export default class App extends Component {

  state = {
    items: [
      {
        id: 1,
        left: 40,
        top: 20,
        width: 100,
        height: 200,
        draggable: true,
        offsetx: 0,
        offsety: 0,
      },
      {
        id: 2,
        left: 140,
        top: 120,
        width: 200,
        height: 50,
        draggable: true,
        offsetx: 0,
        offsety: 0,
      },
      {
        id: 3,
        left: 400,
        top: 20,
        width: 100,
        height: 200,
        draggable: true,
        offsetx: 0,
        offsety: 0,
      },            
      {
        id: 4,
        left: 190,
        top: 180,
        width: 90,
        height: 100,
        draggable: true,
        offsetx: 0,
        offsety: 0,
      },
    ],
    resizer: null
  }

  onDrop = (ev) => {
    console.log('onDrop')
    ev.preventDefault();
    const id = ev.dataTransfer.getData("id") - 1
    console.log(this.state.items[id])

    let width, height, top, left
    width = this.state.items[id].width
    height = this.state.items[id].height
    if (this.state.resizer === 'corner left-top') {
      width = this.state.items[id].width - (ev.clientX - this.state.items[id].offsetx)
      height = this.state.items[id].height - (ev.clientY - this.state.items[id].offsety)
      left = ev.clientX
      top = ev.clientY
    } else if (this.state.resizer === 'corner right-top') {
      width = this.state.items[id].width - (this.state.items[id].offsetx - ev.clientX)
      top = ev.clientY
      height = this.state.items[id].height - (ev.clientY - this.state.items[id].offsety)
      left = this.state.items[id].left
    } else if (this.state.resizer === 'corner left-bottom') {
      width = this.state.items[id].width - (ev.clientX - this.state.items[id].offsetx)
      left = ev.clientX
      height = this.state.items[id].height - (this.state.items[id].offsety - ev.clientY)
      top = this.state.items[id].top
    } else if (this.state.resizer === 'corner right-bottom') {
      width = this.state.items[id].width - (this.state.items[id].offsetx - ev.clientX)
      height = this.state.items[id].height - (this.state.items[id].offsety - ev.clientY)
      top = this.state.items[id].top
      left = this.state.items[id].left
    } else {
      const offset = ev.dataTransfer.getData("text/plain").split(',')
      /** todo make pretty **/
      left = ev.clientX + parseInt(offset[0], 10)
      top = ev.clientY + parseInt(offset[1], 10)
    }

    this.setState(state => {
      state.items.map((item, j) => {
        if (j === id) {
          item.left = left
          item.top = top
          item.width = width
          item.height = height
          return item
        } else {
          return item;
        }
      });
    });
    this.setState({ 'resizer': null }) 
    return false;
  }

  onDragOver = (ev) => {
    console.log('onDragOver')

    ev.preventDefault();
  }

  onMouseUp = (ev) => {
    console.log('onMouseUp')

    ev.preventDefault()
  }

  onDragStart = (ev, id) => {
    console.log('onDragStart')
    let style = window.getComputedStyle(ev.target, null);
    console.log((parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY))
    ev.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY));
    ev.dataTransfer.setDragImage(ev.target, window.outerWidth, window.outerHeight)
    ev.dataTransfer.setData('id', id)
  }

  onMouseDown = (ev, id) => {
    console.log('onMouseDown')
    const offsetx = ev.clientX
    const offsety = ev.clientY
    this.setState({'resizer': ev.target.className})
    id--
    this.setState(state => {
      state.items.map((item, j) => {
        if (j === id) {
          item.offsetx = offsetx
          item.offsety = offsety
          item.draggable = true
          return item
        } else {
          return item;
        }
      });
    });
    return false;
  }

  render() {
    const listItems = this.state.items.map((p) =>
      <Boxitem
        state={p}
        key={p.id}
        onDragStart={this.onDragStart}
        onMouseDown={this.onMouseDown}
      />

    );
    return (
      <div>
        <button>Add +</button>
        <button>Clear all</button>
        <div className="container-drag">
          <div className="wrapper"
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e)}
            onMouseUp={(e) => this.onMouseUp(e)}
          >
            {listItems}
          </div>
        </div>
      </div>
    );
  };
}

