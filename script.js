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
      throw Error('leaving');
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
    return this.previousPlayer;
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

class GameManager {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.score = this.generateScore(player1, player2);
  }

  generateScore(player1, player2) {
    return {
      [player1.name]: 0,
      [player2.name]: 0
    };
  }

  resetScore(player1, player2) {
    return { [player1.name]: 0, [player2.name]: 0 };
  }

  displayStandings() {
    const str = 'GHOST';
    const p1String = str.substring(0, this.score[this.player1.name]);
    const p2String = str.substring(0, this.score[this.player2.name]);
    console.log(`${this.player1.name} has a status of ${p1String}`);
    console.log(`${this.player2.name} has a status of ${p2String}`);
  }

  start(dictionary) {
    while (!this.isGameOver()) {
      const game = new Game(dictionary, this.player1, this.player2);
      const loser = game.start();
      console.log(loser);
      this.updateScore(loser);
      this.displayStandings();
      console.log(JSON.stringify(this));
    }
    console.log(JSON.stringify(this.score));
  }

  updateScore(loser) {
    this.score[loser.name]++;
  }

  isGameOver() {
    for (let x of Object.values(this.score)) {
      if (x === 5) {
        return true;
      }
    }
    return false;
  }
}

async function start() {
  const dict = await buildDictionary();
  const player1 = new Player('Abe'),
    player2 = new Player('Bri');
  const gameManager = new GameManager(player1, player2);
  gameManager.start(dict);
  console.log(gameManager);
  // console.log(game);
  // game.start();
}

start();
