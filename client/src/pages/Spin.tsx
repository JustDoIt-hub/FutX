import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSpin } from "@/hooks/useSpin";
import { Button } from "@/components/ui/button";
import SpinWheel from "@/components/SpinWheel";
import SpinResult from "@/components/SpinResult";
import RecentSpins from "@/components/RecentSpins";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { FaSync } from "react-icons/fa";

const Spin = () => {
  const { user } = useAuth();
  const { 
    spinOptions, 
    recentSpins, 
    spinResult, 
    isSpinning, 
    spinningType,
    isLoading, 
    spin, 
    resetSpinResult 
  } = useSpin();
  
  const [positionDone, setPositionDone] = useState(false);
  const [eventDone, setEventDone] = useState(false);
  const [ovrDone, setOvrDone] = useState(false);

  // Handle individual wheel spins
  const handlePositionSpin = () => {
    spin('position');
    setPositionDone(true);
  };

  const handleEventSpin = () => {
    spin('event');
    setEventDone(true);
  };

  const handleOvrSpin = () => {
    spin('ovr');
    setOvrDone(true);
  };

  // Handle spin all
  const handleSpinAll = () => {
    spin('all');
    setPositionDone(true);
    setEventDone(true);
    setOvrDone(true);
  };

  // Reset everything for a new spin
  const handleResetSpin = () => {
    resetSpinResult();
    setPositionDone(false);
    setEventDone(false);
    setOvrDone(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
        <p className="mt-4 text-white">Loading spin options...</p>
      </div>
    );
  }

  // Check if all spinOptions are available
  if (!spinOptions?.positions || !spinOptions?.events || !spinOptions?.ovrRanges) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-white">Error loading spin options. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <Navigation activeTab="spin" />
      
      <section className="py-8 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div 
            className="w-full md:w-2/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <FaSync className="text-yellow-400 mr-3" /> SPIN THE WHEEL
            </h2>
            
            {/* Show spin wheels or result */}
            {spinResult?.player ? (
              <SpinResult result={spinResult} onReset={handleResetSpin} />
            ) : (
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Position Spinner */}
                  <SpinWheel
                    title="POSITION"
                    options={spinOptions.positions}
                    onSpin={handlePositionSpin}
                    isSpinning={isSpinning && spinningType === 'position'}
                    result={spinResult?.positionResult}
                  />
                  
                  {/* Event Spinner */}
                  <SpinWheel
                    title="EVENT"
                    options={spinOptions.events}
                    onSpin={handleEventSpin}
                    isSpinning={isSpinning && spinningType === 'event'}
                    result={spinResult?.eventResult}
                  />
                  
                  {/* OVR Spinner */}
                  <SpinWheel
                    title="OVR"
                    options={spinOptions.ovrRanges}
                    onSpin={handleOvrSpin}
                    isSpinning={isSpinning && spinningType === 'ovr'}
                    result={spinResult?.ovrResult}
                  />
                </div>
                
                <div className="mt-6 text-center">
                  <Button
                    id="spinAllBtn"
                    onClick={handleSpinAll}
                    disabled={isSpinning || (positionDone && eventDone && ovrDone)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSpinning && spinningType === 'all' ? (
                      <>
                        <FaSync className="animate-spin mr-2" /> SPINNING...
                      </>
                    ) : (
                      'SPIN ALL'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Recent Spins */}
          <motion.div 
            className="w-full md:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <RecentSpins recentSpins={recentSpins || []} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Spin;
