import { React, useState, useEffect } from "react";
import "./App.css";
import PlayablePuzzle from "./PlayablePuzzle.js";

function App() {
  const [userInput, setUserInput] = useState("");
  const [inputArray, setInputArray] = useState([]);
  const [sizeOfPuzzle, setSizeOfPuzzle] = useState(0);
  const [showSolutions, setShowSolutions] = useState(false);

  const [outputArray, setOutputArray] = useState([]);

  useEffect(() => {
    setOutputArray([]);
    setOutputArray(solver(inputArray));
  }, [inputArray]);

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

  const toggleSolutions = () => {
    setShowSolutions(!showSolutions);
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

    const values = [];
    const puzzle = Array(sizeOfPuzzle);
    for (let i = 1; i < sizeOfPuzzle; i++) {
      let value = Math.abs(randArr[i] - randArr[i-1]);
      value = value > sizeOfPuzzle/2 ? sizeOfPuzzle-value: value;
      values.push(value);
      puzzle[randArr[i-1]] = value;
    }
    values.push(Math.floor(Math.random() * Math.floor(sizeOfPuzzle/2)) + 1);
    puzzle[randArr[sizeOfPuzzle-1]] = values[sizeOfPuzzle-1];
    // console.log(puzzle);
    setUserInput(puzzle.toString());
    setInputArray(puzzle);
  };

  const solver = (inputArray) => {
    let blankArr = inputArray.map(() => 0);
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
    return solutionArr;
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
            // solvePuzzle();
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
          onClick={createPuzzle}
        >
          Generate
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={toggleSolutions} style={{width: 'max-content'}}>
          {showSolutions ? "Hide": "Show"} Solutions
        </button>
        {(showSolutions && outputArray) ? (
          outputArray.map((solution, solutionNum) => {
            return (
              <div key={solutionNum} style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ marginRight: 50 }}>
                  {`Puzzle Solution: (${solutionNum + 1})`}
                </div>
                {solution ? (
                  solution.join(", ")
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
