const MAX_SHARPNESS = 1000;
const SINGLE_SPACE = ' ';
const EMPTY = '';
const AROBASE = '@';
const NEWLINE = '\n';

const _calculateNextSharpness = (currentSharpness, letter) => {
  let reduceBy = 1;

  if (currentSharpness === 0 || letter === SINGLE_SPACE || letter === NEWLINE) {
    reduceBy = 0;
  } else if (letter === letter.toUpperCase()) {
    reduceBy = 2;
  }

  return currentSharpness - reduceBy;
};

const _findLastIndexOfToken = (utensils, token) => utensils.paper.lastIndexOf(token);

const _overwrite = (utensils, token, atIndex) => {
  const { paper, pencil } = utensils;
  const paperLetters = paper.split(EMPTY);
  const tokenLetters = token.split(EMPTY);
  const stopAt = atIndex + tokenLetters.length;
  let sharpness = pencil.sharpness;

  for (let i = atIndex, p = 0; i < stopAt; i++, p++) {
    const letterOnPaper = paperLetters[i];
    const letterToWrite = tokenLetters[p];

    if (sharpness <= 0) {
      if (letterOnPaper !== SINGLE_SPACE) {
        paperLetters[i] = letterOnPaper;
      } else {
        paperLetters[i] = SINGLE_SPACE;
      }
    } else if (letterOnPaper !== SINGLE_SPACE) {
      paperLetters[i] = AROBASE;
    } else if (sharpness > 0) {
      paperLetters[i] = letterToWrite;
      sharpness = _calculateNextSharpness(sharpness, letterToWrite);
    }
  }

  return { ...utensils, pencil: { ...pencil, sharpness }, paper: paperLetters.join(EMPTY) };
};

const _append = (utensils, token) => {
  const { paper, pencil: { sharpness } } = utensils;

  return token
    .split(EMPTY)
    .reduce(({ pencil: { sharpness }, paper }, letter) => {
      const currentSharpness = sharpness;
      let letterToWrite = letter;

      if (currentSharpness <= 0) {
        letterToWrite = SINGLE_SPACE;
      }

      return {
        paper: `${paper}${letterToWrite}`,
        pencil: { sharpness: _calculateNextSharpness(currentSharpness, letterToWrite) }
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
  const indexOfToken = _findLastIndexOfToken(utensils, tokenToErase);

  const upperHalf = paper.substring(0, indexOfToken);
  const lowerHalf = paper.substring(indexOfToken + tokenToErase.length);
  const spacesToCreate = rubber < token.length ? rubber : token.length;
  const spaces = SINGLE_SPACE.repeat(spacesToCreate);

  return {
    ...utensils,
    pencil: { ...pencil, rubber: rubber - tokenToErase.length },
    paper: `${upperHalf}${spaces}${lowerHalf}`
  };
};

const erase = (utensils, toErase) => {
  const erased = _erase(utensils, toErase);

  return { ...utensils, pencil: { ...erased.pencil }, paper: erased.paper };
};

const edit = (utensils, tokenToChange, tokenToWrite) => {
  const indexOfErasedToken = _findLastIndexOfToken(utensils, tokenToChange);
  const erased = _erase(utensils, tokenToChange);

  return _overwrite(erased, tokenToWrite, indexOfErasedToken);
};

module.exports = { write, sharpen, erase, edit };
