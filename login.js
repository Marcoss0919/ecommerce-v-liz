// ============================
// Elementos
// ============================
const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('submit-button');
const formStatus = document.getElementById('form-status');

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
  if (value.length === 0) {
    setError('password', 'Digite sua senha.');
    return false;
  }
  clearError('password');
  return true;
}

emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

// ============================
// Envio do formulário
// ============================
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const validations = [validateEmail(), validatePassword()];
  const isValid = validations.every(Boolean);

  if (!isValid) {
    formStatus.textContent = 'Revise os campos destacados antes de continuar.';
    formStatus.classList.remove('success');
    return;
  }

  // Simula uma chamada de rede — troque por uma chamada real de API quando integrar
  submitButton.disabled = true;
  submitButton.querySelector('.submit-button__label').textContent = 'Validando...';
  formStatus.textContent = '';

  setTimeout(() => {
    formStatus.textContent = 'Login realizado! Redirecionando para seus pedidos...';
    formStatus.classList.add('success');
    submitButton.disabled = false;
    submitButton.querySelector('.submit-button__label').textContent = 'Entrar';
    // Quando o dashboard existir, troque a linha acima por algo como:
    // window.location.href = 'dashboard.html';
  }, 900);
});
