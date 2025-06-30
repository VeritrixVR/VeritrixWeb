(function () {
  const form = document.getElementById("bookingForm");
  const steps = Array.from(form.querySelectorAll("fieldset"));
  let currentStep = 0;

  // Buttons and elements
  const btnStart = document.getElementById("startBtn");
  const btnNext1 = document.getElementById("next1");
  const btnNext2 = document.getElementById("next2");
  const btnNext3 = document.getElementById("next3");
  const btnNext4 = document.getElementById("next4");
  const btnNext5 = document.getElementById("next5");
  const btnBack2 = document.getElementById("back2");
  const btnBack3 = document.getElementById("back3");
  const btnBack4 = document.getElementById("back4");
  const btnBack5 = document.getElementById("back5");
  const btnBack6 = document.getElementById("back6");
  const btnSubmit = document.getElementById("submitBtn");
  const summaryDetails = document.getElementById("summaryDetails");

  // Credit card step elements
  const stepCardDetails = document.getElementById("stepCardDetails");
  const cardBack = document.getElementById("cardBack");
  const cardSubmitBtn = document.getElementById("cardSubmitBtn");

  // Form inputs step 1
  const inputName = form.querySelector("#name");
  const inputEmail = form.querySelector("#email");
  const inputPhone = form.querySelector("#phone");
  const inputAddress = form.querySelector("#address");

  const errorName = inputName.nextElementSibling;
  const errorEmail = inputEmail.nextElementSibling;
  const errorPhone = inputPhone.nextElementSibling;
  const errorAddress = inputAddress.nextElementSibling;

  // Step2 simulations
  const simCards = form.querySelectorAll(".sim-card");
  const simError = document.getElementById("sim-error");

  // Step3 duration select
  const selectDuration = form.querySelector("#duration");
  const durationError = selectDuration.nextElementSibling;

  // Step4 headset radios
  const headsetInputs = form.querySelectorAll('input[name="headset"]');
  const headsetError = document.getElementById("headset-error");

  // Step5 payment radios
  const paymentInputs = form.querySelectorAll('input[name="payment"]');
  const paymentError = document.getElementById("payment-error");

  // Credit card inputs
  const cardNumber = form.querySelector("#cardNumber");
  const cardName = form.querySelector("#cardName");
  const expiryDate = form.querySelector("#expiryDate");
  const cvc = form.querySelector("#cvc");

  // Exchange rate USD to ARS
  const USD_TO_ARS = 350;

  // Validation functions for step1
  function validateStep1() {
    let valid = true;
    if (inputName.value.trim() === "") {
      errorName.style.display = "block";
      valid = false;
    } else {
      errorName.style.display = "none";
    }

    if (!validateEmail(inputEmail.value.trim())) {
      errorEmail.style.display = "block";
      valid = false;
    } else {
      errorEmail.style.display = "none";
    }
    if (inputPhone.value.trim() === "") {
      errorPhone.style.display = "block";
      valid = false;
    } else {
      errorPhone.style.display = "none";
    }
    if (inputAddress.value.trim() === "") {
      errorAddress.style.display = "block";
      valid = false;
    } else {
      errorAddress.style.display = "none";
    }
    return valid;
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Step2 validation - always true (optional selection)
  function validateStep2() {
    simError.style.display = "none";
    return true;
  }

  // Step3 duration validation
  function validateStep3() {
    if (!selectDuration.value) {
      durationError.style.display = "block";
      return false;
    } else {
      durationError.style.display = "none";
      return true;
    }
  }

  // Step4 headset validation
  function validateStep4() {
    let selected = false;
    headsetInputs.forEach((input) => {
      if (input.checked) selected = true;
    });
    if (!selected) {
      headsetError.style.display = "block";
    } else {
      headsetError.style.display = "none";
    }
    return selected;
  }

  // Step5 payment validation
  function validateStep5() {
    let selected = false;
    paymentInputs.forEach((input) => {
      if (input.checked) selected = true;
    });
    if (!selected) {
      paymentError.style.display = "block";
    } else {
      paymentError.style.display = "none";
    }
    return selected;
  }

  // Validate credit card inputs, simple validation
  function validateCardDetails() {
    let valid = true;
    if (!/^\d{13,19}$/.test(cardNumber.value.replace(/\s+/g, ""))) {
      cardNumber.nextElementSibling.style.display = "block";
      valid = false;
    } else {
      cardNumber.nextElementSibling.style.display = "none";
    }
    if (cardName.value.trim() === "") {
      cardName.nextElementSibling.style.display = "block";
      valid = false;
    } else {
      cardName.nextElementSibling.style.display = "none";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate.value.trim())) {
      expiryDate.nextElementSibling.style.display = "block";
      valid = false;
    } else {
      expiryDate.nextElementSibling.style.display = "none";
    }
    if (!/^\d{3,4}$/.test(cvc.value.trim())) {
      cvc.nextElementSibling.style.display = "block";
      valid = false;
    } else {
      cvc.nextElementSibling.style.display = "none";
    }
    return valid;
  }

  // Show specific step by index
  function showStep(index) {
    steps.forEach((fieldset, i) => {
      fieldset.style.display = i === index ? "flex" : "none";
      fieldset.classList.toggle("active", i === index);
    });
    currentStep = index;
    if (index === steps.length) {
      stepCardDetails.style.display = "flex";
    } else {
      stepCardDetails.style.display = "none";
    }
    const step6 = document.getElementById("step6");
    if (index === 6) {
      step6.style.display = "flex";
    } else {
      step6.style.display = "none";
    }
  }

  // Calculate price as before (duration is minutes number)
  function calculatePrice(selectedSims, durationMinutes) {
    if (selectedSims.length === 0) return 0;
    let total = 0;
    selectedSims.forEach((input) => {
      const card = input.closest(".sim-card");
      let basePrice = (card && parseFloat(card.dataset.price)) || 7000;
      total += (basePrice * durationMinutes) / 30;
    });
    return total.toFixed(2);
  }

  function getSelectedCheckboxes(name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`));
  }

  function getSelectedValue(name) {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : null;
  }

  // Render summary
  function renderSummary() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const address = form.querySelector("#address").value.trim();
    const selectedSims = getSelectedCheckboxes("simulation");
    const duration = parseInt(selectDuration.value, 10);
    const headset = getSelectedValue("headset");
    const payment = getSelectedValue("payment");
    const priceARS = calculatePrice(selectedSims, duration);

    let simsList =
      selectedSims.length > 0
        ? `<ul>${selectedSims
            .map((input) => `<li><strong>${input.value}</strong></li>`)
            .join("")}</ul>`
        : "<em>Sin simulaciones seleccionadas</em>";

    let durationText = "";
    switch (duration) {
      case 15:
        durationText = "15 minutos";
        break;
      case 20:
        durationText = "20 minutos";
        break;
      case 25:
        durationText = "25 minutos";
        break;
      case 30:
        durationText = "30 minutos";
        break;
      case 45:
        durationText = "45 minutos";
        break;
      case 60:
        durationText = "1 hora";
        break;
      case 75:
        durationText = "1 hora 15 minutos";
        break;
      case 90:
        durationText = "1 hora 30 minutos";
        break;
      case 120:
        durationText = "2 horas";
        break;
      default:
        durationText = `${duration} minutos`;
    }

    summaryDetails.innerHTML = `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone}</p>
      <p><strong>Dirección:</strong> ${address}</p>
      <p><strong>Simulaciones:</strong><br>${simsList}</p>
      <p><strong>Duración:</strong> ${durationText}</p>
      <p><strong>Casco VR:</strong> ${headset || "<em>No seleccionado</em>"}</p>
      <p><strong>Método de pago:</strong> ${payment || "<em>No seleccionado</em>"}</p>
      <p><strong>Total a pagar:</strong> <span style="color: var(--color-primary); font-weight: 700;">$${parseFloat(priceARS).toLocaleString("es-AR")}</span></p>
      <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.7rem;">Presiona "Iniciar Simulación" para comenzar tu experiencia.</p>
    `;
  }

  // Navigate between steps, with special handling for credit card redirect
  btnStart.addEventListener("click", () => {
    showStep(1);
  });

  btnNext1.addEventListener("click", () => {
    if (validateStep1()) showStep(2);
  });

  btnNext2.addEventListener("click", () => {
    if (validateStep2()) showStep(3);
  });

  btnNext3.addEventListener("click", () => {
    if (validateStep3()) showStep(4);
  });

  btnNext4.addEventListener("click", () => {
    if (validateStep4()) showStep(5);
  });

  btnNext5.addEventListener("click", () => {
    if (!validateStep5()) return;

    const selectedPayment = getSelectedValue("payment");
    if (selectedPayment === "Tarjeta de Crédito") {
      showStepCardDetails();
    } else {
      renderSummary();
      showStep(6);
    }
  });

  function showStepCardDetails() {
    steps.forEach((f) => (f.style.display = "none"));
    stepCardDetails.style.display = "flex";
    cardNumber.focus();
  }

  cardBack.addEventListener("click", () => {
    stepCardDetails.style.display = "none";
    showStep(5);
  });

  cardSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateCardDetails()) {
      stepCardDetails.style.display = "none";
      renderSummary();
      showStep(6);
    }
  });

  btnBack2.addEventListener("click", () => showStep(1));
  btnBack3.addEventListener("click", () => showStep(2));
  btnBack4.addEventListener("click", () => showStep(3));
  btnBack5.addEventListener("click", () => showStep(4));
  btnBack6.addEventListener("click", () => showStep(5));

  btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    alert(
      "¡Simulación iniciada!\n\nGracias por elegir Veritrix para tu experiencia en realidad virtual."
    );
    form.reset();
    showStep(0);
  });

  // Keyboard support for sim-card toggle checkbox
  simCards.forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event("change"));
      }
    });
  });

  // Click toggle for sim cards except textarea and inputs/labels
  simCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!["INPUT", "LABEL"].includes(e.target.tagName)) {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        }
      }
    });
  });

  // Headset cards radio selection click
  document.querySelectorAll(".headset-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (!["INPUT", "LABEL", "SPAN"].includes(e.target.tagName)) {
        const radio = card.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event("change"));
        }
      }
    });
  });

  showStep(0);
})();
