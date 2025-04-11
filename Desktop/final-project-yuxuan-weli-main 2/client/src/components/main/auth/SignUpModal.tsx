import React, { useState } from 'react';
import './SignUpModal.css';
import { useSignUp } from '../../../hooks/useSignUp';

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShowLogin?: () => void;
}

const SignUpModal = ({ isOpen, onClose, onShowLogin }: SignUpModalProps) => {
    const { formData, errors, isLoading, handleInputChange, handleSubmit } = useSignUp();
    const [submitError, setSubmitError] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');

        const result = await handleSubmit();
        if (result.success) {
            setIsSuccess(true);
        } else {
            setSubmitError(result.message || 'Failed to sign up');
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        onClose();
    };

    const handleLoginClick = () => {
        handleClose();
        if (onShowLogin) {
            onShowLogin();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Sign Up</h2>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                
                {isSuccess ? (
                    <div className="success-message">
                        <h3>Sign Up Successful!</h3>
                        <p>Your account has been created successfully.</p>
                        <p>Please log in to post questions and interact with the community.</p>
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="bluebtn" 
                                onClick={handleLoginClick}
                            >
                                Log In Now
                            </button>
                            <button 
                                type="button" 
                                className="cancel-btn" 
                                onClick={handleClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {submitError && <div className="error-message">{submitError}</div>}
                        <form onSubmit={onSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    required
                                    minLength={3}
                                    placeholder="Enter your username"
                                />
                                <div className="field-requirements">
                                    Username must be at least 3 characters long
                                </div>
                                {errors.username && (
                                    <div className="field-error">{errors.username}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <div className="field-error">{errors.email}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Enter your password"
                                />
                                <div className="field-requirements">
                                    Password must be at least 6 characters long
                                </div>
                                {errors.password && (
                                    <div className="field-error">{errors.password}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Confirm your password"
                                />
                                <div className="field-requirements">
                                    Passwords must match
                                </div>
                                {errors.confirmPassword && (
                                    <div className="field-error">{errors.confirmPassword}</div>
                                )}
                            </div>
                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="bluebtn" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing up...' : 'Sign Up'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn" 
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        <div className="login-link">
                            Already have an account? <a href="#" onClick={handleLoginClick}>Log in</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SignUpModal; 