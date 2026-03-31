import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ArrowRight, ArrowLeft, Terminal, Activity, Zap, Beaker, CheckCircle2, Calendar } from 'lucide-react';
import { CoreSpinLoader } from './components/ui/core-spin-loader';
import RadialPulseLoader from './components/ui/loading-animation';
import NeuralBackground from './components/ui/flow-field-background';
import LeadScanner from './LeadScanner';
import OverMij from './OverMij';
import Tools from './Tools';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
gsap.registerPlugin(ScrollTrigger);

// --- Component: Hero ---
function Hero() {
    const heroRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-elem', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.2
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative h-[100dvh] w-full overflow-hidden bg-primary flex flex-col justify-end pb-20 md:pb-32 px-6 md:px-16">
            <div className="absolute inset-0 z-0">
                <video
                    src="/assets/hero_video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                    aria-label="Abstracte achtergrond animatie die de continue stroom van AI-automatisering illustreert"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-4xl text-white">
                <div className="overflow-hidden mb-1 md:mb-2">
                    <h1 className="hero-elem text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white mb-2 leading-tight">
                        Ik automatiseer de taken
                    </h1>
                </div>
                <div className="overflow-hidden mb-8 md:mb-10">
                    <h2 className="hero-elem text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-drama italic text-accent leading-none">
                        die jouw tijd innemen.
                    </h2>
                </div>
                <div className="hero-elem flex flex-col sm:flex-row gap-6 sm:gap-4 items-start sm:items-center">
                    <a href="#start" className="btn-magnetic group relative overflow-hidden inline-flex items-center justify-center px-6 md:px-8 py-3.5 md:py-4 rounded-[1.5rem] md:rounded-[2rem] bg-accent text-primary font-bold text-base md:text-lg">
                        <span className="relative z-10 flex items-center gap-2">Ontdek je tijdwinst <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                        <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                    </a>
                    <p className="text-white/60 font-data text-xs md:text-sm max-w-[280px] md:max-w-xs border-l border-white/20 pl-4 py-1">
                        Laat slimme software het terugkerende werk voor je overnemen. Zo komt er meer tijd vrij voor werk dat écht telt.
                    </p>
                </div>
            </div>
        </section>
    );
}

// --- Feature Components ---

