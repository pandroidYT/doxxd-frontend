// Toggle between Sign-Up and Sign-In forms
document.getElementById('signUpTab').addEventListener('click', () => toggleForms('signUp'));
document.getElementById('signInTab').addEventListener('click', () => toggleForms('signIn'));

function toggleForms(formType) {
    if (formType === 'signUp') {
        document.getElementById('signUpTab').classList.add('active');
        document.getElementById('signInTab').classList.remove('active');
        document.getElementById('signUpForm').classList.add('active');
        document.getElementById('signInForm').classList.remove('active');
    } else {
        document.getElementById('signUpTab').classList.remove('active');
        document.getElementById('signInTab').classList.add('active');
        document.getElementById('signUpForm').classList.remove('active');
        document.getElementById('signInForm').classList.add('active');
    }
}

// Handle Sign-Up form submission
document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('signUpUsername').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;

    const userData = { username, email, password };

    try {
        const response = await fetch('https://doxxd-backend.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert('Sign-up successful!');
            window.location.href = '/profile-setup.html';
        } else {
            const errorData = await response.json();
            alert(`Sign-up failed: ${errorData.msg}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to sign up. Please try again.');
    }
});

// Handle Sign-In form submission
document.getElementById('signInForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    const loginData = { email, password };

    try {
        const response = await fetch('https://doxxd-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Save JWT token
            window.location.href = '/home.html'; // Redirect to home page
        } else {
            const errorData = await response.json();
            alert(`Sign-in failed: ${errorData.msg}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to sign in. Please try again.');
    }
});
