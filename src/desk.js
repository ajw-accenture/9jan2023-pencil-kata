const write = (thing, {paper, pencil, durability}) => {
    return {
        paper: `${paper || ''}${thing}`,
        pencil,
        durability: durability - thing.length
    };
};

module.exports = {
    write
};