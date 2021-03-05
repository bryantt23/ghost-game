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
  constructor(dictionary, players) {
    this.fragment = '';
    this.dictionary = new Set(dictionary);
    this.currentIndex = 0;
    this.players = players;
  }

  start() {
    console.log(this.isGameOver());
    while (!this.isGameOver()) {
      this.takeTurn(this.players[this.currentIndex]);
      console.log(`The current fragment is: ${this.fragment}`);
    }
    console.log(' Loser is', this.players[this.currentIndex]);
    // return this.previousPlayer;
    return this.players[this.currentIndex];
  }

  nextPlayer() {
    this.currentIndex = (this.currentIndex + 1) % this.players.length;
    // let temp = this.currentPlayer;
    // this.currentPlayer = this.previousPlayer;
    // this.previousPlayer = temp;
  }

  takeTurn(player) {
    console.log(`It is ${player.name}'s turn`);
    const playerLetter = player.guess();
    let tempFragment = this.fragment + playerLetter;
    if (this.isValidPlay(tempFragment)) {
      this.fragment = tempFragment;
      console.log(`${player.name} has made the fragment into ${this.fragment}`);
      if (!this.isGameOver()) {
        this.nextPlayer();
      }
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
      console.log('Loser is', this.players[this.currentIndex]);
      return true;
    }
    return;
  }
}

class GameManager {
  targetCount = 2;
  constructor(players) {
    this.players = players;
    this.score = this.generateScore(players);
  }

  generateScore(players) {
    let score = {};
    players.forEach(player => {
      score[player.name] = 0;
    });
    return score;
  }

  resetScore(players) {
    return this.generateScore(players);
  }

  displayStandings() {
    const str = 'GHOST';
    // const p2String = str.substring(0, this.score[this.player2.name]);
    // console.log(`${this.player1.name} has a status of ${p1String}`);
    // console.log(`${this.player2.name} has a status of ${p2String}`);

    this.players.forEach(player => {
      const pString = str.substring(0, this.score[player.name]);
      console.log(`${player.name} has a status of ${pString}`);
    });
  }

  start(dictionary) {
    while (!this.isGameOver()) {
      const game = new Game(dictionary, this.players);
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
      if (x === this.targetCount) {
        return true;
      }
    }
    return false;
  }
}

async function start() {
  const dict = await buildDictionary();
  const player1 = new Player('Abe'),
    player2 = new Player('Bri'),
    player3 = new Player('Cat');
  const gameManager = new GameManager([player1, player2]);
  gameManager.start(dict);
  console.log(gameManager);
  // console.log(game);
  // game.start();
}

start();
