import { Input } from '@mui/material';

export const LabelAndInput = (p: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
}) => {
  const { label, onChange, value, type = 'text', name } = p;
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'full',
          gap: '1rem',
        }}
      >
        <span
          style={{
            lineHeight: '2rem',
          }}
        >
          {label}
        </span>
        <Input
          value={value}
          type={type}
          name={name || label.toLocaleLowerCase()}
          onChange={onChange}
          style={{
            width: 'full',
            background: 'white',
          }}
        />
      </div>
    </>
  );
};
