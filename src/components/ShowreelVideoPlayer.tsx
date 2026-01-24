import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface ShowreelVideoPlayerProps {
  url: string;
  isInView: boolean;
  className?: string;
}

const ShowreelVideoPlayer: React.FC<ShowreelVideoPlayerProps> = ({
  url,
  isInView,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Auto-play/pause baseado na visibilidade
  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      videoRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  // Controlar volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
      >
        <source src={url} type="video/mp4" />
        <source src={url.replace('.mp4', '.webm')} type="video/webm" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      {/* Controles de Volume - Canto inferior direito */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-full px-4 py-3 border border-white/10">
        <button
          onClick={toggleMute}
          className="text-white hover:text-amber-400 transition-colors"
          aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #d97706 0%, #d97706 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d97706;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d97706;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider:hover::-webkit-slider-thumb {
          background: #f59e0b;
          transform: scale(1.1);
        }

        .slider:hover::-moz-range-thumb {
          background: #f59e0b;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ShowreelVideoPlayer;
