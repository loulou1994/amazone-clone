export default function setGridHeightSize(cardsNumber) {
  const CARD_HEIGHT = 351;
  let height = null;

  if (window.innerWidth > 1032) {
    height = Math.ceil(cardsNumber / 4) * CARD_HEIGHT;
  } else if (window.innerWidth > 790) {
    height = Math.ceil(cardsNumber / 3) * CARD_HEIGHT;
  } else if (window.innerWidth > 580) {
    height = Math.ceil(cardsNumber / 2) * CARD_HEIGHT;
  } else height = cardsNumber * CARD_HEIGHT;

  return height;
}