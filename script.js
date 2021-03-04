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
      }
    };
    rawFile.send(null);
  });
}

async function buildDictionary() {
  const dictionary = await readTextFile('./dictionary.txt');
  console.log(dictionary);
}

buildDictionary();
// console.log(readTextFile('./dictionary.txt'));
