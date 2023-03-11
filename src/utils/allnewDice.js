export default function allNewDice() {
  return [...Array(10)].map(() => ({
    value: ~~(Math.random() * 6) + 1,
    isHeld: false,
  }));
}
