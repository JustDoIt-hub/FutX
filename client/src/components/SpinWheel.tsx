import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync } from 'react-icons/fa';

interface SpinWheelProps {
  title: string;
  options: string[];
  onSpin: () => void;
  isSpinning: boolean;
  result?: string | null;
}

const SpinWheel = ({ title, options, onSpin, isSpinning, result }: SpinWheelProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [isSpun, setIsSpun] = useState(false);
  const spinnerRef = useRef<HTMLDivElement>(null);
  
  // Set up spinner with duplicated options for infinite scroll effect
  useEffect(() => {
    // Create an array with repeated options to create the effect of an infinite spinner
    const repeatedOptions = [...options, ...options, ...options];
    setItems(repeatedOptions);
  }, [options]);
  
  // Handle spin result
  useEffect(() => {
    if (result && !isSpinning) {
      setIsSpun(true);
    } else if (isSpinning) {
      setIsSpun(false);
    }
  }, [result, isSpinning]);
  
  // Handle spinner animation
  const handleSpin = () => {
    if (isSpinning) return;
    onSpin();
  };
  
  return (
    <div className="spinner bg-gray-900 rounded-lg flex flex-col h-56 overflow-hidden relative">
      {/* Highlight area */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-full h-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
      
      {/* Title */}
      <div className="text-center font-bold text-sm py-2 bg-yellow-400 text-gray-900">
        {title}
      </div>
      
      {/* Spinner items */}
      <div className="spinner-item flex-grow flex flex-col overflow-hidden" ref={spinnerRef}>
        <AnimatePresence>
          <motion.div
            className="flex flex-col"
            animate={{
              y: isSpinning 
                ? [-options.length * 48, -(options.length * 2 + options.indexOf(result || options[0])) * 48] 
                : isSpun && result 
                  ? [-(options.length * 2 + options.indexOf(result)) * 48]
                  : [-options.length * 48]
            }}
            transition={{ 
              duration: isSpinning ? 3 : 0, 
              ease: isSpinning ? "easeInOut" : "linear",
            }}
          >
            {items.map((item, index) => (
              <div 
                key={`${item}-${index}`}
                className="h-12 flex items-center justify-center font-bold text-xl text-white"
              >
                {item}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Spin button */}
      <Button 
        onClick={handleSpin}
        disabled={isSpinning}
        className="spin-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 transition-colors"
      >
        {isSpinning ? (
          <FaSync className="animate-spin mr-2" />
        ) : (
          <FaSync className="mr-2" />
        )}
        SPIN
      </Button>
    </div>
  );
};

export default SpinWheel;
