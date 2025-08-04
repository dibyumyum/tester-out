let selected = [];
let found = [];
let mistakes = 0;

const gridDiv = document.getElementById("grid");
const feedback = document.getElementById("feedback");
const solvedDiv = document.getElementById("solved-categories");
const mistakeTracker = document.getElementById("mistake-tracker");

function game() {
  puzzleWords.forEach(word => {
    const div = document.createElement("div");
    div.className = "tile";
    div.textContent = word;
    div.onclick = () => toggleSelect(div, word);
    gridDiv.appendChild(div);
  });

  for (let i = 0; i < maxMistakes; i++) {
    const circle = document.createElement("div");
    circle.className = "circle";
    mistakeTracker.appendChild(circle);
  }
}

function toggleSelect(tile, word) {
  if (tile.classList.contains("selected")) {
    tile.classList.remove("selected");
    selected = selected.filter(w => w !== word);
  } else if (selected.length < 4) {
    tile.classList.add("selected");
    selected.push(word);
  }
}

function submitGuess() {
  if (selected.length !== 4) {
    feedback.textContent = "Select exactly four words.";
    return;
  }

  const matchedCategory = categories.find(cat =>
    cat.words.every(w => selected.includes(w)) &&
    !found.includes(cat.name)
  );

  if (matchedCategory) {
  found.push(matchedCategory.name);

  const bar = document.createElement("div");
  bar.className = `bar ${matchedCategory.color}`;

  const titleTile = document.createElement("div");
  titleTile.className = "tile category-title";
  titleTile.textContent = matchedCategory.name;
  bar.appendChild(titleTile);

  matchedCategory.words.forEach(w => {
    if (w !== matchedCategory.name) { // just in case
      const wordDiv = document.createElement("div");
      wordDiv.className = "tile";
      wordDiv.textContent = w;
      bar.appendChild(wordDiv);
    }
  });

  solvedDiv.appendChild(bar);

  document.querySelectorAll(".tile").forEach(tile => {
    if (selected.includes(tile.textContent)) {
      tile.remove();
    }
  });

  } else {
    // One away?
    const oneAway = categories.find(cat =>
      selected.filter(w => cat.words.includes(w)).length === 3 &&
      !found.includes(cat.name)
    );

    if (oneAway) {
      feedback.textContent = "One Away...";
    } else {
      feedback.textContent = "Incorrect group.";
    }
      mistakeTracker.children[mistakes].classList.add("used");
      mistakes++;
  }

  selected = [];
  document.querySelectorAll(".tile").forEach(tile => tile.classList.remove("selected"));

  if (mistakes >= maxMistakes) {
    feedback.textContent = "Next Time!";
    revealRemainingAnswers();
  }

  if (found.length === 4) {
    if (mistakes === 0) {
       feedback.textContent = "Perfect!";
    } else if (mistakes >= 1 && mistakes <= 2) {
       feedback.textContent = "Excellent!";
    } else if (mistakes >= 3 && mistakes <= 4) {
       feedback.textContent = "Great!";
    } else if (mistakes >= 5 && mistakes <= 6) {
       feedback.textContent = "Solid!";
    } else if (mistakes >= 7 && mistakes <= 8) {
       feedback.textContent = "Good!";
    } else if (mistakes === maxMistakes - 1) {
       feedback.textContent = "Phew!";
    }
  }
}

function revealRemainingAnswers() {
  gridDiv.innerHTML = "";
  categories.forEach(cat => {
    if (!found.includes(cat.name)) {
      const bar = document.createElement("div");
      bar.className = `bar ${cat.color}`;
      
      const titleTile = document.createElement("div");
      titleTile.className = "tile category-title";
      titleTile.textContent = cat.name;
      bar.appendChild(titleTile);
      
      cat.words.forEach(w => {
        if (w !== cat.name) {
          const wordDiv = document.createElement("div");
          wordDiv.className = "tile";
          wordDiv.textContent = w;
          bar.appendChild(wordDiv);
        }
      });
      
      solvedDiv.appendChild(bar);
    }
  });
}

game();
