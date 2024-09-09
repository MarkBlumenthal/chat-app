// Handles the login process and stores the token
export async function login(username: string, password: string, onSuccess: (token: string) => void, onError: (error: string) => void) {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
    const result = await response.json();
  
    if (response.ok) {
      const token = result.token;
      localStorage.setItem('jwtToken', token); // Store the token locally
      onSuccess(token);
    } else {
      onError(result.error);
    }
  }
  
  // Handles user registration
  export async function register(username: string, password: string, onSuccess: () => void, onError: (error: string) => void) {
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
  
    const result = await response.json();
  
    if (response.ok) {
      onSuccess();
    } else {
      onError(result.error);
    }
  }
  
  // Handles the logout process
  export function logout() {
    localStorage.removeItem('jwtToken'); // Remove the token from local storage
    window.location.reload(); // Reload the page
  }
  
  // Check if a user is logged in by verifying if a token is stored
  export function checkIfLoggedIn(): string | null {
    return localStorage.getItem('jwtToken');
  }
  