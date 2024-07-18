import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { RootState } from '../redux/store';
import Sidebar from './Sidebar';
import './Detail.css';

interface ResponseData {
  _id: number;
  name: string;
  jsonFile: any;
}

const DetailPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const id = window.location.pathname.split('/')[1];
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`http://localhost:3000/animations/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setResponseData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    const websocket = new WebSocket('ws://localhost:3000');

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      websocket.send('Hello Server');
    };

    websocket.onmessage = (event) => {
      fetchData();
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [id]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(`http://localhost:3000/animations/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setResponseData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (data: any) => {
    const newData = { ...responseData };
    newData.name = data.name
    newData.jsonFile.fr = parseInt(data.frameRate);
    newData.jsonFile.layers[0].shapes[0].it.filter(
      (item: any) => item.ty === 'fl'
    )[0].o.k = parseInt(data.opacity);
    newData.jsonFile.layers[0].shapes[0].it.filter(
      (item: any) => item.ty === 'fl'
    )[0].c.k = data.fill.map((item: string) => parseFloat(item));
    try {
      await axios.put(`http://localhost:3000/animations/${id}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('Error updating data: ', error);
    }
  };

  return (
    <div className="detail_page">
      <Sidebar
        name={responseData?.name ?? ''}
        jsonFile={responseData?.jsonFile ?? undefined}
        onSubmit={handleSubmit}
      />
      {responseData && (
        <div className="main_content">
          <Lottie
            animationData={responseData?.jsonFile}
            loop={true}
            lottieRef={lottieRef}
          />
        </div>
      )}
    </div>
  );
};

export default DetailPage;
