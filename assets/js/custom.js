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
