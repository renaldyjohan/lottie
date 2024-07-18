import React, { useRef } from 'react';
import IconFilePlus from './plusIcon';
import './LottieCard.css';
import axios from 'axios';

interface AddNewCardProps {
  token: string;
}

const AddNewCard: React.FC<AddNewCardProps> = ({ token }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if(file) {
      const fileName = file?.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async () => {
        const csvData = reader.result;
        try {
          await axios.post('http://localhost:3000/animations', {
            name: fileName,
            jsonFile: JSON.parse(csvData as string),
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Error uploading file: ', error);
        }
      };
    }
  };

  return (
    <div className="add_container">
      <div className="svg_container" onClick={handleUploadClick}>
        <IconFilePlus />
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileChange}
        />
      </div>
      <div className="name_style">Add New Animation</div>
    </div>
  );
};

export default AddNewCard;
