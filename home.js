// Post something to the feed
document.getElementById('postForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const postContent = document.getElementById('postContent').value;

    const postData = {
        content: postContent
    };

    try {
        const response = await fetch('https://doxxd-backend.onrender.com/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            document.getElementById('postContent').value = '';
            loadFeed(); // Refresh the feed after posting
        } else {
            alert('Failed to post. Try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Try again.');
    }
});

// Load the feed
async function loadFeed() {
    try {
        const response = await fetch('https://doxxd-backend.onrender.com/api/posts');
        const posts = await response.json();

        const feed = document.getElementById('feed');
        feed.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <p><strong>${post.user.username}</strong>: ${post.content}</p>
            `;
            feed.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error loading feed:', error);
    }
}

// Load feed on page load
window.onload = loadFeed;
