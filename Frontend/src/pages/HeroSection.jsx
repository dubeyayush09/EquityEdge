import React from "react";
import MarketSectors from "../components/MarketOverview";
import TopMovers from "../components/TopMovers";

const HeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <div className="md:w-2/3 w-full">
        <MarketSectors />
      </div>
      <div className="md:w-1/3 w-full">
         <TopMovers />
      </div>
    </div>
  );
};

export default HeroSection;
