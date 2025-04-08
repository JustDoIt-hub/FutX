import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaHistory } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface RecentSpinsProps {
  recentSpins: any[];
}

const RecentSpins = ({ recentSpins }: RecentSpinsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
        <FaHistory className="text-yellow-400 mr-3" /> RECENT SPINS
      </h2>
      
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-xl p-4">
        <ScrollArea className="pr-3 max-h-96">
          <div className="space-y-3">
            {recentSpins && recentSpins.length > 0 ? (
              recentSpins.map((spin, index) => (
                <motion.div 
                  key={spin.id}
                  className="recent-spin flex items-center bg-gray-900 bg-opacity-50 p-3 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="font-bold text-white text-sm">{spin.position_result}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{spin.player?.name || "Unknown"}</span>
                      <span className="font-bold text-yellow-400">{spin.player?.overall || "??"}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {spin.event_result?.replace("_", " ") || ""} • {spin.spun_at ? formatDistanceToNow(new Date(spin.spun_at), { addSuffix: true }) : ""}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                No recent spins. Start spinning to build your collection!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecentSpins;
