document.addEventListener("DOMContentLoaded", function () {
  // --------- FORMA + VALIDACIJA (jūsų jau turima) ---------
  const form = document.querySelector(".php-email-form");
  if (form) {
    form.innerHTML = "";

    function createInput(labelText, name, type = "text", validator = null, onInput = null) {
      const div = document.createElement("div");
      div.className = "col-md-6 form-group";

      const input = document.createElement("input");
      input.type = type;
      input.name = name;
      input.className = "form-control";
      input.placeholder = labelText;
      input.required = true;

      const error = document.createElement("div");
      error.className = "input-error";
      error.style.color = "#ff4d4d";
      error.style.fontSize = "14px";
      error.style.marginTop = "4px";

      input.addEventListener("input", function () {
        if (onInput) onInput(input);

        const value = input.value.trim();
        const validation = validator ? validator(value) : { valid: true };
        if (!validation.valid) {
          input.classList.add("is-invalid");
          error.textContent = validation.message;
        } else {
          input.classList.remove("is-invalid");
          error.textContent = "";
        }
        updateSubmitButtonState();
      });

      div.appendChild(input);
      div.appendChild(error);
      return div;
    }

    function createSlider(labelText, name) {
      const div = document.createElement("div");
      div.className = "col-12";

      const label = document.createElement("label");
      label.textContent = labelText;
      label.style.fontWeight = "600";

      const slider = document.createElement("input");
      slider.type = "range";
      slider.name = name;
      slider.min = "1";
      slider.max = "10";
      slider.value = "5";
      slider.className = "form-range";

      const output = document.createElement("span");
      output.textContent = `Vertinimas: ${slider.value}`;
      output.style.display = "block";
      output.style.marginTop = "4px";

      slider.addEventListener("input", function () {
        output.textContent = `Vertinimas: ${this.value}`;
      });

      div.appendChild(label);
      div.appendChild(slider);
      div.appendChild(output);
      return div;
    }

    const onlyLetters = (value) => {
      const regex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s-]+$/;
      if (value === "") return { valid: false, message: "Laukas negali būti tuščias" };
      if (!regex.test(value)) return { valid: false, message: "Tik raidės leidžiamos" };
      return { valid: true };
    };

    const emailValidator = (value) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value === "") return { valid: false, message: "Laukas negali būti tuščias" };
      if (!regex.test(value)) return { valid: false, message: "Neteisingas el. pašto formatas" };
      return { valid: true };
    };

    const notEmpty = (value) => {
      if (value === "") return { valid: false, message: "Laukas negali būti tuščias" };
      return { valid: true };
    };

    function formatPhoneInput(input) {
      let digits = input.value.replace(/\D/g, "");
      if (digits.startsWith("6")) digits = "370" + digits;
      digits = digits.substring(0, 11);
      let formatted = "";
      if (digits.startsWith("370") && digits.length > 3) {
        const rest = digits.substring(3);
        const p1 = rest.substring(0, 3);
        const p2 = rest.substring(3);
        formatted = `+370 ${p1}`;
        if (p2.length) formatted += ` ${p2}`;
      } else {
        formatted = digits;
      }
      input.value = formatted;
    }

    const row = document.createElement("div");
    row.className = "row gy-4";

    row.appendChild(createInput("Vardas", "vardas", "text", onlyLetters));
    row.appendChild(createInput("Pavardė", "pavarde", "text", onlyLetters));
    row.appendChild(createInput("El. paštas", "email", "email", emailValidator));
    row.appendChild(createInput("Telefono numeris", "telefonas", "tel", notEmpty, formatPhoneInput));
    row.appendChild(createInput("Adresas", "adresas", "text", notEmpty));
    row.appendChild(createSlider("Kaip vertinate mano dizaino įgūdžius?", "klausimas1"));
    row.appendChild(createSlider("Kaip vertinate programavimo kokybę?", "klausimas2"));
    row.appendChild(createSlider("Kaip greitai buvo atliktas darbas?", "klausimas3"));

    const submitDiv = document.createElement("div");
    submitDiv.className = "col-12 text-center";

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-primary";
    submitBtn.textContent = "Pateikti";
    submitBtn.disabled = true;

    submitDiv.appendChild(submitBtn);
    row.appendChild(submitDiv);
    form.appendChild(row);

    const resultDiv = document.createElement("div");
    resultDiv.className = "form-result";
    resultDiv.style.display = "none";
    form.appendChild(resultDiv);

