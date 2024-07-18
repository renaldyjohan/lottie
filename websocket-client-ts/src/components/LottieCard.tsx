import React, { useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import './LottieCard.css';
import { useNavigate } from 'react-router-dom';

interface LottieCardProps {
  _id: string;
  name: string;
  jsonFile: any;
}

const LottieCard: React.FC<LottieCardProps> = ({ _id, jsonFile, name }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const navigate = useNavigate(); 
  return (
    <div className="card_container" onClick={() => navigate(`/${_id}`)}>
      <Lottie animationData={jsonFile} loop={true} lottieRef={lottieRef} />
      <div className="name_style">{name}</div>
    </div>
  );
};

export default LottieCard;
