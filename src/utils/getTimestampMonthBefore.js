function timestampMonthBefore() {
  const now = Math.floor(Date.now() / 1000); // in seconds
  const timestampMonthBefore = now - 30 * 24 * 60 * 60;
  return timestampMonthBefore;
}

export default timestampMonthBefore;
