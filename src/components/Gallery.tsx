
import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl animate-float w-full max-w-full mx-auto sm:mx-0">
      <div className="aspect-[16/9] bg-gradient-to-br from-paisagem-darkPurple to-paisagem-teal p-2">
        <AspectRatio ratio={16/9}>
          <div className="w-full h-full bg-background/5 rounded-md flex items-center justify-center overflow-hidden">
            <img 
              src={images[currentIndex]} 
              alt={`Art Gallery Preview ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
          </div>
        </AspectRatio>
      </div>
    </div>
  );
};

export default Gallery;
