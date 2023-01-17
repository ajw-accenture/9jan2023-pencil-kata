const { write, sharpen, erase, edit } = require('./desk');

describe('Pencil', () => {
  let basicUtensils = {};

  beforeEach(() => {
    basicUtensils = { paper: '', pencil: { sharpness: 1000, rubber: 1000 } };
  });

  describe('writing', () => {
    it('should place letters on paper', () => {
      const { paper } = write(basicUtensils, 'Hello, world!');

      expect(paper).toBe('Hello, world!');
    });

    it('should place letters after any text already written on paper', () => {
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

    it('should place blanks for each letter when the pencil becomes dull', () => {
      const utensils = { ...basicUtensils, pencil: { sharpness: 3 } };
      const { paper } = write(utensils, 'Charlie');

      expect(paper).toBe('Ch     ');
    });

    it('should keep sharpness at zero even if the pencil is writing while dulled', () => {
      const utensils = { ...basicUtensils, pencil: { sharpness: 3 } };
      const { pencil: { sharpness } } = write(utensils, 'Charlie');

      expect(sharpness).toBe(0);
    });

    it('should not expend sharpness to place spaces and newline characters', () => {
      const { pencil: { sharpness } } = write(basicUtensils, 'At the\ncinemas');

      expect(sharpness).toBe(987);
    });
  });

  describe('sharpening', () => {
    it('should allow the pencil to write again', () => {
      let utensils = { ...basicUtensils, pencil: { sharpness: 3 } };
      const firstResult = write(utensils, 'Hello');

      expect(firstResult.paper).toBe('He   ');

      utensils = sharpen(utensils);
      const secondResult = write(utensils, 'Hello');

      expect(secondResult.paper).toBe('Hello');
    });
  });

  describe('erasing', () => {
    it('should remove the last occurrence of the specified word to erase', () => {
      let utensils = { ...basicUtensils, paper: 'The world\'s greatest detective in the world.' };
      const { paper } = erase(utensils, 'world');

      expect(paper).toBe('The world\'s greatest detective in the      .');
    });

    it('should reduce pencil rubber by 1 for each character erased', () => {
      let utensils = { ...basicUtensils, paper: 'The world\'s greatest detective in the world.' };
      const { pencil: { rubber } } = erase(utensils, 'world');

      expect(rubber).toBe(995);
    });

    it('should erase only the characters the pencil has enough rubber to erase', () => {
      let utensils = { ...basicUtensils, paper: 'Hello to everyone in the world', pencil: { rubber: 3 } };
      const { paper } = erase(utensils, 'everyone');

      expect(paper).toBe('Hello to every    in the world');
    });
  });

  describe('editing', () => {
    it('should replace the specified letters with new letters', () => {
      const utensils = { ...basicUtensils, paper: 'Hello to everyone in the world' };
      const { paper } = edit(utensils, 'everyone', 'y\'all');

      expect(paper).toBe('Hello to y\'all    in the world');
    });

    it('should replace letter collisions with an at-sign (@)', () => {
      const utensils = { ...basicUtensils, paper: 'How to find a rhinoceros' };
      const { paper } = edit(utensils, 'find', 'entertain');

      expect(paper).toBe('How to enter@a@@inoceros');
    });

    it('should reduce pencil rubber for each letter erased', () => {
      const utensils = { ...basicUtensils, paper: 'How to find a rhinoceros' };
      const { pencil: { rubber } } = edit(utensils, 'find', 'entertain');

      expect(rubber).toBe(996);
    });

    it('should reduce pencil sharpness for each letter written (except for collisions)', () => {
      const utensils = { ...basicUtensils, paper: 'How to find a rhinoceros' };
      const { pencil: { sharpness } } = edit(utensils, 'find', 'Entertain');

      expect(sharpness).toBe(993);
    });

    it('should erase only the characters the pencil has enough rubber to erase', () => {
      const utensils = {
        ...basicUtensils,
        paper: 'How to find a rhinoceros',
        pencil: { ...basicUtensils.pencil, rubber: 3 }
      };
      const { paper } = edit(utensils, 'find', 'entertain');

      expect(paper).toBe('How to @nter@a@@inoceros');
    });

    it('should place blanks for each letter (or original letter, for collisions) when the pencil becomes dull', () => {
      const utensils = {
        ...basicUtensils,
        paper: 'How to find a rhinoceros',
        pencil: { ...basicUtensils.pencil, sharpness: 3 }
      };
      const { paper } = edit(utensils, 'find', 'entertain');

      expect(paper).toBe('How to ent  a rhinoceros');
    });
  });
});
