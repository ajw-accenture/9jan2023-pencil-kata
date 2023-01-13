const MAX_SHARPNESS = 1000;
const SINGLE_SPACE = ' ';
const EMPTY = '';

const write = (pencil, toWrite) => {
  const { paper, sharpness } = pencil;

  return toWrite
    .split(EMPTY)
    .reduce((accumulator, character) => {
      let sharpnessReduction = character === character.toUpperCase() ? 2 : 1;
      let charToWrite = character;

      if (character === SINGLE_SPACE || character === '\n') {
        sharpnessReduction = 0;
      }

      const currentSharpness = accumulator.sharpness;
      if (currentSharpness <= 0) {
        sharpnessReduction = 0;
        charToWrite = SINGLE_SPACE;
      }

      return {
        paper: `${accumulator.paper}${charToWrite}`,
        sharpness: currentSharpness - sharpnessReduction
      };
    }, { paper: paper || EMPTY, sharpness });
};

const sharpen = data => ({ ...data, sharpness: MAX_SHARPNESS });

const erase = (pencil, toErase) => {
  const { paper } = pencil;
  const lastIndexOfThing = paper.lastIndexOf(toErase);

  const upperHalf = paper.substring(0, lastIndexOfThing);
  const lowerHalf = paper.substring(lastIndexOfThing + toErase.length);

  return {
    ...pencil,
    paper: `${upperHalf}${lowerHalf}`
  };
};

module.exports = { write, sharpen, erase };
