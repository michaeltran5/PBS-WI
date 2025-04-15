import styled from 'styled-components';
import { Modal, Form, Button } from 'react-bootstrap';

export const StyledModal = styled(Modal)`
  .modal-content {
    background-color: #2639c3;
    color: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }
  
  .modal-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    
    .modal-title {
      font-family: 'PBS Sans', sans-serif;
      font-weight: 700;
    }
    
    .btn-close {
      filter: brightness(0) invert(1);
      opacity: 0.8;
      
      &:hover {
        opacity: 1;
      }
    }
  }
  
  .modal-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

export const StyledForm = styled(Form)`
  .form-label {
    font-family: 'PBS Sans', sans-serif;
    font-weight: 500;
  }

  .form-control {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-family: 'PBS Sans', sans-serif;
    
    &:focus {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  .form-text {
    font-family: 'PBS Sans', sans-serif;
    font-size: 0.8rem;
  }
`;

export const LoginButton = styled(Button)`
  background-color: #ffffff;
  color: #2639c3;
  border: none;
  font-family: 'PBS Sans', sans-serif;
  font-weight: 700;
  padding: 0.5rem 1.5rem;
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    background-color: #f0f0f0;
    color: #1e2da3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background-color: #cccccc;
    color: #666666;
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

export const ModalOverlay = styled.div`
  &.modal-backdrop {
    background-color: rgba(0, 5, 37, 0.5);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
`;