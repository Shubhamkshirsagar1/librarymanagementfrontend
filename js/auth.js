const auth = {
    showLoginForm: function () {
      document.getElementById('app-content').innerHTML = `
        <h2>Login</h2>
        <form id="login-form">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" required />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
          <p class="mt-3">Don't have an account? <a href="#" id="show-register">Register here</a></p>
        </form>
      `;
  
      document.getElementById('login-form').addEventListener('submit', auth.login);
      document.getElementById('show-register').addEventListener('click', auth.showRegisterForm);
    },
  
    showRegisterForm: function () {
      document.getElementById('app-content').innerHTML = `
        <h2>Register</h2>
        <form id="register-form">
          <div class="mb-3">
            <label for="first_name" class="form-label">First Name</label>
            <input type="text" class="form-control" id="first_name" required />
          </div>
          <div class="mb-3">
            <label for="last_name" class="form-label">Last Name</label>
            <input type="text" class="form-control" id="last_name" required />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" required />
          </div>
          <div class="mb-3">
            <label for="role" class="form-label">Role</label>
            <select class="form-select" id="role">
              <option value="LIBRARIAN">Librarian</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
          <p class="mt-3">Already have an account? <a href="#" id="show-login">Login here</a></p>
        </form>
      `;
  
      document.getElementById('register-form').addEventListener('submit', auth.register);
      document.getElementById('show-login').addEventListener('click', auth.showLoginForm);
    },
  
    login: async function (event) {
      event.preventDefault();
      const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      };
  
      try {
        const result = await api.request('/auth/login', 'POST', data);
        localStorage.setItem('token', result.token);
        const payload = JSON.parse(atob(result.token.split('.')[1]));
        localStorage.setItem('role', payload.role);
        app.init();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    },
  
    register: async function (event) {
      event.preventDefault();
      const data = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.getElementById('role').value,
      };
  
      try {
        await api.request('/auth/register', 'POST', data);
        alert('Registration successful! Please login.');
        auth.showLoginForm();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    },
  
    logout: function () {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      app.init();
    },
  };
  