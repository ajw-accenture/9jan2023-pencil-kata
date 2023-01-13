const {write} = require('./desk');

describe('Writing', () => {
  let writingData = {};

  beforeEach(() => {
    writingData = { paper: '' };
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
});