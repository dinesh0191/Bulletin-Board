import React, { useState, useEffect } from "react";
import "./App.css";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
let randomColor = require("randomcolor");

function App() {
  const [item, setItem] = useState(""); // this is the value of input field. Initialize as empty string
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );

  const newitem = () => {
    if (item.trim() !== "") {
      // if input is not blank, create a new item object
      const newItem = {
        id: uuidv4(),
        item: item,
        color: randomColor({ luminosity: "light" }),
        defaultPos: { x: 100, y: 0 },
      };
      // add this new item object to the items array
      setItems((items) => [...items, newItem]);
      // reset item value to empty string
      setItem("");
    } else {
      alert("Enter something please");
      setItem("");
    }
  };

  const keyPress = (event) => {
    let code = event.keyCode || event.which;
    if (code === 13) {
      newitem();
    }
  };

  //this function is called every time we stop dragging the note. that way, we can save the final position of the note
  // to our items array in localStorage
  const updatePos = (data, index) => {
    let newArr = [...items];
    newArr[index].defaultPos = { x: data.x, y: data.y };
    setItems(newArr);
  };

  // in this function the note will be deleted from both on screen and from the items array in localStorage
  const deleteNote = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  //
  return (
    <div className="App">
      <div id="new-item">
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Enter something..."
          onKeyPress={(e) => keyPress(e)}
        />
        <button onClick={newitem}>ENTER</button>
      </div>
      {items.map((item, index) => {
        return (
          <Draggable
            key={item.id}
            defaultPosition={item.defaultPos}
            onStop={(data) => {
              updatePos(data, index);
            }}
          >
            <div style={{ backgroundColor: item.color }} className="box">
              {`${item.item}`}
              <button id="delete" onClick={() => deleteNote(item.id)}>
                X
              </button>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
}

export default App;
