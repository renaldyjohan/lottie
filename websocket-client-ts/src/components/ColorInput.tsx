interface ColorInputProps {
  label: string;
  id: string;
  value: number;
  setValue: (value: number) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({
  label,
  id,
  value,
  setValue,
}) => (
  <div>
    <label htmlFor={id}>{label}:</label>
    <input
      type="number"
      id={id}
      value={value}
      onChange={(e) => {
        const newValue = parseInt(e.target.value);
        if (newValue > 255) {
          setValue(255);
        } else if (newValue < 0) {
          setValue(0);
        } else {
          setValue(newValue);
        }
      }}
    />
  </div>
);

export default ColorInput;
