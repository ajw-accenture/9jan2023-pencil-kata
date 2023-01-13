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

module.exports = {
    write
};