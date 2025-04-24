import styled from 'styled-components';

export const StyledButton = styled.button`
  padding: 12px 24px;
  background-color: #ffcf00;
  color: #000;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.2s ease;
  margin: 20px auto;
  
  &:hover {
    background-color: #ffd633;
  }
`;