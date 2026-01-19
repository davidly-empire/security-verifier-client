'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);
  const [btnPosition, setBtnPosition] = useState({ x: 0, y: 0 });

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // ================= IMAGES =================
  const images = [
    '/guard1.png',
    '/guard2.png',
    '/guard3.png',
    '/guard4.png',
    '/guard5.png',
    '/guard6.png',
    '/guard7.png',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // ================= IMAGE TRANSITION =================
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 600);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // ================= LOAD ANIMATION =================
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // ================= TYPING EFFECT =================
  useEffect(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return;

    const lines = ['Welcome to', 'Security Rounds', 'Management'];
    h1.innerHTML = '';

    let lineIndex = 0;
    let charIndex = 0;

    const type = () => {
      if (lineIndex >= lines.length) return;

      if (!h1.children[lineIndex]) {
        const lineWrapper = document.createElement('div');
        lineWrapper.style.overflow = 'hidden';

        const lineSpan = document.createElement('span');
        lineSpan.style.display = 'inline-block';
        lineSpan.style.transform = 'translateY(120%)';
        lineSpan.style.animation = `revealText 0.8s ease forwards`;
        lineSpan.style.animationDelay = `${lineIndex * 0.15}s`;

        lineWrapper.appendChild(lineSpan);
        h1.appendChild(lineWrapper);
      }

      const currentSpan = h1.children[lineIndex].firstChild as HTMLElement;
      currentSpan.textContent += lines[lineIndex][charIndex];
      charIndex++;

      if (charIndex === lines[lineIndex].length) {
        lineIndex++;
        charIndex = 0;
      }

      setTimeout(type, 60);
    };

    type();
  }, []);

  // ================= MAGNETIC BUTTON =================
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setBtnPosition({ x: 0, y: 0 });
  };

  // ================= PARALLAX =================
  const handleGlobalMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const x = (e.clientX - window.innerWidth / 2) * 0.02;
    const y = (e.clientY - window.innerHeight / 2) * 0.02;
    cardRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float-blob {
          0% { transform: translate(0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0) scale(1); }
        }

        @keyframes revealText {
          to { transform: translateY(0); }
        }

        .animate-blob {
          animation: float-blob 10s infinite ease-in-out;
        }

        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      <section
        className="min-h-screen bg-[#080883] flex items-center relative overflow-hidden"
        onMouseMove={handleGlobalMouseMove}
      >
        <div className="max-w-7xl mx-auto w-full px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="text-white text-[64px] font-bold" />

            <p className="text-white/90 text-lg mt-6 max-w-lg">
              Turning routine security rounds into measurable,
              reliable, and proactive safety operations.
            </p>

            <button
              ref={btnRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => router.push('/login')}
              className="mt-10 bg-white text-[#080883] px-10 py-4 rounded-full font-semibold"
              style={{ transform: `translate(${btnPosition.x}px, ${btnPosition.y}px)` }}
            >
              LOGIN
            </button>
          </div>

          <div className="flex justify-center">
            <div
              ref={cardRef}
              className={`relative bg-[#C8FFB8] rounded-3xl w-[420px] h-[347px] flex items-center justify-center overflow-hidden transition-all duration-500
                ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
              `}
            >
              <div
                className={`transition-all duration-700 ${
                  fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <Image
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt="Security Guard"
                  width={350}
                  height={580}
                  className="object-contain mt-[49px]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
