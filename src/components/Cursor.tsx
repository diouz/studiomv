import React, { useEffect, useState, useRef } from 'react';

// Função auxiliar para Interpolação Linear (Lerp)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Cursor: React.FC = () => {
  const [opacity, setOpacity] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: 0, y: 0 });
  const renderPos = useRef({ x: 0, y: 0 });
  
  // <-- MUDANÇA: Ref para guardar o estado de hover
  // Esta ref será usada pelo loop de animação
  const hoverRef = useRef(false);

  const animationFrameRef = useRef<number | null>(null);
  const smoothing = 0.15;

  useEffect(() => {
    // --- 1. O Loop de Animação ---
    const animate = () => {
      renderPos.current.x = lerp(
        renderPos.current.x,
        targetPos.current.x,
        smoothing
      );
      renderPos.current.y = lerp(
        renderPos.current.y,
        targetPos.current.y,
        smoothing
      );

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${renderPos.current.x}px, ${renderPos.current.y}px, 0)` +
          ` translate(-50%, -50%)` +
          // <-- MUDANÇA: Lê o estado de hover da ref, não do estado
          ` scale(${hoverRef.current ? 1.5 : 1})`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Inicia o loop de animação
    animationFrameRef.current = requestAnimationFrame(animate);

    // --- 2. Os Event Listeners ---
    const updateCursor = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setOpacity(1);

      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        'button, a, input, textarea, select, [role="button"], [tabindex]'
      );
      
      const isHoveringValue = !!isInteractive;
      
      // Atualiza o estado do React (para mudar as classes CSS/cores)
      setIsHovering(isHoveringValue);
      // <-- MUDANÇA: Atualiza a ref (para o loop de animação saber do scale)
      hoverRef.current = isHoveringValue;
    };

    const handleMouseLeave = () => setOpacity(0);
    const handleMouseEnter = () => setOpacity(1);

    // Este código agora só roda UMA VEZ, na montagem
    targetPos.current = { x: -100, y: -100 };
    renderPos.current = { x: -100, y: -100 };

    document.addEventListener('mousemove', updateCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // --- 3. A Limpeza ---
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
    
    // <-- MUDANÇA: O array de dependências está VAZIO!
    // O useEffect agora só roda na montagem e desmontagem.
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999] transition-opacity duration-300 ease-out"
      style={{
        left: 0,
        top: 0,
        opacity: opacity,
      }}
      aria-hidden="true"
    >
      {/* O HTML interno não muda.
        O 'isHovering' (state) ainda é usado aqui para
        controlar as classes CSS (cores, sombras, etc.),
        o que está perfeitamente correto.
      */}
      <div
        className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
          isHovering
            ? 'border-stone-400 bg-stone-400/20 shadow-stone-400/50'
            : 'border-white bg-white/10 '
        }`}
      >
        <div
          className={`w-1 h-1 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            isHovering ? 'bg-stone-400' : 'bg-white animate-pulse'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Cursor;