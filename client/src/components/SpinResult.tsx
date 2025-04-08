import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PlayerCard from "./PlayerCard";
import { Link } from "wouter";

interface SpinResultProps {
  result: any;
  onReset: () => void;
}

const SpinResult = ({ result, onReset }: SpinResultProps) => {
  if (!result || !result.player) {
    return null;
  }

  return (
    <motion.div 
      className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-6 text-center text-white">SPINNING RESULT</h3>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-6">
          <PlayerCard player={result.player} size="lg" />
        </div>
        
        <div className="text-center">
          <p className="text-lg text-white mb-1">
            You got <span className="text-yellow-400 font-bold">{result.player.name}</span>!
          </p>
          <p className="text-sm text-gray-400 mb-6">
            This player has been added to your collection
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              className="bg-blue-500 hover:bg-blue-600 font-bold transition-colors"
              onClick={onReset}
            >
              SPIN AGAIN
            </Button>
            
            <Link href="/collection">
              <Button
                className="border border-blue-500 bg-transparent hover:bg-blue-500/10 font-bold transition-colors"
                variant="outline"
              >
                VIEW COLLECTION
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpinResult;
