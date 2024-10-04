import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './ShowPosts.css';
import { saveAs } from 'file-saver';

const BACKEND_URL = 
  process.env.REACT_APP_NODE_ENV === 'development'
    ? process.env.REACT_APP_DEVELOPMENT_BACKEND_URL
    : process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_PRODUCTION_BACKEND_URL
      : '';

const ImageWithRetry = ({ src, alt, maxRetries = 3 }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
      setCurrentSrc(src); // Retry loading the same image
    } else {
      setCurrentSrc('path/to/placeholder/image.jpg'); // Set a placeholder image after max retries
    }
  };

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      onError={handleImageError}
    />
  );
};

function ShowPost() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const [message, setMessage] = useState("Message");
  const [status, setStatus] = useState("Status");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [postCount, setPostCount] = useState('');
  const [posts, setPosts] = useState([]);

  const handleLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/login`);
      if (response.data.status === 'success') {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log(event.target.value);

  };

  const handleCountChange = (event) => {
    setPostCount(event.target.value);
    console.log(event.target.value)
  };

  const handlePost = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsPost(false);
      setStatus("Status");
      setMessage("Message");
      const response = await axios.post(`${BACKEND_URL}/posts`, {
        instaUsername: inputValue,
        numberOfPosts: postCount,

      });
      setStatus(response.data.status);
      setMessage(response.data.type);
      if (response.data.status === 'success') {
        setIsPost(true);
        const allPost = response.data.content;
        setPosts(allPost);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  }, [inputValue,postCount]);

  const downloadImage = (image_url, name) => {
    // Proxy the request through your own backend server
    const proxiedUrl = `http://localhost:5000/proxy-image?url=${encodeURIComponent(image_url)}`;
  
    axios.get(proxiedUrl, { responseType: 'blob' })
      .then(response => {
        const blob = new Blob([response.data], { type: 'image/jpeg' });
  
        if (window.navigator.msSaveBlob) {
          window.navigator.msSaveBlob(blob, `${name}.jpeg`);
        } else {
          saveAs(blob, `${name}.jpeg`);
        }
      })
      .catch(error => {
        console.error('Error downloading the image:', error);
      });
  };

  return (
    <div className='flex flex-col items-center justify-center  w-full h-full'>
      {!isLoggedIn ? (
        <button onClick={handleLogin} className='text-lg flex justify-center items-center rounded-full px-6 py-2 bg-blf text-white mt-4'>
          {isLoading ? <p>Loading</p> : <p>Get Started</p>}
        </button>
      ) : null}
      {isLoggedIn ? (
        <div className='flex gap-4 px-5 py-2 border-blb items-center bg-blf rounded-sm w-full justify-around'>
          <input 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange} 
            placeholder="Instagram Public Username" 
            className='border-blb border-2 rounded-md w-full  px-4 py-2'
          />
           <input 
            type="number" 
            value={postCount} 
            onChange={handleCountChange} 
            placeholder="No. of Posts want to extract" 
            className='border-blb border-2 rounded-md w-full  px-4 py-2'
          />
          <button onClick={handlePost} className='px-5 py-1 rounded-full ring-1 ring-blh shadow-md shadow-blt min-w-fit h-fit bg-blf text-white '> 
            {isLoading ? <p>Extracting...</p> : <p>Get Posts</p>} 
          </button>
        </div>
      ) : null}
      {!isPost  ? <h6 className='text-black'>{`Status: ${status} & ${message}`}</h6> : null}
      {isPost ? (
        <div className="ShowPost bg-blf">
{(posts.length > 0 ? posts.slice(0, postCount) : []).map(post => (
  <div className="post" key={post.postSrc}>
    <ImageWithRetry 
      src={`http://localhost:5000/proxy-image?url=${encodeURIComponent(post.postSrc)}`} 
      alt='Post' 
    />
    <div className='flex justify-between items-center px-4 py-2'>
      <p>Here will be the caption</p>
      <button onClick={() => downloadImage(post.postSrc, inputValue)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 bg-blf text-white font-bold p-2 rounded-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
    </div>
  </div>
))}

        </div>
      ) : null}
    </div>
  );
}

export default ShowPost;