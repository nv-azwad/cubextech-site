import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ChevronDown, ArrowRight, ArrowLeft, Phone, Mail, MapPin, Shield, Users, Home, Code, Truck, Zap, CheckCircle, QrCode, Bell, Eye, FileText, Lock } from 'lucide-react';

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
    iso(-sizeX, -sizeY, -sizeZ), iso(sizeX, -sizeY, -sizeZ),
    iso(sizeX, sizeY, -sizeZ), iso(-sizeX, sizeY, -sizeZ),
    iso(-sizeX, -sizeY, sizeZ), iso(sizeX, -sizeY, sizeZ),
    iso(sizeX, sizeY, sizeZ), iso(-sizeX, sizeY, sizeZ),
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

// ==================== SCROLL TO TOP ====================
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ==================== SHARED NAVBAR ====================
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [policiesOpen, setPoliciesOpen] = useState(false);
  const [mobilePoliciesOpen, setMobilePoliciesOpen] = useState(false);
  const location = useLocation();
  const isMainPage = location.pathname === '/';
  const isPolicyPage = ['/terms-of-service', '/privacy-policy', '/pdpa-compliance', '/ai-compliance', '/service-agreement'].includes(location.pathname);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(13, 13, 20, 0)", "rgba(13, 13, 20, 0.95)"]);

  const navItems = [
    { label: "Home", section: "home" },
    { label: "Services", section: "services" },
    { label: "CubeX Home", section: "cubex-home" },
    { label: "Clients", section: "clients" },
    { label: "Contact", section: "contact" },
  ];

  const handleNavClick = (e, sectionId) => {
    if (isMainPage) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav style={{ backgroundColor: isPolicyPage ? "rgba(13, 13, 20, 0.95)" : navBg }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <motion.a href={isMainPage ? "#home" : "/"} onClick={(e) => { if (isMainPage) { e.preventDefault(); document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }); } }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center">
            <img src="/logo.png" alt="CubeX Tech" className="h-30 md:h-34 lg:h-44 w-auto" />
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={isMainPage ? `#${item.section}` : `/#${item.section}`}
                onClick={(e) => handleNavClick(e, item.section)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                className={`px-5 py-2 rounded-full transition-all duration-300 ${item.section === 'home' && isMainPage ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white"}`}
              >
                {item.label}
              </motion.a>
            ))}

            {/* Policies Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="relative"
              onMouseEnter={() => setPoliciesOpen(true)}
              onMouseLeave={() => setPoliciesOpen(false)}
            >
              <button className={`px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 ${isPolicyPage ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white"}`}>
                Policies
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${policiesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {policiesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-[#0d0d14]/95 backdrop-blur-xl border border-white/[0.1] rounded-xl p-2 shadow-2xl shadow-purple-500/10"
                  >
                    <Link to="/terms-of-service" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all" onClick={() => setPoliciesOpen(false)}>
                      <FileText className="w-4 h-4 text-purple-400" />Terms of Service
                    </Link>
                    <Link to="/privacy-policy" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all" onClick={() => setPoliciesOpen(false)}>
                      <Lock className="w-4 h-4 text-emerald-400" />Privacy Policy
                    </Link>
                    <Link to="/pdpa-compliance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all" onClick={() => setPoliciesOpen(false)}>
                      <Shield className="w-4 h-4 text-cyan-400" />PDPA Compliance
                    </Link>
                    <Link to="/ai-compliance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all" onClick={() => setPoliciesOpen(false)}>
                      <Eye className="w-4 h-4 text-amber-400" />AI Compliance
                    </Link>
                    <Link to="/service-agreement" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all" onClick={() => setPoliciesOpen(false)}>
                      <FileText className="w-4 h-4 text-pink-400" />Service Agreement
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="lg:hidden pb-6 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={isMainPage ? `#${item.section}` : `/#${item.section}`}
                className="block px-5 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                onClick={(e) => handleNavClick(e, item.section)}
              >
                {item.label}
              </a>
            ))}
            {/* Mobile Policies */}
            <button
              className="w-full flex items-center justify-between px-5 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
              onClick={() => setMobilePoliciesOpen(!mobilePoliciesOpen)}
            >
              Policies
              <ChevronDown className={`w-4 h-4 transition-transform ${mobilePoliciesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobilePoliciesOpen && (
              <div className="pl-4 space-y-1">
                <Link to="/terms-of-service" className="block px-5 py-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-sm" onClick={() => setMobileMenuOpen(false)}>Terms of Service</Link>
                <Link to="/privacy-policy" className="block px-5 py-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-sm" onClick={() => setMobileMenuOpen(false)}>Privacy Policy</Link>
                <Link to="/pdpa-compliance" className="block px-5 py-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-sm" onClick={() => setMobileMenuOpen(false)}>PDPA Compliance</Link>
                <Link to="/ai-compliance" className="block px-5 py-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-sm" onClick={() => setMobileMenuOpen(false)}>AI Compliance</Link>
                <Link to="/service-agreement" className="block px-5 py-2.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 text-sm" onClick={() => setMobileMenuOpen(false)}>Service Agreement</Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

// ==================== SHARED FOOTER ====================
function Footer() {
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <footer className="bg-[#0d0d14] border-t border-white/[0.05] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <a href={isMainPage ? "#home" : "/"} className="inline-block mb-6">
              <img src="/logo.png" alt="CubeX Tech" className="h-26 w-auto" />
            </a>
            <p className="text-gray-500 leading-relaxed mb-6">Smart solutions for modern businesses. Empowering residential and commercial clients with cutting-edge technology.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Services', 'CubeX Home', 'Clients', 'Contact'].map((link, i) => (
                <li key={i}><a href={isMainPage ? `#${link.toLowerCase().replace(' ', '-')}` : `/#${link.toLowerCase().replace(' ', '-')}`} className="text-gray-500 hover:text-emerald-400 transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              {['CubeX Home', 'Visitor Management', 'Custom Software', 'Warehouse Management', 'Security Solutions'].map((service, i) => (
                <li key={i}><a href={isMainPage ? "#services" : "/#services"} className="text-gray-500 hover:text-emerald-400 transition-colors">{service}</a></li>
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
            <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==================== SHARED PAGE WRAPPER ====================
function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-[#0d0d14] text-white overflow-x-hidden">
      <style>{`
        @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient { background-size: 200% 200%; animation: gradient 8s ease infinite; }
      `}</style>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

// ==================== HOME PAGE ====================
function HomePage() {
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus(null);
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'),
      message: formData.get('message'),
    };
    try {
      const res = await fetch('/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      setFormStatus({ success: result.success, message: result.message });
      if (result.success) e.target.reset();
    } catch (err) {
      setFormStatus({ success: false, message: 'Something went wrong. Please try again.' });
    }
    setFormLoading(false);
  };

  const services = [
    { icon: Home, title: "CubeX Home", description: "Smart residential security with visitor management, QR access, and real-time monitoring.", color: "emerald", highlight: true },
    { icon: Users, title: "Visitor Management", description: "Complete visitor tracking, QR-based access control, and comprehensive activity logs.", color: "purple" },
    { icon: Code, title: "Custom Software", description: "Tailored enterprise solutions from web apps to complex management systems.", color: "emerald" },
    { icon: Truck, title: "Warehouse Management", description: "Advanced tracking for vehicle entry/exit and logistics optimization.", color: "purple" },
    { icon: Shield, title: "Security Solutions", description: "Integrated surveillance and smart monitoring for properties.", color: "emerald" },
    { icon: Zap, title: "Automation Systems", description: "Automated workflows and intelligent management platforms.", color: "purple" },
  ];

  const clients = [
    { name: "Flash Express", initial: "FE", color: "from-amber-500 to-orange-500", glowShadow: "0 0 5px rgba(245, 158, 11, 0.8), 0 0 15px rgba(245, 158, 11, 0.6), 0 0 30px rgba(245, 158, 11, 0.5), 0 0 60px rgba(245, 158, 11, 0.4), 0 0 100px rgba(245, 158, 11, 0.25), 0 0 150px rgba(245, 158, 11, 0.15), inset 0 0 30px rgba(245, 158, 11, 0.08)", borderHover: "border-amber-400/70", bgHover: "from-amber-500/[0.15] via-amber-500/[0.08] to-transparent" },
    { name: "Centroz", initial: "C", color: "from-blue-500 to-cyan-500", glowShadow: "0 0 5px rgba(59, 130, 246, 0.8), 0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.4), 0 0 100px rgba(59, 130, 246, 0.25), 0 0 150px rgba(59, 130, 246, 0.15), inset 0 0 30px rgba(59, 130, 246, 0.08)", borderHover: "border-blue-400/70", bgHover: "from-blue-500/[0.15] via-blue-500/[0.08] to-transparent" },
    { name: "Condominiums", initial: "CD", color: "from-emerald-500 to-teal-500", glowShadow: "0 0 5px rgba(16, 185, 129, 0.8), 0 0 15px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.4), 0 0 100px rgba(16, 185, 129, 0.25), 0 0 150px rgba(16, 185, 129, 0.15), inset 0 0 30px rgba(16, 185, 129, 0.08)", borderHover: "border-emerald-400/70", bgHover: "from-emerald-500/[0.15] via-emerald-500/[0.08] to-transparent" },
  ];

  const cubexHomeFeatures = [
    { icon: QrCode, title: "QR Access Control", desc: "Instant visitor verification with secure QR codes" },
    { icon: Bell, title: "Real-time Alerts", desc: "Instant notifications for all visitor activities" },
    { icon: Users, title: "Guard Interface", desc: "Streamlined security operations dashboard" },
    { icon: Eye, title: "24/7 Monitoring", desc: "Comprehensive activity logs and tracking" },
  ];

  // Glow shadow values for service cards — intense neon border glow
  const emeraldGlow = "0 0 5px rgba(16, 185, 129, 0.8), 0 0 15px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.4), 0 0 100px rgba(16, 185, 129, 0.25), 0 0 150px rgba(16, 185, 129, 0.15), inset 0 0 30px rgba(16, 185, 129, 0.08)";
  const purpleGlow = "0 0 5px rgba(139, 92, 246, 0.8), 0 0 15px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.4), 0 0 100px rgba(139, 92, 246, 0.25), 0 0 150px rgba(139, 92, 246, 0.15), inset 0 0 30px rgba(139, 92, 246, 0.08)";

  return (
    <PageWrapper>
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
                <motion.a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="group inline-flex px-8 py-4 bg-transparent border-2 border-purple-500/50 hover:border-emerald-500/50 text-white rounded-full transition-all duration-500 relative overflow-hidden">
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

      {/* ==================== SERVICES SECTION (WITH GLOW) ==================== */}
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
                  <motion.div
                    whileHover={{
                      y: -8,
                      boxShadow: isEmerald ? emeraldGlow : purpleGlow,
                    }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="group relative h-full rounded-2xl"
                    style={{ boxShadow: '0 0 0px rgba(0,0,0,0)' }}
                  >
                    <div className={`relative h-full p-8 bg-gradient-to-br from-white/[0.02] to-transparent border-2 rounded-2xl transition-all duration-500 ${service.highlight ? 'border-emerald-500/30' : 'border-white/[0.05]'} ${isEmerald ? 'group-hover:border-emerald-400/70' : 'group-hover:border-purple-400/70'}`}>
                      {service.highlight && <div className="absolute -top-3 left-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-bold px-3 py-1 rounded-full">FLAGSHIP</div>}
                      <div className={`absolute inset-0 ${isEmerald ? "bg-gradient-to-br from-emerald-500/[0.15] via-emerald-500/[0.08] to-transparent" : "bg-gradient-to-br from-purple-500/[0.15] via-purple-500/[0.08] to-transparent"} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                      <div className="relative mb-6">
                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`inline-flex p-4 rounded-xl ${isEmerald ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-purple-500/10 border border-purple-500/20"}`}>
                          <service.icon className={`w-7 h-7 ${isEmerald ? "text-emerald-400" : "text-purple-400"}`} />
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{service.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{service.description}</p>
                      <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isEmerald ? "bg-gradient-to-r from-emerald-500 to-transparent" : "bg-gradient-to-r from-purple-500 to-transparent"}`} />
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

              <motion.a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black px-8 py-4 rounded-full font-semibold transition-all">
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

      {/* ==================== CLIENTS SECTION (WITH GLOW) ==================== */}
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
                <motion.div
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow: client.glowShadow,
                  }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl p-8 border-2 border-white/[0.05] hover:border-white/[0.2] transition-all text-center group relative overflow-hidden"
                  style={{ boxShadow: '0 0 0px rgba(0,0,0,0)' }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${client.bgHover} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  <motion.div whileHover={{ scale: 1.1 }} className={`relative z-10 w-20 h-20 bg-gradient-to-br ${client.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-2xl font-bold text-white">{client.initial}</span>
                  </motion.div>
                  <h3 className="relative z-10 font-bold text-white text-lg">{client.name}</h3>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="text-center mt-12">
            <p className="text-gray-500">Join our growing network of satisfied clients</p>
            <motion.a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} whileHover={{ x: 5 }} className="inline-flex items-center gap-2 text-emerald-400 font-semibold mt-4">
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
                {formStatus && (
                  <div className={`p-4 rounded-xl text-sm font-medium mb-4 ${formStatus.success ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {formStatus.message}
                  </div>
                )}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl bg-[#0d0d14]/60 border border-white/[0.1] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-white placeholder-gray-600" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl bg-[#0d0d14]/60 border border-white/[0.1] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-white placeholder-gray-600" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Service Interest</label>
                    <select name="service" className="w-full px-4 py-3 rounded-xl bg-[#0d0d14]/60 border border-white/[0.1] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-white">
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
                    <textarea name="message" required className="w-full px-4 py-3 rounded-xl bg-[#0d0d14]/60 border border-white/[0.1] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition text-white placeholder-gray-600 h-32 resize-none" placeholder="Tell us about your project..."></textarea>
                  </div>
                  <motion.button type="submit" disabled={formLoading} whileHover={{ scale: formLoading ? 1 : 1.02 }} whileTap={{ scale: formLoading ? 1 : 0.98 }} className={`w-full bg-gradient-to-r from-purple-500 to-emerald-500 py-4 rounded-xl font-semibold transition-all text-black ${formLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                    {formLoading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

// ==================== REUSABLE POLICY PAGE COMPONENT ====================
function PolicyPage({ badge, badgeColor, borderColor, title, titleGradient, lastUpdated, sections, hoverBorder }) {
  return (
    <PageWrapper>
      <div className="relative pt-32 pb-24">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="mb-12">
              <div className="inline-block mb-4">
                <div className={`px-4 py-2 border ${borderColor} rounded-full ${badgeColor} text-sm tracking-wider`}>{badge}</div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${titleGradient}`}>{title}</span>
              </h1>
              <p className="text-gray-500">Last updated: {lastUpdated}</p>
            </div>
          </AnimatedSection>
          <div className="space-y-6">
            {sections.map((section, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className={`bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] ${hoverBorder} rounded-2xl p-8 transition-all duration-300`}>
                  <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{section.content}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ==================== TERMS OF SERVICE PAGE ====================
function TermsOfServicePage() {
  const sections = [
    { title: "1. Introduction and Acceptance", content: "Welcome to CubeXTech Sdn Bhd. These Terms of Use govern your access to and use of our website (www.cubextech.net) and any of our services. By accessing or using our website or services, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any part of these Terms, you must not use our website or services. We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website." },
    { title: "2. Company Information", content: "CubeXTech Sdn Bhd is registered under company number JM1020270-T with our registered address at Suite 3A07 Menara Mutiara Majestic, No 15 Jalan Othman Section 3, 46000 Petaling Jaya, Malaysia. For inquiries, contact us at info@cubextech.net." },
    { title: "3. Services Description", content: "CubeXTech provides technology solutions for security and property management, including: Visitor Management Systems (VMS) with QR code generation and scanning, Surveillance and CCTV systems with cloud-based monitoring, Smart residential security solutions including access control systems, Property management software integrations, Technical support and maintenance services, and Consultation and custom solution development. We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time." },
    { title: "4. User Accounts", content: "To access certain features of our Services, you may be required to create an account. When creating an account, you agree to: Provide accurate, current, and complete information; Maintain and promptly update your account information; Maintain the security of your password and account credentials; Accept responsibility for all activities that occur under your account; Notify us immediately of any unauthorized use. You must be at least 18 years old to create an account." },
    { title: "5. Acceptable Use Policy", content: "You agree NOT to: Use our Services for any illegal purpose or in violation of any laws; Attempt to gain unauthorized access to our systems or networks; Interfere with or disrupt the integrity or performance of our Services; Reverse engineer, decompile, or disassemble any aspect of our Services; Upload or transmit viruses, malware, or other malicious code; Harvest or collect information about other users without their consent; Use our Services to send spam or unsolicited communications; Impersonate any person or entity; Use automated systems (bots, scrapers) without our written permission; Resell or redistribute our Services without authorization." },
    { title: "6. Intellectual Property Rights", content: "All Content on our website and within our Services, including text, graphics, logos, images, software, source code, and documentation, is the property of CubeXTech Sdn Bhd or its licensors and is protected by Malaysian and international copyright, trademark, and other intellectual property laws. The CubeXTech name, logo, and all related product names are trademarks of CubeXTech Sdn Bhd. Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use our website and Services." },
    { title: "7. Privacy and Data Protection", content: "CubeXTech is committed to protecting your Personal Data in accordance with Malaysia's Personal Data Protection Act 2010 (PDPA). By using our Services, you acknowledge and consent to: Collection of Personal Data as described in our Privacy Policy; Use of cookies and similar tracking technologies; Processing of your data for service delivery and improvement; Storage of data on secure servers. Under the PDPA, you have the right to access, correct, and request deletion of your Personal Data." },
    { title: "8. Payment Terms", content: "Pricing for our Services is as quoted in your service agreement or displayed on our website. All prices are in Malaysian Ringgit (RM) unless otherwise stated and exclude applicable taxes. We accept payment via bank transfer, credit/debit cards (Visa, Mastercard), online banking (FPX), and cheque for corporate clients. Payment is due within 30 days of invoice date. Late payments may incur interest at 1.5% per month. We reserve the right to suspend Services for non-payment." },
    { title: "9. Warranties and Disclaimers", content: "We warrant that our Services will be performed in a professional and workmanlike manner consistent with industry standards. EXCEPT AS EXPRESSLY PROVIDED, OUR SERVICES AND WEBSITE ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. We specifically disclaim all implied warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted or error-free operation." },
    { title: "10. Limitation of Liability", content: "TO THE MAXIMUM EXTENT PERMITTED BY MALAYSIAN LAW, OUR TOTAL LIABILITY TO YOU FOR ANY DAMAGES ARISING OUT OF OR RELATED TO THESE TERMS OR YOUR USE OF OUR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY. We shall not be liable for indirect, incidental, consequential damages, loss of profits, revenue, data, or business opportunities." },
    { title: "11. Indemnification", content: "You agree to indemnify, defend, and hold harmless CubeXTech Sdn Bhd, its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, and expenses arising out of your use or misuse of our Services, your violation of these Terms, your violation of any rights of another party, or your violation of any applicable laws." },
    { title: "12. Termination", content: "You may terminate your account at any time by contacting us at support@cubextech.net. We may terminate or suspend your access immediately, without prior notice, for breach of these Terms, non-payment of fees, illegal or fraudulent activity, or risk to our systems or other users. Upon termination, your right to access our Services immediately ceases and we may delete your account and data." },
    { title: "13. Governing Law and Jurisdiction", content: "These Terms shall be governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law provisions. You agree that any legal action or proceeding shall be instituted exclusively in the courts of Malaysia. In the event of any dispute, parties shall first attempt to resolve through good faith negotiations, then mediation if negotiations fail within 30 days." },
    { title: "14. Contact Information", content: "For questions, concerns, or inquiries regarding these Terms of Use, please contact us: CubeXTech Sdn Bhd, Suite 3A07 Menara Mutiara Majestic, No 15 Jalan Othman Section 3, 46000 Petaling Jaya, Malaysia. Email: legal@cubextech.net, Phone: +60 18-919 9975." },
  ];

  return (
    <PageWrapper>
      <div className="relative pt-32 pb-24">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors mb-8"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
            <div className="mb-12">
              <div className="inline-block mb-4"><div className="px-4 py-2 border border-purple-500/30 rounded-full text-purple-400 text-sm tracking-wider">LEGAL</div></div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"><span className="text-white">Terms of </span><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Service</span></h1>
              <p className="text-gray-500">Last updated: January 20, 2026</p>
            </div>
          </AnimatedSection>
          <div className="space-y-6">
            {sections.map((section, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] hover:border-purple-500/20 rounded-2xl p-8 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{section.content}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ==================== PRIVACY POLICY PAGE ====================
function PrivacyPolicyPage() {
  const sections = [
    { title: "1. Introduction and Scope", content: "CubeXTech Sdn Bhd (\"CubeXTech\", \"we\", \"us\", \"our\") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains our practices regarding the collection, use, disclosure, and protection of information through our websites (www.cubextech.net), mobile applications, security systems and IoT devices, and direct interactions with our teams. We are the Data Controller, registered as JM1020270-T, located at Suite 3A07 Menara Mutiara Majestic, No 15 Jalan Othman Section 3, 46000 Petaling Jaya, Malaysia." },
    { title: "2. Personal Information You Provide", content: "We collect information that you voluntarily provide: Identity Data (name, username, title, date of birth, gender), Contact Data (email address, phone numbers, postal address), Professional Data (company name, job title, business address, industry), Financial Data (bank account details, payment card information, billing address), Account Data (username, password, preferences, saved settings), and Identity Documents (NRIC, passport, business registration for verification purposes)." },
    { title: "3. Information Collected Automatically", content: "When you use our services, we automatically collect: Technical Data (IP address, browser type, device ID, operating system), Usage Data (pages viewed, features used, timestamps, referring URLs), Location Data (GPS coordinates, WiFi access points, IP-based location), Interaction Data (click patterns, mouse movements, scroll depth), and Device Data (screen size, installed fonts, battery level, sensor data)." },
    { title: "4. Sensitive Personal Data", content: "With your explicit consent, we may collect: Biometric Data (facial recognition data, fingerprints for access control systems), Video/Audio Data (surveillance footage, recorded calls with notice), and Health Data (temperature readings for access control during health screening). We only collect sensitive data when necessary and with appropriate legal basis." },
    { title: "5. How We Use Your Information", content: "We use your information for: Service Provision (install and configure systems, provide access control, monitor surveillance), Account Management (create accounts, authenticate users, manage subscriptions), Payment & Billing (process transactions, issue invoices, detect fraud), Customer Support (respond to inquiries, troubleshoot issues), Communications (send service updates, security alerts, newsletters), Product Improvement (analyze usage patterns, develop features), Security & Safety (prevent unauthorized access, detect threats), Legal Compliance (comply with laws, respond to legal requests), and Marketing (promotional offers, surveys, personalized advertising with consent)." },
    { title: "6. Legal Basis for Processing", content: "We process your personal information based on: Consent (you have given clear consent for specific purposes like marketing, biometric data collection, location tracking); Contractual Necessity (processing is necessary to fulfill our contract including providing services, processing payments, delivering support); Legal Obligation (processing required to comply with tax reporting, responding to authorities, maintaining records); and Legitimate Interests (fraud prevention, network security, business analytics, improving products)." },
    { title: "7. Sharing and Disclosure", content: "We do not sell your personal information. We may share your information with: Service Providers (cloud hosting, payment processors, email platforms, analytics services, customer support tools), Business Partners (hardware suppliers, software vendors, system integrators), Legal Requirements (when required by law, to comply with legal process, protect our rights, prevent fraud), and Business Transfers (in the event of merger, acquisition, or sale of assets - we will notify you of any such change)." },
    { title: "8. Data Retention and Deletion", content: "We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected and to comply with legal obligations. After the retention period expires, we securely delete or anonymize your personal data unless required to retain it for legal purposes. Specific retention periods are defined for different categories of data." },
    { title: "9. Your Privacy Rights", content: "You have the right to: Access your personal data and receive a copy; Request correction of inaccurate, incomplete, or outdated data; Withdraw consent at any time (this will not affect lawfulness of processing before withdrawal); Limit processing in certain circumstances; Data portability (receive your data in machine-readable format). To exercise these rights, contact our Data Protection Officer at privacy@cubextech.net." },
    { title: "10. Security Measures", content: "We implement comprehensive security measures: Technical Security (encryption in transit using TLS 1.3, encryption at rest using AES-256, multi-factor authentication, firewalls and intrusion detection, regular security patches, secure backup systems); Organizational Security (background checks for employees, confidentiality training, access controls on need-to-know basis, security audits, incident response protocols); Physical Security (secure data centers, CCTV surveillance, locked storage, secure disposal of records)." },
    { title: "11. Surveillance and Video Data", content: "For our security systems and CubeX Home platform, we collect and process surveillance footage and video analytics. This data is used exclusively for security purposes, access control, and visitor management. Retention periods typically range from 30-90 days unless extended retention is required for incident investigation. Clear signage is displayed at all monitored locations." },
    { title: "12. Cookies and Tracking", content: "Our website uses cookies and similar tracking technologies. Types include: Essential Cookies (required for site functionality), Analytics Cookies (help us understand usage patterns), Functional Cookies (remember your preferences), and Marketing Cookies (used for targeted advertising with consent). You can control cookies through our consent banner, browser settings, or analytics opt-out tools. Blocking certain cookies may affect website functionality." },
    { title: "13. International Data Transfers", content: "Your personal data is primarily stored and processed in Malaysia. We may transfer data to other countries where our service providers operate (cloud hosting, email services, analytics). When transferring data internationally, we ensure the recipient country has adequate data protection laws, implement appropriate safeguards, and obtain your consent where required." },
    { title: "14. Children's Privacy", content: "Our services are not intended for children under 18 years of age. We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately at privacy@cubextech.net." },
    { title: "15. Contact Information", content: "For any questions, concerns, or requests regarding this Privacy Policy, contact us: CubeXTech Sdn Bhd, Data Protection Officer, Suite 3A07 Menara Mutiara Majestic, No 15 Jalan Othman Section 3, 46000 Petaling Jaya, Malaysia. Email: privacy@cubextech.net, Phone: +60 18-919 9975. If not satisfied with our response, you may lodge a complaint with the Personal Data Protection Commissioner of Malaysia." },
  ];

  return <PolicyPage badge="PRIVACY" badgeColor="text-emerald-400" borderColor="border-emerald-500/30" title="Privacy Policy" titleGradient="from-emerald-400 to-purple-400" lastUpdated="January 20, 2026" sections={sections} hoverBorder="hover:border-emerald-500/20" />;
}

// ==================== PDPA COMPLIANCE PAGE ====================
function PDPACompliancePage() {
  const sections = [
    { title: "Introduction", content: "Cubex Technology (\"CubeXTech\", \"we\", \"us\", \"our\") is committed to protecting your privacy and ensuring the security of your personal data in accordance with Malaysia's Personal Data Protection Act 2010 (\"PDPA\"). This Privacy Notice explains how we collect, use, disclose, and protect your personal data when you visit our website (www.cubextech.net), use our products and services, or contact us in any way. By providing your personal data to us, you consent to the processing of your personal data in accordance with this Privacy Notice." },
    { title: "Company Information", content: "Data Controller: CubeXTech Sdn Bhd, Registration Number: JM1020270-T, Address: Suite 3A07 Menara Mutiara Majestic, No 15 Jalan Othman Section 3, 46000 Petaling Jaya, Malaysia, Data Protection Officer: privacy@cubextech.net" },
    { title: "Personal Data We Collect", content: "Information You Provide Directly: Name and contact details, company and job information, payment and billing information, account credentials, identification documents. Information Collected Automatically: Device and browser information, IP address and location data, usage patterns and preferences, cookies and tracking data. Information from Third Parties: Business partners and service providers, publicly available sources, social media platforms, and referral sources." },
    { title: "How We Use Your Personal Data", content: "We process your personal data for: Providing and improving our services, Processing transactions and payments, Communicating with you about our services, Security and fraud prevention, Legal compliance and regulatory requirements, Marketing and promotional activities (with your consent), Analytics and business intelligence, Customer support and relationship management." },
    { title: "Disclosure of Your Personal Data", content: "We may disclose your personal data to: Service providers and contractors, Business partners and affiliates, Legal and regulatory authorities (when required by law), Professional advisors (lawyers, accountants, auditors), Potential buyers (in the event of business sale or merger). We require all third parties to respect the security of your personal data and treat it in accordance with applicable laws." },
    { title: "Data Retention", content: "We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected and to comply with legal obligations. Retention periods vary by data type: Active customer data (duration of relationship + 7 years), Transaction records (7 years for tax compliance), Marketing data (until consent withdrawn), Security footage (30-90 days typically). After retention period expires, we securely delete or anonymize your data." },
    { title: "Your Rights Under PDPA", content: "Right to Access: You can request access to your personal data, receive confirmation of processing, get a copy of your data, and understand how it's used. Right to Correction: You can request correction of inaccurate, incomplete, or outdated data within 21 days. Right to Withdraw Consent: Where we rely on consent, you may withdraw at any time without affecting prior processing. Right to Limit Processing: You may request we limit processing in certain circumstances. Right to Data Portability: Request your data in a machine-readable format for transfer." },
    { title: "How to Exercise Your Rights", content: "To exercise any of your rights, contact our Data Protection Officer: Email: privacy@cubextech.net, Phone: +60 18-919 9975, Mail: Suite 3A07 Menara Mutiara Majestic, No 15 Jalan Othman Section 3, 46000 Petaling Jaya, Malaysia. We may charge a reasonable fee for excessive or repetitive requests. We will inform you of any applicable fees before processing." },
    { title: "Data Security Measures", content: "Technical Security: Encryption in transit (TLS 1.3), encryption at rest (AES-256), multi-factor authentication, firewalls and intrusion detection, regular security patches, secure backup systems. Organizational Security: Background checks for employees, confidentiality and data protection training, need-to-know access controls, regular security audits, incident response protocols. Physical Security: Secure data centers with access controls, CCTV surveillance, locked storage for documents, secure disposal of records." },
    { title: "Cookies and Tracking Technologies", content: "Our website uses cookies to enhance your experience. Types: Essential Cookies (required for site functionality, cannot be disabled), Performance Cookies (analytics and usage patterns), Functional Cookies (remember preferences and settings), Marketing Cookies (targeted advertising with consent). You can manage cookies through our consent banner, browser settings, or opt-out tools like Google Analytics Opt-out." },
    { title: "International Data Transfers", content: "Your data is primarily stored in Malaysia. We may transfer to other countries where our service providers operate (cloud hosting, email services, analytics). For international transfers, we ensure: Recipient country has adequate data protection laws OR we implement appropriate safeguards (contractual clauses, certification) AND obtain your consent where required." },
    { title: "Changes to This Notice", content: "We may update this Privacy Notice from time to time. We will: Post the updated notice on our website, update the \"Last Updated\" date, notify you by email for significant changes (if we have your email). Your continued use of our services after changes constitutes acceptance of the updated Privacy Notice." },
    { title: "Contact Us and Complaints", content: "For questions, concerns, or requests: CubeXTech Sdn Bhd, Data Protection Officer, privacy@cubextech.net, +60 18-919 9975. If not satisfied with our response, you have the right to lodge a complaint with: Personal Data Protection Commissioner, Level 6, Kompleks Kementerian Komunikasi dan Multimedia, Lot 4G9, Persiaran Perdana, Presint 4, 62100 Putrajaya, Malaysia. Website: www.pdp.gov.my" },
  ];

  return <PolicyPage badge="PDPA" badgeColor="text-cyan-400" borderColor="border-cyan-500/30" title="PDPA Compliance" titleGradient="from-cyan-400 to-purple-400" lastUpdated="January 20, 2026" sections={sections} hoverBorder="hover:border-cyan-500/20" />;
}

// ==================== AI COMPLIANCE PAGE ====================
function AICompliancePage() {
  const sections = [
    { title: "1. Introduction and Purpose", content: "Cubex Technology (\"CubeXTech\") is committed to the responsible development, deployment, and use of Artificial Intelligence (AI) and Machine Learning (ML) technologies in our security and property management solutions. This AI Compliance Policy establishes principles, standards, and procedures to ensure our AI systems are ethical and aligned with human values, transparent and explainable, fair and non-discriminatory, secure and privacy-preserving, and compliant with applicable laws and regulations." },
    { title: "2. Scope of AI Technologies", content: "This policy applies to all AI/ML technologies used in CubeXTech products and services, including: Facial recognition systems for access control, Video analytics for security monitoring, Behavior detection and anomaly recognition, Automated visitor screening and verification, Predictive analytics for property management, Natural language processing for customer support, and any future AI implementations." },
    { title: "3. Ethical AI Principles - Human-Centric Design", content: "Our AI systems are designed with humans at the center: AI systems must serve human well-being and dignity, Humans retain ultimate decision-making authority, Systems include human oversight and intervention mechanisms, User consent and autonomy are respected at all times." },
    { title: "4. Fairness and Non-Discrimination", content: "CubeXTech ensures AI fairness through: AI systems must not discriminate based on race, gender, age, religion, disability, or other protected characteristics. Training data is reviewed for bias and balanced representation. Regular fairness audits are conducted on deployed systems. Disparate impact is monitored and mitigated continuously." },
    { title: "5. Transparency and Explainability", content: "We maintain transparency in AI operations: Users are informed when interacting with AI systems, AI decision-making processes are documented and explainable, Clear disclosures about AI capabilities and limitations are provided, Model cards document system specifications and performance metrics." },
    { title: "6. Facial Recognition Technology", content: "Given the sensitive nature of facial recognition, CubeXTech applies additional safeguards: Consent and Notice (explicit consent required before enrollment, clear signage at all locations, opt-out mechanisms available, privacy notice explaining data use). Accuracy Requirements (minimum 99% true positive rate, maximum 0.1% false positive rate, maximum 1% false negative rate, tested across demographic groups). Systems failing to meet these standards must not be deployed." },
    { title: "7. Prohibited Uses of Facial Recognition", content: "Facial recognition SHALL NOT be used for: Mass surveillance of public spaces without legal authority, Tracking individuals based on protected characteristics, Covert identification without notice or consent, Political profiling or suppression, Creating databases for unauthorized purposes, Any use violating human rights or dignity." },
    { title: "8. Video Analytics and Surveillance AI", content: "Permitted Use Cases: Perimeter intrusion detection, Unauthorized access attempts, Object detection (vehicles, packages), Crowd density monitoring, Fire and smoke detection, Loitering and suspicious behavior alerts. Privacy Protections: Blur or mask faces when identification not required, Zone masking for privacy-sensitive areas, Metadata-only storage where possible, Limited retention periods (30-90 days typical)." },
    { title: "9. AI Data Governance", content: "Training Data Standards: All training data must be legally obtained with appropriate consent, representative and diverse across demographics, properly labeled and quality-controlled, documented with data lineage and provenance, and regularly updated. Bias Testing: Pre-deployment bias assessment required, quarterly bias audits for deployed systems, immediate suspension if bias discovered, remediation and retraining before redeployment." },
    { title: "10. AI Ethics Committee", content: "CubeXTech maintains an AI Ethics Committee comprising: Chief Technology Officer (Chair), Data Protection Officer, Legal Counsel, Senior AI/ML Engineer, and Customer Representative (rotating). Responsibilities: Review and approve new AI deployments, investigate ethical concerns and complaints, update policies based on emerging risks, and quarterly review of AI system performance." },
    { title: "11. Regulatory Compliance", content: "CubeXTech monitors and complies with: Malaysia's Personal Data Protection Act 2010 (PDPA), EU AI Act requirements (for applicable services), Industry-specific regulations and standards, International AI ethics frameworks and guidelines, and emerging AI legislation in operating jurisdictions." },
    { title: "12. Incident Response for AI Systems", content: "In case of AI system failures, bias incidents, or ethical violations: Immediate suspension of affected system, Investigation by AI Ethics Committee within 24 hours, Notification to affected parties as required by law, Root cause analysis and corrective action plan, Independent audit before system reactivation." },
    { title: "13. User Rights and Controls", content: "Individuals have rights regarding AI systems: Right to Information (be informed when AI is used in decisions, understand the logic and criteria, access model documentation). Right to Human Review (request human review of AI decisions, challenge automated decisions, appeal adverse outcomes). Right to Opt-Out (decline AI-based processing where alternatives exist, use manual processes instead, request deletion of AI training data)." },
    { title: "14. Contact Information", content: "For questions, concerns, or complaints regarding AI systems: AI Ethics Committee Email: ai-ethics@cubextech.net, Data Protection Officer: privacy@cubextech.net, General Inquiries: info@cubextech.net, Phone: +60 18-919 9975, Address: Suite 3A07 Menara Mutiara Majestic, No 15 Jalan Othman Section 3, 46000 Petaling Jaya, Malaysia." },
  ];

  return <PolicyPage badge="AI ETHICS" badgeColor="text-amber-400" borderColor="border-amber-500/30" title="AI Compliance" titleGradient="from-amber-400 to-orange-400" lastUpdated="January 20, 2026" sections={sections} hoverBorder="hover:border-amber-500/20" />;
}

// ==================== SERVICE AGREEMENT PAGE ====================
function ServiceAgreementPage() {
  const sections = [
    { title: "1. Agreement Overview", content: "These Terms of Service govern the provision of products and services by Cubex Technology (\"CubeXTech\") to customers who purchase or subscribe to our security and property management solutions. This Agreement supplements our Terms of Use and Privacy Policy. Services covered include: Visitor Management Systems, Surveillance and CCTV systems, Smart access control solutions, Property management software, Technical support and maintenance, and Custom solution development." },
    { title: "2. Quotations and Proposals", content: "All quotations and proposals are: Valid for 30 days from issue date unless otherwise stated, Subject to site survey confirmation and feasibility assessment, Non-binding until formal contract execution by both parties, and May be revised if requirements change or site conditions differ." },
    { title: "3. Service Agreement Formation", content: "A binding service agreement is formed when: Customer accepts a written quotation or proposal, Both parties execute a formal Service Order or Statement of Work, Customer makes initial payment as specified in the quotation, and CubeXTech issues written confirmation of order acceptance." },
    { title: "4. Project Timeline and Implementation", content: "Typical implementation includes: Site survey and assessment, System design and planning, Hardware procurement and configuration, Installation and setup, Testing and quality assurance, Training and handover, and Go-live support. Total typical duration: 3-6 weeks depending on project complexity." },
    { title: "5. Customer Responsibilities", content: "Customer must provide: Site access during normal business hours (9 AM - 6 PM), Electrical power supply at installation locations, Network connectivity (LAN/WiFi) as per technical requirements, Mounting surfaces suitable for equipment installation, Authorized personnel for approvals and sign-offs, Timely responses to information requests (within 3 business days), and Participation in User Acceptance Testing (UAT)." },
    { title: "6. Change Orders", content: "If Customer requests changes to the agreed scope: Customer submits written change request, CubeXTech assesses impact on cost, timeline, and resources, CubeXTech provides written Change Order with revised terms, Customer approves and signs Change Order, Work proceeds under revised terms. Change Orders may affect project timeline and pricing. CubeXTech is not obligated to proceed with changes until a signed Change Order is received." },
    { title: "7. Service Level Agreements (SLAs)", content: "CubeXTech commits to system availability targets with scheduled maintenance excluded from calculations. We provide 48 hours advance notice of planned maintenance. Support response times are based on severity levels during business hours: Monday - Friday, 9:00 AM - 6:00 PM MYT, excluding Malaysian public holidays. If CubeXTech fails to meet SLA targets, Customer may be eligible for service credits. Credits must be claimed within 30 days. Maximum credit per month is 50% of monthly service fee." },
    { title: "8. Warranties and Guarantees", content: "Service Warranty: Services will be performed in a professional and workmanlike manner, Installation will comply with applicable Malaysian standards and codes, Software will perform substantially in accordance with documentation. Hardware Warranty: Warranty period commences from date of system acceptance or go-live. Warranty Exclusions: Damage caused by accident, misuse, abuse, or neglect; Unauthorized modifications or repairs; Damage from power surges, lightning, or acts of nature; Normal wear and tear; Customer-provided equipment issues." },
    { title: "9. Software Licensing", content: "Subject to payment and compliance, CubeXTech grants Customer a non-exclusive, non-transferable, revocable license to use our software for the subscription period. Customer shall NOT: Copy, modify, or create derivative works, Reverse engineer or decompile the software, Rent, lease, sell, or sublicense the software, Remove proprietary notices, or Use beyond the specified scope. Subscriptions auto-renew at then-current pricing unless cancelled before renewal date." },
    { title: "10. Payment Terms", content: "Project-Based Services: 30% deposit upon contract signing, 40% upon hardware delivery/installation completion, 30% upon UAT completion and acceptance. Recurring Services: Billed monthly or annually in advance, Payment due within 14 days of invoice, Auto-debit available, Late payment may result in suspension. Late Payment Consequences: Interest at 1.5% per month (18% per annum), Service suspension after 7 days past due, Termination after 30 days past due. All fees exclude applicable taxes (GST/SST)." },
    { title: "11. Data Protection and Security", content: "Data Ownership: Customer retains all rights to Customer Data. CubeXTech does not claim ownership. Customer grants CubeXTech limited license to process data solely for providing Services. Data Processing: Process data in accordance with PDPA 2010, Implement appropriate security measures, Use data only for providing Services, Not disclose without consent (except as required by law), Return or delete upon termination. Security Measures: Encryption (TLS 1.3, AES-256), Multi-factor authentication, Regular security assessments, 24/7 monitoring, Regular backups with disaster recovery." },
    { title: "12. Data Breach Notification", content: "In the event of a data breach affecting Customer Data, CubeXTech will: Notify Customer within 72 hours of becoming aware, Provide details of nature and scope of breach, Describe remedial actions taken or planned, and Cooperate with Customer in any required regulatory notifications." },
    { title: "13. Termination", content: "Termination for Convenience: Monthly subscriptions require 30 days notice, Annual subscriptions require 60 days notice (effective at end of term), No refund for unused portion. Termination for Cause: Either party may terminate immediately if other party breaches material term and fails to cure within 30 days, becomes insolvent, or engages in illegal activity. Effects of Termination: Customer's right to use Services ceases, All outstanding fees become due, Customer has 30 days to retrieve data, CubeXTech may delete data after 30 days." },
    { title: "14. Contact Information", content: "For service-related inquiries: CubeXTech Sdn Bhd, Suite 3A07 Menara Mutiara Majestic, No 15 Jalan Othman Section 3, 46000 Petaling Jaya, Malaysia. Support: support@cubextech.net, Sales: sales@cubextech.net, Billing: billing@cubextech.net, Phone: +60 18-919 9975." },
  ];

  return <PolicyPage badge="SERVICE" badgeColor="text-pink-400" borderColor="border-pink-500/30" title="Service Agreement" titleGradient="from-pink-400 to-purple-400" lastUpdated="January 20, 2026" sections={sections} hoverBorder="hover:border-pink-500/20" />;
}

// ==================== MAIN EXPORT WITH ROUTING ====================
export default function CubeXTechWebsite() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/pdpa-compliance" element={<PDPACompliancePage />} />
        <Route path="/ai-compliance" element={<AICompliancePage />} />
        <Route path="/service-agreement" element={<ServiceAgreementPage />} />
      </Routes>
    </>
  );
}
