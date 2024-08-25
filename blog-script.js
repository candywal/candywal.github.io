const blogPosts = [
    {
        title: "test blog post through new system",
        date: "2023-05-01",
        description: "Exploring the beauty of simplicity and efficiency in programming. Less is more.",
        slug: "test"
    },
    // {
    //     title: "Embracing the Void: Learning to Love Null",
    //     date: "2023-05-05",
    //     description: "A deep dive into the misunderstood concept of null and its philosophical implications in coding.",
    //     slug: "embracing-the-void"
    // },
    // {
    //     title: "The Zen of Debugging",
    //     date: "2023-05-10",
    //     description: "Finding inner peace while hunting elusive bugs. Meditation techniques for programmers.",
    //     slug: "zen-of-debugging"
    // },
    // {
    //     title: "Coding in the Shadows: The Allure of Dark Mode",
    //     date: "2023-05-15",
    //     description: "Why dark mode isn't just easy on the eyes, but a lifestyle choice for the nocturnal coder.",
    //     slug: "allure-of-dark-mode"
    // }
];

function createBlogPost(post) {
    const blogPost = document.createElement('div');
    blogPost.className = 'blog-post';
    blogPost.innerHTML = `
        <h2>${post.title}</h2>
        <div class="date">${post.date}</div>
        <p class="description">${post.description}</p>
    `;
    
    blogPost.addEventListener('click', function() {
        window.location.href = `blog/${post.slug}.html`;
    });
    
    return blogPost;
}

function renderBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    blogPosts.forEach(post => {
        blogGrid.appendChild(createBlogPost(post));
    });
}

document.addEventListener('DOMContentLoaded', renderBlogPosts);