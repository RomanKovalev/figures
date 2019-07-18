import React, { Component } from 'react';
import Boxitem from "../boxitem";

import FetchService from "../../services/fetch-service";
import './app.css'

export default class App extends Component {

  constructor() {
    super();
    this.getFigures();
  }

  fetchService = new FetchService();

  state = {
    items: [],
    resizer: null

  }

  getFigures() {
    this.fetchService
      .getFigures()
      .then((figures) => {
        this.setState({ 'items': figures })
      })
  };

  postFigure(body) {
    this.fetchService
      .postFigure(body)
      .then((answer) => {
        this.getFigures()
      })
  }

  delFigures() {
    this.fetchService
    .delFigures()
    .then((answer) => {
      this.getFigures()
    })
  }

  updateFigure(body, id) {
    this.fetchService
    .updateFigure(body, id)
    .then((answer) => {
      this.getFigures()
    })
  }  
  
  onDrop = (ev) => {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("id")
    const figure = this.state.items.filter(obj => {
      return obj.id == id
    })
    if (!!figure[0]) {
      let width, height, top, left
      width = figure[0].width
      height = figure[0].height
      if (this.state.resizer === 'corner left-top') {
        width = figure[0].width - (ev.clientX - figure[0].offsetx)
        height = figure[0].height - (ev.clientY - figure[0].offsety)
        left = ev.clientX
        top = ev.clientY
      } else if (this.state.resizer === 'corner right-top') {
        width = figure[0].width - (figure[0].offsetx - ev.clientX)
        top = ev.clientY
        height = figure[0].height - (ev.clientY - figure[0].offsety)
        left = figure[0].left
      } else if (this.state.resizer === 'corner left-bottom') {
        width = figure[0].width - (ev.clientX - figure[0].offsetx)
        left = ev.clientX
        height = figure[0].height - (figure[0].offsety - ev.clientY)
        top = figure[0].top
      } else if (this.state.resizer === 'corner right-bottom') {
        width = figure[0].width - (figure[0].offsetx - ev.clientX)
        height = figure[0].height - (figure[0].offsety - ev.clientY)
        top = figure[0].top
        left = figure[0].left
      } else {
        const offset = ev.dataTransfer.getData("text/plain").split(',')
        left = ev.clientX + parseInt(offset[0], 10)
        top = ev.clientY + parseInt(offset[1], 10)
      }
      const body = {
        "left": left,
        "top": top,
        "width": width,
        "height": height
      }
      this.updateFigure(body, id)
      this.getFigures()
      this.setState({ 'resizer': null })
      return false;
    }
  }

  onDragOver = (ev) => {
    ev.preventDefault();
  }

  onMouseUp = (ev) => {
    ev.preventDefault()
  }

  onDragStart = (ev, id) => {
    let style = window.getComputedStyle(ev.target, null);
    ev.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY));
    ev.dataTransfer.setDragImage(ev.target, window.outerWidth, window.outerHeight)
    ev.dataTransfer.setData('id', id)
  }

  onMouseDown = (ev, id) => {
    const offsetx = ev.clientX
    const offsety = ev.clientY
    this.setState({ 'resizer': ev.target.className })
    this.setState(state => {
      state.items.map((item, j) => {
        if (item.id == id) {
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

  delAll = () => {
    this.delFigures()
  };

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  addFigure = () => {
    const newFigure = {
      left: this.getRandomInt(10, 900),
      top: this.getRandomInt(10, 900),
      width: this.getRandomInt(40, 300),
      height: this.getRandomInt(40, 300),
      draggable: true,
      offsetx: 0,
      offsety: 0,
    }
    this.postFigure(newFigure);
    this.getFigures();
  };

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
        <div className="container-drag">

          <div className="wrapper"
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e)}
            onMouseUp={(e) => this.onMouseUp(e)}
          >
            <div className="bnt-wrapper">
              <button
                onClick={this.addFigure}
              >
                Add +
              </button><br />
              <button
                onClick={this.delAll}
              >
                Clear all
              </button>
            </div>
            {listItems}
          </div>
        </div>
      </div>
    );
  };
}

