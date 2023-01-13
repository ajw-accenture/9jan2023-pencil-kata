const { write, sharpen, erase } = require('./desk');

describe('Writing', () => {
  let simplePencil = {};

  beforeEach(() => {
    simplePencil = { paper: '', sharpness: 1000 };
  });

  it('should write on a piece of paper', () => {
    const { paper } = write(simplePencil, 'Hello, world!');

    expect(paper).toBe('Hello, world!');
  });

  it('should write after any text already written on the piece of paper', () => {
    const pencil = { ...simplePencil, paper: 'Mary had ' };
    const { paper } = write(pencil, 'a little lamb');

    expect(paper).toBe('Mary had a little lamb');
  });

  it('should degrade the point of the pencil by 1 for each lowercase letter written', () => {
    const { sharpness } = write(simplePencil, 'alpha');

    expect(sharpness).toBe(995);
  });

  it('should degrade the point of the pencil by 2 for each uppercase letter written', () => {
    const { sharpness } = write(simplePencil, 'Bravo');

    expect(sharpness).toBe(994);
  });

  it('should place blanks for each character the pencil cannot write because it has dulled', () => {
    const pencil = { ...simplePencil, sharpness: 3 };
    const { paper } = write(pencil, 'Charlie');

    expect(paper).toBe('Ch     ');
  });

  it('should keep sharpness at zero even if the pencil is writing while dulled', () => {
    const pencil = { ...simplePencil, sharpness: 3 };
    const { sharpness } = write(pencil, 'Charlie');

    expect(sharpness).toBe(0);
  });

  it('should not expend sharpness to write spaces and newline characters', () => {
    const { sharpness } = write(simplePencil, 'At the\ncinemas');

    expect(sharpness).toBe(987);
  });

  it('should be able to write again after sharpening', () => {
    let pencil = { ...simplePencil, sharpness: 3 };
    const firstResult = write(pencil, 'Hello');

    expect(firstResult.paper).toBe('He   ');

    pencil = sharpen(pencil);
    const secondResult = write(pencil, 'Hello');

    expect(secondResult.paper).toBe('Hello');
  });

  it('should erase the last occurrence of the specified word to erase', () => {
    let pencil = { ...simplePencil, paper: 'The world\'s greatest detective in the world.' };
    const { paper } = erase(pencil, 'world');

    expect(paper).toBe('The world\'s greatest detective in the .');
  });
});
