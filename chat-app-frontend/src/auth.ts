// chat-app-frontend/src/auth.ts
export function login(username: string, password: string, onSuccess: (token: string) => void, onError: (error: any) => void) {
  fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);  // Store token locally
        onSuccess(data.token);
      } else {
        onError(data);
      }
    })
    .catch(onError);
}

export function register(username: string, password: string, onSuccess: () => void, onError: (error: any) => void) {
  fetch('http://localhost:4000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(onSuccess)
    .catch(onError);
}

export function logout() {
  localStorage.removeItem('jwtToken');  // Remove token
  window.location.reload();  // Reload the page to reset the UI
}

export function checkIfLoggedIn() {
  return localStorage.getItem('jwtToken');  // Return the token if logged in
}

  