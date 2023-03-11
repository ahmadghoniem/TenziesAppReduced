import { useState } from "react";
import lbIcon from "../leaderboardIcon.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Leaderboard({ leaderboard, userId }) {
  const [sortBy, setSortBy] = useState("rolls"); // default is to sort by rolls count
  let compareFunction;
  switch (sortBy) {
    case "rolls":
      compareFunction = (a, b) => a.count - b.count;
      break;
    case "time":
      compareFunction = (a, b) => a.timeTaken - b.timeTaken;
      break;
    case "both":
      compareFunction = (a, b) =>
        a.count + a.timeTaken - (b.count + b.timeTaken);
      break;
  }

  const handleSortChange = (e) => setSortBy(e.currentTarget.value);

  // console.log("rendered"); // this component used to to re render twice (with the old approach)
  // if you clicked the button twice even though the value didn't change
  let skeleStyle = {
    width: "80%",
    borderRadius: "0.15rem",
    baseColor: "#e8e8e8",
    highlightColor: "#f1f1f1",
  };
  // top 10
  let elesArr = leaderboard
    .sort(compareFunction)
    .slice(0, 10)
    .map(({ name, timeTaken, count, id }) => {
      return (
        <li key={id} className={`${userId === id ? "choosen" : ""}`}>
          <span>{name || <Skeleton {...skeleStyle} />}</span>
          <span>{count || <Skeleton {...skeleStyle} />}</span>
          <span>{timeTaken || <Skeleton {...skeleStyle} />}</span>
        </li>
      );
    });
  return (
    <div className="leaderboard">
      <span className="leaderboard-title">
        Leaderboard
        <small style={{ marginLeft: "10px" }}>
          {Object.keys(leaderboard[0]).length ? (
            leaderboard.length
          ) : (
            <Skeleton {...skeleStyle} width={"15%"} />
          )}
        </small>
      </span>
      <img className="lb-icon" src={lbIcon} />
      <div className="leaderboard-sort">
        <span>sort by</span>
        <input
          id="rolls"
          type="radio"
          value="rolls"
          name="sort"
          checked={sortBy === "rolls"}
          onChange={handleSortChange}
        />
        <label htmlFor="rolls">rolls</label>
        <input
          id="time"
          type="radio"
          value="time"
          name="sort"
          checked={sortBy === "time"}
          onChange={handleSortChange}
        />
        <label htmlFor="time">time</label>
        <input
          id="both"
          type="radio"
          value="both"
          name="sort"
          checked={sortBy === "both"}
          onChange={handleSortChange}
        />
        <label htmlFor="both">best of both!</label>
        {/*   OLD APPROACH
        <button onClick={() => setSortBy("rolls")}>rolls</button>
        <button onClick={() => setSortBy("time")}>time</button>
        <button onClick={() => setSortBy("both")}>best of both!</button> */}
      </div>
      <ol className="grid">
        <li>
          <span>Name</span>
          <span>Rolls</span>
          <span>Time</span>
        </li>
        {elesArr}
      </ol>
    </div>
  );
}
