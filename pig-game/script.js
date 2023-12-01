'use strict';

// [1] Selecting elements: both are same
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1'); //supposed to be slightly faster
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

let scores, currentScore, activePlayer, gameOn;

// [2] Starting conditions
const init = function () {
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');

  currentScore = 0;
  scores = [0, 0];
  activePlayer = 0;
  gameOn = true;
};
init();

// Helper functions
const switchPlayer = function () {
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent = 0;

  activePlayer = activePlayer ? 0 : 1;

  player0El.classList.toggle('player--active'); // (!) New method learnt.
  player1El.classList.toggle('player--active');
};

// [3] Rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (gameOn) {
    const roll = Math.trunc(Math.random() * 6) + 1;

    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${roll}.png`; // (!) setting value for img src attribute

    if (roll !== 1) {
      // [i] Checking if roll is 1
      currentScore += roll;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // [ii] Switching active player
      switchPlayer();
    }
  }
});

// [4] Hold turn functionality
btnHold.addEventListener('click', function () {
  if (gameOn) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (scores[activePlayer] < 50) {
      switchPlayer();
    } else {
      // End Game: Declare Winner
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');

      gameOn = false;
    }
  }
});

// [5] Resetting game functionality
btnNew.addEventListener('click', init);
