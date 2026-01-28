'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
// Make sure this file exists: app/components/ui/button.tsx
import { Button } from '@/app/components/ui/button'
import * as THREE from 'three'

export default function LoginPage() {
  const router = useRouter()

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formRef = useRef<HTMLDivElement>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // ==========================================
  // 3D Tilt & Spotlight Handlers
  // ==========================================
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = formRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    
    // Calculate Tilt
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -2 // Max -2deg to 2deg
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 2

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`

    // Calculate Spotlight
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleMouseLeave = () => {
    const card = formRef.current
    if (!card) return
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  }

  // ==========================================
  // Form Logic
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) throw new Error('API URL not defined in .env')

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_pin: password,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.detail || 'Invalid User ID or Password')
      }

      const data = await res.json()

      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('name', data.name)

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to fetch. Check backend connection.')

      if (formRef.current) {
        void formRef.current.offsetWidth // trigger reflow
        formRef.current.classList.add('animate-shake')
        setTimeout(
          () => formRef.current?.classList.remove('animate-shake'),
          500
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const inputs = inputRefs.current
    inputs.forEach((input, index) => {
      if (input) {
        input.style.opacity = '0'
        input.style.transform = 'translateY(20px)'
        setTimeout(() => {
          input.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
          input.style.opacity = '1'
          input.style.transform = 'translateY(0)'
        }, 100 * index)
      }
    })
  }, [])

  return (
    <>
      <div className="hidden">{/* Navbar intentionally hidden */}</div>

      {/* 1. Specific Background Gradient */}
      <div id="canvas-container" className="fixed inset-0 z-0 bg-gradient-to-br from-[#050560] via-[#080883] to-[#02024a]" />
      
      {/* 2. 3D Canvas Container (Transparent, pointer-events-none so it doesn't block clicks) */}
      <div className="fixed inset-0 z-10 pointer-events-none" />

      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div
          ref={formRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] p-8 transition-transform duration-100 ease-out will-change-transform overflow-hidden group relative"
        >
          {/* Spotlight Effect */}
          <div className="spotlight group-hover:opacity-100" />

          <div className="flex flex-col items-center mb-8 relative z-content">
            <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-4 rounded-full mb-4 shadow-lg shadow-blue-500/40">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-sm">Admin Portal</h1>
            <p className="text-sm text-blue-200/70 mt-2 flex items-center gap-2">
              <Sparkles size={14} /> Secure Access System
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-content">
            <div>
              <label className="text-xs text-white/80 font-bold ml-1 mb-1 block uppercase tracking-wider">User ID</label>
              <div className="relative group-input">
                <input
                  ref={(el) => { inputRefs.current[0] = el }}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full mt-2 px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-slate-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 focus:border-transparent rounded-xl backdrop-blur-md transition-all duration-300"
                  placeholder="Enter your ID"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/80 font-bold ml-1 mb-1 block uppercase tracking-wider">Password</label>
              <div className="relative group-input">
                <input
                  ref={(el) => { inputRefs.current[1] = el }}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 bg-white/20 border border-white/30 text-white placeholder-slate-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/30 focus:border-transparent rounded-xl backdrop-blur-md transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm flex items-center gap-2">{error}</p>}

            <Button type="submit" className="w-full btn-shimmer relative overflow-hidden">
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-500">© 2025 Security Verifier</p>
        </div>
      </div>

      <BackgroundInjector />
      <CustomStyles />
    </>
  )
}

// ==========================================
// 3D Background Component (Enhanced)
// ==========================================

const SceneEffect = () => {
  useEffect(() => {
    const container = document.getElementById('canvas-container')
    if (!container) return

    const scene = new THREE.Scene()
    // Fog matches the dark background for depth
    scene.fog = new THREE.FogExp2(0x02024a, 0.025)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    // We append to a dedicated wrapper to handle z-index correctly
    const canvasWrapper = document.createElement('div')
    canvasWrapper.className = 'fixed inset-0 pointer-events-none'
    container.appendChild(canvasWrapper)
    canvasWrapper.appendChild(renderer.domElement)

    // 1. Main Icosahedron
    const geometry = new THREE.IcosahedronGeometry(15, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      opacity: 0.15,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // 2. Secondary Icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(20, 1)
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      opacity: 0.05,
      transparent: true,
    })
    const outerMesh = new THREE.Mesh(outerGeo, outerMat)
    scene.add(outerMesh)

    // 3. Particles (Starfield)
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 800
    const posArray = new Float32Array(particlesCount * 3)

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 120
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.8,
    })
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Mouse Interaction Logic
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const windowHalfX = window.innerWidth / 2
    const windowHalfY = window.innerHeight / 2

    const onDocumentMouseMove = (event: globalThis.MouseEvent) => {
      mouseX = (event.clientX - windowHalfX)
      mouseY = (event.clientY - windowHalfY)
    }

    document.addEventListener('mousemove', onDocumentMouseMove)

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onWindowResize)

    // Animation Loop
    const animate = (time: number) => {
      requestAnimationFrame(animate)

      targetX = mouseX * 0.001
      targetY = mouseY * 0.001

      // Rotations
      mesh.rotation.x += 0.001
      mesh.rotation.y += 0.001
      outerMesh.rotation.x -= 0.0005
      outerMesh.rotation.y -= 0.0005

      // Parallax
      particlesMesh.rotation.y = -mouseX * 0.0002
      particlesMesh.rotation.x = -mouseY * 0.0002

      mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y)
      mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x)

      // Breathing Effect
      const breathe = 0.2 + Math.sin(time * 0.002) * 0.05
      particlesMaterial.size = breathe

      renderer.render(scene, camera)
    }

    animate(0)

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove)
      window.removeEventListener('resize', onWindowResize)
      if (canvasWrapper.parentNode) {
        canvasWrapper.parentNode.removeChild(canvasWrapper)
      }
    }
  }, [])

  return null
}

const BackgroundInjector = () => <SceneEffect />

const CustomStyles = () => (
  <style jsx global>{`
    /* Shake Animation */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    .animate-shake {
      animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    }

    /* Spotlight Logic */
    .spotlight {
      position: absolute;
      inset: 0;
      background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.15), transparent 40%);
      opacity: 0;
      transition: opacity 0.5s;
      pointer-events: none;
      z-index: 0;
      border-radius: 1rem;
    }

    .z-content {
      position: relative;
      z-index: 10;
    }

    /* Button Shimmer */
    .btn-shimmer::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: 0.5s;
    }
    .btn-shimmer:hover::after {
      left: 100%;
      transition: 0.5s;
    }
  `}</style>
)