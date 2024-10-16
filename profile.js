document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const profilePic = document.getElementById('profilePic').files[0];
    const bio = document.getElementById('bio').value;

    const formData = new FormData();
    formData.append('profilePic', profilePic);
    formData.append('bio', bio);

    try {
        const response = await fetch('https://doxxd-backend.onrender.com/api/profile/setup', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Redirect to main feed after profile setup
            window.location.href = '/home.html';
        } else {
            const errorData = await response.json();
            alert(`Profile setup failed: ${errorData.msg}`);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('There was an error connecting to the server. Please try again.');
    }
});
