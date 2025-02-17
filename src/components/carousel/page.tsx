"use client";
// components/Carousel.tsx
import React, { useState } from "react";
import Slider from "react-slick";
import Bible from "../Bible/page";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useModules } from "@/context/modulesContext";
import Calculadora from "../Calculadora/page";
import { ChevronDown, ChevronUp, CircleMinus } from "lucide-react";

const Carousel: React.FC = () => {
  const { modules, removeModule } = useModules();

  // Set the initial state as minimized for all modules
  const initialState = modules.reduce((acc, module) => {
    acc[module] = true; // All modules start minimized
    return acc;
  }, {} as { [key: string]: boolean });

  const [minimized, setMinimized] = useState<{ [key: string]: boolean }>(initialState);

  // Toggle minimize for individual modules
  const handleMinimize = (module: string) => {
    setMinimized((prev) => ({
      ...prev,
      [module]: !prev[module], // Toggle only the clicked module
    }));
  };

  const renderModule = (moduleName: string) => {
    switch (moduleName) {
      case "Bible":
        return <Bible />;
      case "Calculadora":
        return <Calculadora />;
      default:
        return null;
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="w-full mb-10">
      <Slider {...settings}>
        {modules.map((module, index) => (
          <div key={index} className="w-full relative p-4 rounded-md">
            

            {/* Module Header with Toggle */}
            <div className="flex justify-between items-center rounded-lg bg-green-500 text-white text-center font-bold p-2">
              {/* Remove Module Button */}
            <button
              onClick={() => removeModule(module)}
        
            >
            <CircleMinus />
            </button>
              {module}
              <button
                onClick={() => handleMinimize(module)}
                className="cursor-pointer focus:outline-none"
              >
                {minimized[module] ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
              </button>
            </div>

            {/* Module Content (Initially Hidden) */}
            {!minimized[module] && (
              <div>{renderModule(module)}</div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
