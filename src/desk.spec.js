const { write, sharpen, erase, edit } = require('./desk');

describe('Writing', () => {
  let basicUtensils = {};

  beforeEach(() => {
    basicUtensils = { paper: '', pencil: { sharpness: 1000, rubber: 1000 } };
  });

  it('should write on a piece of paper', () => {
    const { paper } = write(basicUtensils, 'Hello, world!');

    expect(paper).toBe('Hello, world!');
  });

  it('should write after any text already written on the piece of paper', () => {
    const utensils = { ...basicUtensils, paper: 'Mary had ' };
    const { paper } = write(utensils, 'a little lamb');

    expect(paper).toBe('Mary had a little lamb');
  });

  it('should reduce pencil sharpness by 1 for each lowercase letter written', () => {
    const { pencil: { sharpness } } = write(basicUtensils, 'alpha');

    expect(sharpness).toBe(995);
  });

  it('should reduce pencil sharpness by 2 for each uppercase letter written', () => {
    const { pencil: { sharpness } } = write(basicUtensils, 'Bravo');

    expect(sharpness).toBe(994);
  });

  it('should place blanks for each character the pencil cannot write because it has dulled', () => {
    const utensils = { ...basicUtensils, pencil: { sharpness: 3 } };
    const { paper } = write(utensils, 'Charlie');

    expect(paper).toBe('Ch     ');
  });

  it('should keep sharpness at zero even if the pencil is writing while dulled', () => {
    const utensils = { ...basicUtensils, pencil: { sharpness: 3 } };
    const { pencil: { sharpness } } = write(utensils, 'Charlie');

    expect(sharpness).toBe(0);
  });

  it('should not expend sharpness to write spaces and newline characters', () => {
    const { pencil: { sharpness } } = write(basicUtensils, 'At the\ncinemas');

    expect(sharpness).toBe(987);
  });

  it('should be able to write again after sharpening', () => {
    let utensils = { ...basicUtensils, pencil: { sharpness: 3 } };
    const firstResult = write(utensils, 'Hello');

    expect(firstResult.paper).toBe('He   ');

    utensils = sharpen(utensils);
    const secondResult = write(utensils, 'Hello');

    expect(secondResult.paper).toBe('Hello');
  });

  it('should erase the last occurrence of the specified word to erase', () => {
    let utensils = { ...basicUtensils, paper: 'The world\'s greatest detective in the world.' };
    const { paper } = erase(utensils, 'world');

    expect(paper).toBe('The world\'s greatest detective in the      .');
  });

  it('should reduce pencil rubber by 1 for each character erased', () => {
    let utensils = { ...basicUtensils, paper: 'The world\'s greatest detective in the world.' };
    const { pencil: { rubber } } = erase(utensils, 'world');

    expect(rubber).toBe(995);
  });

  it('should erase only the characters it has enough rubber to erase', () => {
    let utensils = { ...basicUtensils, paper: 'Hello to everyone in the world', pencil: { rubber: 3 } };
    const { paper } = erase(utensils, 'everyone');

    expect(paper).toBe('Hello to every    in the world');
  });

  it('should edit the specified characters', () => {
    const utensils = { ...basicUtensils, paper: 'Hello to everyone in the world' };
    const { paper } = edit(utensils, 'everyone', 'y\'all');

    expect(paper).toBe('Hello to y\'all    in the world');
  });

  it('should edit the specified characters, replacing overwritten, non-space characters with an @ symbol', () => {
    const utensils = { ...basicUtensils, paper: 'How to find a rhinoceros' };
    const { paper } = edit(utensils, 'find', 'entertain');

    expect(paper).toBe('How to enter@a@@inoceros');
  });
});
