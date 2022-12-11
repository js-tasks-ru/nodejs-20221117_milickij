module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    if (Object.keys(obj).length === 0) {
      errors.push({ error: `obj is empty` });
      return errors;
    }

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;

      if (value === null || value === undefined) {
        errors.push({ field, error: `expect value, got ${value}` });
        return errors;
      }

      if (type !== rules.type) {
        errors.push({ field, error: `expect ${rules.type}, got ${type}` });
        return errors;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({ field, error: `too short, expect ${rules.min}, got ${value.length}` });
          }
          if (value.length > rules.max) {
            errors.push({ field, error: `too long, expect ${rules.max}, got ${value.length}` });
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({ field, error: `too little, expect ${rules.min}, got ${value}` });
          }
          if (value > rules.max) {
            errors.push({ field, error: `too big, expect ${rules.min}, got ${value}` });
          }
          break;
      }
    }

    return errors;
  }
};
