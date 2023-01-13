const {write} = require('./desk')

describe('Writing', () => {
  it('should write on a piece of paper', () => {
    const {paper} = write('Hello, world!', {});
    
    expect(paper).toBe('Hello, world!');
  });
});