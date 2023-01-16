const MAX_SHARPNESS = 1000;
const SINGLE_SPACE = ' ';
const EMPTY = '';

const _write = (utensils, token) => {
  const { paper, pencil: { sharpness } } = utensils;

  return token
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

const write = (utensils, token) => {
  const written = _write(utensils, token);

  return {
    pencil: { ...written.pencil },
    paper: written.paper
  };
};

const sharpen = utensils => ({ ...utensils, pencil: { ...utensils.pencil, sharpness: MAX_SHARPNESS } });

const _erase = (utensils, token) => {
  const { paper, pencil, pencil: { rubber } } = utensils;
  const tokenToErase = rubber < token.length ? token.substring(token.length - rubber) : token;
  const lastIndexOfToken = paper.lastIndexOf(tokenToErase);

  const upperHalf = paper.substring(0, lastIndexOfToken);
  const lowerHalf = paper.substring(lastIndexOfToken + tokenToErase.length);
  const spaces = rubber < token.length ? [ ...Array(rubber) ].reduce(acc => acc + ' ', '') : '';

  return {
    ...utensils,
    pencil: { ...pencil, rubber: rubber - tokenToErase.length },
    paper: `${upperHalf}${spaces}${lowerHalf}`
  };
};

const erase = (utensils, toErase) => {
  const erased = _erase(utensils, toErase);

  return {
    ...utensils,
    pencil: { ...erased.pencil },
    paper: erased.paper
  };
};

module.exports = { write, sharpen, erase };
