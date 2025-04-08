import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { FaSync, FaLayerGroup, FaGamepad, FaStore } from "react-icons/fa";

interface NavigationProps {
  activeTab: string;
}

const Navigation = ({ activeTab }: NavigationProps) => {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <nav className="flex overflow-x-auto whitespace-nowrap py-2">
          <Link href="/spin">
            <a className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors",
              activeTab === "spin" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}>
              <FaSync className="inline-block mr-2" /> SPIN
            </a>
          </Link>
          
          <Link href="/collection">
            <a className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors",
              activeTab === "collection" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}>
              <FaLayerGroup className="inline-block mr-2" /> COLLECTION
            </a>
          </Link>
          
          <Link href="/team-battle">
            <a className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors",
              activeTab === "team-battle" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}>
              <FaGamepad className="inline-block mr-2" /> TEAM BATTLE
            </a>
          </Link>
          
          <Link href="/shop">
            <a className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors",
              activeTab === "shop" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}>
              <FaStore className="inline-block mr-2" /> SHOP
            </a>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
