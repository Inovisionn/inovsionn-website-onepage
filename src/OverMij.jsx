import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Star, Zap, BarChart3, Clock, User, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const FaqItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-dark/5 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left gap-4"
            >
                <span className="font-semibold text-primary text-sm md:text-base">{question}</span>
                {open ? <ChevronUp size={18} className="text-dark/40 shrink-0" /> : <ChevronDown size={18} className="text-dark/40 shrink-0" />}
            </button>
            {open && (
                <div className="text-dark/60 text-sm leading-relaxed pb-5 space-y-3">
                    {Array.isArray(answer) ? answer.map((p, i) => <p key={i}>{p}</p>) : <p>{answer}</p>}
                </div>
            )}
        </div>
    );
};

const CASES = [
    {
        num: "01",
        icon: BarChart3,
        title: "Amazon Product Research",
        tag: "E-commerce automatisering",
        desc: "Een Amazon-verkoper deed zijn product research volledig handmatig: uren per week zoeken, vergelijken en noteren. Ik bouwde een systeem dat binnen enkele minuten de Amazon-pagina scrapt en een compleet Excel-overzicht genereert van producten die voldoen aan zijn wensen, met inkoopprijs, verkoopprijs, concurrentieanalyse en concrete verbeterpunten.",
        impact: "Uren handwerk → minuten",
    },
    {
        num: "02",
        icon: Zap,
        title: "AI Klantenservice Bot",
        tag: "AI klantencontact",
        desc: "Voor een webshop bouwde ik een support bot die het eerste-lijns klantencontact volledig overneemt. De bot haalt bestellingen op uit de backend door middel van naam of bestelnummer, herkent terugkerende klanten en past zijn toon daarop aan. Hij leert continu van feedback en gouden voorbeelden.",
        impact: "80%+ vragen geautomatiseerd",
    },
    {
        num: "03",
        icon: Clock,
        title: "Automatische Advertentierapportages",
        tag: "Data & rapportage",
        desc: "Een ondernemer met meerdere advertentiekanalen moest wekelijks handmatig data ophalen en samenvoegen. Nu haalt een workflow automatisch alle kanaaldata op, voegt deze samen en genereert een rapport met conclusies en aanbevelingen — op het juiste moment, in de inbox.",
        impact: "Wekelijks uren teruggewonnen",
    },
];

