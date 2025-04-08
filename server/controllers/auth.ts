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

// Simple function to validate a code against Telegram API
// In a real scenario, this would make an API call to the Telegram bot
async function validateTelegramCode(code: string): Promise<{ telegramId: string, username: string } | null> {
  // This is a placeholder. In production, you'd make an API call to your Telegram bot
  // to validate the code and get the user info
  
  log(`Validating Telegram code: ${code}`, 'auth');
  
  // For demo purposes, accept any code that's 6-10 digits long
  if (code.length >= 6 && code.length <= 10) {
    return {
      telegramId: `telegram_${code}`,
      username: `user_${code}`
    };
  }
  
  return null;
}

export async function authenticateWithTelegram(req: Request, res: Response) {
  try {
    log('Authentication attempt with Telegram', 'auth');
    
    // Validate request body
    const { code } = telegramAuthSchema.parse(req.body);
    log(`Received auth code: ${code}`, 'auth');
    
    // Validate the code with Telegram
    const telegramUser = await validateTelegramCode(code);
    
    if (!telegramUser) {
      log('Invalid Telegram code provided', 'auth');
      return res.status(401).json({ message: 'Invalid or expired code' });
    }
    
    log(`Telegram validation successful for user: ${telegramUser.username}`, 'auth');
    
    // Check if user exists with this telegram ID
    let user = await storage.getUserByTelegramId(telegramUser.telegramId);
    
    if (!user) {
      log(`Creating new user for Telegram ID: ${telegramUser.telegramId}`, 'auth');
      // Create a new user if not found
      user = await storage.createUser({
        username: telegramUser.username,
        password: Math.random().toString(36).slice(2), // Generate a random password
        telegram_id: telegramUser.telegramId,
        telegram_username: telegramUser.username,
        coins: 1000 // Give new users some starting coins
      });
      log(`New user created with ID: ${user.id}`, 'auth');
    } else {
      log(`Existing user found with ID: ${user.id}`, 'auth');
    }
    
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
      message: 'Authentication successful',
      user: userInfo
    });
    
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      log(`Validation error: ${validationError.message}`, 'auth');
      return res.status(400).json({ message: validationError.message });
    }
    
    log(`Authentication error: ${error instanceof Error ? error.message : String(error)}`, 'auth');
    return res.status(500).json({ message: 'Authentication failed' });
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
