// Select elements
const postBtn = document.getElementById('postBtn');
const postsContainer = document.getElementById('posts');
const textarea = document.querySelector('textarea');

// Add a new post
postBtn.addEventListener('click', () => {
    const content = textarea.value;

    if (content.trim() === '') {
        alert('Post cannot be empty!');
        return;
    }

    // Create a new post element
    const post = document.createElement('div');
    post.classList.add('post');

    post.innerHTML = `
        <div class="username">@user123</div>
        <div class="content">${content}</div>
    `;

    // Add the post to the posts container
    postsContainer.prepend(post);

    // Clear the textarea
    textarea.value = '';
});
