const {write, sharpen} = require('./desk');

describe('Writing', () => {
  let writingData = {};

  beforeEach(() => {
    writingData = { paper: '', durability: 1000 };
  });

  it('should write on a piece of paper', () => {
    const {paper} = write('Hello, world!', writingData);

    expect(paper).toBe('Hello, world!');
  });

  it('should write after any text already written on the piece of paper', () => {
    const data = { ...writingData, paper: 'Mary had '};
    const {paper} = write('a little lamb', data);

    expect(paper).toBe('Mary had a little lamb');
  });

  it('should degrade the point of the pencil by 1 for each lowercase letter written', () => {
    const {durability} = write('alpha', writingData);

    expect(durability).toBe(995);
  });

  it('should degrade the point of the pencil by 2 for each uppercase letter written', () => {
    const {durability} = write('Bravo', writingData);

    expect(durability).toBe(994);
  });

  it('should place blanks for each character the pencil cannot write because it has dulled', () => {
    const data = {...writingData, durability: 3};
    const {paper} = write('Charlie', data);

    expect(paper).toBe('Ch     ');
  });

  it('should keep the durability at zero even if the pencil is writing while dulled', () => {
    const data = {...writingData, durability: 3};
    const {durability} = write('Charlie', data);

    expect(durability).toBe(0);
  });

  it('should expend no durability to write spaces and newline characters', () => {
    const {durability} = write('At the\ncinemas', writingData);

    expect(durability).toBe(987);
  });

  it('should be able to write again after sharpening', () => {
    let data = {...writingData, durability: 3};
    const firstResult = write('Hello', data);

    expect(firstResult.paper).toBe('He   ');

    data = sharpen(data);
    const secondResult = write('Hello', data);

    expect(secondResult.paper).toBe('Hello');
  });
});