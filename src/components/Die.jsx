export default function Die({
  index,
  value,
  isHeld,
  count,
  tenzies,
  dispatch,
}) {
  const styles = {
    backgroundColor: isHeld ? "#59e391" : "#fff",
  };
  function fixDie() {
    if (count === 0 || tenzies) return;
    dispatch({ type: "fix_die", payload: { index } });
  }
  return (
    <div className="dice" style={styles} onClick={fixDie}>
      {value}
    </div>
  );
}
