import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
`;

interface TabButtonProps {
  isActive: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: ${props => props.isActive ? '#000525' : 'transparent'};
  color: ${props => props.isActive ? 'white' : '#b0b0b0'};
  border: none;
  border-bottom: ${props => props.isActive ? '2px solid #ffcf00' : '2px solid transparent'};
  cursor: pointer;
  font-size: 16px;
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
  transition: all 0.2s ease;

  &:last-child {
    margin-right: 0;
  }
`;