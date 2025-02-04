import Answer from "../modules/answer.js";

class Game {
  #answerActive = 0;

  constructor(nbrTentative) {
    this.nbrTentative = nbrTentative;
    this.anserTab = [];
    this.creationAnswer();
  }

  creationAnswer() {
    for (let i = 0; i <= this.nbrTentative - 1; i++) {
      let answer = new Answer(this);
      this.anserTab.push(answer);
    }
    this.anserTab[0].activationForm();
  }

  changeAnswer() {
    if ((this.#answerActive == 4)) {
      this.displayMessage("Game over");
    } else {
      this.anserTab[this.#answerActive].form.setAttribute("inert", "");
      this.anserTab[this.#answerActive + 1].activationForm();
      this.#answerActive += 1;
    }
  }

  displayMessage(message) {
    document.querySelector(".message").textContent = message; // Sélectionne l'élément de message et met à jour son texte.
  }
}

export default Game;
