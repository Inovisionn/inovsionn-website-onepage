import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
    const navRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToSection = (sectionId, closeMenu = false) => {
        if (closeMenu) setIsMenuOpen(false);
        if (location.pathname === '/') {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/#${sectionId}`);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                start: 'top -50',
                end: 99999,
                toggleClass: {
                    className: 'scrolled-nav',
                    targets: navRef.current
                }
            });
        }, navRef);
        return () => ctx.revert();
    }, []);

    return (
        <nav
            ref={navRef}
            className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl rounded-full md:rounded-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-all duration-500 text-white
                 [&:not(.scrolled-nav)]:bg-transparent
                 [&.scrolled-nav]:bg-background/90 [&.scrolled-nav]:backdrop-blur-xl [&.scrolled-nav]:text-primary [&.scrolled-nav]:shadow-lg [&.scrolled-nav]:border [&.scrolled-nav]:border-primary/10"
        >
            <Link to="/" className="font-bold text-lg md:text-xl tracking-tighter uppercase font-heading flex items-center gap-2 md:gap-3">
                <img
                    src="/logo-new.png"
                    alt="Inovisionn Logo"
                    className="h-8 md:h-12 w-auto object-contain rounded-full"
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}
                />
                <span className="hidden xs:inline">Inovisionn</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                <button onClick={() => scrollToSection('contact')} className="link-lift">Contact</button>
                <Link to="/over-mij" className="link-lift">Over mij</Link>
                <Link to="/tools" className="link-lift">Werkwijze</Link>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={() => scrollToSection('start')} className="btn-magnetic overflow-hidden relative group inline-flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-accent text-primary font-semibold text-xs md:text-sm shadow-md">
                    <span className="relative z-10 flex items-center gap-1.5 md:gap-2">Start demo <ChevronRight size={14} className="md:size-4" /></span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </button>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-accent/10 rounded-full text-accent transition-all hover:bg-accent/20"
                >
                    <span className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                    <span className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-background/98 backdrop-blur-3xl z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center justify-center gap-10 text-primary md:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-primary/40 hover:text-primary transition-colors">
                    <span className="text-2xl font-light">✕</span>
                </button>
                <div className="flex flex-col items-center gap-8">
                    <button onClick={() => scrollToSection('contact', true)} className="text-4xl font-bold font-heading text-[#3B82F6] hover:opacity-80 transition-all">Contact</button>
                    <Link to="/over-mij" onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold font-heading hover:text-accent transition-colors">Over mij</Link>
                    <Link to="/tools" onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold font-heading hover:text-accent transition-colors">Werkwijze</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
