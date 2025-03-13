export default class QuizQuestion {
    constructor(id, country, correctanswer, options) {
      this.id = id;
      this.country = country;
      this.correctanswer = correctanswer;
      this.options = options;
    }
  
    isValid() {
      return (
        this.country &&
        this.correctanswer &&
        Array.isArray(this.options) &&
        this.options.length >= 3
      );
    }
  }