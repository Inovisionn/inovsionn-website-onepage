import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white px-6 py-12 md:py-20 relative z-30 overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-8">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter mb-4">inovisionn</h2>
                    <p className="text-white/50 text-sm max-w-xs leading-relaxed text-balance">
                        Geen onnodig handwerk meer, zodat jij kunt ondernemen. Gespecialiseerd in zakelijke AI-automatisering en software koppelingen
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-bold mb-2">Navigatie:</h4>
                    <Link to="/over-mij" className="text-white/50 hover:text-accent transition-colors text-sm">Over mij</Link>
                    <Link to="/tools" className="text-white/50 hover:text-accent transition-colors text-sm">Werkwijze</Link>
                    <Link to="/lead-scanner" className="text-white/50 hover:text-accent transition-colors text-sm">Lead Scanner</Link>
                    <a href="/#contact" className="text-white/50 hover:text-accent transition-colors text-sm">Contact</a>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-bold mb-2">Volg mij op:</h4>
                    <a href="https://www.linkedin.com/in/niels-heijman/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent transition-colors text-sm flex items-center gap-2">
                        <Linkedin size={16} /> LinkedIn
                    </a>
                    <a href="https://www.instagram.com/niels.heijman/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent transition-colors text-sm flex items-center gap-2">
                        <Instagram size={16} /> Instagram
                    </a>
                </div>
                <div className="flex flex-col gap-3">
                    <h4 className="font-bold mb-2">Informatie:</h4>
                    <a href="mailto:inovisionn@hotmail.com" className="text-white/50 hover:text-accent transition-colors text-sm flex items-center gap-2"><Mail size={16} /> inovisionn@hotmail.com</a>
                    <span className="text-white/50 text-sm flex items-center gap-2"><Phone size={16} /> +31 6 15088920</span>
                    <a 
                        href="https://maps.app.goo.gl/kvnDpu95vx85uQEh7" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/50 hover:text-accent transition-colors text-sm flex items-center gap-2"
                    >
                        <MapPin size={16} /> Abdis Susannastraat 15, 6041 VK Roermond
                    </a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <p className="text-white/40 text-xs font-data">
                        &copy; 2026 Inovisionn. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-white/40 text-xs font-data">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacybeleid</Link>
                        <Link to="/voorwaarden" className="hover:text-white transition-colors">Algemene Voorwaarden</Link>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-data text-white/70">System Operational</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
