import { useEffect, useReducer } from "react";
import axios from "axios";
import congratsMp3 from "./congrats.mp3";
import Die from "./components/Die";
import Confetti from "react-confetti";
import Leaderboard from "./components/Leaderboard";
import Suggestions from "./components/Suggestions";
import Header from "./components/Header";
import TimeElapsedDisp from "./components/TimeElapsedDisp";

function App() {
  const congratsAudio = new Audio(congratsMp3);
  const pantryID = "319f2108-7202-4669-9979-bfbd309ebdd7";
  const pantryBasketName = "Leaderboards";

  function tenziesReducer(state, action) {
    switch (action.type) {
      case "start_game": {
        return {
          ...state,
          startTime: new Date().getTime(),
          interval: action.payload.interval,
        };
      }
      case "win_game": {
        return {
          ...state,
          tenzies: true,
          interval: null,
        };
      }
      case "play_again": {
        return {
          ...state,
          dice: allNewDice(),
          count: 0,
          startTime: 0,
          interval: null,
          tenzies: false,
        };
      }
      case "inc_count": {
        return {
          ...state,
          count: state.count + 1,
        };
      }
      case "roll": {
        return {
          ...state,
          dice: state.dice.map((e) =>
            !e.isHeld ? { ...e, value: ~~(Math.random() * 6) + 1 } : e
          ),
        };
      }
      case "update_state": {
        return {
          ...state,
          [action.payload.propName]: action.payload.value,
        };
      }

      case "fix_die": {
        // don't hold the dice unless the user started the game and don't make him be able to select the dies after he wins
        // else it will trigger the useEffect's callback function and will add his name to the leaderboards again!
        let arr = [...state.dice];
        arr[action.payload.index].isHeld = !arr[action.payload.index].isHeld;
        return {
          ...state,
          dice: arr,
        };
      }
      default: {
        return state;
      }
    }
  }
  function initializeState(state) {
    return {
      ...state,
      dice: allNewDice(),
      userName: localStorage.getItem("tenziesName") || "Guest",
    };
  }
  const [state, dispatch] = useReducer(
    tenziesReducer,
    {
      dice: [],
      tenzies: false,
      userName: "",
      userId: "",
      count: 0,
      startTime: 0,
      interval: null,
      leaderboard: [],
    },
    initializeState
  );

  function allNewDice() {
    return [...Array(10)].map(() => ({
      value: ~~(Math.random() * 6) + 1,
      isHeld: false,
    }));
  }
  function checkWinCond(dice) {
    return dice.every(
      (die, i, arr) => die.isHeld && die.value === arr[0].value
    ); // checking if each die is held and if they are all equal to the first die's value which is a valid approach to check if they are all the same
  }
  function rollDice() {
    if (!tenzies) {
      dispatch({ type: "inc_count" });
      if (count === 0) {
        dispatch({ type: "start_game", payload: { interval: 20 } });
        return;
      }
      dispatch({ type: "roll" });
    } else {
      dispatch({ type: "play_again" });
    }
  }

  let {
    count,
    startTime,
    interval,
    userName,
    tenzies,
    dice,
    userId,
    leaderboard,
  } = state;
  console.log(state);
  // USEEFFECT to load leaderboard from pantry to leaderboard state
  useEffect(() => {
    const myHeaders = new Headers();

    let arr = [];
    myHeaders.append("Content-Type", "application/json");

    const config = {
      method: "get",
      url: `https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/${pantryBasketName}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config).then((result) => {
      result = result.data;
      Object.keys(result).forEach((e) => arr.push({ id: e, ...result[e] }));
      dispatch({
        type: "update_state",
        payload: { propName: "leaderboard", value: arr },
      });
    });
  }, []);

  useEffect(() => {
    if (checkWinCond(dice)) {
      dispatch({ type: "win_game" });
      congratsAudio.play();
      // push num of rolls and time taken to leaderboard
      let endTime = new Date();
      let timeDiff = ((endTime - startTime) / 1000).toFixed(2);

      const obj = {
        id: crypto.randomUUID(),
        name: userName,
        count: count,
        timeTaken: timeDiff,
      };
      dispatch({
        type: "update_state",
        payload: { propName: "id", value: obj.id },
      });

      // update our leaderboard JSON with the new record
      const config = {
        method: "put",
        url: `https://getpantry.cloud/apiv1/pantry/${pantryID}/basket/${pantryBasketName}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          [obj.id]: obj,
        }),
      };
      axios(config).then((response) => {
        /*console.log(JSON.stringify(response.data)); */
      });
      dispatch({
        type: "update_state",
        payload: { propName: "leaderboard", value: [...leaderboard, obj] },
      });
    }
  }, [dice]);

  let diceArr = dice.map((e, i) => (
    <Die
      key={i}
      index={i}
      count={count}
      tenzies={tenzies}
      value={e.value}
      isHeld={e.isHeld}
      dispatch={dispatch}
    />
  ));

  return (
    <>
      <Header />
      <main className="App">
        <Leaderboard leaderboard={leaderboard} userId={userId} />
        <div className="game-container">
          {tenzies && <Confetti />}
          <h1>Tenzies 🎲</h1>
          <p>
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
          <div className="dice-container">{diceArr}</div>

          <div className="dice-container-bottom">
            <span className="roll-number">{count}</span>
            <button className="roll-dice" onClick={rollDice}>
              {!tenzies ? `${count ? "Roll" : "Start"}` : "Play again!"}
            </button>
            <TimeElapsedDisp interval={interval} startTime={startTime} />
          </div>
        </div>
        <Suggestions dispatch={dispatch} userName={userName} />
      </main>
    </>
  );
}

export default App;
