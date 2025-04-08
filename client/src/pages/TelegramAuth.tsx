import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { FaTelegram, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const TelegramAuth = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate code format (6-10 characters)
    if (code.length < 6 || code.length > 10) {
      setError("Code must be 6-10 characters long");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login with code:", code);
      const success = await login(code);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to FUT Draft Spin!",
        });
        setLocation("/");
      } else {
        setError("Login failed. Please check your code and try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
      toast({
        title: "Login Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // For demo purposes, pre-fill with a valid code
  const handleDemoFill = () => {
    setCode("123456");
    setError("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Connect Your Telegram Account
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-4 text-center">
            Get your login code from the FUT Draft Telegram bot:
          </p>
          <div className="flex items-center justify-center mb-6">
            <FaTelegram className="text-blue-400 text-4xl mr-3" />
            <span className="font-bold text-white">@FutDraftSpinBot</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                id="telegramCode"
                placeholder="Enter code from Telegram bot"
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading || isSubmitting}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                "Connect Account"
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-sm text-gray-400 text-center">
            <p>
              Having trouble?{" "}
              <button
                onClick={handleDemoFill}
                className="text-blue-400 hover:underline"
              >
                Use Demo Code
              </button>
            </p>
            <p className="mt-2">
              <a
                href="https://t.me/FutDraftSpinBot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Open the Telegram bot
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TelegramAuth;
