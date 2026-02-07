import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);
  const touchDelta = useRef(0);
  const isDragging = useRef(false);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, index));
    setCurrent(clamped);
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (touchDelta.current > 50) {
      goTo(current - 1);
    } else if (touchDelta.current < -50) {
      goTo(current + 1);
    }
    touchDelta.current = 0;
  };

  // Mouse drag for desktop
  const mouseStart = useRef(0);
  const mouseDelta = useRef(0);
  const isMouseDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStart.current = e.clientX;
    isMouseDragging.current = true;
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDragging.current) return;
    mouseDelta.current = e.clientX - mouseStart.current;
  };

  const handleMouseUp = () => {
    if (!isMouseDragging.current) return;
    isMouseDragging.current = false;
    if (mouseDelta.current > 50) {
      goTo(current - 1);
    } else if (mouseDelta.current < -50) {
      goTo(current + 1);
    }
    mouseDelta.current = 0;
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      isMouseDragging.current = false;
      mouseDelta.current = 0;
    };
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, []);

  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <div className="w-full aspect-[4/3] bg-muted overflow-hidden">
        <img src={images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Image strip */}
      <div
        ref={containerRef}
        className="w-full aspect-[4/3] overflow-hidden relative select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="w-full h-full flex-shrink-0">
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left/right arrows (desktop) */}
      {current > 0 && (
        <button
          onClick={() => goTo(current - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {current < images.length - 1 && (
        <button
          onClick={() => goTo(current + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Dots indicator */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-200 ${
              i === current
                ? 'w-2 h-2 bg-white shadow-md'
                : 'w-1.5 h-1.5 bg-white/50'
            }`}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter badge */}
      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full px-2.5 py-1 font-medium">
        {current + 1}/{images.length}
      </div>
    </div>
  );
};

export default ImageCarousel;