const DiagnosticShuffler = () => {
    const [cards, setCards] = useState([
        { id: 1, title: 'Data ophalen', color: 'bg-primary', text: 'white' },
        { id: 2, title: 'Documenten verwerken', color: 'bg-dark', text: 'white' },
        { id: 3, title: 'CRM bijwerken', color: 'bg-accent', text: 'primary' }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCards(prev => {
                const newCards = [...prev];
                const last = newCards.pop();
                newCards.unshift(last);
                return newCards;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-40 md:h-48 w-full max-w-[280px] sm:max-w-sm mx-auto perspective-1000 mt-6 md:mt-8" aria-label="Interactieve weergave van AI-data extractie workflows">
            <span className="sr-only">Automatisering die non-stop voor je doorloopt.</span>
            {cards.map((card, i) => (
                <div
                    key={card.id}
                    className={`absolute top-0 left-0 w-full p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-dark/5 transition-all duration-[800ms] ${card.color} text-${card.text} ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-between`}
                    style={{
                        transform: `translateY(${i * 8}px) scale(${1 - i * 0.04})`,
                        zIndex: cards.length - i,
                        opacity: 1 - i * 0.2
                    }}
                >
                    <div className="font-bold text-sm md:text-base flex items-center gap-2 md:gap-3"><Activity size={18} className="md:size-5 opacity-80" /> {card.title}</div>
                    <div className="font-data text-[10px] md:text-xs opacity-60">✓</div>
                </div>
            ))
            }
        </div >
    );
};

const TelemetryTypewriter = () => {
    const [text, setText] = useState('');
    const fullText = "Human-in-the-loop actief.\\nProcessen optimaliseren...\\nFoutmarge geminimaliseerd.";

    useEffect(() => {
        let i = 0;
        let isTyping = false;

        const typeWriter = () => {
            if (i < fullText.length) {
                setText(prev => prev + fullText.charAt(i));
                i++;
                setTimeout(typeWriter, Math.random() * 50 + 30);
            } else {
                setTimeout(() => { i = 0; setText(''); typeWriter(); }, 4000);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isTyping) {
                isTyping = true;
                i = 0;
                setText('');
                typeWriter();
            }
        });

        const el = document.getElementById('telemetry-terminal');
        if (el) observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div id="telemetry-terminal" className="mt-6 md:mt-8 bg-primary rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 text-white text-xs md:text-sm font-data shadow-xl relative overflow-hidden h-40 md:h-48 flex flex-col" aria-label="Terminal simulatie weergave die process-optimalisatie toont">
            <span className="sr-only">Visuele weergave van een live foutloze terminal feed door AI validatie.</span>
            <div className="absolute top-0 left-0 w-full px-4 md:px-6 py-2.5 md:py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/50"><Terminal size={12} className="md:size-3.5" /> telemetry_log.sh</div>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-accent"><span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent animate-pulse"></span> Live Feed</div>
            </div>
            <div className="mt-10 md:mt-12 text-white/80 whitespace-pre-line leading-relaxed">
                <span className="text-accent">{'> '}</span>{text}
                <span className="inline-block w-1.5 md:w-2 bg-accent animate-pulse ml-1">&nbsp;</span>
            </div>
        </div>
    );
};

const CursorProtocolScheduler = () => {
    const containerRef = useRef(null);
    const cursorRef = useRef(null);
    const buttonRef = useRef(null);
    const dayRef = useRef(null);
    const [activeDay, setActiveDay] = useState(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            tl.set(cursorRef.current, { x: 300, y: 150, opacity: 0, scale: 1 })
                .set(buttonRef.current, { scale: 1 })
                .to(cursorRef.current, { opacity: 1, duration: 0.5 })
                .to(cursorRef.current, {
                    x: () => dayRef.current?.offsetLeft + 10 || 150,
                    y: () => dayRef.current?.offsetTop + 10 || 50,
                    duration: 1,
                    ease: "power2.inOut"
                })
                .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
                .call(() => setActiveDay(3))
                .to(cursorRef.current, { scale: 1, duration: 0.1 })
                .to(cursorRef.current, {
                    x: () => buttonRef.current?.offsetLeft + 20 || 200,
                    y: () => buttonRef.current?.offsetTop + 10 || 150,
                    duration: 0.8,
                    ease: "power2.inOut",
                    delay: 0.2
                })
                .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
                .to(buttonRef.current, { scale: 0.95, duration: 0.1 }, "<")
                .to(cursorRef.current, { scale: 1, duration: 0.1 })
                .to(buttonRef.current, { scale: 1, duration: 0.1 }, "<")
                .to(cursorRef.current, { opacity: 0, x: '+=30', y: '+=30', duration: 0.5, delay: 0.2 })
                .call(() => setActiveDay(null));

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div ref={containerRef} className="mt-6 md:mt-8 bg-white border border-dark/10 shadow-xl rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 h-40 md:h-48 relative overflow-hidden select-none" aria-label="Kalender widget die wekelijkse workflows structureert door AI automation">
            <span className="sr-only">Weergave van Make.com planning automatisering die wekelijkse uren en inspanning bespaart.</span>
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h4 className="font-bold text-dark text-sm md:text-base flex items-center gap-1.5 md:gap-2"><Calendar size={16} className="md:size-[18px]" /> Workflow</h4>
                <div className="text-[10px] font-data bg-accent/20 text-accent px-2 rounded-full font-bold">10u winst</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => (
                    <div
                        key={i}
                        ref={i === 3 ? dayRef : null}
                        className={`aspect-square rounded-lg md:rounded-xl flex items-center justify-center text-[10px] md:text-sm font-medium transition-colors duration-300 ${activeDay === i ? 'bg-accent text-primary scale-110 shadow-md z-10' : 'bg-background text-dark/40'}`}
                    >
                        {d}
                    </div>
                ))}
            </div>

            <div className="mt-4 md:mt-6 flex justify-end">
                <div ref={buttonRef} className="bg-primary text-white text-[10px] md:text-xs px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold">
                    Opslaan
                </div>
            </div>

            {/* Fake Cursor */}
            <div ref={cursorRef} className="absolute top-0 left-0 z-50 pointer-events-none drop-shadow-xl" style={{ width: '20px', height: '20px' }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 3.21V20.8C5.5 21.45 6.27 21.79 6.75 21.36L11.44 17.1C11.66 16.9 11.95 16.8 12.24 16.8H18.5C19.16 16.8 19.5 16.03 19.06 15.55L6.46 2.31C6.01 1.84 5.5 2.16 5.5 3.21Z" fill="#1E293B" stroke="white" strokeWidth="1.5" />
                </svg>
            </div>
        </div >
    );
};

const Features = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                },
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="ai-teams" ref={sectionRef} className="py-20 md:py-32 px-6 md:px-16 bg-background">
            <div className="max-w-6xl mx-auto">
                <div className="mb-14 md:mb-20 space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight">Minder handmatig werk.<br />Meer tijd voor je klanten.</h2>
                    <p className="text-dark/60 max-w-2xl text-base md:text-lg text-balance">
                        Geen tijdelijke pleisters en geen nieuw systeem om aan te leren. Ik bouw een automatisering die onzichtbaar op de achtergrond werkt en het terugkerende handmatige werk volledig van je overneemt.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="feature-card bg-white/50 rounded-[2rem] p-2 flex flex-col">
                        <div className="bg-white rounded-[1.75rem] p-8 h-full border border-dark/5 shadow-sm hover:shadow-xl transition-shadow duration-500">
                            <h3 className="text-xl font-bold text-primary mb-3">Meer focus<br />en groei</h3>
                            <p className="text-dark/60 text-sm leading-relaxed text-balance">
                                Jij houdt de regie en het overzicht. De software doet het terugkerende werk.
                            </p>
                            <DiagnosticShuffler />
                        </div>
                    </div>

                    <div className="feature-card bg-white/50 rounded-[2rem] p-2 flex flex-col">
                        <div className="bg-white rounded-[1.75rem] p-8 h-full border border-dark/5 shadow-sm hover:shadow-xl transition-shadow duration-500">
                            <h3 className="text-xl font-bold text-primary mb-3">Betrouwbaar<br />verwerkt</h3>
                            <p className="text-dark/60 text-sm leading-relaxed text-balance">
                                Automatisering die non-stop voor je doordraait en data direct foutloos verwerkt in de systemen die je nu al gebruikt.
                            </p>
                            <TelemetryTypewriter />
                        </div>
                    </div>

                    <div className="feature-card bg-white/50 rounded-[2rem] p-2 flex flex-col">
                        <div className="bg-white rounded-[1.75rem] p-8 h-full border border-dark/5 shadow-sm hover:shadow-xl transition-shadow duration-500">
                            <h3 className="text-xl font-bold text-primary mb-3">Rust in je<br />bedrijf</h3>
                            <p className="text-dark/60 text-sm leading-relaxed text-balance">
                                Geen dagelijkse chaos meer. Minder oplossen, minder vertraging en meer tijd voor je klanten.
                            </p>
                            <CursorProtocolScheduler />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

// --- Philosophy Component ---

const Philosophy = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.phil-word', {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 60%',
                },
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.05,
                ease: 'power4.out'
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const text1 = "Waar losse software vaak zorgt voor extra werk,".split(" ");
    const text2 = "bouw ik een AI-team dat jou directe ".split(" ");

    return (
        <section ref={sectionRef} className="relative py-32 md:py-48 px-6 md:px-16 bg-primary overflow-hidden text-white flex items-center justify-center">
            {/* Parallax Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/ai-agentic-workflow-netwerk-roermond.jpg"
                    alt="AI-automatisering en agentic workflows voor bedrijven in Roermond en Limburg - Inovisionn"
                    className="w-full h-full object-cover opacity-70 mix-blend-luminosity"
                    data-speed="0.8"
                />
                <div className="absolute inset-0 bg-primary/80"></div>
            </div>

            <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center">
                <p className="text-white/60 text-lg md:text-2xl font-medium max-w-2xl mb-12 leading-relaxed">
                    {text1.map((word, i) => (
                        <span key={i} className="phil-word inline-block mr-2">{word}</span>
                    ))}
                </p>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-drama italic text-white leading-tight">
                    {text2.map((word, i) => (
                        <span key={i} className="phil-word inline-block mr-3">{word}</span>
                    ))}
                    {"tijdswinst en controle geeft.".split(" ").map((word, i) => (
                        <span key={`accent-${i}`} className="phil-word inline-block mr-3 text-accent">{word}</span>
                    ))}
                </h2>
            </div>
        </section>
    );
};

// --- Protocol Component ---

const Protocol = () => {
    const containerRef = useRef(null);

    const steps = [
        {
            num: "01",
            title: "Knelpunten aanpakken",
            desc: "Ik kijk samen met jou waar jij de meeste uren verliest aan onnodig handwerk. Ik pak precies díe processen aan die jou direct de meeste tijdswinst en rust opleveren.",
            Visual: () => (
                <div className="w-full h-full flex items-center justify-center bg-primary rounded-3xl" aria-label="AI-agent die bedrijfsprocessen versnelt.">
                    <CoreSpinLoader />
                </div>
            )
        },
        {
            num: "02",
            title: "Werken met wat je al hebt",
            desc: "Je hoeft geen nieuwe software te leren. Mijn oplossingen werken onzichtbaar samen met jouw huidige CRM en systemen. Je vertrouwde werkwijze blijft, maar de vertraging verdwijnt.",
            Visual: () => (
                <div className="w-full h-full flex items-center justify-center bg-primary rounded-3xl" aria-label="Systematische integratie via Make.com">
                    <RadialPulseLoader />
                </div>
            )
        },
        {
            num: "03",
            title: "Groeien zonder extra personeel",
            desc: "Je processen draaien voortaan soepel door, ongeacht hoe druk het wordt. Zo kan je bedrijf moeiteloos groeien, zonder dat je direct nieuwe mensen hoeft aan te nemen.",
            Visual: () => (
                <div className="w-full h-full flex items-center justify-center bg-primary rounded-3xl overflow-hidden relative" aria-label="Automatisering van klantcontact via AI.">
                    <NeuralBackground color="#3B82F6" speed={0.8} />
                </div>
            )
        }
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.protocol-card');

            cards.forEach((card, i) => {
                ScrollTrigger.create({
                    trigger: card,
                    start: "top top",
                    pin: true,
                    pinSpacing: false,
                    end: () => `+=${window.innerHeight}`,
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="werkwijze" className="bg-background relative">
            {steps.map((step, i) => (
                <div key={i} className="protocol-card sticky top-0 h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-16">
                    <div className="absolute inset-0 bg-background"></div>

                    <div className="relative z-10 w-full max-w-6xl h-full max-h-[85vh] md:max-h-[70vh] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-dark/5 flex flex-col md:flex-row overflow-hidden origin-top"
                        style={{
                            zIndex: i + 1
                        }}>

                        <div className="flex-1 p-6 sm:p-8 md:p-20 flex flex-col justify-center">
                            <span className="font-data text-accent text-sm md:text-xl mb-3 md:mb-4 py-1 px-3 bg-accent/10 rounded-full w-fit">_{step.num}</span>
                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold font-heading text-primary tracking-tight mb-4 md:mb-6 leading-tight">
                                {step.title}.
                            </h3>
                            <p className="text-dark/60 text-base md:text-xl max-w-md text-balance leading-relaxed">
                                {step.desc}
                            </p>
                        </div>

                        <div className="w-full md:w-[45%] h-48 sm:h-64 md:h-auto bg-ivory/30 border-t md:border-t-0 md:border-l border-dark/5 p-6 md:p-8 relative flex items-center justify-center">
                            <step.Visual />
                        </div>

                    </div>
                </div>
            ))}
        </section>
    );
};

// --- CTA Component ---

const CTA = () => {
    return (
        <section id="start" className="py-24 md:py-32 px-6 bg-background relative z-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Strategische Route */}
                <div className="bg-primary text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 flex flex-col items-start justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-colors"></div>
                    <div className="relative z-10 mb-12">
                        <h3 className="text-3xl font-bold mb-4">Laten we de ruis wegnemen</h3>
                        <p className="text-white/60 text-balance leading-relaxed">
                            Laten we samen kijken hoeveel uren ik wekelijks voor je kan vrijmaken. Plan een korte, vrijblijvende kennismaking in en ontdek je mogelijkheden.
                        </p>
                    </div>
                    <a href="https://calendly.com/inovisionn/30min" target="_blank" rel="noopener noreferrer" className="btn-magnetic bg-accent text-primary px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 group-hover:scale-105 relative z-10">
                        Plan een kennismaking <ArrowRight size={18} />
                    </a>
                </div>

                {/* Directe Bewijsvoering */}
                <div className="bg-white border border-dark/5 shadow-xl rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 flex flex-col items-start justify-between group">
                    <div className="mb-12">
                        <h3 className="text-3xl font-bold mb-4 text-primary">Test de workflow</h3>
                        <p className="text-dark/60 text-balance leading-relaxed">
                            Ontvang binnen 5 minuten een gekwalificeerde leadlijst. Eén simpel proces, als voorproefje op een volledig geautomatiseerde backoffice.
                        </p>
                    </div>
                    <Link to="/lead-scanner" className="btn-magnetic bg-primary text-white px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 group-hover:scale-105">
                        Start de live demo <Terminal size={18} />
                    </Link>
                </div>

            </div>
        </section>
    );
};

