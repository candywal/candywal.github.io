// const blogPosts = [
//     {
//         title: "test blog post through new system",
//         date: "2023-05-01",
//         description: "Exploring the beauty of simplicity and efficiency in programming. Less is more.",
//         link: "test"
//     },
//     {
//         title: "Embracing the Void: Learning to Love Null",
//         date: "2023-05-05",
//         description: "A deep dive into the misunderstood concept of null and its philosophical implications in coding.",
//         link: "embracing-the-void"
//     },
//     {
//         title: "The Zen of Debugging",
//         date: "2023-05-10",
//         description: "Finding inner peace while hunting elusive bugs. Meditation techniques for programmers.",
//         link: "zen-of-debugging"
//     },
//     {
//         title: "Coding in the Shadows: The Allure of Dark Mode",
//         date: "2023-05-15",
//         description: "Why dark mode isn't just easy on the eyes, but a lifestyle choice for the nocturnal coder.",
//         link: "google.com", 
//     }
// ];

const blogPosts = [];  

function createBlogPost(post) {
    const blogPost = document.createElement('div');
    blogPost.className = 'blog-post';
    blogPost.innerHTML = `
        <h2>${post.title}</h2>
        <div class="date">${post.date}</div>
        <p class="description">${post.description}</p>
    `;
    
    blogPost.addEventListener('click', function() {
        window.open(`https://${post.link}`, '_blank', 'noopener,noreferrer');
    });
    
    return blogPost;
}

function renderBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    
    if (blogPosts.length === 0) {
        const message = document.createElement('p');
        message.className = 'empty-blog-message';
        message.innerHTML = '"i will post something soon" - Anshul circa 400BC';
        blogGrid.appendChild(message);
        return;
    }

    blogPosts.forEach(post => {
        blogGrid.appendChild(createBlogPost(post));
    });
}

document.addEventListener('DOMContentLoaded', renderBlogPosts);