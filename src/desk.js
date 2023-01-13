const write = (thing, data) => {
    const {paper, pencil, durability} = data;

    return {
        paper: `${paper || ''}${thing}`,
        pencil,
        durability: durability - thing.length
    };
};

module.exports = {
    write
};