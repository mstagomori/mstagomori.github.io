function darkLight() {
  var elem = document.body;
  elem.classList.toggle("dark-body");

  var game = document.getElementById("game-container");
  
  if (game.className == "game-container") {
    game.className = "dark-game";
  } else {
    game.className = "game-container";
  }

  var em = document.getElementById('dark-em');
  if (em.innerText == "Enable Dark Mode!") {
    em.innerText = "Disable Dark Mode!";
  } else {
    em.innerText = "Enable Dark Mode!"
  }
}