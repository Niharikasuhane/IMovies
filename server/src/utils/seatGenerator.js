// Builds seat documents for a show from a theatre screen layout.
const rowLabel = (i) => String.fromCharCode(65 + i); // 0 -> A

module.exports = (show, screen, prices) => {
  const seats = [];
  const premiumStart = screen.rows - (screen.premiumRows || 0);
  for (let r = 0; r < screen.rows; r++) {
    for (let n = 1; n <= screen.seatsPerRow; n++) {
      const type = r >= premiumStart ? 'premium' : 'regular';
      seats.push({
        show,
        row: rowLabel(r),
        number: n,
        label: `${rowLabel(r)}${n}`,
        type,
        price: type === 'premium' ? prices.premium : prices.regular,
      });
    }
  }
  return seats;
};
