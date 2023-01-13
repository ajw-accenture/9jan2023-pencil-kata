const write = (thing, data) => {
    const {paper, durability} = data;

    return thing.split('')
        .reduce((accumulator, character) => {
            const duraReduction = character === character.toUpperCase() ? 2 : 1;

            return {
                paper: `${accumulator.paper || ''}${character}`,
                durability: accumulator.durability - duraReduction
            };
        }, {paper, durability});
};

module.exports = {
    write
};