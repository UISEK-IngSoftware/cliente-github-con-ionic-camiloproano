import axios from "axios";

const TOKEN_KEY = "github_auth_token";
const USERNAME_KEY = "github_auth_username";

class AuthService {
  // Validación real contra GitHub
  async loginWithGithub(username: string, token: string): Promise<boolean> {
    if (!username || !token) return false;

    try {
      const authHeader = 'Basic ' + btoa(username + ':' + token);
      const response = await axios.get('https://api.github.com/user', {
        headers: { Authorization: authHeader }
      });

      if (response.status === 200) {
        // Guardar datos solo si las credenciales son correctas
        this.logout();
        localStorage.setItem(USERNAME_KEY, username);
        localStorage.setItem(TOKEN_KEY, token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error autenticando en GitHub', error);
      return false;
    }
  }

  logout() {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(TOKEN_KEY) !== null
        && localStorage.getItem(USERNAME_KEY) !== null;
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUsername() {
    return localStorage.getItem(USERNAME_KEY);
  }

  getAuthHeader() {
    const token = this.getToken();
    const username = this.getUsername();

    if (token && username) {
      return 'Basic ' + btoa(username + ':' + token);
    }

    return null;
  }
}

export default new AuthService();
