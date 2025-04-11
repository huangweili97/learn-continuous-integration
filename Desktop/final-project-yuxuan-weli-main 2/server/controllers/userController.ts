import { Router, Request, Response } from "express";
import { UserInput } from "../types/types";
import User from "../models/users";

const router = Router();

/**
 * @route POST /users/register
 * @description Creates a new user account
 * @param {Request} req - Express request object containing user data
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Responds with success status and auth token or error message
 */
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body as UserInput;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Create new user
        const user = await User.createUser({
            username,
            email,
            password
        });

        // Generate auth token
        const token = await user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error: unknown) {
        console.error('Sign up error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign up';
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
});

/**
 * @route POST /users/login
 * @description Authenticates a user and returns a token
 * @param {Request} req - Express request object containing login credentials
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Responds with auth token or error message
 */
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Find user by email and explicitly select the password field
        const user = await User.findOne({ email }).select('+password');
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid login credentials'
            });
        }

        // Check password using the user's comparePassword method
        console.log('Comparing passwords...');
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');
        
        if (!isMatch) {
            console.log('Password does not match for user:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid login credentials'
            });
        }

        // Generate auth token
        const token = await user.generateAuthToken();
        console.log('Login successful for user:', email);

        res.json({
            success: true,
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error: unknown) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
        res.status(500).json({
            success: false,
            message: errorMessage
        });
    }
});

export default router; 