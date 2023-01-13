const {write} = require('./desk');

describe('Writing', () => {
  it('should write on a piece of paper', () => {
    const {paper} = write('Hello, world!', {});
    
    expect(paper).toBe('Hello, world!');
  });

  it('should write after any text already written on the piece of paper', () => {
    const {paper} = write('a little lamb', {paper: 'Mary had '});

    expect(paper).toBe('Mary had a little lamb');
  });
});