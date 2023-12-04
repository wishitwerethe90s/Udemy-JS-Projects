'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Paarth Gupta',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Lokesh Gupta',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Nidhi Gupta',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Snigdha Gupta',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Creating Usernames
const createUsernames = function (accountsArray) {
  accountsArray.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// FUNCTIONALITIES/ACTIONS
const displayHistory = function (history, sort = false) {
  containerMovements.innerHTML = '';

  const sorted = sort ? history.slice().sort((a, b) => a - b) : history;

  sorted.forEach(function (mov, i) {
    const typeOfTransaction = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${typeOfTransaction}">${
      i + 1
    } ${typeOfTransaction}</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displaySummary = function (account) {
  const depositsTotal = account.movements
    .filter(txn => txn > 0)
    .reduce((accum, txn) => accum + txn, 0);
  labelSumIn.textContent = depositsTotal;

  const withdrawalsTotal = account.movements
    .filter(txn => txn < 0)
    .reduce((accum, txn) => accum + txn, 0);
  labelSumOut.textContent = `${Math.abs(withdrawalsTotal)}`;

  const interestTotal = account.movements
    .filter(txn => txn > 0)
    .map(dep => (dep * account.interestRate) / 100)
    .reduce((accum, int) => accum + int, 0);
  labelSumInterest.textContent = interestTotal;
};

const displayBalance = function (account) {
  const bal = account.movements.reduce((accum, txn) => accum + txn, 0);
  account.balance = bal;
  labelBalance.textContent = bal;
};

const updateUI = function (account) {
  displayBalance(account);
  displayHistory(account.movements);
  displaySummary(account);
};

/////////////////////////////////////////////////

// EVENT LISTENERS
let loggedUser;

// LOGIN
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevents default behavior (Reloads the page on btn click) of form btn

  loggedUser = accounts.find(
    user => user.username === inputLoginUsername.value
  );

  if (loggedUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome, ${loggedUser.owner}!`;
    containerApp.style.opacity = 100;

    // Clearing form fields
    inputLoginUsername.value = inputLoginPin.value = '';
  }

  updateUI(loggedUser);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  const txnValue = Number(inputTransferAmount.value);

  inputTransferAmount.value = inputTransferTo.value = '';
  inputLoanAmount.value = '';
  if (
    receiver &&
    txnValue > 0 &&
    loggedUser.balance > txnValue &&
    receiver.username !== loggedUser.username
  ) {
    loggedUser.movements.push(-txnValue);
    receiver.movements.push(txnValue);

    updateUI(loggedUser);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && loggedUser.movements.some(mov => mov >= amount * 0.1)) {
    loggedUser.movements.push(amount);

    updateUI(loggedUser);
  }
  inputLoanAmount.value = '';
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayHistory(loggedUser.movements, !sort);
  sort = !sort;
});
