document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare the data to be sent in the request body
    const userData = {
        username: username,
        email: email,
        password: password
    };

    try {
        // Send a POST request to your backend's registration endpoint
        const response = await fetch('https://doxxd-backend.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // Handle the response from the server
        if (response.ok) {
            const data = await response.json();
            alert('Registration successful!'); // You can replace this with more complex UI feedback
            console.log('User registered:', data);
        } else {
            const errorData = await response.json();
            alert(`Registration failed: ${errorData.msg}`);
            console.error('Error:', errorData);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('There was an error connecting to the server. Please try again.');
    }
});
