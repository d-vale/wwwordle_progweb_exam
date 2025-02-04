function isAlphaNumericKey(key) {
  return /^([\x30-\x39]|[\x61-\x7a])$/i.test(key);
}

function isAlphaNumeric(word) {
  return /^[a-zA-Z]+$/.test(word);
}

class Answer {
  constructor(game) {
    this.form = this.generationForm();
    this.game = game;
    this.changeFocus();
    this.answerVerify();
  }

  generationForm() {
    //Container
    const container = document.querySelector("main.board");

    //Form
    const form = document.createElement("form");
    form.classList.add("row");
    form.id = `row-0`;
    form.setAttribute("inert", "");

    //input
    const input0 = document.createElement("input");
    input0.classList.add("letter");
    input0.type = "text";
    input0.name = "letter-0";
    input0.id = "row-0--0";
    input0.maxLength = "1";

    const input1 = document.createElement("input");
    input1.classList.add("letter");
    input1.type = "text";
    input1.name = "letter-1";
    input1.id = "row-0--1";
    input1.maxLength = "1";

    const input2 = document.createElement("input");
    input2.classList.add("letter");
    input2.type = "text";
    input2.name = "letter-2";
    input2.id = "row-0--2";
    input2.maxLength = "1";

    const input3 = document.createElement("input");
    input3.classList.add("letter");
    input3.type = "text";
    input3.name = "letter-3";
    input3.id = "row-0--3";
    input3.maxLength = "1";

    const input4 = document.createElement("input");
    input4.classList.add("letter");
    input4.type = "text";
    input4.name = "letter-4";
    input4.id = "row-0--4";
    input4.maxLength = "1";

    const inputSubmit = document.createElement("input");
    inputSubmit.type = "submit";
    inputSubmit.setAttribute("hidden", "");

    form.appendChild(input0);
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    form.appendChild(input4);
    form.appendChild(inputSubmit);

    container.appendChild(form);

    return form;
  }

  activationForm() {
    this.form.removeAttribute("inert");
    this.form[0].focus();
  }

  changeFocus() {
    this.form.addEventListener("keyup", function (e) {
      if (
        e.target.tagName === "INPUT" &&
        isAlphaNumericKey(e.target.value) &&
        e.target.nextElementSibling.type != "submit"
      ) {
        e.target.blur();
        e.target.nextElementSibling.focus();
      }
    });
  }

  async answerVerify() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formdata = new FormData(this.form);
      let answerToString = "";
      formdata.values();
      for (var value of formdata.values()) {
        answerToString += value;
      }

      if (answerToString.length < 5) {
        this.game.displayMessage(`${answerToString} n'a pas 5 lettre`);
      } else if (isAlphaNumeric(answerToString)) {
        this.game.displayMessage(`Votre réponse est ${answerToString}`);

        const answerToFetch = {
          guess: answerToString,
        };

        const options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answerToFetch),
        };

        const reponse = await fetch(
          "https://progweb-wwwordle-api.onrender.com/guess",
          options
        );
        const data = await reponse.json();
        if (
          data.message === "Not quite! Keep trying!" &&
          data.status === "valid"
        ) {
          this.colorChange(data);
          this.game.changeAnswer();
        } else if (
          data.status === "valid" &&
          data.message === "Congratulations! You found the word!"
        ) {
          this.game.displayMessage("Congratulations! You found the word!");
          this.colorChange(data);
        } else {
          this.game.displayMessage("This word is not in English !");
        }
      } else {
        this.game.displayMessage(
          `${answerToString} n'est pas seulement alphabétique`
        );
      }
    });
  }

  colorChange(data) {
    for (let i = 0; i <= 4; i++) {
      if (data.feedback[i].status === "correct") {
        this.form[i].style.backgroundColor = "green";
      } else if (data.feedback[i].status === "present") {
        this.form[i].style.backgroundColor = "yellow";
      } else if (data.feedback[i].status === "absent") {
        this.form[i].style.backgroundColor = "grey";
      }
    }
  }
}

export default Answer;
