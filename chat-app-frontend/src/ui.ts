export function updateUIOnLogin(loginForm: HTMLElement, registerForm: HTMLElement, logoutButton: HTMLElement) {
  loginForm.style.display = 'none';
  registerForm.style.display = 'none';
  logoutButton.style.display = 'block';
}

export function resetUIOnLogout(loginForm: HTMLElement, registerForm: HTMLElement, logoutButton: HTMLElement) {
  loginForm.style.display = 'block';
  registerForm.style.display = 'block';
  logoutButton.style.display = 'none';
}

  