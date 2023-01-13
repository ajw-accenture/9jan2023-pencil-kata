const write = (thing, data) => {
    const {paper, durability} = data;

    return thing
        .split('')
        .reduce((accumulator, character) => {
            let duraReduction = character === character.toUpperCase() ? 2 : 1;
            const charToWrite = accumulator.durability > 0 ? character : ' ';
            duraReduction = accumulator.durability > 0 ? duraReduction : 0;

            return {
                paper: `${accumulator.paper}${charToWrite}`,
                durability: accumulator.durability - duraReduction
            };
        }, {paper: paper || '', durability});
};

module.exports = {
    write
};