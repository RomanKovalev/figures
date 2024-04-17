import React, { useState } from 'react';
import Boxitem from "../boxitem";

import './app.css'
import { useEffect} from "react";
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_FIGURES, ADD_FIGURE, UPDATE_FIGURE, DELETE_ALL_FIGURES, FIGURES_SUBSCRIPTION } from '../../queries'

const App = () => {
  const [items, setItems] = useState([])
  const [resizer, setResizer] = useState(null)
  const { loading, error, data, refetch } = useQuery(GET_FIGURES);
  const [addFigureQL] = useMutation(ADD_FIGURE);
  const [updateFigureQL] = useMutation(UPDATE_FIGURE);
  const [delFiguresQL] = useMutation(DELETE_ALL_FIGURES);
  const { dataWs, loadingWs } = useSubscription(FIGURES_SUBSCRIPTION, {
    onError: (data) => {
      console.log("onError: ", data)
    },
    onSubscriptionData: (data) => {
      const action = data.subscriptionData.data.newFigureNotification.action
      let new_items = []
      switch (action) {
        case 'add':
          new_items = [...items, data.subscriptionData.data.newFigureNotification.figure]
          setItems(new_items)
          break
        case 'delete':
          setItems([])
          break
        case 'update':
          const figure = data.subscriptionData.data.newFigureNotification.figure
          new_items = items.map(item => {
                if (item.id === figure.id) {
                    return { ...item, ...figure };
                } else {
                    return item;
                }
            });
          console.log("items", items)
          console.log("new_items", new_items)
          setItems(new_items)
          break
        default:
          console.log(`Sorry, we are out of items array.`);
          break
      }
    },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setItems(data.figures)
    }
  }, [loading, error, data]);

  const postFigure = (newFigure) => {
    addFigureQL({
      variables: { ...newFigure, "wsid": "figures" }
    })
      .then(({ data }) => {
        refetch()
          .then((result) => {
            setItems(result.data.figures);
          })
          .catch((error) => {
            console.error('Error refetching data:', error);
        });
      })
      .catch((error) => {
        console.error('Error while adding new figure:', error);
      });
  }

  const delFigures = () => {
    delFiguresQL().then(
       ({ data }) => {
        refetch()
          .then((result) => {
            setItems(result.data.figures);
          })
          .catch((error) => {
            console.error('Error refetching data:', error);
        });
      })
      .catch((error) => {
        console.error('Error while adding new figure:', error);
    });
  }

  const updateFigure = (newFigure, pk) => {
    updateFigureQL({
      variables: { ...newFigure, pk: +pk, "wsid": "figures" }
    })
    .then(({ data }) => {
      refetch()
        .then((result) => {
          setItems(result.data.figures);
        })
        .catch((error) => {
          console.error('Error refetching data:', error);
      });
    })
    .catch((error) => {
      console.error('Error while editing existing figure:', error);
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
      refetch()
      .then((result) => {
        setItems(result.data.figures);
      })
      .catch((error) => {
        console.error('Error refetching data:', error);
      });
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
    refetch()
    .then((result) => {
      setItems(result.data.figures);
    })
    .catch((error) => {
      console.error('Error refetching data:', error);
    });
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