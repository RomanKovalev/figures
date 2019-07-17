import React, { Component } from 'react';
import Boxitem from "../boxitem";

import FetchService from "../../services/fetch-service";
import './app.css'


export default class App extends Component {

  constructor() {
    super();
    this.updateFigures();
  }

  fetchService = new FetchService();

  updateFigures() {
    this.fetchService
      .getFigures()
      .then((figures) => {
        // console.log(figures)
        // console.log(this.state.items)
        this.setState({ 'items': figures })
      })
  };

  maxId = 100

  state = {
    items: [],
    resizer: null

  }

  // state = {
  //   items: [
  //     {
  //       id: 1,
  //       left: 40,
  //       top: 20,
  //       width: 100,
  //       height: 200,
  //       draggable: true,
  //       offsetx: 0,
  //       offsety: 0,
  //     },
  //     {
  //       id: 2,
  //       left: 140,
  //       top: 120,
  //       width: 200,
  //       height: 50,
  //       draggable: true,
  //       offsetx: 0,
  //       offsety: 0,
  //     },
  //     {
  //       id: 3,
  //       left: 400,
  //       top: 20,
  //       width: 100,
  //       height: 200,
  //       draggable: true,
  //       offsetx: 0,
  //       offsety: 0,
  //     },
  //     {
  //       id: 4,
  //       left: 190,
  //       top: 180,
  //       width: 90,
  //       height: 100,
  //       draggable: true,
  //       offsetx: 0,
  //       offsety: 0,
  //     },
  //   ],
  //   resizer: null
  // }



  onDrop = (ev) => {
    console.log('onDrop')
    ev.preventDefault();
    const id = ev.dataTransfer.getData("id")
    const figure = this.state.items.filter(obj => {
      return obj.id == id
    })
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
      /** todo make pretty **/
      left = ev.clientX + parseInt(offset[0], 10)
      top = ev.clientY + parseInt(offset[1], 10)
    }

    this.setState(state => {
      state.items.map((item, j) => {
        if (item.id == id) {
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
    this.setState({ items: [] })
  };

  getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  addFigure = () => {

    const newFigure = {
      id: this.maxId++,
      left: this.getRandomInt(10, 900),
      top: this.getRandomInt(10, 900),
      width: this.getRandomInt(30, 300),
      height: this.getRandomInt(30, 300),
      draggable: true,
      offsetx: 0,
      offsety: 0,
    }

    this.setState(({ items }) => {
      console.log(items)
      const newArr = [
        ...items,
        newFigure
      ];
      console.log(this.state.items)

      return {
        items: newArr
      }
    })
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

