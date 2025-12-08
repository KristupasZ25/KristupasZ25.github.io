document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".php-email-form");
  if (!form) return;

  form.innerHTML = "";

  // Pagalbinė funkcija su validacija ir (jei reikia) onInput
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

  // Slider
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

  // Validatoriai
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

  // Jei pradeda nuo 6, pridėti +370
  if (digits.startsWith("6")) {
    digits = "370" + digits;
  }

  // Sutrumpinam iki max 11 skaitmenų po + (3706XXXXXXX)
  digits = digits.substring(0, 11);

  // Formatuojam kaip +370 6xx xxxxx
  let formatted = "";
  if (digits.startsWith("370") && digits.length > 3) {
    const rest = digits.substring(3); // 6xxxxxxx
    const part1 = rest.substring(0, 3); // pirmi 3 skaitmenys (pvz 612)
    const part2 = rest.substring(3);   // likę (pvz 34567)
    formatted = `+370 ${part1}`;
    if (part2.length > 0) {
      formatted += ` ${part2}`;
    }
  } else {
    formatted = digits;
  }

  input.value = formatted;
}

  // Sukuriam formą
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
  submitBtn.disabled = true; // pradžioje neaktyvus

  submitDiv.appendChild(submitBtn);
  row.appendChild(submitDiv);
  form.appendChild(row);

  const resultDiv = document.createElement("div");
  resultDiv.className = "form-result";
  resultDiv.style.display = "none";
  form.appendChild(resultDiv);

  // Funkcija patikrinimui ar visi laukeliai validūs
  function updateSubmitButtonState() {
    const inputs = form.querySelectorAll("input");
    let allValid = true;
    inputs.forEach((input) => {
      const isInvalid = input.classList.contains("is-invalid") || input.value.trim() === "";
      if (isInvalid) {
        allValid = false;
      }
    });
    submitBtn.disabled = !allValid;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const klaus1 = Number(data.klausimas1);
    const klaus2 = Number(data.klausimas2);
    const klaus3 = Number(data.klausimas3);
    const vidurkis = ((klaus1 + klaus2 + klaus3) / 3).toFixed(1);

    resultDiv.innerHTML = `
      <h4>Jūsų pateikti duomenys:</h4>
      <p><strong>Vardas:</strong> ${data.vardas}</p>
      <p><strong>Pavardė:</strong> ${data.pavarde}</p>
      <p><strong>El. paštas:</strong> ${data.email}</p>
      <p><strong>Telefonas:</strong> ${data.telefonas}</p>
      <p><strong>Adresas:</strong> ${data.adresas}</p>
      <p><strong>Vidurkis:</strong> ${vidurkis}</p>
      <p><strong>Santrauka:</strong> ${data.vardas} ${data.pavarde}: ${vidurkis}</p>
    `;
    resultDiv.style.display = "block";
    resultDiv.classList.add("show");
    resultDiv.scrollIntoView({ behavior: "smooth" });

    showSuccessPopup("Duomenys pateikti sėkmingai!");
  });
});

// Pop-up funkcija
function showSuccessPopup(message) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.className = "custom-popup";

  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("visible"), 50);
  setTimeout(() => {
    popup.classList.remove("visible");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}


document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const movesCounter = document.getElementById("moves");
  const matchCounter = document.getElementById("matches");
  const winMessage = document.getElementById("win-message");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");
  const difficultySelect = document.getElementById("difficulty");

  // Pakankamai didelis emoji masyvas — kad užtektų net sunkesniam lygiui
  const emojiSet = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🦁','🐯','🐨','🐮','🐸','🐷','🦄','🐔','🐤','🐙','🦋','🐞','🐌','🐝','🐟','🦀','🐠','🦖','🐲'];

  let totalPairs = 6;
  let moves = 0;
  let matches = 0;
  let flippedCards = [];
  let lockBoard = false;

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createBoard() {
    board.innerHTML = "";
    moves = 0;
    matches = 0;
    flippedCards = [];
    lockBoard = false;
    updateStats();
    winMessage.style.display = "none";

    if (emojiSet.length < totalPairs) {
      console.error("Per mažai unikalių emoji: reikia:", totalPairs, "turime:", emojiSet.length);
      return;
    }

    const selected = shuffle(emojiSet).slice(0, totalPairs);
    const pairArray = shuffle([...selected, ...selected]);

console.log("Pasirinktos poros:", selected);
console.log("Galutinis kortelių masyvas:", pairArray);
console.log("Kortelių skaičius:", pairArray.length);


    // Patikrinam — porų masyvas turi būti lygus totalPairs*2
    if (pairArray.length !== totalPairs * 2) {
      console.error("Neteisingas porų masyvo ilgis:", pairArray.length, "vietoj", totalPairs * 2);
      return;
    }

    const cols = Math.min(pairArray.length / 2, 6);
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    pairArray.forEach((symbol, idx) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = symbol;
      card.dataset.index = idx;   // unikalus ID
      card.textContent = "";
      card.addEventListener("click", () => flipCard(card));
      board.appendChild(card);
    });
  }

  function flipCard(card) {
    if (lockBoard) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

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
        // sutapo
        c1.classList.add("matched");
        c2.classList.add("matched");
        flippedCards = [];
        matches++;
        lockBoard = false;
        updateStats();

        if (matches === totalPairs) {
          winMessage.style.display = "block";
        }
      } else {
        // neatitiko — verčiam atgal
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

  function updateStats() {
    movesCounter.textContent = moves;
    matchCounter.textContent = matches;
  }

  startBtn.addEventListener("click", () => {
    const lvl = difficultySelect.value;
    if (lvl === "easy") totalPairs = 6;
    else if (lvl === "hard") totalPairs = 12;
    else totalPairs = 6;

    createBoard();
  });

  resetBtn.addEventListener("click", createBoard);
});
