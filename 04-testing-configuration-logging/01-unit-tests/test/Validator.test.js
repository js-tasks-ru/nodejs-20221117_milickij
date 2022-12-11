const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет валидный объект', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 6,
          max: 18,
        },
        name: {
          type: 'string',
          min: 5,
          max: 10,
        },
      });

      const errors = validator.validate({name:'maria',age:12});
      expect(errors.length).equal(0);
    });

    it('валидатор проверяет типы полей', () => {
      const validator = new Validator({
        name: {
          type: 'boolean',
          min: 10,
          max: 20,
        }
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect boolean, got string');
    });

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 6,
          max: 18,
        },
      });

      const errors = validator.validate({ age: 24 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 6, got 24');
    });

    it('валидатор проверяет поля на null значения', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 6,
          max: 18,
        },
        name: {
          type: 'string',
          min: 1,
          max: 10,
        },
      });

      const errors = validator.validate({ age: null, name: null });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect value, got null');
    });

    it('валидатор проверяет на пустой объект', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 6,
          max: 18,
        },
        name: {
          type: 'string',
          min: 1,
          max: 10,
        },
      });

      const errors = validator.validate({});
      expect(errors[0]).to.have.property('error').and.to.be.equal('obj is empty');
    });
  });
});