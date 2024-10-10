import React from 'react'

const Menu = () => {
  const posts = [
    {
      id: 1,
      title: "Exploring the Future of Quantum Computing",
      description: "Quantum computing holds the potential to revolutionize technology with incredible computational power. This article explores its future.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1K4m0eRgD-RF9AoMRO5Jfda47483d1L-ikg&s"
    },
    {
      id: 2,
      title: "Mental Health in the Modern World",
      description: "Mental health awareness is more important than ever. Learn about the growing significance of mental well-being and support systems.",
      imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528"
    },
    {
      id: 3,
      title: "Top 10 JavaScript Libraries for 2024",
      description: "Explore the most popular JavaScript libraries to streamline your development process and build dynamic web applications in 2024.",
      imageUrl: "https://images.unsplash.com/photo-1555580647-6b39f2a4a15f"
    },
    {
      id: 4,
      title: "Building a Full MERN Stack Application",
      description: "A step-by-step guide to building a full-stack web application using MongoDB, Express, React, and Node.js.",
      imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7"
    },
    {
      id: 5,
      title: "Effective Coding Practices for Developers",
      description: "Improve your coding practices with these simple but effective tips that will make you a more productive and efficient developer.",
      imageUrl: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f"
    }
  ];

  return (
    <div className='menu'>
      <h1>Other Post You May Like</h1>
      {posts.map((post) => (
        <div className='post' key={post.id}>
          <img src={post.imageUrl} alt='' />
          <h2>{post.title}</h2>
          <button>Read More</button>
        </div>
      ))}
    </div>
  )
}

export default Menu