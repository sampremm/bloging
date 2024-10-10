import React from 'react';
import dele from '../img/delete.png';
import edit from '../img/editbutton.png';
import { Link } from 'react-router-dom';
import Menu from '../components/Menu';

const Single = () => {
  return (
    <div className='single'>
      <div className='content'>
        <img
          src='https://cdn.pixabay.com/photo/2018/05/01/07/52/tuscany-3364921_640.jpg'
          alt='Tuscany Landscape'
        />
        <div className='user'> 
          <img
            src='https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
            alt='User Profile'
          />
          <div className='info'>
            <span>John Doe</span>
            <p>Posted 2 days ago</p>
          </div>
          <div className='edit'>
          <Link to = {`/write?edit=2`}>
            <img src={edit} alt='Edit'></img>
          </Link>
            <img src={dele} alt='Edit'></img>
          </div>
        </div>
        <h1>
          Lorem ipsum dolor sit amet consectetur adipisicing elit nostrum   
        </h1>
        <p>
        echnical Skills:
      Frontend: React.js, Tailwind CSS, modern web design principles.
      Backend:Node.js, Express.js, Spring Boot for building scalable server-side applications.
      Database: MongoDB for efficient data management.
      Additional: Socket.IO (real-time communication), multithreaded server applications in Java.

      What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


        </p>
      </div>
      <Menu />
      </div>

  );
}

export default Single;
