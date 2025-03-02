"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Versiculos from "../Versiculos/page";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Calculadora from "../Calculadora/page";
import Tasks from "../tasks/page";
import { useAuth } from "@/hooks/useAuth";
import { useModules } from "@/context/modulesContext"; // ✅ Use global state
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MinusCircleIcon,
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
  const { modules, addModule, removeModule } = useModules();
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [allMinimized, setAllMinimized] = useState(false); // ✅ Controla si TODOS los módulos están minimizados

  useEffect(() => {
    const fetchModules = async () => {
      if (!user?.id || hasFetched) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/user/modules?userId=${user.id}`);
        const data = await response.json();

        if (response.ok && Array.isArray(data.modules)) {
          data.modules.forEach((module: string) => addModule(module));
        }

        setHasFetched(true);
      } catch (error) {
        console.error("❌ Error obteniendo módulos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [user, addModule, hasFetched]);

  const handleMinimize = () => {
    setAllMinimized((prev) => !prev); // ✅ Alternar entre minimizar y expandir TODOS los módulos
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

  const handleRemoveModule = async (moduleName: string) => {
    if (!user?.id) {
      console.error("❌ No hay usuario autenticado.");
      return;
    }

    try {
      const response = await fetch("/api/user/modules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, module: moduleName }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Módulo eliminado:", data);
        removeModule(moduleName);
      } else {
        console.error("❌ Error al eliminar módulo:", data.message);
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
    }
  };

  return (
    <div className="w-full m-auto">
      {loading && modules.length > 0 ? (
              <div className="flex justify-center mt-3 items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>      ) : modules.length === 0 ? null : (
        <Slider {...settings}>
          {modules.map((module) => (
            <div key={module} className="relative pt-4 pb-4 px-2">
              <div
                className={`flex justify-between items-center bg-green-500 shadow-md  text-white text-center font-bold p-2
                ${allMinimized ? "rounded-lg" : "rounded-t-lg"}`}
              >
                <span>
                  <MinusCircleIcon
                    className="cursor-pointer text-white"
                    size={24}
                    onClick={() => handleRemoveModule(module)}
                  />
                </span>
                <span>{module}</span>
                <button
                  onClick={handleMinimize} // ✅ Ahora afecta a todos los módulos
                  className="cursor-pointer focus:outline-none p-1"
                  aria-label="Toggle all modules"
                >
                  {allMinimized ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                </button>
              </div>

              {!allMinimized && (
                <div className="rounded-b-lg border border-green-500">
                  {renderModule(module)}
                </div>
              )}
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default Carousel;
