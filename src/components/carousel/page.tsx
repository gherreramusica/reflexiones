"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Versiculos from "../Versiculos/page";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Calculadora from "../Calculadora/page";
import Tasks from "../tasks/page";
import { useAuth } from "@/hooks/useAuth";

import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => (
  <div className={`${className} custom-next-arrow`} style={{ ...style }} onClick={onClick}>
    <ChevronRight size={24} />
  </div>
);

const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => (
  <div className={`${className} custom-prev-arrow`} style={{ ...style }} onClick={onClick}>
    <ChevronLeft size={24} />
  </div>
);

const Carousel: React.FC = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [minimized, setMinimized] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchModules = async () => {
      if (!user?.id) return; // No ejecutar si no hay usuario

      try {
        const response = await fetch(`/api/user/modules?userId=${user.id}`);
        const data = await response.json();
console.log("Respuesta de la API:", data);
        if (response.ok && Array.isArray(data.modules)) {
          setModules(data.modules);

          // ✅ Verificar si `data.modules` existe y es un array antes de usar `reduce`
          const minimizedState = (data.modules || []).reduce((acc: { [key: string]: boolean }, module: string) => {
            acc[module] = true;
            return acc;
          }, {});

          setMinimized(minimizedState);
        } else {
          console.error("❌ Error en la respuesta:", data.message || "Formato inesperado");
        }
      } catch (error) {
        console.error("❌ Error obteniendo módulos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [user]);

  const handleMinimize = (module: string) => {
    setMinimized((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const renderModule = (moduleName: string) => {
    switch (moduleName) {
      case "Versiculos":
        return <Versiculos />;
      case "Calculadora":
        return <Calculadora />;
      case "Tareas":
        return <Tasks />;
      default:
        return null;
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="w-full m-auto">
      {loading ? (
        <p className="text-center text-gray-500">Cargando módulos...</p>
      ) : (
        <Slider {...settings}>
          {modules.map((module) => (
            <div key={module} className="relative pt-4 pb-4 px-2">
              <div
                className={`flex justify-between items-center bg-green-500 text-white text-center font-bold p-2
                ${minimized[module] ? "rounded-lg" : "rounded-t-lg"}`}
              >
                <span>{module}</span>
                <button
                  onClick={() => handleMinimize(module)}
                  className="cursor-pointer focus:outline-none p-1"
                  aria-label={`Toggle ${module}`}
                >
                  {minimized[module] ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                </button>
              </div>

              {!minimized[module] && (
                <div className="rounded-b-lg border border-green-500">{renderModule(module)}</div>
              )}
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Carousel;
