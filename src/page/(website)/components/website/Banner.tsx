import React, { useState, useEffect } from "react";

const Banner = () => {
  // Danh sách ảnh banner
  const images = [
    "./src/./image/slide1.webp",
    "./src/./image/slide2.webp",
    "./src/./image/slide3.webp",
    "./src/./image/slide4.webp",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative mb-16 w-full">
      {/* Ảnh Banner */}
      <img
        src={images[currentIndex]}
        alt="Banner"
        className="w-full h-[600px] object-cover"
      />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-4 h-4 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