function updateSubmitButtonState() {
  const inputs = form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel']");
  let allValid = true;
  inputs.forEach((input) => {
    // jeigu input turi klaidą (is-invalid), arba tuščias → invalid
    if (input.classList.contains("is-invalid") || input.value.trim() === "") {
      allValid = false;
    }
  });
  submitBtn.disabled = !allValid;
}


    form.addEventListener("submit", e => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const k1 = Number(data.klausimas1);
      const k2 = Number(data.klausimas2);
      const k3 = Number(data.klausimas3);
      const avg = ((k1 + k2 + k3) / 3).toFixed(1);
      resultDiv.innerHTML = `
        <h4>Jūsų pateikti duomenys:</h4>
        <p><strong>Vardas:</strong> ${data.vardas}</p>
        <p><strong>Pavardė:</strong> ${data.pavarde}</p>
        <p><strong>El. paštas:</strong> ${data.email}</p>
        <p><strong>Telefonas:</strong> ${data.telefonas}</p>
        <p><strong>Adresas:</strong> ${data.adresas}</p>
        <p><strong>Vidurkis:</strong> ${avg}</p>
        <p><strong>Santrauka:</strong> ${data.vardas} ${data.pavarde}: ${avg}</p>
      `;
      resultDiv.style.display = "block";
      resultDiv.classList.add("show");
      resultDiv.scrollIntoView({ behavior: "smooth" });
      showSuccessPopup("Duomenys pateikti sėkmingai!");
    });
  }

  function showSuccessPopup(msg) {
    const popup = document.createElement("div");
    popup.textContent = msg;
    popup.className = "custom-popup";
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add("visible"), 50);
    setTimeout(() => {
      popup.classList.remove("visible");
      setTimeout(() => popup.remove(), 300);
    }, 3000);
  }

  // --------- MEMORY GAME + TIMER + BEST SCORE ---------
  const board = document.getElementById("game-board");
  if (!board) return; // jei nėra žaidimo sekcijos — kodas nesikraus

  const movesCounter = document.getElementById("moves");
  const matchCounter = document.getElementById("matches");
  const winMessage = document.getElementById("win-message");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");
  const difficultySelect = document.getElementById("difficulty");

  const bestEasySpan = document.getElementById("best-easy");
  const bestHardSpan = document.getElementById("best-hard");
  const timerSpan = document.getElementById("timer");

  const emojiSet = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🦁','🐯','🐨','🐮','🐸','🐷','🦄','🐔','🐤','🐙','🦋','🐞','🐌','🐝','🐟','🦀','🐠','🦖','🐲'];

  let totalPairs = 6;
  let moves = 0;
  let matches = 0;
  let flippedCards = [];
  let lockBoard = false;

  let timer = null;
  let secondsElapsed = 0;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function loadBestScores() {
    const be = localStorage.getItem("memory_best_easy");
    const bh = localStorage.getItem("memory_best_hard");
    if (bestEasySpan) bestEasySpan.textContent = be ? be : "—";
    if (bestHardSpan) bestHardSpan.textContent = bh ? bh : "—";
  }

  loadBestScores();

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function startTimer() {
    clearInterval(timer);
    secondsElapsed = 0;
    if (timerSpan) timerSpan.textContent = formatTime(secondsElapsed);
    timer = setInterval(() => {
      secondsElapsed++;
      if (timerSpan) timerSpan.textContent = formatTime(secondsElapsed);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function updateStats() {
    if (movesCounter) movesCounter.textContent = moves;
    if (matchCounter) matchCounter.textContent = matches;
  }

  function createBoard() {
    board.innerHTML = "";
    moves = 0;
    matches = 0;
    flippedCards = [];
    lockBoard = false;
    updateStats();
    if (winMessage) winMessage.style.display = "none";

    stopTimer();
    if (timerSpan) timerSpan.textContent = "00:00";

    if (emojiSet.length < totalPairs) {
      console.error("Per mažai unikalių emoji");
      return;
    }

    const selected = shuffle(emojiSet).slice(0, totalPairs);
    const pairArray = shuffle([...selected, ...selected]);

    if (pairArray.length !== totalPairs * 2) {
      console.error("Kortelių kiekis netinkamas:", pairArray.length);
      return;
    }

    const cols = Math.min(pairArray.length / 2, 6);
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    pairArray.forEach((symb, idx) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = symb;
      card.dataset.index = idx;
      card.textContent = "";
      card.addEventListener("click", () => flipCard(card));
      board.appendChild(card);
    });
  }

  function finishGame() {
    stopTimer();

    const bestKey = totalPairs === 6 ? "memory_best_easy" : "memory_best_hard";
    const old = parseInt(localStorage.getItem(bestKey), 10);
    if (!old || moves < old) {
      localStorage.setItem(bestKey, moves);
      loadBestScores();
    }

    if (winMessage) winMessage.style.display = "block";
  }

  function flipCard(card) {
    if (lockBoard) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    if (moves === 0 && matches === 0 && flippedCards.length === 0) {
      startTimer();
    }

    card.classList.add("flipped");
    card.textContent = card.dataset.value;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      lockBoard = true;
      moves++;
      updateStats();

      const [c1, c2] = flippedCards;
      const same = c1.dataset.value === c2.dataset.value;
      const diffIndex = c1.dataset.index !== c2.dataset.index;

      if (same && diffIndex) {
        c1.classList.add("matched");
        c2.classList.add("matched");
        flippedCards = [];
        matches++;
        lockBoard = false;
        updateStats();
        if (matches === totalPairs) {
          finishGame();
        }
      } else {
        setTimeout(() => {
          c1.classList.remove("flipped");
          c2.classList.remove("flipped");
          c1.textContent = "";
          c2.textContent = "";
          flippedCards = [];
          lockBoard = false;
        }, 1000);
      }
    }
  }

  startBtn.addEventListener("click", () => {
    const lvl = difficultySelect.value;
    totalPairs = (lvl === "easy" ? 6 : 12);
    createBoard();
  });

  resetBtn.addEventListener("click", createBoard);
});
