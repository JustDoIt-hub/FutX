import { Request, Response } from 'express';
import { storage } from '../storage';
import { telegramAuthSchema } from '@shared/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { log } from '../vite';
import 'express-session';

// Extend the session type to include userId
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Simple login function that auto-creates a demo user
export async function login(req: Request, res: Response) {
  try {
    log('Simple login attempt', 'auth');
    
    // Create a username with timestamp to ensure uniqueness
    const username = `user_${Date.now()}`;
    
    // Create a new user
    log(`Creating new user with username: ${username}`, 'auth');
    const user = await storage.createUser({
      username,
      password: Math.random().toString(36).slice(2), // Generate a random password
      telegram_id: null,
      telegram_username: null,
      coins: 5000 // Give new users some starting coins
    });
    
    log(`New user created with ID: ${user.id}`, 'auth');
    
    // Store user in session
    if (req.session) {
      req.session.userId = user.id;
      log(`User ID ${user.id} stored in session`, 'auth');
    } else {
      log('Session object not available!', 'auth');
    }
    
    // Return user info (excluding password)
    const { password, ...userInfo } = user;
    return res.status(200).json({ 
      message: 'Login successful',
      user: userInfo
    });
    
  } catch (error) {
    log(`Login error: ${error instanceof Error ? error.message : String(error)}`, 'auth');
    return res.status(500).json({ message: 'Login failed' });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const userId = req.session?.userId;
    
    if (!userId) {
      log('No user ID found in session', 'auth');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    log(`Fetching current user with ID: ${userId}`, 'auth');
    const user = await storage.getUser(userId);
    
    if (!user) {
      log(`User with ID ${userId} not found in database`, 'auth');
      return res.status(404).json({ message: 'User not found' });
    }
    
    log(`Returned user info for ID: ${userId}`, 'auth');
    const { password, ...userInfo } = user;
    return res.status(200).json({ user: userInfo });
    
  } catch (error) {
    log(`Get current user error: ${error instanceof Error ? error.message : String(error)}`, 'auth');
    return res.status(500).json({ message: 'Failed to get user information' });
  }
}

export async function logout(req: Request, res: Response) {
  if (req.session) {
    const userId = req.session.userId;
    log(`Logging out user with ID: ${userId}`, 'auth');
    
    req.session.destroy((err) => {
      if (err) {
        log(`Error destroying session: ${err.message}`, 'auth');
        return res.status(500).json({ message: 'Failed to logout' });
      }
      
      log('Session destroyed, clearing cookie', 'auth');
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } else {
    log('No session found for logout', 'auth');
    return res.status(200).json({ message: 'Already logged out' });
  }
}
