import { React, useState, useEffect } from "react";

function PlayablePuzzle(props) {
  const [coords, setCoords] = useState([]);
  const [selectedArr, setSelectedArr] = useState([]);
  const [relationshipMap, setRelationshipMap] = useState([]);

  const [lastSelected, setLastSelected] = useState();
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [canBeSelected, setCanBeSelected] = useState([]);

  useEffect(() => {
    lastSelected !== undefined && relationshipMap !== undefined
      ? setCanBeSelected([...relationshipMap[lastSelected]])
      : setCanBeSelected([]);
    if (
      lastSelected !== undefined &&
      lastSelected !== selectedOrder[selectedOrder.length - 1]
    ) {
      let newList = [...selectedOrder];
      newList.push(lastSelected);
      setSelectedOrder(newList);
    }
  }, [lastSelected]);

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  let setup = () => {
    var radius = 300; // radius of the circle
    var fields = [...props.inputArray];
    var coordArray = [];
    var angle = (3 / 2 * Math.PI); // 270 degree angle to start at top
    var step = (2 * Math.PI) / fields.length;

    fields.forEach(() => {
      var x = Math.round(radius * Math.cos(angle));
      var y = Math.round(radius * Math.sin(angle));
      angle += step;
      coordArray.push([x, y]);
    });

    setCoords(coordArray);
    let newArr = coordArray.map(() => {
      return 0;
    });

    let newRelationshipMap = [];
    props.inputArray.forEach((val, index) => {
      let upStepIndex = mod(
        index + +props.inputArray[index],
        props.inputArray.length
      );
      let downStepIndex = mod(
        index - props.inputArray[index],
        props.inputArray.length
      );
      let relationShipTuple = [downStepIndex, upStepIndex];
      newRelationshipMap.push(relationShipTuple);
    });
    setRelationshipMap(newRelationshipMap);

    setSelectedArr(newArr);
    setLastSelected(undefined);
    setSelectedOrder([]);
  };

  if (coords.length > 1) {
    return (
      <div>
        <div>
          <button
            onClick={() => {
              setup();
            }}
          >
            Reset
          </button>
          {selectedOrder.includes(canBeSelected[0]) &&
          selectedOrder.includes(canBeSelected[1]) &&
          new Set(selectedArr).has(0) ? (
            <div>This is a dead end, try again</div>
          ) : (
            <div>
              <div>{"Selected Order" + JSON.stringify(selectedOrder)}</div>
            </div>
          )}
        </div>
        {coords.map((pos, tileIndex) => {
          return (
            <div
              style={{
                position: "absolute",
                marginLeft: 500 + pos[0],
                marginTop: 300 + pos[1],
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    lastSelected !== undefined && lastSelected === tileIndex
                      ? "2px solid blue"
                      : selectedArr[tileIndex] === 1
                      ? "2px solid red"
                      : (canBeSelected[0] !== undefined &&
                          canBeSelected[0] === tileIndex) ||
                        (canBeSelected[1] !== undefined &&
                          canBeSelected[1] === tileIndex)
                      ? "2px solid yellow"
                      : "2px solid black",
                  fontSize: 35,
                }}
                onClick={() => {
                  if (
                    !selectedArr[tileIndex] &&
                    (canBeSelected.length === 0 ||
                      (canBeSelected[0] !== undefined &&
                        canBeSelected[0] === tileIndex) ||
                      (canBeSelected[1] !== undefined &&
                        canBeSelected[1] === tileIndex))
                  ) {
                    setLastSelected(tileIndex);
                    let newArr = [...selectedArr];
                    newArr[tileIndex] = 1;
                    setSelectedArr(newArr);
                  } else {
                  }
                }}
              >
                {props.inputArray[tileIndex]
                  ? props.inputArray[tileIndex]
                  : "EROROR"}
              </div>
            </div>
          );
        })}
        <div
          className="App-logo"
          style={{
            position: "absolute",
            marginLeft: 500 - 200,
            marginTop: 300,
            fontSize: 50,
            color: "red",
          }}
        >
          {new Set(selectedArr).has(0) ? "" : "CONGRATULATIONS"}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <button
            onClick={() => {
              setup();
            }}
          >
            Seetup
          </button>
        </div>
        asd
      </div>
    );
  }
}

export default PlayablePuzzle;
