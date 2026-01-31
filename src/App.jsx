import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ChevronRight, ArrowRight, Phone, Mail, MapPin, Shield, Users, Home, Code, Truck, Zap, CheckCircle, QrCode, Bell, Eye, Building } from 'lucide-react';

// ==================== CUBE 3D COMPONENT ====================
function Cube3D() {
  const sizeX = 100;
  const sizeY = 140;
  const sizeZ = 100;
  const centerX = 300;
  const centerY = 280;

  const angleX = Math.PI / 6;
  const angleY = Math.PI / 6;

  const iso = (x, y, z) => {
    return {
      x: centerX + (x - z) * Math.cos(angleX) * 1.2,
      y: centerY + (x + z) * Math.sin(angleY) * 0.6 + y * 0.8,
    };
  };

  const vertices = [
    iso(-sizeX, -sizeY, -sizeZ),
    iso(sizeX, -sizeY, -sizeZ),
    iso(sizeX, sizeY, -sizeZ),
    iso(-sizeX, sizeY, -sizeZ),
    iso(-sizeX, -sizeY, sizeZ),
    iso(sizeX, -sizeY, sizeZ),
    iso(sizeX, sizeY, sizeZ),
    iso(-sizeX, sizeY, sizeZ),
  ];

  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  const faces = [
    { points: [4, 5, 6, 7], gradient: "url(#faceGradient1)" },
    { points: [1, 2, 6, 5], gradient: "url(#faceGradient2)" },
    { points: [2, 3, 7, 6], gradient: "url(#faceGradient3)" },
  ];

  const dotPaths = [
    { target: 0, path: [4, 0], color: "#10b981", delay: 0 },
    { target: 1, path: [5, 1], color: "#8b5cf6", delay: 0.5 },
    { target: 2, path: [6, 2], color: "#06b6d4", delay: 1 },
    { target: 3, path: [7, 3], color: "#10b981", delay: 1.5 },
    { target: 4, path: [0, 4], color: "#8b5cf6", delay: 2 },
    { target: 5, path: [1, 5], color: "#06b6d4", delay: 2.5 },
    { target: 6, path: [2, 6], color: "#10b981", delay: 3 },
    { target: 7, path: [3, 7], color: "#8b5cf6", delay: 3.5 },
  ];

  const innerScale = 0.5;
  const innerVertices = [
    iso(-sizeX * innerScale, -sizeY * innerScale, -sizeZ * innerScale),
    iso(sizeX * innerScale, -sizeY * innerScale, -sizeZ * innerScale),
    iso(sizeX * innerScale, sizeY * innerScale, -sizeZ * innerScale),
    iso(-sizeX * innerScale, sizeY * innerScale, -sizeZ * innerScale),
    iso(-sizeX * innerScale, -sizeY * innerScale, sizeZ * innerScale),
    iso(sizeX * innerScale, -sizeY * innerScale, sizeZ * innerScale),
    iso(sizeX * innerScale, sizeY * innerScale, sizeZ * innerScale),
    iso(-sizeX * innerScale, sizeY * innerScale, sizeZ * innerScale),
  ];

  const innerEdges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[400px] h-[400px] bg-gradient-to-r from-purple-500/20 via-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <svg width="600" height="600" viewBox="0 0 600 600" className="relative z-10" style={{ filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))" }}>
        {faces.map((face, index) => {
          const faceVertices = face.points.map((i) => vertices[i]);
          const pathData = `M ${faceVertices[0].x} ${faceVertices[0].y} ` + faceVertices.slice(1).map((v) => `L ${v.x} ${v.y}`).join(" ") + " Z";
          return (
            <motion.path key={`face-${index}`} d={pathData} fill={face.gradient}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.8, 0.5, 0.8] }}
              transition={{ duration: 4, delay: 0.5 + index * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}

        {edges.map((edge, index) => {
          const v1 = vertices[edge[0]];
          const v2 = vertices[edge[1]];
          let strokeColor = "url(#edgeGradient)";
          if (index < 4) strokeColor = "url(#edgeGradient1)";
          else if (index < 8) strokeColor = "url(#edgeGradient2)";
          return (
            <motion.line key={`edge-${index}`} x1={v1.x} y1={v1.y} x2={v2.x} y2={v2.y} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ pathLength: { duration: 1.5, delay: index * 0.1, ease: "easeOut" }, opacity: { duration: 0.8, delay: index * 0.1 } }}
            />
          );
        })}

        {innerEdges.map((edge, index) => {
          const v1 = innerVertices[edge[0]];
          const v2 = innerVertices[edge[1]];
          return (
            <motion.line key={`inner-edge-${index}`} x1={v1.x} y1={v1.y} x2={v2.x} y2={v2.y} stroke="url(#innerGradient)" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.6, 0.6, 0] }}
              transition={{ duration: 6, delay: 2 + index * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}

        {dotPaths.map((dotPath, index) => {
          const startVertex = vertices[dotPath.path[0]];
          const endVertex = vertices[dotPath.path[1]];
          return (
            <g key={`dot-${index}`}>
              <motion.circle r="6" fill={dotPath.color} opacity="0.15" filter="url(#glow)"
                animate={{ cx: [startVertex.x, endVertex.x, startVertex.x], cy: [startVertex.y, endVertex.y, startVertex.y] }}
                transition={{ duration: 8, delay: dotPath.delay, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.circle r="2.5" fill={dotPath.color} filter="url(#glow)"
                animate={{ cx: [startVertex.x, endVertex.x, startVertex.x], cy: [startVertex.y, endVertex.y, startVertex.y], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 8, delay: dotPath.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          );
        })}

        {vertices.map((vertex, index) => (
          <g key={`vertex-${index}`}>
            <motion.circle cx={vertex.x} cy={vertex.y} r="8" fill="none" stroke={index % 2 === 0 ? "#10b981" : "#8b5cf6"} strokeWidth="1.5" opacity="0.4"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 3, delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle cx={vertex.x} cy={vertex.y} r="3.5" fill={index % 2 === 0 ? "#10b981" : "#8b5cf6"} filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: "backOut" }}
            />
          </g>
        ))}

        <defs>
          <linearGradient id="edgeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="edgeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="faceGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="faceGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="faceGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.15" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
        <div className="w-[400px] h-[400px] border border-purple-500/10 rounded-full" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute top-8 left-8 w-5 h-5 border-l-2 border-t-2 border-cyan-400/60" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute top-8 right-8 w-5 h-5 border-r-2 border-t-2 border-cyan-400/60" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="absolute bottom-8 left-8 w-5 h-5 border-l-2 border-b-2 border-cyan-400/60" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute bottom-8 right-8 w-5 h-5 border-r-2 border-b-2 border-cyan-400/60" />
      </div>
    </div>
  );
}

// ==================== ANIMATED SECTION WRAPPER ====================
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

// ==================== COUNTER HOOK ====================
function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration, start]);
  return [count, setIsVisible];
}

