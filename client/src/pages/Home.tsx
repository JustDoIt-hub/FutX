import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FaFutbol, FaSpinner, FaGamepad } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If user is not authenticated, redirect to auth page
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <FaSpinner className="animate-spin text-4xl text-yellow-400 mx-auto" />
        <p className="mt-4 text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Welcome to FUT Draft Spin!
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Spin to collect players, build your dream team, and battle against opponents in exciting matches!
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl overflow-hidden shadow-xl"
        >
          <div className="p-6">
            <FaFutbol className="text-4xl text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Player Spin</h2>
            <p className="text-gray-200 mb-6">
              Spin the wheel to get new players for your collection. Combine position, event, and rating to find rare cards!
            </p>
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
              onClick={() => setLocation("/spin")}
            >
              Start Spinning
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl overflow-hidden shadow-xl"
        >
          <div className="p-6">
            <FaGamepad className="text-4xl text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Team Battle</h2>
            <p className="text-gray-200 mb-6">
              Create your ultimate team with different formations and play styles. Challenge opponents in exciting matches!
            </p>
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold"
              onClick={() => setLocation("/team-battle")}
            >
              Battle Now
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-400 mb-4">
          Connected with Telegram: <span className="text-yellow-400">{user.telegram_username || user.username}</span>
        </p>
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            onClick={() => window.open("https://t.me/FutDraftSpinBot", "_blank")}
          >
            <FaFutbol className="mr-2" /> Open Telegram Bot
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
