import React, { useState } from 'react';
import { Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { StyledModal, StyledForm, LoginButton } from '../styled/LoginPopup.styled';
import { useAuth } from './AuthContext';

interface LoginPopupProps {
  show: boolean;
  onHide: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        setEmail('');
        setPassword('');
        onHide();
      } else {
        setError('Email must have @example.com');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <StyledModal show={show} onHide={onHide} centered backdrop="static" className="login-popup"
      backdropClassName="backdrop-blur">
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        <StyledForm onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}
              required disabled={isLoggingIn}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter any password" value={password}
            onChange={(e) => setPassword(e.target.value)} required disabled={isLoggingIn}/>
          </Form.Group>
          
          <LoginButton type="submit" className="w-100 mt-3" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                Signing in...
              </>
            ) : 'Login'}
          </LoginButton>
        </StyledForm>
      </Modal.Body>
    </StyledModal>
  );
};

export default LoginPopup;