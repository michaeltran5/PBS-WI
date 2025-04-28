import styled from 'styled-components';
import { Modal, Form, Button } from 'react-bootstrap';

export const StyledModal = styled(Modal)`
  .modal-content {
    background-color: #171b33;
    color: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    border: none;
  }
  
  .modal-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
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
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export const StyledForm = styled(Form)`
  .form-label {
    font-family: 'PBS Sans', sans-serif;
    font-weight: 500;
    color: #e6e6e6;
  }

  .form-control {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-family: 'PBS Sans', sans-serif;
    
    &:focus {
      background-color: rgba(255, 255, 255, 0.15);
      color: white;
      box-shadow: 0 0 0 0.2rem rgba(38, 57, 195, 0.25);
      border-color: #2639c3;
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  .form-text {
    font-family: 'PBS Sans', sans-serif;
    font-size: 0.8rem;
    color: #b0b0b0;
  }
`;

export const LoginButton = styled(Button)`
  background-color: #ffcc00;
  color: #171b33;
  border: none;
  font-family: 'PBS Sans', sans-serif;
  font-weight: 700;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    background-color: #ffd633;
    color: #171b33;
  }
  
  &:active {
    background-color: #e6b800;
    color: #171b33;
  }
  
  &:disabled {
    background-color: rgba(255, 204, 0, 0.5);
    color: rgba(23, 27, 51, 0.7);
  }
`;

export const ForgotPasswordLink = styled.a`
  color: #b0b0b0;
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: 10px;
  display: inline-block;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

export const SignUpLink = styled.div`
  text-align: center;
  margin-top: 15px;
  color: #b0b0b0;
  
  a {
    color: #2639c3;
    text-decoration: none;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SocialLoginButton = styled(Button)`
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 8px 16px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  svg {
    font-size: 18px;
  }
`;

export const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &:before,
  &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  span {
    margin: 0 10px;
    color: #b0b0b0;
    font-size: 0.9rem;
    text-transform: uppercase;
  }
`;