const MAX_SHARPNESS = 1000;
const SINGLE_SPACE = ' ';
const EMPTY = '';
const AROBASE = '@';

const _overwrite = (utensil, token, atIndex) => {
  const { paper } = utensil;
  const paperLetters = paper.split(EMPTY);
  const tokenLetters = token.split(EMPTY);
  const stopAt = atIndex + tokenLetters.length;

  for (let i = atIndex, p = 0; i < stopAt; i++, p++) {
    const currentCharOnPaper = paperLetters[i];
    paperLetters[i] = currentCharOnPaper !== SINGLE_SPACE ? AROBASE : tokenLetters[p];
  }

  return { ...utensil, paper: paperLetters.join(EMPTY) };
};

const _append = (utensils, token) => {
  const { paper, pencil: { sharpness } } = utensils;

  return token
    .split(EMPTY)
    .reduce((accumulator, character) => {
      const currentSharpness = accumulator.pencil.sharpness;
      let charToWrite = character;
      let sharpnessReduction = character === character.toUpperCase() ? 2 : 1;

      if (character === SINGLE_SPACE || character === '\n') {
        sharpnessReduction = 0;
      }

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
  const written = _append(utensils, token);

  return {
    pencil: { ...written.pencil },
    paper: written.paper
  };
};

const sharpen = utensils => ({ ...utensils, pencil: { ...utensils.pencil, sharpness: MAX_SHARPNESS } });

const _erase = (utensils, token) => {
  const { paper, pencil, pencil: { rubber } } = utensils;
  const tokenToErase = rubber < token.length ? token.substring(token.length - rubber) : token;
  const indexOfToken = paper.lastIndexOf(tokenToErase);

  const upperHalf = paper.substring(0, indexOfToken);
  const lowerHalf = paper.substring(indexOfToken + tokenToErase.length);
  const spacesToCreate = rubber < token.length ? rubber : token.length;
  const spaces = [ ...Array(spacesToCreate) ].reduce(acc => acc + SINGLE_SPACE, EMPTY);

  return {
    ...utensils,
    indexOfToken,
    pencil: { ...pencil, rubber: rubber - tokenToErase.length },
    paper: `${upperHalf}${spaces}${lowerHalf}`
  };
};

const erase = (utensils, toErase) => {
  const erased = _erase(utensils, toErase);

  return { ...utensils, pencil: { ...erased.pencil }, paper: erased.paper };
};

const edit = (utensils, atToken, editToken) => {
  const erased = _erase(utensils, atToken);
  const written = _overwrite(erased, editToken, erased.indexOfToken);

  return written;
};

module.exports = { write, sharpen, erase, edit };
