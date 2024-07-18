import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import ColorInput from './ColorInput';

interface SidebarProps {
  name: string;
  jsonFile: any;
  onSubmit: (data: {
    name: string;
    frameRate: number;
    fill: string[];
    opacity: number;
  }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ name, jsonFile, onSubmit }) => {
  const [tempName, setTempName] = useState(name);
  const [frameRate, setFrameRate] = useState(jsonFile?.fr || 0);
  const [fillR, setFillR] = useState(
    jsonFile?.layers[0].shapes[0].it.filter((item: any) => item.ty === 'fl')[0]
      .c.k[0] || 0
  );
  const [fillG, setFillG] = useState(
    jsonFile?.layers[0].shapes[0].it.filter((item: any) => item.ty === 'fl')[0]
      .c.k[1] || 0
  );
  const [fillB, setFillB] = useState(
    jsonFile?.layers[0].shapes[0].it.filter((item: any) => item.ty === 'fl')[0]
      .c.k[2] || 0
  );
  const [opacity, setOpacity] = useState(
    jsonFile?.layers[0].shapes[0].it.filter((item: any) => item.ty === 'fl')[0]
      .o.k || 0
  );

  useEffect(() => {
    if (jsonFile !== undefined) {
      setFrameRate(jsonFile.fr);
      setFillR(
        jsonFile?.layers[0].shapes[0].it
          .filter((item: any) => item.ty === 'fl')[0]
          .c.k.map((item: number) => item * 255)[0]
          .toFixed(0)
      );
      setFillG(
        jsonFile?.layers[0].shapes[0].it
          .filter((item: any) => item.ty === 'fl')[0]
          .c.k.map((item: number) => item * 255)[1]
          .toFixed(0)
      );
      setFillB(
        jsonFile?.layers[0].shapes[0].it
          .filter((item: any) => item.ty === 'fl')[0]
          .c.k.map((item: number) => item * 255)[2]
          .toFixed(0)
      );
      setOpacity(
        jsonFile?.layers[0].shapes[0].it
          .filter((item: any) => item.ty === 'fl')[0]
          .o.k.toFixed(0)
      );
      setTempName(name);
    }
  }, [jsonFile, name]);

  return (
    <div className="sidebar">
      <div className="item_name">
        <label>{name}</label>
      </div>
      <div className="adjustment_section">
        <label htmlFor="name">Name:</label>
        <input
          name="name"
          type="string"
          id="name"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
        />
      </div>
      <div className="adjustment_section">
        <label htmlFor="frameRate">Frame Rate:</label>
        <input
          name="fr"
          type="number"
          id="frameRate"
          value={frameRate}
          onChange={(e) => setFrameRate(e.target.value)}
        />
      </div>
      <div className="adjustment_section">
        <label htmlFor="opacity">Opacity:</label>
        <input
          type="number"
          id="opacity"
          value={opacity}
          onChange={(e) => {
            if (parseInt(e.target.value) > 100) {
              setOpacity(100);
            } else if (parseInt(e.target.value) < 0) {
              setOpacity(0);
            } else {
              setOpacity(e.target.value);
            }
          }}
        />
      </div>
      <div className="adjustment_section">
        <fieldset>
          <legend>Color Adjustment</legend>
          <ColorInput
            label="Red"
            id="fillR"
            value={fillR}
            setValue={setFillR}
          />
          <ColorInput
            label="Green"
            id="fillG"
            value={fillG}
            setValue={setFillG}
          />
          <ColorInput
            label="Blue"
            id="fillB"
            value={fillB}
            setValue={setFillB}
          />
        </fieldset>
      </div>
      <div className="adjustment_section">
        <button
          onClick={() => {
            onSubmit({
              name: tempName,
              frameRate: frameRate,
              fill: [
                (fillR / 255).toFixed(4),
                (fillG / 255).toFixed(4),
                (fillB / 255).toFixed(4),
              ],
              opacity: opacity,
            });
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
