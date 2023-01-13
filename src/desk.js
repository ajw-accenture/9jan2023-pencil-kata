const write = (thing, {paper, pencil}) => {
    return {
        paper: `${paper || ''}${thing}`,
        pencil
    };
};

module.exports = {
    write
};