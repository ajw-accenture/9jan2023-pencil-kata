const {write} = require('./desk');

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
});