const CaseStudyTabs = () => {
    const [activeTab, setActiveTab] = useState(0);
    const intervalRef = useRef(null);
    const DURATION = 5000;

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActiveTab(prev => (prev + 1) % CASES.length);
        }, DURATION);
    };

    useEffect(() => {
        resetTimer();
        return () => clearInterval(intervalRef.current);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClick = (i) => {
        setActiveTab(i);
        resetTimer();
    };

    const active = CASES[activeTab];

    return (
        <div className="flex flex-col md:flex-row rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-dark/5 shadow-sm">
            {/* Left: tab list */}
            <div className="md:w-[38%] flex flex-col bg-white divide-y divide-dark/5 border-b md:border-b-0 md:border-r border-dark/5">
                {CASES.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        className={`relative text-left px-5 py-4 md:px-7 md:py-6 transition-colors duration-300 ${activeTab === i ? 'bg-background' : 'hover:bg-dark/[0.02]'}`}
                    >
                        {activeTab === i && (
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-dark/10 rounded-r">
                                <div
                                    key={`prog-${activeTab}`}
                                    className="absolute top-0 left-0 w-full bg-accent rounded-r"
                                    style={{ animation: `tabFill ${DURATION}ms linear forwards` }}
                                />
                            </div>
                        )}
                        <span className="font-data text-accent text-xs mb-2 block">_{c.num}</span>
                        <h3 className={`font-bold text-sm leading-snug transition-colors duration-300 ${activeTab === i ? 'text-primary' : 'text-dark/35'}`}>
                            {c.title}
                        </h3>
                        {activeTab === i && (
                            <p className="text-dark/40 text-xs mt-1">{c.tag}</p>
                        )}
                    </button>
                ))}
            </div>

            {/* Right: case detail */}
            <div className="md:w-[62%] p-6 md:p-10 bg-background flex flex-col justify-between min-h-[280px] md:min-h-[320px]">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center shrink-0">
                            <active.icon size={20} className="text-accent" />
                        </div>
                        <span className="text-xs font-medium text-dark/40 bg-dark/5 px-3 py-1 rounded-full">{active.tag}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">{active.title}</h3>
                    <p className="text-dark/60 text-sm md:text-base leading-relaxed">{active.desc}</p>
                </div>
                <div className="mt-8">
                    <div className="bg-accent/10 rounded-xl px-5 py-3 inline-block">
                        <span className="text-accent font-bold text-sm">{active.impact}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OverMij = () => {
    const [activeReview, setActiveReview] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.fromTo(".hero-stagger", 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
            );

            // Scroll animations for sections
            gsap.utils.toArray('.scroll-fade-up').forEach((el) => {
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                        }
                    }
                );
            });

            // Werkwijze stappen stagger
            gsap.fromTo(".werkwijze-step",
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".werkwijze-step",
                        start: "top 85%",
                    }
                }
            );
        }, containerRef);

        ScrollTrigger.refresh();

        return () => ctx.revert();
    }, []);

    const reviews = [
        {
            name: "Naam klant",
            role: "Functie, Bedrijfsnaam",
            text: "Vul hier een review in. Beschrijf wat de samenwerking met Niels voor jouw bedrijf heeft betekend."
        },
        {
            name: "Naam klant",
            role: "Functie, Bedrijfsnaam",
            text: "Vul hier een review in. Beschrijf wat de samenwerking met Niels voor jouw bedrijf heeft betekend."
        },
        {
            name: "Naam klant",
            role: "Functie, Bedrijfsnaam",
            text: "Vul hier een review in. Beschrijf wat de samenwerking met Niels voor jouw bedrijf heeft betekend."
        },
    ];

    const nextReview = () => setActiveReview((prev) => (prev + 1) % reviews.length);
    const prevReview = () => setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length);

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary overflow-x-hidden">
            <Helmet>
                <title>Over Niels Heijman | AI Automatisering Specialist Roermond | Inovisionn</title>
                <meta name="description" content="Leer Niels Heijman kennen, oprichter van Inovisionn. Gecertificeerd AI-automatisering specialist uit Roermond met aantoonbare resultaten in Make.com, n8n en Claude." />
                <link rel="canonical" href="https://www.inovisionn.com/over-mij" />
            </Helmet>

            {/* GEO snippet voor AI-zoekmachines */}
            <div className="sr-only">
                <p>Niels Heijman is een gecertificeerd AI-automatisering specialist gevestigd in Roermond, Limburg. Via Inovisionn bouwt hij op maat gemaakte AI-workflows voor mkb-bedrijven in Nederland met Make.com, n8n en Claude. Zijn aanpak: bottlenecks analyseren, dan de oplossing bouwen die direct tijdwinst oplevert.</p>
            </div>

            <Navbar />

            {/* Hero Section */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-16 bg-primary text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-1 max-w-3xl gap-12 items-center">
                        <div>
                            <p className="hero-stagger text-accent font-medium text-xs mb-4 uppercase tracking-widest">AI Automatisering Specialist · Roermond, Limburg</p>
                            <h1 className="hero-stagger text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                                <span className="font-drama italic text-accent">Niels Heijman.</span>
                            </h1>
                            <p className="hero-stagger text-white/70 text-base md:text-lg leading-relaxed mb-8">
                                Mijn naam is Niels Heijman, oprichter van Inovisionn, gevestigd in Roermond. Ik help mkb-bedrijven in Nederland de bottlenecks in hun dagelijkse processen te automatiseren, niet met tijdelijke pleisters, maar met slimme AI-workflows die het echte werk voor je overnemen.
                            </p>

                            {/* Certificeringen / Autoriteit */}
                            <div className="hero-stagger flex flex-wrap items-center gap-8 pt-6 border-t border-white/5">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] text-accent/50 uppercase tracking-[0.2em] font-bold">Gecertificeerd</span>
                                    <a 
                                        href="https://www.credly.com/badges/e70de52a-fb18-4afa-be9d-8cb70b6a97e4/linked_in_profile" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block group-hover:scale-105 transition-transform"
                                    >
                                        <img 
                                            src="/assets/make-academy-ai-agent-builder-certificaat-roermond.png" 
                                            alt="Make Academy AI Agent Builder Certificaat - Inovisionn Roermond" 
                                            className="h-12 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
                                        />
                                    </a>
                                </div>
                                {/* Ruimte voor toekomstige badges */}
                            </div>
                        </div>

                        {/* Foto placeholder verborgen voor lancering
                        <div className="flex justify-center md:justify-end">
                            <div className="w-56 h-56 md:w-72 md:h-72 rounded-[2rem] bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 text-white/30">
                                <User size={48} />
                                <p className="text-xs text-center px-4 leading-relaxed">Voeg hier een<br />foto van jezelf toe</p>
                            </div>
                        </div>
                        */}
                    </div>
                </div>
            </section>

            {/* Achtergrond */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-background">
                <div className="max-w-4xl mx-auto scroll-fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight leading-tight">Van e-commerce naar AI-automatisering.</h2>
                    <div className="space-y-5 text-dark/70 text-base md:text-lg leading-relaxed">
                        <p>
                            Mijn achtergrond ligt in e-commerce. Na mijn opleiding tot e-commerce specialist werkte ik aan online advertentiecampagnes voor ondernemers. Ik leerde hoe bedrijven groeien, waar tijd verloren gaat en hoe kleine verbeteringen in processen grote impact kunnen hebben.
                        </p>
                        <p>
                            Tegelijkertijd raakte ik steeds meer gefascineerd door de snelheid waarmee AI-technologie zich ontwikkelt. Ik zie enorme potentie voor bedrijven die deze technologie strategisch inzetten. Maar ik zie ook hoe snel je daarin de plank misslaat als je zonder een goede aanpak aan de slag gaat.
                        </p>
                    </div>
                </div>
            </section>

            {/* Case Studies */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="scroll-fade-up text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight leading-tight">Wat ik voor klanten heb gebouwd.</h2>
                    <p className="scroll-fade-up text-dark/60 text-base md:text-lg mb-10 max-w-2xl leading-relaxed">
                        Hieronder drie concrete automatiseringen die ik heb gebouwd. Geen theorie, dit zijn echte processen die dagelijks voor mijn klanten doordraaien.
                    </p>
                    <div className="scroll-fade-up">
                        <CaseStudyTabs />
                    </div>
                </div>
            </section>

            {/* Aanpak */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-background">
                <div className="max-w-5xl mx-auto">
                    <h2 className="scroll-fade-up text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight leading-tight">Hoe ik werk.</h2>
                    <p className="scroll-fade-up text-dark/60 text-base md:text-lg leading-relaxed max-w-2xl mb-12">
                        Elk traject begint hetzelfde: analyseren waar de pijn zit, dan de juiste tool kiezen en bouwen. Geen onnodige complexiteit, geen nieuwe software om te leren.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                num: "01",
                                icon: BarChart3,
                                title: "Analyseren",
                                desc: "We kijken samen welke processen de meeste tijd kosten en waar de echte bottlenecks zitten.",
                            },
                            {
                                num: "02",
                                icon: Zap,
                                title: "Tool kiezen & bouwen",
                                desc: "Ik kies Make.com, n8n of Claude Code op basis van jouw situatie en bouw de automatisering op maat.",
                            },
                            {
                                num: "03",
                                icon: CheckCircle2,
                                title: "Opleveren & doordraaien",
                                desc: "De workflow werkt onzichtbaar op de achtergrond. Na oplevering pas ik direct aan als er iets niet klopt.",
                            },
                        ].map((step, i) => (
                            <div key={i} className="werkwijze-step relative bg-white rounded-[1.5rem] p-6 border border-dark/5 overflow-hidden">
                                <span className="font-data text-accent text-xs bg-accent/10 px-2 py-1 rounded-full">_{step.num}</span>
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mt-5 mb-4">
                                    <step.icon size={20} className="text-white" />
                                </div>
                                <h3 className="font-bold text-primary text-lg mb-2 leading-tight">{step.title}</h3>
                                <p className="text-dark/55 text-sm leading-relaxed">{step.desc}</p>
                                <span className="absolute bottom-3 right-4 font-drama italic text-dark/[0.04] text-8xl font-bold select-none leading-none pointer-events-none">
                                    {step.num}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-white">
                <div className="max-w-4xl mx-auto scroll-fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 tracking-tight">Veelgestelde vragen.</h2>
                    <div className="bg-background rounded-[1.5rem] md:rounded-[2rem] border border-dark/5 px-6 md:px-10 divide-y divide-dark/5">
                        <FaqItem
                            question="Hoe kan ik AI-automatisering gebruiken om mijn bedrijfsprocessen te optimaliseren in 2026?"
                            answer="In het kort: In 2026 draait AI-optimalisatie om het koppelen van slimme taalmodellen aan je eigen bedrijfsdata. Door repetitieve taken zoals data-entry (het overtikken van gegevens), leadopvolging (contact opnemen met potentiële klanten) en klantenservice te automatiseren via API-verbindingen (digitale sleutels waarmee software met elkaar praat) of MCP-servers (Model Context Protocol: een veilige techniek om AI direct toegang te geven tot specifieke bedrijfsdata), bespaar je gemiddeld 10 tot 15 uur per week aan de hand van welke automatiseringen en hoeveel werk hierin omgaat."
                        />
                        <FaqItem
                            question="Is het veilig om gevoelige bedrijfsdata te delen met AI-modellen?"
                            answer={[
                                "In het kort: Ja, mits je gebruikmaakt van Enterprise-grade API-verbindingen (zakelijke verbindingen met extra hoge beveiliging). In tegenstelling tot de gratis consumentenversie van ChatGPT, wordt data die via een professionele API-koppeling wordt verstuurd niet gebruikt om publieke modellen te trainen. Jouw data blijft 100% privé.",
                                "• AVG/GDPR-compliance: Voldoen aan de strenge Europese privacywetgeving.",
                                "• Data-encryptie: Het versleutelen van gegevens zodat ze onleesbaar zijn voor onbevoegden.",
                                "• Zero Data Retention (ZDR): Een beleid waarbij de AI-aanbieder je gegevens direct na verwerking verwijdert en niet opslaat."
                            ]}
                        />
                        <FaqItem
                            question="Wat is de verwachte ROI van een AI-implementatie voor een klein team?"
                            answer="In het kort: De gemiddelde ROI (Return on Investment, het bedrag dat je terugverdient vergeleken met de kosten) van AI-automatisering ligt aan wat je automatiseert, stel je vervangt een klantenservice medewerker van 40 uur per week naar een automatisering die een weekelijkse check nodig heeft van 2,5 uur dan is dat een behoorlijke besparing op salaris. Naast directe besparing op manuren, verhoogt het de winstgevendheid door snellere leadopvolging en het elimineren van menselijke fouten in de administratie. Ook is de AI-agent die ik opzet nooit ziek en loop 24/7 door."
                        />
                        <FaqItem
                            question="Wat is het verschil tussen ChatGPT en een custom AI-oplossing voor mijn bedrijf?"
                            answer="In het kort: ChatGPT is een algemene tool met brede kennis; een custom AI-oplossing (een op maat gemaakte assistent) is een specialist die werkt met jouw specifieke bedrijfsdata en tone-of-voice (de unieke manier waarop jouw bedrijf communiceert). Deze AI-oplossing ondersteunen niet alleen informatie maar voeren daadwerkelijk taken uit. Bovendien kan een custom oplossing acties uitvoeren in je eigen software, wat de standaard ChatGPT niet kan."
                        />
                    </div>
                </div>
            </section>

            {/* Reviews Slider verborgen voor lancering
            <section className="py-20 md:py-28 px-6 md:px-16 bg-background">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 tracking-tight">Wat klanten zeggen.</h2>

                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 border border-dark/5 shadow-sm">
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} className="text-accent fill-accent" />
                            ))}
                        </div>
                        <p className="text-dark/70 text-lg leading-relaxed italic mb-8">"{reviews[activeReview].text}"</p>
                        <div>
                            <p className="font-bold text-primary">{reviews[activeReview].name}</p>
                            <p className="text-dark/50 text-sm">{reviews[activeReview].role}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="flex gap-2 items-center">
                            {reviews.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveReview(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === activeReview ? 'bg-primary w-6' : 'bg-dark/20 w-2'}`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevReview} className="w-10 h-10 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
                                <ChevronLeft size={18} className="text-primary" />
                            </button>
                            <button onClick={nextReview} className="w-10 h-10 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
                                <ChevronRight size={18} className="text-primary" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            */}

            {/* CTA */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-primary text-white text-center">
                <div className="max-w-2xl mx-auto scroll-fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Benieuwd wat ik voor jou kan doen?</h2>
                    <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
                        Plan een gratis, vrijblijvende kennismaking in. Ik kijk samen met jou naar de mogelijkheden.
                    </p>
                    <a
                        href="https://calendly.com/inovisionn/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-magnetic bg-accent text-primary px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        Plan een kennismaking <ArrowRight size={18} />
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default OverMij;
