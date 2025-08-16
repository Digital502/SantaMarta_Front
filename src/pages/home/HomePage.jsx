import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import banner from '../../assets/bannerJesús.svg';
import banner2 from '../../assets/bannerVirgen.svg';
import banner3 from '../../assets/bannerInmaculada.svg';
import banner4 from '../../assets/bannerEsquipulas.svg';
import banner5 from '../../assets/bannerSantaMarta.svg';
import banner6 from '../../assets/bannerReplicas.svg';
import banner7 from '../../assets/bannerAcompanantes.svg';
import banner8 from '../../assets/bannerSantisimo.svg';
import { Footer } from '../../components/footer/Footer';

export const HomePage = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const images = [
    {
      src: banner,
      alt: "Jesús Nazareno Redentor de los Cautivos",
      mobileSrc: banner
    },
    {
      src: banner2,
      alt: "Virgen de Dolores",
      mobileSrc: banner2
    },
    {
      src: banner3,
      alt: "Inmaculada Concepción",
      mobileSrc: banner3
    },
    {
      src: banner4,
      alt: "Cristo de Esquipulas",
      mobileSrc: banner4
    },
    {
      src: banner5,
      alt: "Santa Marta",
      mobileSrc: banner5
    },
    {
      src: banner6,
      alt: "Réplicas de la Hermandad",
      mobileSrc: banner6
    },
    {
      src: banner7,
      alt: "Acompañantes de la Procesión",
      mobileSrc: banner7
    },
    {
      src: banner8,
      alt: "Santísimo Sacramento",
      mobileSrc: banner8
    }
  ];

  // Manejar redimensionamiento de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const siguiente = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const anterior = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      siguiente();
    }, 10000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Carrusel de imágenes */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden">
        {images.map((image, i) => (
          <picture key={i}>
            {/* Opcional para diferentes imágenes en móvil */}
            {/* <source media="(max-width: 767px)" srcSet={image.mobileSrc} /> */}
            <img
              src={image.src}
              alt={image.alt}
              className={`
                absolute inset-0 w-full h-full object-cover object-center
                transition-opacity duration-1000 ease-in-out
                ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              `}
              loading="lazy"
              decoding="async"
            />
          </picture>
        ))}
        
        {/* Controles de navegación */}
        <button
          onClick={anterior}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2
                    text-white rounded-full
                    p-1 sm:p-2 transition-all duration-300 z-20
                    focus:outline-none"
          aria-label="Imagen anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={siguiente}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2
                    text-white rounded-full
                    p-1 sm:p-2 transition-all duration-300 z-20
                    focus:outline-none"
          aria-label="Siguiente imagen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 px-4 sm:px-6 py-8 md:py-12 max-w-3xl mx-auto w-full">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#010326] mb-4 md:mb-6 leading-tight">
            Hermandad de Jesús Nazareno<br className="hidden sm:inline" /> Redentor de los Cautivos y Virgen de Dolores
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed max-w-2xl mx-auto">
            Plataforma web oficial para la administración transparente de turnos y eventos de nuestra hermandad.
            Accede con tus credenciales para gestionar tu participación.
          </p>
          
          <blockquote className="text-base sm:text-lg italic text-[#415A77] mb-6 md:mb-8">
            <p className="mb-1">"Si conociéramos el valor de la Santa Misa, moriríamos de amor."</p>
            <footer className="not-italic font-medium text-[#010326]">
              — San Juan María Vianney
            </footer>
          </blockquote>
          
          <button
            onClick={handleLoginClick}
            className="bg-[#010326] hover:bg-[#1f234f] text-white font-medium
                      text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-2.5
                      rounded-full transition duration-300 shadow-md
                      transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#010326]/50"
          >
            Iniciar Sesión
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};