import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSoundEffects } from '../../hooks/useSoundEffects';

export function SplashScreen({ onComplete }) {
  const [hasSeenSplash, setHasSeenSplash] = useState(() => {
    return sessionStorage.getItem('ritzlaplay_splash_seen') === 'true';
  });

  const containerRef = useRef(null);
  const portalRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (hasSeenSplash) {
      if (onComplete) onComplete();
      return;
    }

    // Play subtle cinematic opening chord
    playSound('portal');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('ritzlaplay_splash_seen', 'true');
          setHasSeenSplash(true);
          if (onComplete) onComplete();
        }
      });

      // 1. Point of light expands into rotating energy portal
      tl.fromTo(
        portalRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      )
      // 2. Twin concentric rings rotate in counter directions
      .to(ring1Ref.current, { rotation: 360, duration: 1.2, ease: 'power1.inOut' }, '-=0.4')
      .to(ring2Ref.current, { rotation: -360, duration: 1.2, ease: 'power1.inOut' }, '-=1.2')
      // 3. Holographic RitzlaPlay prism emerges
      .fromTo(
        logoRef.current,
        { scale: 0.7, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.6'
      )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        '-=0.2'
      )
      // 4. Smooth dissolve into app
      .to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.inOut',
        delay: 0.3
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasSeenSplash, onComplete, playSound]);

  if (hasSeenSplash) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B14] overflow-hidden select-none"
    >
      {/* Abstract Glowing Portal */}
      <div className="relative flex items-center justify-center">
        {/* Core Glow */}
        <div
          ref={portalRef}
          className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#8B5CF6]/30 via-[#22D3EE]/20 to-[#FB7185]/30 blur-2xl"
        />

        {/* Outer Ring 1 */}
        <div
          ref={ring1Ref}
          className="absolute w-64 h-64 rounded-full border border-[#22D3EE]/30 border-t-[#8B5CF6] border-r-transparent"
        />

        {/* Inner Ring 2 */}
        <div
          ref={ring2Ref}
          className="absolute w-44 h-44 rounded-full border border-[#FB7185]/40 border-b-[#22D3EE] border-l-transparent"
        />

        {/* Logo Badge */}
        <div ref={logoRef} className="absolute flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#22D3EE] to-[#FB7185] p-[2px] shadow-2xl shadow-[#22D3EE]/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center">
              <span className="font-display font-black text-2xl bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
                RP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Title */}
      <div ref={textRef} className="mt-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
          Ritzla<span className="text-[#22D3EE]">Play</span>
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] mt-1.5">
          Stories Move Around You
        </p>
      </div>

      {/* Skip button for accessibility */}
      <button
        onClick={() => {
          sessionStorage.setItem('ritzlaplay_splash_seen', 'true');
          setHasSeenSplash(true);
          if (onComplete) onComplete();
        }}
        className="absolute bottom-8 text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors cursor-pointer px-3 py-1 rounded bg-white/5"
      >
        Skip sequence ↵
      </button>
    </div>
  );
}
