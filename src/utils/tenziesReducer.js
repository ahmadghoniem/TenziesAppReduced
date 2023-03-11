import allNewDice from "./allnewDice";
export default function tenziesReducer(state, action) {
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