const ContactSection = () => {
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.form_type = 'contact';

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            setStatus('success');
        } catch (error) {
            console.error("Fout bij verzenden: ", error);
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="py-24 bg-primary text-white border-t border-white/5 relative z-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 text-white">Contact.</h2>
                    <p className="text-white/60 text-lg max-w-xl mx-auto">
                        Heb je een specifieke uitdaging of wil je weten welke agents voor jou kunnen werken? Stuur mij een bericht.
                    </p>
                </div>

                {status === 'error' ? (
                    <div className="bg-red-500/10 p-8 md:p-12 rounded-[2rem] border border-red-500/30 shadow-2xl text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Er ging iets mis.</h3>
                        <p className="text-white/60">Je bericht kon niet worden verzonden. Probeer het opnieuw of mail rechtstreeks naar <a href="mailto:inovisionn@hotmail.com" className="text-accent underline">inovisionn@hotmail.com</a>.</p>
                        <button onClick={() => setStatus('idle')} className="mt-8 text-sm text-accent hover:text-white transition-colors">Opnieuw proberen</button>
                    </div>
                ) : status === 'success' ? (
                    <div className="bg-white/5 p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} className="text-accent" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Bericht verzonden!</h3>
                        <p className="text-white/60">Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op.</p>
                        <button onClick={() => setStatus('idle')} className="mt-8 text-sm text-accent hover:text-white transition-colors">Start nieuw bericht</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="bedrijfsnaam" className="text-sm font-medium text-white/80">Bedrijfsnaam</label>
                                <input
                                    required
                                    type="text"
                                    id="bedrijfsnaam"
                                    name="bedrijfsnaam"
                                    placeholder="Uw bedrijf"
                                    className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="naam" className="text-sm font-medium text-white/80">Naam</label>
                                <input
                                    required
                                    type="text"
                                    id="naam"
                                    name="naam"
                                    placeholder="Uw naam"
                                    className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-white/80">E-mail</label>
                            <input
                                required
                                type="email"
                                id="email"
                                name="email"
                                placeholder="uwnaam@bedrijf.nl"
                                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="vraag" className="text-sm font-medium text-white/80">Vraag</label>
                            <textarea
                                required
                                id="vraag"
                                name="vraag"
                                rows="4"
                                placeholder="Waar kunnen we u mee helpen?"
                                className="w-full bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className={`w-full md:w-auto btn-magnetic bg-accent text-primary px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 relative z-10 ${status === 'loading' ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
                        >
                            {status === 'loading' ? 'Verzenden...' : 'Verstuur bericht'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

// --- Legal Components ---

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            setTimeout(() => {
                const el = document.getElementById(hash.slice(1));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);
    return null;
};

const LegalLayout = ({ title, seoTitle, seoDescription, canonicalUrl, children }) => {
    return (
        <div className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary relative overflow-hidden">
            <Helmet>
                <title>{seoTitle || `${title} | Inovisionn`}</title>
                <meta name="description" content={seoDescription || `Lees de ${title} van Inovisionn met betrekking tot onze dienstverlening, AI-agents en verwerking van gegevens.`} />
                {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
            </Helmet>
            <div className="noise-overlay"></div>
            <Navbar />

            <div className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors mb-8 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Terug naar Home
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary mb-12 leading-tight">
                        {title}<span className="text-accent">.</span>
                    </h1>

                    <div className="bg-white/50 backdrop-blur-sm border border-dark/5 rounded-[2rem] p-8 md:p-12 shadow-xl prose prose-slate max-w-none text-dark/80 leading-relaxed font-sans">
                        {children}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const PrivacyPolicy = () => {
    return (
        <LegalLayout title="Privacyverklaring" canonicalUrl="https://www.inovisionn.com/privacy">
            <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10 text-sm text-primary/80">
                <p className="font-bold uppercase tracking-wide mb-1">Inovisionn</p>
                <p>KvK: 91930391 | Abdis Susannastraat 15, 6041 VK Roermond</p>
            </div>

            <h2 className="text-2xl font-bold text-primary mb-6">PRIVACYVERKLARING</h2>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">1. Inleiding</h3>
                <p className="mb-4">Inovisionn, gevestigd aan de Abdis Susannastraat 15, 6041 VK te Roermond, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in deze privacyverklaring. Inovisionn is een eenmanszaak ingeschreven bij de Kamer van Koophandel onder nummer 91930391.</p>
                <div className="bg-dark/5 p-5 rounded-2xl mb-4">
                    <p className="font-bold mb-2">Contactgegevens:</p>
                    <p>Inovisionn</p>
                    <p>Abdis Susannastraat 15</p>
                    <p>6041 VK Roermond</p>
                    <p>E-mail: <a href="mailto:inovisionn@hotmail.com" className="text-primary hover:underline">inovisionn@hotmail.com</a></p>
                </div>
                <p>Inovisionn heeft geen Functionaris Gegevensbescherming (FG) aangesteld, aangezien dit voor de organisatie niet wettelijk verplicht is.</p>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">2. Welke persoonsgegevens verwerken wij</h3>
                <p className="mb-4">Inovisionn verwerkt persoonsgegevens doordat u gebruik maakt van onze diensten en/of doordat u deze gegevens zelf aan ons verstrekt. Het gaat om de volgende persoonsgegevens:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Naam en voornaam</li>
                    <li>E-mailadres</li>
                    <li>Bedrijfsnaam</li>
                    <li>KvK-nummer</li>
                    <li>Adresgegevens</li>
                    <li>Telefoonnummer (indien verstrekt)</li>
                    <li>Gegevens die u invult via het contactformulier op onze website</li>
                    <li>IP-adres en browsgegevens (bij websitebezoek)</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">3. Doeleinden van de verwerking</h3>
                <p className="mb-4">Inovisionn verwerkt uw persoonsgegevens voor de volgende doeleinden:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Het uitvoeren van een overeenkomst die u met ons heeft gesloten (rechtsgrond: uitvoering overeenkomst)</li>
                    <li>Het verzenden van facturen en het afhandelen van betalingen (rechtsgrond: uitvoering overeenkomst)</li>
                    <li>Het onderhouden van contact met u per e-mail, telefoon of messaging-apps (rechtsgrond: uitvoering overeenkomst)</li>
                    <li>Het voldoen aan wettelijke verplichtingen, zoals de fiscale bewaarplicht (rechtsgrond: wettelijke verplichting)</li>
                    <li>Het beveiligen en verbeteren van onze website (rechtsgrond: gerechtvaardigd belang)</li>
                    <li>Het afhandelen van uw verzoeken via het contactformulier (rechtsgrond: toestemming / uitvoering overeenkomst)</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">4. Bewaartermijnen</h3>
                <p className="mb-4">Inovisionn bewaart uw persoonsgegevens niet langer dan strikt noodzakelijk is. Wij hanteren de volgende bewaartermijnen:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Klantgegevens (naam, e-mail, bedrijfsnaam, KvK, adres):</strong> 7 jaar na het einde van de overeenkomst, in verband met de fiscale bewaarplicht.</li>
                    <li><strong>Factuurgegevens en financiële administratie:</strong> 7 jaar, conform de wettelijke bewaarplicht (artikel 2:10 BW en artikel 52 AWR).</li>
                    <li><strong>Gegevens uit het contactformulier:</strong> 1 jaar na afhandeling van uw verzoek, tenzij er een overeenkomst uit voortvloeit.</li>
                    <li><strong>Projectbestanden en correspondentie:</strong> tot 1 jaar na afronding van het project, tenzij een doorlopende overeenkomst van toepassing is.</li>
                    <li><strong>IP-adressen en browsgegevens:</strong> maximaal 6 maanden.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">5. Delen met derden</h3>
                <p className="mb-4">Inovisionn verstrekt uw gegevens niet aan derden, tenzij dit noodzakelijk is voor de uitvoering van de overeenkomst, of om te voldoen aan een wettelijke verplichting. Wij maken gebruik van de volgende categorieën verwerkers:</p>
                <ul className="list-disc ml-6 space-y-2 mb-6">
                    <li><strong>Hostingprovider:</strong> Vercel (voor onze eigen website)</li>
                    <li><strong>Domeinnaamregistratie:</strong> GoDaddy</li>
                    <li><strong>E-maildienst:</strong> Microsoft Outlook</li>
                    <li><strong>Boekhoudpakket:</strong> Moneybird</li>
                    <li><strong>Projectbeheer en klantgegevens:</strong> Notion</li>
                    <li><strong>Automatiseringsplatformen:</strong> Make, n8n</li>
                    <li><strong>AI-diensten:</strong> Anthropic (Claude)</li>
                    <li><strong>Ontwikkelomgeving:</strong> Google Antigravity (IDE)</li>
                </ul>
                <p className="italic">Met alle verwerkers die persoonsgegevens verwerken in onze opdracht sluiten wij een verwerkersovereenkomst om te zorgen voor eenzelfde niveau van beveiliging en vertrouwelijkheid van uw gegevens.</p>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">6. Doorgifte buiten de Europese Economische Ruimte (EER)</h3>
                <p className="mb-4">Een aantal van de hierboven genoemde verwerkers is gevestigd in de Verenigde Staten of slaat gegevens op buiten de EER. Dit betreft in ieder geval:</p>
                <ul className="list-disc ml-6 space-y-2 mb-6">
                    <li><strong>Notion</strong> – gevestigd in de VS. Doorgifte vindt plaats op basis van door de Europese Commissie goedgekeurde Standard Contractual Clauses (SCCs).</li>
                    <li><strong>Vercel</strong> – gevestigd in de VS. Doorgifte vindt plaats op basis van SCCs en/of het EU-US Data Privacy Framework.</li>
                    <li><strong>Anthropic (Claude)</strong> – gevestigd in de VS. Doorgifte vindt plaats op basis van SCCs.</li>
                    <li><strong>GoDaddy</strong> – gevestigd in de VS. Doorgifte vindt plaats op basis van SCCs en/of het EU-US Data Privacy Framework.</li>
                    <li><strong>Make</strong> – kan gegevens verwerken buiten de EER. Doorgifte vindt plaats op basis van SCCs.</li>
                </ul>
                <p>Inovisionn zorgt ervoor dat passende waarborgen worden getroffen bij doorgifte van persoonsgegevens buiten de EER.</p>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">7. Cookies</h3>
                <p>De website van Inovisionn maakt op dit moment geen gebruik van cookies. Mocht dit in de toekomst veranderen, dan zal deze privacyverklaring worden bijgewerkt en zal, indien vereist, voorafgaande toestemming worden gevraagd via een cookiebanner.</p>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">8. Beveiliging</h3>
                <p className="mb-4">Inovisionn neemt passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, ongeoorloofd gebruik of onbevoegde toegang. Wij treffen onder andere de volgende maatregelen:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Tweestapsverificatie (2FA) op alle accounts en systemen</li>
                    <li>Gebruik van cloudsleutels en herstelsleutels voor veilige toegang</li>
                    <li>Versleutelde verbindingen (SSL/TLS) voor gegevensoverdracht</li>
                    <li>Regelmatige software-updates en beveiligingspatches</li>
                    <li>Beperkte toegang tot persoonsgegevens (alleen de eigenaar van Inovisionn)</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">9. Uw rechten</h3>
                <p className="mb-4">Op grond van de Algemene Verordening Gegevensbescherming (AVG) heeft u de volgende rechten:</p>
                <ul className="list-disc ml-6 space-y-2 mb-6">
                    <li><strong>Recht op inzage:</strong> u kunt opvragen welke persoonsgegevens wij van u verwerken.</li>
                    <li><strong>Recht op rectificatie:</strong> u kunt verzoeken om onjuiste gegevens te laten corrigeren.</li>
                    <li><strong>Recht op verwijdering:</strong> u kunt verzoeken om uw gegevens te laten verwijderen, tenzij wij wettelijk verplicht zijn deze te bewaren.</li>
                    <li><strong>Recht op beperking van de verwerking:</strong> u kunt verzoeken om de verwerking te beperken.</li>
                    <li><strong>Recht op overdraagbaarheid:</strong> u kunt verzoeken om uw gegevens in een gestructureerd, gangbaar en machineleesbaar formaat te ontvangen.</li>
                    <li><strong>Recht van bezwaar:</strong> u kunt bezwaar maken tegen de verwerking van uw gegevens op basis van gerechtvaardigd belang.</li>
                </ul>
                <p>U kunt uw verzoek indienen via het e-mailadres dat bovenaan deze verklaring vermeld staat. Wij reageren uiterlijk binnen 4 weken op uw verzoek.</p>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">10. Datalekken</h3>
                <p>Inovisionn heeft passende maatregelen getroffen om datalekken te voorkomen. Mocht er onverhoopt toch een datalek plaatsvinden, dan zal Inovisionn dit binnen 72 uur melden bij de Autoriteit Persoonsgegevens, indien het lek een risico vormt voor de rechten en vrijheden van betrokkenen. Betrokkenen worden zo spoedig mogelijk geïnformeerd indien het lek waarschijnlijk een hoog risico oplevert.</p>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">11. Klachten</h3>
                <p>Indien u een klacht heeft over de verwerking van uw persoonsgegevens, neem dan contact met ons op. Wij helpen u graag verder. U heeft daarnaast altijd het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens (www.autoriteitpersoonsgegevens.nl).</p>
            </section>

            <section className="mb-6">
                <h3 className="text-xl font-bold text-primary mb-4">12. Wijzigingen in deze privacyverklaring</h3>
                <p className="mb-6">Inovisionn behoudt zich het recht voor om deze privacyverklaring te wijzigen. Wijzigingen worden gepubliceerd op onze website. Wij raden u aan om deze verklaring regelmatig te raadplegen.</p>
                <p className="text-dark/60 italic">Deze privacyverklaring is voor het laatst gewijzigd op 30 maart 2026.</p>
            </section>
        </LegalLayout>
    );
};

const TermsOfService = () => {
    return (
        <LegalLayout title="Algemene Voorwaarden" canonicalUrl="https://www.inovisionn.com/voorwaarden">
            <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10 text-sm text-primary/80">
                <p className="font-bold uppercase tracking-wide mb-1">Inovisionn</p>
                <p>KvK: 91930391 | Abdis Susannastraat 15, 6041 VK Roermond</p>
            </div>

            <h2 className="text-2xl font-bold text-primary mb-6">ALGEMENE VOORWAARDEN INOVISIONN</h2>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 1 – Definities</h3>
                <p className="mb-3 italic">In deze algemene voorwaarden wordt verstaan onder:</p>
                <ul className="list-none space-y-3">
                    <li><strong>1.1 Opdrachtnemer:</strong> Inovisionn, eenmanszaak, ingeschreven bij de Kamer van Koophandel onder nummer 91930391, gevestigd aan de Abdis Susannastraat 15, 6041 VK te Roermond.</li>
                    <li><strong>1.2 Opdrachtgever:</strong> iedere natuurlijke of rechtspersoon die met Opdrachtnemer een overeenkomst is aangegaan of wenst aan te gaan.</li>
                    <li><strong>1.3 Overeenkomst:</strong> iedere afspraak tussen Opdrachtnemer en Opdrachtgever tot het verlenen van diensten door Opdrachtnemer ten behoeve van Opdrachtgever.</li>
                    <li><strong>1.4 Diensten:</strong> alle werkzaamheden en leveringen die onderwerp zijn van de Overeenkomst, waaronder maar niet beperkt tot: het ontwerpen en bouwen van websites, het ontwikkelen van automatiseringen, AI-implementaties, chatbots en aanverwante digitale diensten.</li>
                    <li><strong>1.5 Meerwerk:</strong> werkzaamheden die buiten de oorspronkelijk overeengekomen opdracht vallen en apart in rekening worden gebracht.</li>
                    <li><strong>1.6 Schriftelijk:</strong> per e-mail, per brief of via een ander digitaal communicatiemiddel dat door beide partijen wordt gebruikt (waaronder messaging-apps), mits de identiteit van de afzender voldoende vaststaat.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 2 – Toepasselijkheid</h3>
                <ul className="list-none space-y-3">
                    <li><strong>2.1</strong> Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes, werkzaamheden, overeenkomsten en leveringen van Opdrachtnemer, tenzij schriftelijk anders is overeengekomen.</li>
                    <li><strong>2.2</strong> Afwijkingen van deze voorwaarden zijn slechts geldig indien deze schriftelijk zijn overeengekomen.</li>
                    <li><strong>2.3</strong> De toepasselijkheid van eventuele inkoop- of andere voorwaarden van Opdrachtgever wordt uitdrukkelijk van de hand gewezen.</li>
                    <li><strong>2.4</strong> Indien een of meerdere bepalingen in deze voorwaarden nietig zijn of vernietigd worden, blijven de overige bepalingen onverminderd van kracht.</li>
                    <li><strong>2.5</strong> Opdrachtgever verklaart deze algemene voorwaarden te hebben ontvangen vóór of bij het sluiten van de overeenkomst.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 3 – Offertes en aanbiedingen</h3>
                <ul className="list-none space-y-3">
                    <li><strong>3.1</strong> Alle offertes en aanbiedingen van Opdrachtnemer zijn vrijblijvend, tenzij uitdrukkelijk anders vermeld.</li>
                    <li><strong>3.2</strong> Offertes hebben een geldigheidsduur van 30 dagen, tenzij anders aangegeven.</li>
                    <li><strong>3.3</strong> De in een offerte vermelde prijzen zijn exclusief btw, tenzij anders vermeld.</li>
                    <li><strong>3.4</strong> Een overeenkomst komt tot stand op het moment dat de Opdrachtgever de offerte schriftelijk aanvaardt, dan wel op het moment dat Opdrachtnemer feitelijk met de uitvoering van de opdracht aanvangt.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 4 – Uitvoering van de overeenkomst</h3>
                <ul className="list-none space-y-3">
                    <li><strong>4.1</strong> Opdrachtnemer zal de overeenkomst naar beste inzicht en vermogen uitvoeren, overeenkomstig de eisen van goed vakmanschap. De verplichting van Opdrachtnemer betreft een inspanningsverplichting en uitdrukkelijk geen resultaatsverplichting.</li>
                    <li><strong>4.2</strong> Opdrachtgever draagt er zorg voor dat alle gegevens en materialen die nodig zijn voor de uitvoering van de opdracht tijdig en in de gewenste vorm aan Opdrachtnemer worden verstrekt. Opdrachtnemer is niet aansprakelijk voor schade die voortvloeit uit onjuiste of onvolledige informatie van Opdrachtgever.</li>
                    <li><strong>4.3</strong> Indien tijdens de uitvoering van de overeenkomst blijkt dat aanvullende werkzaamheden noodzakelijk zijn (meerwerk), zal Opdrachtnemer dit vooraf schriftelijk melden aan Opdrachtgever. Meerwerk wordt pas uitgevoerd na schriftelijke goedkeuring door Opdrachtgever per e-mail of messaging-app. Meerwerk wordt apart in rekening gebracht tegen het overeengekomen tarief.</li>
                    <li><strong>4.4</strong> Opdrachtnemer heeft het recht om derden in te schakelen bij de uitvoering van de overeenkomst.</li>
                    <li><strong>4.5</strong> Door Opdrachtnemer opgegeven termijnen zijn indicatief en gelden niet als fatale termijnen, tenzij uitdrukkelijk schriftelijk anders is overeengekomen.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 5 – Tarieven en kosten</h3>
                <ul className="list-none space-y-3">
                    <li><strong>5.1</strong> De overeengekomen tarieven zijn exclusief btw, tenzij uitdrukkelijk anders vermeld.</li>
                    <li><strong>5.2</strong> Opdrachtnemer is gerechtigd om jaarlijks per 1 januari de tarieven te indexeren op basis van de Consumentenprijsindex (CPI) zoals gepubliceerd door het Centraal Bureau voor de Statistiek (CBS). Opdrachtnemer zal Opdrachtgever hiervan vooraf schriftelijk op de hoogte stellen.</li>
                    <li><strong>5.3</strong> Indien zich na het sluiten van de overeenkomst kostprijsverhogende omstandigheden voordoen die niet voorzienbaar waren, is Opdrachtnemer gerechtigd de overeengekomen prijs dienovereenkomstig aan te passen.</li>
                    <li><strong>5.4</strong> Reiskosten worden in rekening gebracht tegen een tarief van € 0,23 per kilometer.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 6 – Betaling</h3>
                <ul className="list-none space-y-3">
                    <li><strong>6.1</strong> Betaling dient te geschieden binnen 30 dagen na factuurdatum, op de door Opdrachtnemer aangegeven wijze, tenzij schriftelijk anders is overeengekomen.</li>
                    <li><strong>6.2</strong> Bij projectmatige opdrachten is Opdrachtgever 50% van de overeengekomen projectprijs verschuldigd bij aanvang van de werkzaamheden. De resterende 50% is verschuldigd na oplevering en goedkeuring, dan wel na het verstrijken van de goedkeuringstermijn zoals bedoeld in artikel 6.3.</li>
                    <li><strong>6.3</strong> Na oplevering heeft Opdrachtgever een goedkeuringstermijn van 5 werkdagen (maandag tot en met vrijdag). Indien Opdrachtgever binnen deze termijn geen schriftelijke bezwaren kenbaar maakt, wordt het opgeleverde geacht te zijn goedgekeurd.</li>
                    <li><strong>6.4</strong> Indien Opdrachtgever niet binnen de betalingstermijn betaalt, ontvangt Opdrachtgever eerst een betalingsherinnering. Indien na de herinnering betaling alsnog uitblijft, is Opdrachtgever van rechtswege in verzuim en is Opdrachtgever de wettelijke handelsrente verschuldigd over het openstaande bedrag.</li>
                    <li><strong>6.5</strong> Alle redelijke kosten ter verkrijging van voldoening buiten rechte komen voor rekening van Opdrachtgever. De buitengerechtelijke incassokosten bedragen minimaal 15% van het openstaande bedrag, met een minimum van € 150,00.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 7 – Aansprakelijkheid</h3>
                <ul className="list-none space-y-3">
                    <li><strong>7.1</strong> De aansprakelijkheid van Opdrachtnemer is beperkt tot het bedrag dat in het desbetreffende geval door de aansprakelijkheidsverzekering van Opdrachtnemer wordt uitgekeerd, vermeerderd met het eigen risico. Indien en voor zover de verzekeraar niet uitkeert, is de aansprakelijkheid beperkt tot maximaal het factuurbedrag over de laatste 3 maanden voorafgaand aan het schadeveroorzakende feit.</li>
                    <li><strong>7.2</strong> Opdrachtnemer is nimmer aansprakelijk voor indirecte schade, waaronder maar niet beperkt tot gevolgschade, gederfde winst, gemiste besparingen, schade door bedrijfsstagnatie of verlies van gegevens.</li>
                    <li><strong>7.3</strong> Opdrachtnemer is niet aansprakelijk voor schade die het gevolg is van handelen of nalaten van Opdrachtgever of door Opdrachtgever ingeschakelde derden.</li>
                    <li><strong>7.4</strong> Opdrachtnemer is niet aansprakelijk voor schade die voortvloeit uit het niet of niet tijdig functioneren van door derden geleverde diensten, waaronder maar niet beperkt tot hosting, domeinnaamregistratie en externe software.</li>
                    <li><strong>7.5</strong> Opdrachtgever vrijwaart Opdrachtnemer tegen alle aanspraken van derden die voortvloeien uit of verband houden met door Opdrachtgever aan Opdrachtnemer aangeleverd materiaal, waaronder maar niet beperkt tot teksten, afbeeldingen, logo’s en overig materiaal waarop intellectuele eigendomsrechten van derden rusten.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 8 – Overmacht</h3>
                <ul className="list-none space-y-3">
                    <li><strong>8.1</strong> Onder overmacht wordt verstaan elke omstandigheid buiten de wil en toedoen van Opdrachtnemer, waardoor nakoming van de overeenkomst geheel of gedeeltelijk wordt verhinderd. Hieronder wordt in ieder geval begrepen: ziekte, overheidsmaatregelen, brand, natuurrampen, epidemieën en pandemieën, stakingen, cyberaanvallen, hacks, DDoS-aanvallen, storingen in het internet- of telefoonnetwerk, storingen bij hosting- of cloudproviders, stroomuitval en tekortkomingen van toeleveranciers.</li>
                    <li><strong>8.2</strong> Gedurende de periode van overmacht worden de verplichtingen van Opdrachtnemer opgeschort.</li>
                    <li><strong>8.3</strong> Indien de overmachtsituatie langer dan 60 dagen voortduurt, zijn beide partijen gerechtigd de overeenkomst schriftelijk te ontbinden, zonder dat er een verplichting tot schadevergoeding ontstaat.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 9 – Opzegging en beëindiging</h3>
                <ul className="list-none space-y-3">
                    <li><strong>9.1</strong> Beide partijen kunnen de overeenkomst schriftelijk opzeggen met een opzegtermijn van 1 maand, tegen het einde van een kalendermaand.</li>
                    <li><strong>9.2</strong> Bij tussentijdse beëindiging door Opdrachtgever is Opdrachtgever gehouden tot betaling van alle reeds uitgevoerde werkzaamheden. Opdrachtnemer zal een eindafrekening opstellen op basis van de tot dan toe verrichte werkzaamheden en gemaakte kosten.</li>
                    <li><strong>9.3</strong> Opdrachtnemer is gerechtigd de overeenkomst met onmiddellijke ingang te ontbinden indien Opdrachtgever in verzuim is met de nakoming van enige verplichting uit de overeenkomst, in surseance van betaling verkeert, faillissement is aangevraagd, of de onderneming wordt geliquideerd of gestaakt.</li>
                    <li><strong>9.4</strong> In geval van ontbinding op grond van artikel 9.3 is Opdrachtnemer niet gehouden tot enige schadevergoeding, onverminderd het recht van Opdrachtnemer op vergoeding van geleden schade.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 10 – Intellectueel eigendom</h3>
                <ul className="list-none space-y-3">
                    <li><strong>10.1</strong> Alle intellectuele eigendomsrechten op de door Opdrachtnemer ontwikkelde werken, waaronder ontwerpen, code, concepten en overige creatieve uitingen, berusten bij Opdrachtnemer.</li>
                    <li><strong>10.2</strong> Na volledige betaling van alle verschuldigde bedragen verkrijgt Opdrachtgever een niet-exclusief, niet-overdraagbaar gebruiksrecht op het opgeleverde werk, uitsluitend voor het doel waarvoor het is ontwikkeld.</li>
                    <li><strong>10.3</strong> Het is Opdrachtgever niet toegestaan om zonder voorafgaande schriftelijke toestemming van Opdrachtnemer het opgeleverde werk te wijzigen, te verveelvoudigen of aan derden ter beschikking te stellen.</li>
                    <li><strong>10.4</strong> Opdrachtnemer behoudt het recht om het opgeleverde werk te gebruiken voor eigen promotie- en portfoliodoeleinden, tenzij schriftelijk anders is overeengekomen.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 11 – Retentierecht</h3>
                <ul className="list-none space-y-3">
                    <li><strong>11.1</strong> Opdrachtnemer is gerechtigd om de afgifte van alle in het kader van de overeenkomst vervaardigde of bewerkte bestanden, ontwerpen, code en overige materialen op te schorten totdat Opdrachtgever alle opeisbare vorderingen van Opdrachtnemer volledig heeft voldaan.</li>
                    <li><strong>11.2</strong> Gedurende de periode dat Opdrachtnemer het retentierecht uitoefent, is Opdrachtnemer gerechtigd het opgeleverde werk offline te halen of de toegang daartoe op te schorten.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 12 – Geheimhouding</h3>
                <ul className="list-none space-y-3">
                    <li><strong>12.1</strong> Beide partijen zijn verplicht tot geheimhouding van alle vertrouwelijke informatie die zij in het kader van de overeenkomst van elkaar of uit andere bron hebben verkregen. Informatie geldt als vertrouwelijk als dit door de andere partij is medegedeeld of als dit redelijkerwijs voortvloeit uit de aard van de informatie.</li>
                    <li><strong>12.2</strong> De geheimhoudingsverplichting geldt gedurende de looptijd van de overeenkomst en tot 1 jaar na beëindiging daarvan.</li>
                    <li><strong>12.3</strong> Deze geheimhoudingsverplichting geldt niet voor informatie die reeds openbaar is, die de ontvangende partij al rechtmatig in bezit had, of die op grond van een wettelijke verplichting moet worden verstrekt.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 13 – Klachten</h3>
                <ul className="list-none space-y-3">
                    <li><strong>13.1</strong> Klachten over de verrichte werkzaamheden dienen door Opdrachtgever schriftelijk kenbaar te worden gemaakt binnen 14 dagen na ontdekking van het gebrek, doch uiterlijk binnen 30 dagen na oplevering.</li>
                    <li><strong>13.2</strong> Het indienen van een klacht schort de betalingsverplichting van Opdrachtgever niet op.</li>
                    <li><strong>13.3</strong> Indien een klacht gegrond is, zal Opdrachtnemer de werkzaamheden alsnog verrichten zoals overeengekomen, tenzij dit inmiddels aantoonbaar zinloos is geworden.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 14 – Privacy en gegevensverwerking</h3>
                <ul className="list-none space-y-3">
                    <li><strong>14.1</strong> Opdrachtnemer verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG). De privacyverklaring van Opdrachtnemer is beschikbaar op verzoek en/of op de website van Opdrachtnemer.</li>
                    <li><strong>14.2</strong> Indien Opdrachtnemer in het kader van de overeenkomst persoonsgegevens verwerkt namens Opdrachtgever, zullen partijen een afzonderlijke verwerkersovereenkomst sluiten.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 15 – Geschillenbeslechting</h3>
                <ul className="list-none space-y-3">
                    <li><strong>15.1</strong> Partijen zullen eerst trachten een geschil in onderling overleg op te lossen.</li>
                    <li><strong>15.2</strong> Indien onderling overleg niet tot een oplossing leidt, zullen partijen het geschil voorleggen aan een onafhankelijke mediator, alvorens het geschil aan de rechter voor te leggen. De kosten van mediation worden door beide partijen gelijk gedragen.</li>
                    <li><strong>15.3</strong> Indien mediation niet tot een oplossing leidt, is de rechtbank Limburg bevoegd om van het geschil kennis te nemen.</li>
                </ul>
            </section>

            <section className="mb-10">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 16 – Toepasselijk recht</h3>
                <ul className="list-none space-y-3">
                    <li><strong>16.1</strong> Op alle overeenkomsten tussen Opdrachtnemer en Opdrachtgever is Nederlands recht van toepassing.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h3 className="text-xl font-bold text-primary mb-4">Artikel 17 – Slotbepalingen</h3>
                <ul className="list-none space-y-3">
                    <li><strong>17.1</strong> Opdrachtnemer behoudt zich het recht voor deze algemene voorwaarden te wijzigen. Gewijzigde voorwaarden treden in werking 30 dagen na schriftelijke bekendmaking aan Opdrachtgever. Indien Opdrachtgever de gewijzigde voorwaarden niet wenst te accepteren, heeft Opdrachtgever het recht de overeenkomst op te zeggen tegen de datum waarop de gewijzigde voorwaarden in werking treden.</li>
                    <li><strong>17.2</strong> Deze algemene voorwaarden zijn voor het laatst gewijzigd op 30 maart 2026.</li>
                </ul>
            </section>
        </LegalLayout>
    );
};

const Home = () => {
    return (
        <div className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary">
            <Helmet>
                <title>Inovisionn | AI Automatisering & Software Koppelingen Roermond</title>
                <meta name="description" content="Stop met handmatig werk. Inovisionn is uw partner voor AI-automatisering en software koppelingen (Make.com) in Roermond en Limburg. Wij bouwen slimme AI-agents die direct tijd en kosten besparen." />
                <link rel="canonical" href="https://www.inovisionn.com/" />
                <meta name="keywords" content="AI automatisering Roermond, Make.com specialist Limburg, AI agents Nederland, bedrijfsprocessen automatiseren, Inovisionn" />
            </Helmet>
            <div className="noise-overlay"></div>
            <Navbar />
            <Hero />
            <Features />
            <Philosophy />
            <Protocol />
            <CTA />
            <ContactSection />
            <Footer />
        </div>
    );
};

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary relative overflow-hidden flex items-center justify-center p-6 sm:p-12">
            <div className="noise-overlay"></div>
            <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-red-500/5 rounded-full blur-[60px] md:blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-4xl w-full text-center relative z-10">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-8xl md:text-[12rem] font-bold tracking-tight text-primary leading-none opacity-10 select-none">
                        403
                    </h1>
                    <div className="mt-[-4rem] md:mt-[-8rem]">
                        <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-primary mb-4 leading-tight">
                            Protocol: <span className="font-drama italic text-red-500 capitalize">Toegang Geweigerd.</span>
                        </h2>
                        <p className="text-dark/60 text-base md:text-lg max-w-lg mx-auto mb-10">
                            U heeft niet de benodigde autorisatie om dit onderdeel te benaderen. Voor de Lead Scanner geldt een limiet van 1 scan per adres.
                        </p>
                    </div>
                </div>

                <Link to="/" className="btn-magnetic bg-primary text-white px-8 md:px-12 py-3.5 md:py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <ArrowLeft size={18} /> Terug naar Home
                </Link>
            </div>
        </div>
    );
};

const NotFound = () => {
    return (
        <div className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary relative overflow-hidden flex items-center justify-center p-6 sm:p-12">
            <div className="noise-overlay"></div>
            <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-accent/5 rounded-full blur-[60px] md:blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-4xl w-full text-center relative z-10">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-8xl md:text-[12rem] font-bold tracking-tight text-primary leading-none opacity-10 select-none">
                        404
                    </h1>
                    <div className="mt-[-4rem] md:mt-[-8rem]">
                        <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-primary mb-4 leading-tight">
                            Status: <span className="font-drama italic text-accent capitalize">Niet Gevonden.</span>
                        </h2>
                        <p className="text-dark/60 text-base md:text-lg max-w-lg mx-auto mb-10">
                            De opgevraagde parameter bestaat niet in onze architectuur. Laten we je terugbrengen naar de hoofdpagina.
                        </p>
                    </div>
                </div>

                <Link to="/" className="btn-magnetic bg-primary text-white px-8 md:px-12 py-3.5 md:py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <ArrowLeft size={18} /> Terug naar Home
                </Link>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lead-scanner" element={<LeadScanner />} />
                <Route path="/over-mij" element={<OverMij />} />
                <Route path="/werkwijze" element={<Tools />} />
                <Route path="/tools" element={<Navigate to="/werkwijze" replace />} />
                <Route path="/forbidden" element={<Forbidden />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/voorwaarden" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default function App() {
    return (
        <HelmetProvider>
            <Router>
                <AppRoutes />
            </Router>
        </HelmetProvider>
    );
}
