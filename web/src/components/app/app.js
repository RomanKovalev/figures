import React, { useState } from 'react';
import Boxitem from "../boxitem";

import './app.css'
import { useEffect} from "react";
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';

const GET_FIGURES = gql`
  query GetFigures {
    figures {
      id
      top
      left
      width
      height
      offsetx
      offsety
      draggable
    }
  }
`;

const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'}
const App = () => {
  const apiBase = 'http://127.0.0.1:8003/api/';
  const [items, setItems] = useState([])
  const [resizer, setResizer] = useState(null)
  const { loading, error, data } = useQuery(GET_FIGURES);

  useEffect(() => {
    console.log(loading, error, data)
    if (!loading && !error && data) {
      console.log(loading, error, data)
      setItems(data.figures)
    }
  }, [loading, error, data]);


  const getFigures = () => {
    const url = `${apiBase}list`;
    return fetch(url, {
      method: 'GET',
    })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      console.log('data')
      return data
    })
    .catch((error) => {
      console.error('Error getting figures list figure:', error);
    });
  }

  const postFigure = (body) => {
    const url = `${apiBase}list`;
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      getFigures().then((figures) => {setItems(figures)})
    })
    .catch((error) => {
      console.error('Error posting figure:', error);
    });
  }

  const delFigures = () => {
    const url = `${apiBase}list`;
    fetch(url, {
      method: 'DELETE',
      headers: headers,
    })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      getFigures().then((figures) => {setItems(figures)})
    })
    .catch((error) => {
      console.error('Error posting figure:', error);
    });
  }

  const updateFigure = (body, id) => {
    const url = `${apiBase}update/${id}/`;
    fetch(url, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(body)
    })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      getFigures().then((figures) => {setItems(figures)})
    })
    .catch((error) => {
      console.error('Error posting figure:', error);
    });
  }

  const onDrop = (ev) => {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("id")
    const figure = items.filter(obj => {
      // eslint-disable-next-line
      return obj.id == id
    })

    if (!!figure[0]) {
      let width, height, top, left
      width = figure[0].width
      height = figure[0].height
      if (resizer === 'corner left-top') {
        width = figure[0].width - (ev.clientX - figure[0].left)
        height = figure[0].height - (ev.clientY - figure[0].top)
        left = ev.clientX
        top = ev.clientY
      } else if (resizer === 'corner right-top') {
        width = figure[0].width - (figure[0].offsetx - ev.clientX)
        top = ev.clientY
        height = figure[0].height - (ev.clientY - figure[0].top)
        left = figure[0].left
      } else if (resizer === 'corner left-bottom') {
        width = figure[0].width - (ev.clientX - figure[0].left)
        left = ev.clientX
        height = figure[0].height - (figure[0].offsety - ev.clientY)
        top = figure[0].top
      } else if (resizer === 'corner right-bottom') {
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
      updateFigure(body, id)
      getFigures().then((figures) => {
        setItems(figures)
      })
      setResizer({ 'resizer': null })
      return false;
    }
  }

  const onDragOver = (ev) => {
    ev.preventDefault();
  }

  const onMouseUp = (ev) => {
    ev.preventDefault()
  }

  const onDragStart = (ev, id) => {
    let style = window.getComputedStyle(ev.target, null);
    ev.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY));
    ev.dataTransfer.setDragImage(ev.target, window.outerWidth, window.outerHeight)
    ev.dataTransfer.setData('id', id)
  }

  const onMouseDown = (ev, id) => {
    const offsetx = ev.clientX
    const offsety = ev.clientY
    setResizer(ev.target.className)
    const body = {
      "offsetx": offsetx,
      "offsety": offsety,
    }
    updateFigure(body, id)
    return false;
  }

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const addFigure = () => {
    const newFigure = {
      left: getRandomInt(10, 900),
      top: getRandomInt(10, 900),
      width: getRandomInt(40, 300),
      height: getRandomInt(40, 300),
      draggable: true,
      offsetx: 0,
      offsety: 0,
    }
    postFigure(newFigure);
    getFigures().then((figures) => {
      setItems(figures)
    })
  };

  const listItems = items.map((p) =>
    <Boxitem
        state={p}
        key={p.id}
        onDragStart={onDragStart}
        onMouseDown={onMouseDown}
      />
    );
    return (
        <div>
          <div className="container-drag">

            <div className="wrapper"
              onDragOver={(e) => onDragOver(e)}
              onDrop={(e) => onDrop(e)}
              onMouseUp={(e) => onMouseUp(e)}
            >
              <div className="bnt-wrapper">
                <button
                  onClick={addFigure}
                >
                  Add +
                </button><br />
                <button
                  onClick={delFigures}
                >
                  Clear all
                </button>
              </div>
              {listItems}
            </div>
          </div>
        </div>
    );
}

export default App;