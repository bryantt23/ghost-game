// https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open('GET', file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        console.log(allText);
      }
    }
  };
  rawFile.send(null);
}

console.log(readTextFile('./dictionary.txt'));
