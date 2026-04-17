import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
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

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

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
        <>
            <header>
            <nav
                ref={navRef}
                className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl rounded-full md:rounded-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-all duration-500 text-white
                 [&:not(.scrolled-nav)]:bg-transparent
                 [&.scrolled-nav]:bg-background/90 [&.scrolled-nav]:backdrop-blur-xl [&.scrolled-nav]:text-primary [&.scrolled-nav]:shadow-lg [&.scrolled-nav]:border [&.scrolled-nav]:border-primary/10"
            >
                <Link to="/" className="font-bold text-lg md:text-xl tracking-tighter uppercase font-heading flex items-center gap-2 md:gap-3">
                    <img
                        src="/logo-transparent.png"
                        alt="Inovisionn Logo"
                        className="h-8 md:h-11 w-auto object-contain"
                    />
                    <span className="hidden xs:inline">Inovisionn</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                    <button onClick={() => scrollToSection('contact')} className="link-lift">Contact</button>
                    <Link to="/over-mij" className="link-lift">Over mij</Link>
                    <Link to="/werkwijze" className="link-lift">Werkwijze</Link>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => scrollToSection('start')} className="btn-magnetic overflow-hidden relative group inline-flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-accent text-primary font-semibold text-xs md:text-sm shadow-md">
                        <span className="relative z-10 flex items-center gap-1.5 md:gap-2">Start demo <ChevronRight size={14} className="md:size-4" /></span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                    </button>

                    {/* Mobile hamburger toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Menu sluiten' : 'Menu openen'}
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-accent/10 rounded-full text-accent transition-all hover:bg-accent/20"
                    >
                        <span className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                        <span className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>
            </nav>
            </header>

            {/* Mobile Menu — bottom sheet, rendered outside the nav pill so it's never clipped */}
            <div
                className={`fixed inset-0 z-[200] md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                {/* Dark backdrop — tap to close */}
                <div
                    className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Sheet slides up from the bottom */}
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-[2rem] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}
                >
                    {/* Drag handle */}
                    <div className="flex justify-center pt-4 pb-2">
                        <div className="w-10 h-1 bg-dark/20 rounded-full" />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-4 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-dark/5 text-primary/40 hover:text-primary transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Links */}
                    <nav className="flex flex-col px-8 pt-4 pb-10 gap-1">
                        <button
                            onClick={() => scrollToSection('contact', true)}
                            className="text-left py-4 text-2xl font-bold text-primary border-b border-dark/5 hover:text-accent transition-colors flex items-center justify-between"
                        >
                            Contact <ChevronRight size={18} className="text-dark/20" />
                        </button>
                        <Link
                            to="/over-mij"
                            onClick={() => setIsMenuOpen(false)}
                            className="py-4 text-2xl font-bold text-primary border-b border-dark/5 hover:text-accent transition-colors flex items-center justify-between"
                        >
                            Over mij <ChevronRight size={18} className="text-dark/20" />
                        </Link>
                        <Link
                            to="/werkwijze"
                            onClick={() => setIsMenuOpen(false)}
                            className="py-4 text-2xl font-bold text-primary hover:text-accent transition-colors flex items-center justify-between"
                        >
                            Werkwijze <ChevronRight size={18} className="text-dark/20" />
                        </Link>

                        {/* CTA */}
                        <button
                            onClick={() => scrollToSection('start', true)}
                            className="mt-6 w-full bg-accent text-primary py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                        >
                            Start demo <ChevronRight size={18} />
                        </button>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;
