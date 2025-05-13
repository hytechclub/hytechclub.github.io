function getHighScores() {
  const hsKey = window.natMode ? "high-scores-nat" : "high-scores";
  const hsFromStorage = localStorage.getItem(hsKey);
  if (hsFromStorage) {
    return JSON.parse(hsFromStorage);
  } else {
    return [];
  }
}

function sendHighScore(newScore) {
  const hsKey = window.natMode ? "high-scores-nat" : "high-scores";
  const currentHighScores = getHighScores();
  currentHighScores.push(newScore);
  localStorage.setItem(hsKey, JSON.stringify(currentHighScores));
}

function getHighestScore() {
  const topScores = getTopScores();
  if (topScores.length === 0) {
    return 0;
  } else {
    return topScores[0].score;
  }
}

function addNewScore(score) {
  const currentHighest = getHighestScore();

  if (score > currentHighest) {
    alert("NEW HIGH SCORE!!!");
  }

  if (score === currentHighest) {
    alert("You tied for highest score!");
  }
  
  let initials = "";
  while (initials.length !== 3) {
    initials = prompt("You won! Enter your initials (3 characters)");
  }
  
  sendHighScore({ initials, score });
  displayHighScores();
}

function getTopScores() {
  const currentHighScores = getHighScores();
  currentHighScores.sort((hs1, hs2) => hs2.score - hs1.score);
  return currentHighScores;
}

function displayHighScores() {
  const hsLabel = document.querySelector("#hs-label");
  hsLabel.textContent = window.natMode ? "High Scores (natural mode)" : "High Scores";

  const hsTable = document.querySelector("#hs-table");
  hsTable.innerHTML = "";
  const topScores = getTopScores();
  
  const numToDisplay = Math.min(3, topScores.length);
  for (let i = 0; i < numToDisplay; i++) {
    const currentScore = topScores[i];
    const newRow = document.createElement("tr");
    
    const initsCell = document.createElement("td");
    initsCell.textContent = currentScore.initials;
    
    const scoreCell = document.createElement("td");
    scoreCell.textContent = currentScore.score;
    
    newRow.appendChild(initsCell);
    newRow.appendChild(scoreCell);
    hsTable.appendChild(newRow);
  }
}

displayHighScores();
