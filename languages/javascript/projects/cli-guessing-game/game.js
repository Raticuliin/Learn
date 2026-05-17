import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

function generateTarget(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compareGuess(guess, target) {
  return guess - target;
}

function parseGuess(input, min, max) {
  if (
    input <= max &&
    input >= min &&
    !Number.isNaN(input) &&
    Number.isInteger(input)
  )
    return input;
  return null;
}

async function guessNumber() {
  const guess = await rl.question("What is your number: ");

  return Number(guess);
}

async function playGame() {
  const minNumber = await rl.question("Select a first number: ");
  const maxNumber = await rl.question("Select a second number: ");

  const numberToGuess = generateTarget(Number(minNumber), Number(maxNumber));

  let win = false;
  let intentos = 0;

  for (let i = 0; i < 7; i++) {
    let num = null;
    while (num == null) {
      num = await guessNumber();
      num = parseGuess(num, Number(minNumber), Number(maxNumber));
      if (num == null) console.log("Ese número no es valido");
    }

    const res = compareGuess(num, numberToGuess);

    if (res < 0) {
      console.log("demasiado bajo");
    } else if (res > 0) {
      console.log("demasiado alto");
    } else {
      intentos = i + 1;
      win = true;
      break;
    }
  }

  if (win) {
    console.log(`Has ganado en un total de ${intentos} intentos`);
  } else {
    console.log("Vaya, has perdido, el número correcto era: ", numberToGuess);
  }

  rl.close();
}

await playGame();
