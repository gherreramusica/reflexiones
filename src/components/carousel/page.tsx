// components/Carousel.tsx
import React from 'react';
import Slider from 'react-slick';
import Bible from '../Bible/page';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useModules } from '@/context/modulesContext';
import Calculadora from '../Calculadora/page';

const Carousel: React.FC = () => {
  const { modules, removeModule } = useModules();

  const renderModule = (moduleName: string) => {
    switch (moduleName) {
      case 'Bible':
        return <Bible />;
        case 'Calculadora':
            return <Calculadora />;
       
      // Puedes agregar más módulos aquí
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
    <div className='w-full'>
      <Slider {...settings}>
        {modules.map((module, index) => (
          <div key={index} className="w-full relative">
            {renderModule(module)}
            <button
              onClick={() => removeModule(module)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md absolute top-0 right-0"
            >
              Quitar {module}
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
