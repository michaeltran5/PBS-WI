import React from 'react';
import { StyledButton } from '../styled/PreviewButton.styled';

interface PreviewButtonProps {
  onClick: () => void;
}

const PreviewButton: React.FC<PreviewButtonProps> = ({ onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
      </svg>
      Watch Preview
    </StyledButton>
  );
};

export default PreviewButton;