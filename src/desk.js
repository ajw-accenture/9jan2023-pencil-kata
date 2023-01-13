const MAX_DURABILITY = 1000;

const write = (thing, data) => {
  const {paper, durability} = data;

  return thing
    .split('')
    .reduce((accumulator, character) => {
      let duraReduction = character === character.toUpperCase() ? 2 : 1;
      let charToWrite = character;

      if (character === ' ' || character === '\n') {
        duraReduction = 0;
      }

      const currentDura = accumulator.durability;
      if (currentDura <= 0) {
        duraReduction = 0;
        charToWrite = ' ';
      }

      return {
        paper: `${accumulator.paper}${charToWrite}`,
        durability: currentDura - duraReduction
      };
    }, {paper: paper || '', durability});
};

const sharpen = data => ({...data, durability: MAX_DURABILITY});

const erase = (data, thing) => {
  const {paper} = data;
  const lastIndexOfThing = paper.lastIndexOf(thing);

  const upperHalf = paper.substring(0, lastIndexOfThing);
  const lowerHalf = paper.substring(lastIndexOfThing + thing.length);

  return {
    ...data,
    paper: `${upperHalf}${lowerHalf}`
  };
};

module.exports = {
  write,
  sharpen,
  erase
};