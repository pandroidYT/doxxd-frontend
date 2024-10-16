<script>
    // Tab Switching Logic
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Login Form Submission
    document.getElementById('loginFormElem').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('https://doxxd-backend.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.token) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);

                // Display success message
                document.getElementById('loginMessage').innerText = 'Login successful!';

                // Redirect to home page after login success
                setTimeout(() => {
                    window.location.href = 'index.html'; // Replace with the actual home page URL
                }, 1000);
            } else {
                // Show error message
                document.getElementById('loginMessage').innerText = 'Error: ' + data.msg;
            }
        } catch (err) {
            console.error('Error:', err);
            document.getElementById('loginMessage').innerText = 'Error logging in';
        }
    });

    // Sign-Up Form Submission
    document.getElementById('signupFormElem').addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://doxxd-backend.onrender.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (data.token) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);

                // Display success message
                document.getElementById('registerMessage').innerText = 'Registration successful!';

                // Redirect to home page after registration success
                setTimeout(() => {
                    window.location.href = 'index.html'; // Replace with the actual home page URL
                }, 1000);
            } else {
                // Show error message
                document.getElementById('registerMessage').innerText = 'Error: ' + data.msg;
            }
        } catch (err) {
            console.error('Error:', err);
            document.getElementById('registerMessage').innerText = 'Error registering user';
        }
    });
</script>
