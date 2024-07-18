import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import LottieCard from './LottieCard';
import AddNewCard from './AddNewCard';
import './Home.css';

interface Animation {
  _id: string;
  name: string;
  jsonFile: any;
}

const Home: React.FC = () => {
  const [list, setList] = useState<Animation[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const getAnimationList = async () => {
      try {
        const response = await axios('http://localhost:3000/animations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setList(response.data);
      } catch (error) {
        console.error('Error fetching animation list: ', error);
      }
    };
    if (token) getAnimationList();
  }, [token]);

  return (
    <div className='list_container'>
      {list.map((animation) => (
        <div key={animation._id}>
          <LottieCard _id={animation._id} jsonFile={animation.jsonFile} name={animation.name} />
        </div>
      ))}
      <AddNewCard token={token} />
    </div>
  );
};

export default Home;
