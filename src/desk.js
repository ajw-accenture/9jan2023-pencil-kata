const MAX_SHARPNESS = 1000;
const SINGLE_SPACE = ' ';
const EMPTY = '';

const write = (utensils, toWrite) => {
  const { paper, pencil: { sharpness } } = utensils;

  return toWrite
    .split(EMPTY)
    .reduce((accumulator, character) => {
      let sharpnessReduction = character === character.toUpperCase() ? 2 : 1;
      let charToWrite = character;

      if (character === SINGLE_SPACE || character === '\n') {
        sharpnessReduction = 0;
      }

      const currentSharpness = accumulator.pencil.sharpness;
      if (currentSharpness <= 0) {
        sharpnessReduction = 0;
        charToWrite = SINGLE_SPACE;
      }

      return {
        paper: `${accumulator.paper}${charToWrite}`,
        pencil: { sharpness: currentSharpness - sharpnessReduction }
      };
    }, { paper: paper || EMPTY, pencil: { sharpness } });
};

const sharpen = utensils => ({ ...utensils, pencil: { ...utensils.pencil, sharpness: MAX_SHARPNESS } });

const erase = (utensils, toErase) => {
  const { paper, pencil, pencil: { rubber } } = utensils;
  const tokenToErase = rubber < toErase.length ? toErase.substring(toErase.length - rubber) : toErase;
  const lastIndexOfThing = paper.lastIndexOf(tokenToErase);

  const upperHalf = paper.substring(0, lastIndexOfThing);
  const lowerHalf = paper.substring(lastIndexOfThing + tokenToErase.length);

  return {
    ...utensils,
    pencil: { ...pencil, rubber: rubber - tokenToErase.length },
    paper: `${upperHalf}${lowerHalf}`
  };
};

module.exports = { write, sharpen, erase };