function StatCounter({ value, suffix = '', label }) {
  const [count, setIsVisible] = useCountUp(value, 2000);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => { if (isInView) setIsVisible(true); }, [isInView, setIsVisible]);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.5 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, type: "spring" }} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400 mb-2">{count}{suffix}</div>
      <div className="text-gray-500 text-sm uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function CubeXTechWebsite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(13, 13, 20, 0)", "rgba(13, 13, 20, 0.95)"]);

  const services = [
    { icon: Home, title: "CubeX Home", description: "Smart residential security with visitor management, QR access, and real-time monitoring.", color: "emerald", highlight: true },
    { icon: Users, title: "Visitor Management", description: "Complete visitor tracking, QR-based access control, and comprehensive activity logs.", color: "purple" },
    { icon: Code, title: "Custom Software", description: "Tailored enterprise solutions from web apps to complex management systems.", color: "emerald" },
    { icon: Truck, title: "Warehouse Management", description: "Advanced tracking for vehicle entry/exit and logistics optimization.", color: "purple" },
    { icon: Shield, title: "Security Solutions", description: "Integrated surveillance and smart monitoring for properties.", color: "emerald" },
    { icon: Zap, title: "Automation Systems", description: "Automated workflows and intelligent management platforms.", color: "purple" },
  ];

  const clients = [
    { name: "Flash Express", initial: "FE", color: "from-amber-500 to-orange-500" },
    { name: "Centroz", initial: "C", color: "from-blue-500 to-cyan-500" },
    { name: "Condominiums", initial: "CD", color: "from-emerald-500 to-teal-500" },
  ];

  const cubexHomeFeatures = [
    { icon: QrCode, title: "QR Access Control", desc: "Instant visitor verification with secure QR codes" },
    { icon: Bell, title: "Real-time Alerts", desc: "Instant notifications for all visitor activities" },
    { icon: Users, title: "Guard Interface", desc: "Streamlined security operations dashboard" },
    { icon: Eye, title: "24/7 Monitoring", desc: "Comprehensive activity logs and tracking" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white overflow-x-hidden">
      <style>{`
        @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient { background-size: 200% 200%; animation: gradient 8s ease infinite; }
      `}</style>

      {/* ==================== NAVIGATION ==================== */}
      <motion.nav style={{ backgroundColor: navBg }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24">
            <motion.a href="#home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center">
              <img src="/logo.png" alt="CubeX Tech" className="h-30 md:h-34 lg:h-44 w-auto" />
            </motion.a>
            <div className="hidden lg:flex items-center gap-2">
              {[{ label: "Home", href: "#home", active: true }, { label: "Services", href: "#services" }, { label: "CubeX Home", href: "#cubex-home" }, { label: "Clients", href: "#clients" }, { label: "Contact", href: "#contact" }].map((item, i) => (
                <motion.a key={item.label} href={item.href} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                  className={`px-5 py-2 rounded-full transition-all duration-300 ${item.active ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white"}`}>
                  {item.label}
                </motion.a>
              ))}
            </div>
            <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="lg:hidden pb-6 space-y-2">
              {["Home", "Services", "CubeX Home", "Clients", "Contact"].map((item, i) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block px-5 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5" onClick={() => setMobileMenuOpen(false)}>{item}</a>
              ))}
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* ==================== HERO SECTION ==================== */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#0d0d14]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-6rem)]">
            <div className="space-y-8 lg:space-y-12">
              <div className="space-y-4">
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight">YOUR</motion.h1>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight">PREMIUM</motion.h1>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-400 to-purple-400 animate-gradient">TECH</span>
                  </h1>
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mt-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-purple-400 to-emerald-400 animate-gradient">PARTNER</span>
                  </h1>
                </motion.div>
              </div>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="text-gray-400 text-lg sm:text-xl max-w-md tracking-wider">MULTI-TECH SOLUTIONS</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}>
                <motion.a href="#services" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="group inline-flex px-8 py-4 bg-transparent border-2 border-purple-500/50 hover:border-emerald-500/50 text-white rounded-full transition-all duration-500 relative overflow-hidden">
                  <span className="relative z-10 text-lg tracking-wide">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.a>
              </motion.div>
              <motion.div initial={{ width: 0 }} animate={{ width: "200px" }} transition={{ duration: 1.5, delay: 1.2 }} className="h-[1px] bg-gradient-to-r from-purple-500 via-emerald-500 to-transparent" />
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.4 }} className="relative h-[600px] hidden lg:block">
              <Cube3D />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0d14] to-transparent pointer-events-none" />
      </section>

      {/* ==================== SERVICES SECTION ==================== */}
      <section id="services" className="relative py-32 bg-[#0d0d14] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="px-4 py-2 border border-purple-500/30 rounded-full text-purple-400 text-sm tracking-wider">OUR SERVICES</div>
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">BUILT FOR </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-400 to-purple-400">EXCELLENCE</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto tracking-wide">Comprehensive solutions designed to transform your business</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const isEmerald = service.color === "emerald";
              return (
                <AnimatedSection key={service.title} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -8 }} className="group relative h-full">
                    <div className={`relative h-full p-8 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] hover:border-white/[0.15] rounded-2xl transition-all duration-500 ${service.highlight ? 'border-emerald-500/30' : ''}`}>
                      {service.highlight && <div className="absolute -top-3 left-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-bold px-3 py-1 rounded-full">FLAGSHIP</div>}
                      <div className={`absolute inset-0 ${isEmerald ? "bg-gradient-to-br from-emerald-500/5 to-transparent" : "bg-gradient-to-br from-purple-500/5 to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                      <div className="relative mb-6">
                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`inline-flex p-4 rounded-xl ${isEmerald ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-purple-500/10 border border-purple-500/20"}`}>
                          <service.icon className={`w-7 h-7 ${isEmerald ? "text-emerald-400" : "text-purple-400"}`} />
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{service.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{service.description}</p>
                      <motion.div initial={{ width: 0 }} whileHover={{ width: "100%" }} transition={{ duration: 0.5 }} className={`absolute bottom-0 left-0 h-[2px] ${isEmerald ? "bg-gradient-to-r from-emerald-500 to-transparent" : "bg-gradient-to-r from-purple-500 to-transparent"}`} />
                    </div>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== CUBEX HOME SECTION ==================== */}
      <section id="cubex-home" className="py-24 bg-gradient-to-br from-[#0d0d14] via-purple-950/20 to-[#0d0d14] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
                <Home className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium tracking-wider">FLAGSHIP PRODUCT</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Introducing </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400">CubeX Home</span>
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">The future of residential security and management. Smart, secure, and seamlessly integrated for modern living spaces.</p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {cubexHomeFeatures.map((feature, i) => (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <div className="flex items-start gap-4">
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="bg-gradient-to-br from-emerald-500/20 to-purple-500/20 p-3 rounded-xl flex-shrink-0 border border-emerald-500/20">
                        <feature.icon className="w-6 h-6 text-emerald-400" />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                        <p className="text-gray-500 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black px-8 py-4 rounded-full font-semibold transition-all">
                Get CubeX Home <ChevronRight className="w-5 h-5" />
              </motion.a>
            </AnimatedSection>

            <AnimatedSection delay={0.3} className="hidden lg:block">
              <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur rounded-3xl p-8 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">CubeX Home App</h3>
                  <div className="bg-emerald-500/20 text-emerald-400 text-sm font-medium px-3 py-1 rounded-full">Mobile & Web</div>
                </div>
                <div className="space-y-4">
                  {[{ icon: QrCode, title: "QR Code Access", desc: "Generate & scan for instant entry" },
                    { icon: Bell, title: "Instant Notifications", desc: "Real-time visitor alerts" },
                    { icon: Shield, title: "Secure Management", desc: "Guard interface & activity logs" }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-[#0d0d14]/60 rounded-xl p-4 flex items-center gap-4 border border-white/[0.05]">
                      <div className="bg-gradient-to-br from-emerald-500/20 to-purple-500/20 p-3 rounded-lg">
                        <item.icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-gray-500 text-sm">{item.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-20 bg-[#0d0d14] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Businesses Choose Us</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">As a Malaysian technology company, we understand local business needs.</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-3 gap-8 mb-16">
            <StatCounter value={10} suffix="+" label="Projects Completed" />
            <StatCounter value={2} suffix="+" label="Years Experience" />
            <StatCounter value={98} suffix="%" label="Client Satisfaction" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{ title: "Local Expertise", desc: "Deep understanding of Malaysian market needs with solutions tailored for local businesses." },
              { title: "End-to-End Support", desc: "From consultation to deployment and ongoing maintenance, we're with you every step." },
              { title: "Transparent Pricing", desc: "Clear deliverables with no hidden fees. We deliver exactly what we discussed." }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl p-8 border border-white/[0.05] hover:border-purple-500/30 transition-all">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CLIENTS SECTION ==================== */}
      <section id="clients" className="py-24 bg-gradient-to-b from-[#0d0d14] to-purple-950/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="px-4 py-2 border border-emerald-500/30 rounded-full text-emerald-400 text-sm tracking-wider">TRUSTED BY</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Clients</h2>
            <p className="text-lg text-gray-500">Building lasting relationships with organizations and residential communities</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {clients.map((client, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8, scale: 1.02 }} className="bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl p-8 border border-white/[0.05] hover:border-purple-500/30 transition-all text-center group">
                  <motion.div whileHover={{ scale: 1.1 }} className={`w-20 h-20 bg-gradient-to-br ${client.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-2xl font-bold text-white">{client.initial}</span>
                  </motion.div>
                  <h3 className="font-bold text-white text-lg">{client.name}</h3>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="text-center mt-12">
            <p className="text-gray-500">Join our growing network of satisfied clients</p>
            <motion.a href="#contact" whileHover={{ x: 5 }} className="inline-flex items-center gap-2 text-emerald-400 font-semibold mt-4">
              Become a Client <ArrowRight className="w-4 h-4" />
            </motion.a>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section id="contact" className="py-24 bg-[#0d0d14] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <AnimatedSection>
              <div className="inline-block mb-6">
                <div className="px-4 py-2 border border-purple-500/30 rounded-full text-purple-400 text-sm tracking-wider">GET IN TOUCH</div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Build Something Great Together</h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">Ready to transform your business with smart technology solutions? Get in touch with our team today.</p>
              
              <div className="space-y-6">
                {[{ icon: MapPin, title: "Address", value: "Lot 110, Jalan 28/10a, Taman Perindustrian Iks, 68100 Batu Caves, Selangor" },
                  { icon: Phone, title: "Phone", value: "+60 18-919 9975" },
                  { icon: Mail, title: "Email", value: "info@cubextech.net" }
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-purple-500/20 to-emerald-500/20 p-3 rounded-xl flex-shrink-0 border border-purple-500/20">
                      <item.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-500">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur rounded-3xl p-8 border border-white/[0.08]">
                <h3 className="text-xl font-bold mb-6">Send us a message</h3>
                <form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-[#0d0d14]/60 border border-white/[0.1] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-white placeholder-gray-600" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 rounded-xl bg-[#0d0d14]/60 border border-white/[0.1] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-white placeholder-gray-600" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Service Interest</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-[#0d0d14]/60 border border-white/[0.1] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-white">
                      <option>CubeX Home</option>
                      <option>Visitor Management System</option>
                      <option>Custom Software Development</option>
                      <option>Warehouse Management</option>
                      <option>Security Solutions</option>
                      <option>Automation Systems</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea className="w-full px-4 py-3 rounded-xl bg-[#0d0d14]/60 border border-white/[0.1] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-white placeholder-gray-600 h-32 resize-none" placeholder="Tell us about your project..."></textarea>
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 py-4 rounded-xl font-semibold transition-all text-black">
                    Send Message
                  </motion.button>
                </form>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#0d0d14] border-t border-white/[0.05] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <a href="#home" className="inline-block mb-6">
                <img src="/logo.png" alt="CubeX Tech" className="h-26 w-auto" />
              </a>
              <p className="text-gray-500 leading-relaxed mb-6">Smart solutions for modern businesses. Empowering residential and commercial clients with cutting-edge technology.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {['Home', 'Services', 'CubeX Home', 'Clients', 'Contact'].map((link, i) => (
                  <li key={i}><a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-emerald-400 transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Our Services</h3>
              <ul className="space-y-3">
                {['CubeX Home', 'Visitor Management', 'Custom Software', 'Warehouse Management', 'Security Solutions'].map((service, i) => (
                  <li key={i}><a href="#services" className="text-gray-500 hover:text-emerald-400 transition-colors">{service}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-500"><MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" /><span>Lot 110, Jalan 28/10a, Taman Perindustrian Iks, 68100 Batu Caves, Selangor</span></li>
                <li className="flex items-center gap-3 text-gray-500"><Phone className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>+60 18-919 9975</span></li>
                <li className="flex items-center gap-3 text-gray-500"><Mail className="w-5 h-5 text-purple-400 flex-shrink-0" /><span>info@cubextech.net</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2025 CubeX Technology. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
