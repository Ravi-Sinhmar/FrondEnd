import React, { useCallback, useState } from 'react';
import axios from 'axios';
import './ShowPosts.css';
import pic from './../../assets/Images/instaImg.jpeg';

function ShowPost() {
    const [isPost, setIsPost] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [inputValue, setInputValue] = useState(''); // State for the input box
    const [posts, setPosts] = useState([]); // Initialize as an array

    const handleLogin = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/login');
            if (response.data.status === 'success') {
                setIsLoggedIn(true);
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    // Function to handle input changes
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Function to handle the POST request
    const handlePost = useCallback(async () => {
        try {
            const response = await axios.post('http://localhost:5000/posts', {
                data: inputValue // Sending the input data
            });

            if (response.data.success) {
                setIsPost(true);
                const allPost = response.data.content;
                setPosts(allPost);
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [inputValue]); // Include inputValue as a dependency

    return (
        <div className="ShowPost">
            <button onClick={handleLogin} className='px-5 py-1 rounded-full ring-1 ring-black shadow-md shadow-blt min-w-fit h-fit'>Login</button>
            <input 
                type="text" 
                value={inputValue} 
                onChange={handleInputChange} 
                placeholder="Enter your data" 
            />
            <button onClick={handlePost} className='px-5 py-1 rounded-full ring-1 ring-black shadow-md shadow-blt min-w-fit h-fit'>Get Posts</button>
            {isLoggedIn ? <h1>Successfully Logged In</h1> : null}
            
            {isPost && posts.length > 0 ? posts.map(post => (
                <div className="post" key={post.postSrc}>
                    <img src={post.postSrc} alt='Post' />
                    <div className='flex justify-between items-center px-4 py-2'>
                        <p>Here will be the caption</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 bg-blf text-white font-bold p-2 rounded-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                    </div>
                </div>
            )) : null}
        </div>
    );
}

export default ShowPost;
