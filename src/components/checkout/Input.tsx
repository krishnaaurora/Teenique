import React from 'react';
import styled from 'styled-components';

type Props = {
  label: string;
  name?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value?: string | number | boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({ label, name, placeholder, type = 'text', required = false, value, onChange, onFocus, onBlur, disabled }) => {
  return (
    <StyledWrapper>
      <label className="label">
        {label}{required && ' *'}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value as any}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className="input"
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .label {
    display: block;
    font-size: 0.875rem;
    color: #374151; /* gray-700 */
    margin-bottom: 0.25rem;
  }

  .input {
    max-width: 100%;
    width: 100%;
    padding: 0.875rem;
    font-size: 1rem;
    background: #f3f4f6; /* gray-100 */
    border: 1.5px solid #000;
    border-radius: 0.5rem;
    box-shadow: 2.5px 3px 0 #000;
    outline: none;
    transition: ease 0.25s;
    box-sizing: border-box;
  }

  .input:focus {
    box-shadow: 5.5px 7px 0 black;
  }
`;

export default Input;
