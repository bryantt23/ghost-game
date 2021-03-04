// https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
function readTextFile(file) {
  //https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
  return new Promise(function (resolve, reject) {
    var rawFile = new XMLHttpRequest();
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText;
          return resolve(allText.split('\n'));
        }
      } else {
        reject('failed');
      }
    };
    rawFile.send(null);
  });
}

async function buildDictionary() {
  const dictionary = await readTextFile('./dictionary.txt');
  return dictionary;
}

class Player {
  constructor(name) {
    this.name = name;
  }

  guess = () => {
    const letter = prompt(`${this.name} Enter a letter`);
    if (!letter) {
      return;
    }
    return letter;
  };

  alertInvalidGuess = () => {
    console.log('You need to select another letter');
  };
}

class Game {
  constructor(dictionary, player1, player2) {
    this.fragment = '';
    this.dictionary = new Set(dictionary);
    this.currentPlayer = player1;
    this.previousPlayer = player2;
  }

  start() {
    console.log(this.isGameOver());
    while (!this.isGameOver()) {
      this.takeTurn(this.currentPlayer);
      console.log(`The current fragment is: ${this.fragment}`);
    }
  }

  nextPlayer() {
    let temp = this.currentPlayer;
    this.currentPlayer = this.previousPlayer;
    this.previousPlayer = temp;
  }

  takeTurn(player) {
    console.log(`It is ${player.name}'s turn`);
    const playerLetter = player.guess();
    let tempFragment = this.fragment + playerLetter;
    if (this.isValidPlay(tempFragment)) {
      this.fragment = tempFragment;
      console.log(`${player.name} has made the fragment into ${this.fragment}`);
      this.nextPlayer();
    } else {
      player.alertInvalidGuess();
    }
  }

  isValidPlay(fragment) {
    return (
      Array.from(this.dictionary).findIndex(word => word.startsWith(fragment)) >
      -1
    );
  }

  isGameOver() {
    if (this.dictionary.has(this.fragment)) {
      console.log(`Game over. The winner is ${this.currentPlayer.name}`);
      return true;
    }
    return;
  }
}

async function start() {
  const dict = await buildDictionary();
  const player1 = new Player('Abe'),
    player2 = new Player('Bri');
  const game = new Game(dict, player1, player2);
  console.log(game);
  game.start();
}

start();
