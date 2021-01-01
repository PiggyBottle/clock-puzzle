import { React, useState, useEffect } from "react";
import "./App.css";
import PlayablePuzzle from "./PlayablePuzzle.js";

function App() {
  const [userInput, setUserInput] = useState("");
  const [inputArray, setInputArray] = useState([]);
  const [sizeOfPuzzle, setSizeOfPuzzle] = useState(0);

  const [outputArray, setOutputArray] = useState([]);

  useEffect(() => {
    setInputArray(userInput.split(","));
  }, [userInput]);

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  let checkPath = (chosenIndex, chosenArr, pathArr, solutionArr) => {
    pathArr.push(chosenIndex);
    chosenArr[chosenIndex] = 1;

    if (pathArr.length === inputArray.length) {
      solutionArr.push(pathArr);
    }

    let upStepIndex = mod(
      chosenIndex + +inputArray[chosenIndex],
      inputArray.length
    );
    let downStepIndex = mod(
      chosenIndex - inputArray[chosenIndex],
      inputArray.length
    );

    if (chosenArr[upStepIndex] === 0) {
      let newChosenArr = [...chosenArr];
      newChosenArr[upStepIndex] = 1;
      checkPath(upStepIndex, newChosenArr, [...pathArr], solutionArr);
    }

    if (upStepIndex !== downStepIndex && chosenArr[downStepIndex] === 0) {
      let newChosenArr = [...chosenArr];
      newChosenArr[downStepIndex] = 1;
      checkPath(downStepIndex, newChosenArr, [...pathArr], solutionArr);
    }
  };

  const createPuzzle = () => {
    // create random array
    let randArr = [];
    for (let i = 0; i < sizeOfPuzzle; i++) {
      randArr.push({idx: i, rank: Math.random()});
    }
    // sort it
    randArr.sort((r1, r2) => r1.rank - r2.rank);
    randArr = randArr.map((v) => v.idx);
    console.log(randArr);

    const values = [];
    const puzzle = Array(12);
    for (let i = 1; i < sizeOfPuzzle; i++) {
      let value = Math.abs(randArr[i] - randArr[i-1]);
      value = value > sizeOfPuzzle/2 ? sizeOfPuzzle-value: value;
      values.push(value);
      puzzle[randArr[i-1]] = value;
    }
    values.push(Math.floor(Math.random() * Math.floor(sizeOfPuzzle/2)) + 1);
    puzzle[randArr[11]] = values[11];
    console.log(puzzle);
    setUserInput(puzzle.toString());
  }

  let solvePuzzle = () => {
    let blankArr = inputArray.map(() => {
      return 0;
    });
    let solutionArr = [];
    inputArray.forEach((element, index) => {
      checkPath(+index, [...blankArr], [], solutionArr);
    });
    solutionArr = solutionArr.filter((currArr, currArrIndex) => {
      // next arr exists
      let unique = false;
      if (currArrIndex < solutionArr.length - 1) {
        currArr.forEach((currElement, currPosition) => {
          if (currElement === solutionArr[currArrIndex + 1][currPosition]) {
            // same as prev so cannot determine if unique
          } else {
            // at least one value is diff
            unique = true;
          }
        });
      } else {
        unique = true;
      }
      return unique;
    });

    console.log(solutionArr);

    setOutputArray(solutionArr);
  };

  return (
    <div className="App">
      <div>
        <input
          value = {userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            setInputArray(userInput.split(","));
            setOutputArray([]);
            solvePuzzle();
          }}
        >
          Run
        </button>
      </div>
      <div>
        <input
          onChange={(e) => {
            setSizeOfPuzzle(e.target.value);
          }}
        ></input>
        <button
          onClick={() => createPuzzle()}
        >
          Generate
        </button>
      </div>
      <div>Sample puzzle 1: 5,3,1,3,5,2,4,5,1,6,2,2</div>
      <div>
        Sample puzzle: 11, 5, 1, 7, 11, 12, 8, 5, 8, 7, 15, 8, 3, 9, 9, 14, 9,
        12, 16, 3, 14, 5, 4, 3, 3, 12, 4, 13, 14, 2, 6, 16
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginRight: 50 }}>
          {"Puzzle tiles: (" + inputArray.length + ")"}
        </div>
        {inputArray.map((element, index) => {
          if (index < inputArray.length - 1) {
            return <div>{element + " , "}</div>;
          } else {
            return <div>{element}</div>;
          }
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {outputArray ? (
          outputArray.map((solution, solutionNum) => {
            return (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ marginRight: 50 }}>
                  {"Puzzle Solution: (" + (solutionNum + 1) + ")"}
                </div>
                {solution ? (
                  solution.map((element, index) => {
                    if (index < inputArray.length - 1) {
                      return <div>{element + " , "}</div>;
                    } else {
                      return <div>{element}</div>;
                    }
                  })
                ) : (
                  <div />
                )}
              </div>
            );
          })
        ) : (
          <div />
        )}
      </div>
      <div style={{ marginTop: 100 }}>
        <PlayablePuzzle inputArray={inputArray} />
      </div>
    </div>
  );
}

export default App;
