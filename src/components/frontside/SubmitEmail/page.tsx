
import React, { useState } from 'react';
import axios from 'axios';
import { errorToast, successToast } from '@/components/toster';

function Submitemail() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage('Email is required');
      return;
    } else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      const response: any = await axios.post('/api/subscribe/newsletter', { email });
      if (response.data.st) {
        successToast(response.data.msg);
        setEmail('');
      } else {
        errorToast(response.data.msg);
      }
    } catch (error: any) {
      errorToast(error.message)
      console.error('Error subscribing to newsletter:', error);
    }
  };



  return (
    <div className="grid md:grid-cols-2 bg-[#f7f5f5] py-16 gap-10 justify-center items-center px-24">
      <div className="flex flex-col">
        <p className="font-medium text-[40px] roboto">
          Subscribe to the newsletter
        </p>
        <p className="font-normal text-base roboto pt-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eu sit
          mauris, tristique ultrices mauris. Consectetur eget nunc, dui
          pellentesque ultrices morbi nisl. Iaculis tempor rutrum.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex justify-center items-center">
        <input
          type="text"
          placeholder="ENTER YOUR EMAIL"
          value={email}
          onChange={handleChange}
          className="bg-white font-bold py-2 px-4 border-2 border-black"
        />
        <button type="submit" className="bg-black p-[13px]">
          <img src="/image/ArrowRight.svg" alt="Submit" />
        </button>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </form>
    </div>
  );
}

export default Submitemail;
