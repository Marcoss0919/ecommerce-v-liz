// ============================
// Elementos
// ============================
const form = document.getElementById('signup-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');
const termsInput = document.getElementById('terms');
const submitButton = document.getElementById('submit-button');
const formStatus = document.getElementById('form-status');
const termsError = document.getElementById('terms-error');

const sealMeter = document.getElementById('seal-meter');
const sealLabel = document.getElementById('seal-label');

// ============================
// Mostrar / ocultar senha
// ============================
document.querySelectorAll('.toggle-visibility').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);
    const isHidden = input.type === 'password';

    input.type = isHidden ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(isHidden));
    button.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
  });
});

// ============================
// Medidor de "lacre" (força da senha)
// ============================
const strengthLabels = {
  0: 'Sem lacre',
  1: 'Lacrado',
  2: 'Reforçado',
  3: 'Blindado',
  4: 'Blindado',
};

function calculateStrength(value) {
  if (!value) return 0;

  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value) && value.length >= 10) score++;

  if (value.length < 6) score = Math.min(score, 1);

  return Math.max(score, value.length > 0 ? 1 : 0);
}

passwordInput.addEventListener('input', () => {
  const strength = calculateStrength(passwordInput.value);
  sealMeter.dataset.strength = String(strength);
  sealLabel.textContent = strengthLabels[strength];
  clearError('password');
});

// ============================
// Login social (Google / Facebook)
// Hoje só dá o feedback visual — quando integrar de verdade,
// troque o corpo desta função pela chamada ao SDK/OAuth do provedor
// e redirecione para o dashboard após o retorno.
// ============================
document.querySelectorAll('.social-button').forEach((button) => {
  button.addEventListener('click', () => {
    const provider = button.dataset.provider;
    formStatus.textContent = `Conectando com ${provider}...`;
    formStatus.classList.remove('success');
  });
});

// ============================
// Helpers de erro
// ============================
function setError(fieldName, message) {
  const field = document.getElementById(fieldName).closest('.field');
  const errorEl = document.getElementById(`${fieldName}-error`);
  if (field) field.classList.add('has-error');
  if (errorEl) errorEl.textContent = message;
}

function clearError(fieldName) {
  const field = document.getElementById(fieldName).closest('.field');
  const errorEl = document.getElementById(`${fieldName}-error`);
  if (field) field.classList.remove('has-error');
  if (errorEl) errorEl.textContent = '';
}

// ============================
// Validações
// ============================
function validateName() {
  const value = nameInput.value.trim();
  if (value.length < 2) {
    setError('name', 'Digite seu nome completo.');
    return false;
  }
  clearError('name');
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) {
    setError('email', 'Digite um e-mail válido.');
    return false;
  }
  clearError('email');
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  if (value.length < 8) {
    setError('password', 'A senha precisa ter no mínimo 8 caracteres.');
    return false;
  }
  clearError('password');
  return true;
}

function validateConfirmPassword() {
  if (confirmInput.value !== passwordInput.value || confirmInput.value === '') {
    setError('confirm-password', 'As senhas não coincidem.');
    return false;
  }
  clearError('confirm-password');
  return true;
}

function validateTerms() {
  if (!termsInput.checked) {
    termsError.textContent = 'Você precisa aceitar os termos para continuar.';
    termsError.classList.add('visible');
    return false;
  }
  termsError.textContent = '';
  termsError.classList.remove('visible');
  return true;
}

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);
confirmInput.addEventListener('blur', validateConfirmPassword);
termsInput.addEventListener('change', validateTerms);

// ============================
// Envio do formulário
// ============================
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const validations = [
    validateName(),
    validateEmail(),
    validatePassword(),
    validateConfirmPassword(),
    validateTerms(),
  ];

  const isValid = validations.every(Boolean);

  if (!isValid) {
    formStatus.textContent = 'Revise os campos destacados antes de continuar.';
    formStatus.classList.remove('success');
    return;
  }

  // Simula uma chamada de rede — troque por uma chamada real de API quando integrar
  submitButton.disabled = true;
  submitButton.querySelector('.submit-button__label').textContent = 'Gerando etiqueta...';
  formStatus.textContent = '';

  setTimeout(() => {
    formStatus.textContent = `Conta criada! Bem-vindo(a) à Véliz, ${nameInput.value.trim().split(' ')[0]}.`;
    formStatus.classList.add('success');
    submitButton.disabled = false;
    submitButton.querySelector('.submit-button__label').textContent = 'Criar conta';
    form.reset();
    sealMeter.dataset.strength = '0';
    sealLabel.textContent = strengthLabels[0];
    // Quando o dashboard existir, troque o reset acima por algo como:
    // window.location.href = 'dashboard.html';
  }, 900);
});
