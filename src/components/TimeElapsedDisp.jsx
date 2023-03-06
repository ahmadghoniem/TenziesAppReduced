import { useState, useEffect, useRef, memo } from "react";
// this component was created to  separate the displaying of the current time as updating timeElapsed
// in the app component would make the whole App component re-render every 10ms
// also to utilize React.memo so this component won't re-render because of the parent component App state changes
// unless startTime and interval states only got changed

const TimeElapsedDisp = ({ startTime, interval }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  function useInterval(callback, delay) {
    const savedCallback = useRef(); // we used useRef so the component won't rerender once it gets changed

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current(); // execute the function that updates the current
      }

      if (delay !== null) {
        let id = setInterval(tick, delay);

        //cleaning function set for the future (autoexecuted when "delay" change)
        return () => {
          //console.log("clear Interval: " + id);
          clearInterval(id);
        };
      }
    }, [delay]);
  }
  useInterval(() => {
    setTimeElapsed(new Date().getTime());
  }, interval);
  let time =
    startTime && timeElapsed && ((timeElapsed - startTime) / 1000).toFixed(2); // both of them needs to be a value bigger than zero else display zero
  // on the very first render of this component elapsedTime is set to zero and then when startTime is passed it's re-rendered
  // but since they value of elapsed time is yet to be updated by UseInterval custom hook, time = oldValue-startTime
  return <p className="time-elapsed">{time > 0 ? time : 0}</p>;
};

export default memo(TimeElapsedDisp);
