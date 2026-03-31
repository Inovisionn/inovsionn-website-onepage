import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronDown, ChevronUp, Zap, GitBranch, Brain } from 'lucide-react';
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


const TOOLS = [
    {
        icon: Zap,
        name: 'Make.com',
        tagline: 'Snel koppelen',
        intro: [
            "Stel je voor dat al je systemen met elkaar kunnen praten. Je CRM weet automatisch wanneer er een nieuwe bestelling binnenkomt. Je boekhouding wordt bijgewerkt zodra een factuur betaald is. Dat is wat Make.com doet.",
            "Make.com is een visueel platform waarmee ik koppelingen bouw tussen de systemen die jij al gebruikt. Zonder code, zonder technische kennis aan jouw kant. Je ziet het resultaat, de rest gebeurt automatisch.",
        ],
        goed: "Ideaal voor het verbinden van bekende tools zoals HubSpot, Exact, Gmail, Shopify, Google Sheets en honderden andere applicaties. Visueel, snel te bouwen en direct te begrijpen.",
        wanneer: "Mijn eerste keuze voor de meeste projecten: snel, stabiel en aansluitend op bijna elke tool die een mkb-bedrijf gebruikt.",
        minder: "Data gaat via de servers van Make.com. Voor sectoren waar privacy extra zwaar weegt, zoals zorg of juridische dienstverlening, kan n8n de betere keuze zijn.",
    },
    {
        icon: GitBranch,
        name: 'n8n',
        tagline: 'Data in eigen beheer',
        intro: [
            "n8n doet in de basis hetzelfde als Make.com: het verbindt systemen en automatiseert processen. Maar n8n is open-source en kan op een eigen server gehost worden.",
            "Dat betekent dat alle data intern blijft, op jouw server, in jouw beheer. n8n biedt ook meer ruimte voor complexe logica en koppelingen met systemen die geen standaard integratie hebben.",
        ],
        goed: "De betere keuze als dataprivacy een vereiste is, de workflow technisch complex is, of het volume zo hoog is dat de kosten van Make.com oplopen. Geen limieten op het aantal keer dat een workflow draait.",
        wanneer: "Als een klant in een privacygevoelige sector werkt, maatwerk code nodig is in de workflow, of koppelingen gelegd moeten worden met interne systemen.",
        minder: "Vereist iets meer technische kennis om op te zetten en te onderhouden. Voor eenvoudige koppelingen tussen veelgebruikte tools is Make.com sneller.",
    },
    {
        icon: Brain,
        name: 'Claude Code',
        tagline: 'Maatwerk & AI agents',
        intro: [
            "Make.com en n8n zijn krachtige tools, maar ze volgen regels. Claude Code gaat een stap verder — het bouwt oplossingen die echt denken.",
            "Volledige dashboards, applicaties en agentic workflows waarbij AI zelfstandig taken oppakt en beslissingen neemt. Claude gebruik ik ook als brein binnen Make.com en n8n workflows — voor het begrijpen van tekst, nemen van beslissingen en genereren van output.",
        ],
        goed: "Als een project verder gaat dan het koppelen van bestaande systemen: eigen applicaties, interne dashboards, maatwerk tools of een AI-agent die volledig zelfstandig werkt.",
        wanneer: "Als de oplossing niet past binnen Make.com of n8n, of als een klant iets wil bouwen dat uniek is en volledig aansluit op zijn eigen processen en wensen.",
        minder: "Complexer te bouwen en te onderhouden. Voor standaard koppelingen tussen bestaande tools is Make.com of n8n sneller, goedkoper en eenvoudiger.",
    },
];

const ToolSwitcher = () => {
    const [active, setActive] = useState(0);
    const contentRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(wrapperRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: wrapperRef.current, start: 'top 80%' }
                }
            );
        });
        return () => ctx.revert();
    }, []);

    const switchTo = (i) => {
        if (i === active) return;
        gsap.to(contentRef.current, {
            opacity: 0, x: -16, duration: 0.18, ease: 'power2.in',
            onComplete: () => {
                setActive(i);
                gsap.fromTo(contentRef.current,
                    { opacity: 0, x: 16 },
                    { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }
                );
            }
        });
    };

    const tool = TOOLS[active];

    return (
        <section className="py-20 md:py-28 px-6 md:px-16 bg-background">
            <div ref={wrapperRef} className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                    {/* Left: selector */}
                    <div className="flex flex-row md:flex-col gap-3 shrink-0 md:w-52 overflow-x-auto pb-2 md:pb-0 -mx-1 px-1">
                        {TOOLS.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => switchTo(i)}
                                className={`flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all duration-300 text-left shrink-0 md:w-full ${
                                    active === i
                                        ? 'bg-primary border-primary shadow-xl'
                                        : 'bg-white border-dark/5 hover:border-primary/20 hover:shadow-md'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active === i ? 'bg-white/10' : 'bg-accent/10'}`}>
                                    <t.icon size={18} className="text-accent" />
                                </div>
                                <div className="hidden md:block">
                                    <p className={`font-bold text-sm leading-tight ${active === i ? 'text-white' : 'text-primary'}`}>{t.name}</p>
                                    <p className={`text-xs mt-0.5 ${active === i ? 'text-white/50' : 'text-dark/40'}`}>{t.tagline}</p>
                                </div>
                                <span className={`text-xs font-bold md:hidden ${active === i ? 'text-white' : 'text-primary'}`}>{t.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right: content */}
                    <div ref={contentRef} className="flex-1 min-h-[360px]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center shrink-0">
                                <tool.icon size={24} className="text-accent" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight leading-tight">{tool.name}</h2>
                                <p className="text-dark/40 text-sm">{tool.tagline}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-dark/70 text-base leading-relaxed mb-8 max-w-2xl">
                            {tool.intro.map((p, i) => <p key={i}>{p}</p>)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { label: `Waar ${tool.name} goed in is`, body: tool.goed },
                                { label: `Wanneer kies ik voor ${tool.name}?`, body: tool.wanneer },
                                { label: `Minder geschikt voor`, body: tool.minder },
                            ].map((card, i) => (
                                <div key={i} className="bg-white rounded-2xl p-5 border border-dark/5">
                                    <h3 className="font-bold text-primary text-xs uppercase tracking-wider mb-3">{card.label}</h3>
                                    <p className="text-dark/60 text-sm leading-relaxed">{card.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ---- Animated Workflow Visualisation ----
const TOOL_COLORS = {
    'Make.com': { bg: 'rgba(59,130,246,0.18)', border: '#3B82F6', text: '#3B82F6', label: 'Make' },
    'Claude':   { bg: 'rgba(168,85,247,0.18)',  border: '#A855F7', text: '#A855F7', label: 'Claude' },
    'n8n':      { bg: 'rgba(34,197,94,0.18)',   border: '#22C55E', text: '#22C55E', label: 'n8n' },
    'Claude Code': { bg: 'rgba(168,85,247,0.18)', border: '#A855F7', text: '#A855F7', label: 'Claude Code' },
};

const AnimatedWorkflowViz = ({ steps }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        intervalRef.current = setInterval(() => {
            setActiveStep(prev => (prev + 1) % steps.length);
        }, 1600);

        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('resize', checkMobile);
        };
    }, [steps.length]);

    const NODE_R = 14;
    const SPACING_V = 54;
    const SPACING_H = 80;
    
    // Vertical Layout (Desktop)
    const SVG_W_V = 110;
    const SVG_H_V = steps.length * SPACING_V + 10;
    const CX_V = SVG_W_V / 2;

    // Horizontal Snake Layout (Mobile)
    const ROWS = 2;
    const COLS = 3;
    const SVG_W_H = COLS * SPACING_H + 20;
    const SVG_H_H = ROWS * SPACING_V + 40;
    const PADDING = 20;

    const getCoords = (i) => {
        if (!isMobile) {
            return { cx: CX_V, cy: i * SPACING_V + NODE_R + 10 };
        }
        // Snake logic: row 0 (0,1,2), row 1 (reverse: 5,4,3)
        const row = Math.floor(i / COLS);
        let col = i % COLS;
        if (row === 1) {
            col = (COLS - 1) - col; 
        }
        return {
            cx: col * SPACING_H + PADDING + NODE_R,
            cy: row * SPACING_V + PADDING + NODE_R
        };
    };

    const SVG_W = isMobile ? SVG_W_H : SVG_W_V;
    const SVG_H = isMobile ? SVG_H_H : SVG_H_V;

    return (
        <div className="flex flex-col items-center justify-center h-full py-4" aria-hidden="true">
            <svg
                width={SVG_W}
                height={SVG_H}
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible', transition: 'width 0.3s, height 0.3s' }}
            >
                {/* Connecting lines */}
                {steps.map((_, i) => {
                    if (i === steps.length - 1) return null;
                    const p1 = getCoords(i);
                    const p2 = getCoords(i + 1);
                    const isActive = activeStep === i;
                    
                    // Simple path for line
                    const linePath = `M ${p1.cx} ${p1.cy} L ${p2.cx} ${p2.cy}`;
                    
                    return (
                        <g key={`line-${i}`}>
                            <path
                                d={linePath}
                                stroke="rgba(255,255,255,0.12)"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            {isActive && (
                                <circle r="4" fill="#3B82F6" opacity="0.9">
                                    <animateMotion
                                        dur="1.5s"
                                        repeatCount="1"
                                        path={linePath}
                                    />
                                    <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" repeatCount="1" />
                                </circle>
                            )}
                        </g>
                    );
                })}

                {/* Nodes */}
                {steps.map((step, i) => {
                    const { cx, cy } = getCoords(i);
                    const isActive = activeStep === i;
                    const toolInfo = TOOL_COLORS[step.tool] || TOOL_COLORS['Make.com'];
                    
                    // On mobile, alternate label position to avoid overlap
                    const isTopRow = Math.floor(i / COLS) === 0;
                    const labelYOffset = isMobile ? (isTopRow ? -28 : 10) : -9;
                    const labelXOffset = isMobile ? -26 : (NODE_R + 6);

                    return (
                        <g key={`node-${i}`} style={{ transition: 'transform 0.4s ease' }}>
                            {isActive && (
                                <circle
                                    cx={cx} cy={cy} r={NODE_R + 7}
                                    fill="none"
                                    stroke={toolInfo.border}
                                    strokeWidth="2"
                                    opacity="0"
                                >
                                    <animate attributeName="r" values={`${NODE_R};${NODE_R + 12}`} dur="1s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.8;0" dur="1s" repeatCount="indefinite" />
                                </circle>
                            )}
                            <circle
                                cx={cx} cy={cy} r={NODE_R}
                                fill={isActive ? toolInfo.border : 'rgba(255,255,255,0.07)'}
                                stroke={isActive ? toolInfo.border : 'rgba(255,255,255,0.18)'}
                                strokeWidth="1.5"
                                style={{ transition: 'fill 0.4s, stroke 0.4s' }}
                            />
                            <text
                                x={cx} y={cy + 1}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="10"
                                fontFamily="'JetBrains Mono', monospace"
                                fontWeight="700"
                                fill={isActive ? '#0D1B2A' : 'rgba(255,255,255,0.5)'}
                            >
                                {i + 1}
                            </text>
                            {/* Tool badge */}
                            <g transform={`translate(${cx + labelXOffset}, ${cy + labelYOffset})`}>
                                <rect
                                    rx="5" ry="5"
                                    width="52" height="18"
                                    fill={isActive ? toolInfo.bg : 'rgba(255,255,255,0.04)'}
                                    stroke={isActive ? toolInfo.border : 'rgba(255,255,255,0.1)'}
                                    strokeWidth="1"
                                />
                                <text
                                    x="26" y="9"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="9"
                                    fontFamily="'JetBrains Mono', monospace"
                                    fontWeight="600"
                                    fill={isActive ? toolInfo.text : 'rgba(255,255,255,0.3)'}
                                >
                                    {toolInfo.label}
                                </text>
                            </g>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const WORKFLOW_1 = [
    { tool: 'Make.com' },
    { tool: 'Make.com' },
    { tool: 'Claude' },
    { tool: 'Make.com' },
    { tool: 'Claude' },
    { tool: 'Make.com' },
];

const WORKFLOW_2 = [
    { tool: 'n8n' },
    { tool: 'n8n' },
    { tool: 'Claude' },
    { tool: 'Claude Code' },
    { tool: 'Claude Code' },
];

const Tools = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero text
            gsap.fromTo(".hero-stagger",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }
            );

            // Floating tool cards entrance
            gsap.fromTo(".tool-float-card",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.3 }
            );

            // Continuous float animation per card
            [".tool-float-1", ".tool-float-2", ".tool-float-3"].forEach((sel, i) => {
                gsap.to(sel, {
                    y: -10 - i * 4,
                    duration: 2.8 + i * 0.4,
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut",
                    delay: i * 0.6,
                });
            });

            // General scroll fade-up elements
            gsap.utils.toArray('.scroll-fade-up').forEach((el) => {
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 85%" }
                    }
                );
            });

            // Samenwerken flow steps
            gsap.fromTo(".flow-step",
                { opacity: 0, x: -20 },
                {
                    opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power3.out",
                    scrollTrigger: { trigger: ".flow-container", start: "top 78%" }
                }
            );

            // Example cards
            gsap.fromTo(".example-card",
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
                    scrollTrigger: { trigger: ".examples-container", start: "top 80%" }
                }
            );

        }, containerRef);

        ScrollTrigger.refresh();
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary overflow-x-hidden">
            <Helmet>
                <title>Make.com, n8n &amp; Claude Code | AI Tools Specialist Roermond | Inovisionn</title>
                <meta name="description" content="Ontdek hoe Inovisionn in Roermond Make.com, n8n en Claude Code inzet voor AI-automatisering. Wij bouwen maatwerk workflows en AI-agents voor mkb-bedrijven in Limburg en Nederland." />
                <link rel="canonical" href="https://www.inovisionn.com/werkwijze" />
            </Helmet>

            <div className="sr-only">
                <p>Inovisionn gebruikt Make.com, n8n en Claude Code als primaire tools voor AI-automatisering. Make.com verzorgt visuele workflow-koppelingen, n8n biedt flexibele zelfgehoste automatisering, en Claude Code maakt maatwerk applicaties en agentic workflows mogelijk. De juiste tool wordt gekozen op basis van complexiteit, dataprivacy en budget.</p>
            </div>

            <Navbar />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-16 bg-primary text-white overflow-hidden">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="hero-stagger text-accent font-medium text-xs mb-4 uppercase tracking-widest">De technische stack</p>
                        <h1 className="hero-stagger text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                            De tools achter<br />
                            <span className="font-drama italic text-accent">de automatisering.</span>
                        </h1>
                        <p className="hero-stagger text-white/70 text-base md:text-lg leading-relaxed">
                            Elke automatisering draait op een van deze drie platforms. Ik kies altijd de oplossing die het beste resultaat geeft tegen de laagst mogelijke kosten.
                        </p>
                    </div>

                    {/* Floating tool stack */}
                    <div className="hero-stagger hidden md:flex items-center justify-center">
                        <div className="relative w-full h-56">
                            {[
                                { icon: Zap,       name: 'Make.com',    sub: 'Workflow koppeling', cls: 'tool-float-1', top: '0px',   left: '10%',  rotate: '-4deg'  },
                                { icon: GitBranch, name: 'n8n',         sub: 'Open-source & privé', cls: 'tool-float-2', top: '60px',  left: '22%',  rotate: '2deg'   },
                                { icon: Brain,     name: 'Claude Code', sub: 'AI & maatwerk',       cls: 'tool-float-3', top: '120px', left: '34%',  rotate: '-2deg'  },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`tool-float-card ${item.cls} absolute flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 w-64`}
                                    style={{ top: item.top, left: item.left, rotate: item.rotate }}
                                >
                                    <div className="w-9 h-9 bg-accent/20 rounded-xl flex items-center justify-center shrink-0">
                                        <item.icon size={18} className="text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{item.name}</p>
                                        <p className="text-white/50 text-xs">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <ToolSwitcher />

            {/* Hoe de drie samenwerken */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-primary text-white">
                <div className="max-w-6xl mx-auto examples-container">
                    <h2 className="scroll-fade-up text-3xl md:text-4xl font-bold mb-6 tracking-tight leading-tight">Hoe de drie samenwerken.</h2>
                    <p className="scroll-fade-up text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mb-14">
                        De kracht zit in de combinatie. Make.com of n8n als zenuwstelsel, Claude als brein, en Claude Code als het platform voor wat daarboven uitstijgt.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Voorbeeld 1 */}
                        <div className="example-card bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8">
                            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-6">Voorbeeld: automatische klantenservice</p>
                            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                {/* Steps */}
                                <div className="flow-container flex flex-col flex-1">
                                    {[
                                        "Klantvraag binnenkomt via e-mail of chat",
                                        "Make.com detecteert het bericht en start de workflow",
                                        "Claude leest de vraag en categoriseert deze",
                                        "Make.com haalt ordergegevens op uit de backend",
                                        "Claude schrijft een gepersonaliseerd antwoord",
                                        "Antwoord verstuurd en geregistreerd in het CRM",
                                    ].map((step, i, arr) => (
                                        <div key={i} className="flow-step flex items-start gap-4">
                                            <div className="flex flex-col items-center shrink-0">
                                                <span className="font-data text-accent text-[10px] bg-accent/20 w-7 h-7 rounded-full flex items-center justify-center font-bold">
                                                    {i + 1}
                                                </span>
                                                {i < arr.length - 1 && (
                                                    <div className="w-px bg-white/10 flex-1 my-1 min-h-[20px]" />
                                                )}
                                            </div>
                                            <p className="text-white/75 text-sm leading-relaxed pb-4">{step}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Animated viz */}
                                <div className="shrink-0 self-center w-full md:w-[200px] flex items-center justify-center min-h-[240px] md:min-h-0 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
                                    <AnimatedWorkflowViz steps={WORKFLOW_1} />
                                </div>
                            </div>
                        </div>

                        {/* Voorbeeld 2 */}
                        <div className="example-card bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8">
                            <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-6">Voorbeeld: maatwerk rapportage dashboard</p>
                            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                                {/* Steps */}
                                <div className="flow-container flex flex-col flex-1">
                                    {[
                                        "Meerdere advertentiekanalen genereren dagelijks data",
                                        "n8n haalt alle data op en voegt deze samen",
                                        "Claude analyseert en schrijft conclusies en aanbevelingen",
                                        "Claude Code genereert een dashboard dat altijd up-to-date is",
                                        "De ondernemer opent elke ochtend één scherm met alles",
                                    ].map((step, i, arr) => (
                                        <div key={i} className="flow-step flex items-start gap-4">
                                            <div className="flex flex-col items-center shrink-0">
                                                <span className="font-data text-accent text-[10px] bg-accent/20 w-7 h-7 rounded-full flex items-center justify-center font-bold">
                                                    {i + 1}
                                                </span>
                                                {i < arr.length - 1 && (
                                                    <div className="w-px bg-white/10 flex-1 my-1 min-h-[20px]" />
                                                )}
                                            </div>
                                            <p className="text-white/75 text-sm leading-relaxed pb-4">{step}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Animated viz */}
                                <div className="shrink-0 self-center w-full md:w-[200px] flex items-center justify-center min-h-[200px] md:min-h-0 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
                                    <AnimatedWorkflowViz steps={WORKFLOW_2} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-background">
                <div className="max-w-4xl mx-auto scroll-fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 tracking-tight">Veelgestelde vragen.</h2>
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-dark/5 px-6 md:px-10 divide-y divide-dark/5">
                        <FaqItem
                            question="Hoe kan ik AI gebruiken voor klantenservice zonder dat het robotachtig aanvoelt?"
                            answer="In het kort: Door gebruik te maken van RAG-technologie (Retrieval-Augmented Generation, een techniek waarbij de AI eerst in jouw eigen documenten en kennisbank zoekt naar het juiste antwoord). Hiermee baseert de AI zijn antwoorden uitsluitend op jouw eigen documentatie. Dit resulteert in menselijke antwoorden die 80% van de supportvragen direct oplossen. Ik raad altijd aan vooral op het begin een human in the loop te houden bij dit soort automatiseringen, de AI kan al veel zelf zoals jullie schrijfstijl aannemen, informatie uit backend systemen halen, anders reageren omdat het een vaste klant is en nog meer."
                        />
                        <FaqItem
                            question="Wat zijn de beste AI-tools om repetitieve administratie te elimineren?"
                            answer="In het kort: Voor een krachtige workflow (een automatische stroom van taken) in 2026 is de combinatie van Make of n8n (tools die verschillende apps aan elkaar koppelen) met geavanceerde modellen zoals Gemini of Claude essentieel. Hiermee automatiseer je de volledige keten van factuurverwerking, e-mailbeheer en data-synchronisatie (het gelijk laten lopen van gegevens) tussen verschillende pakketten. Wil je een stap hoger in de mogelijkheden kun je custom workflows bouwen met tools zoals claude-code en google antigravity."
                        />
                        <FaqItem
                            question="Hoe koppel ik mijn huidige CRM zoals HubSpot of Salesforce aan AI?"
                            answer="In het kort: Dit gebeurt via een API-koppeling (de brug tussen twee systemen). Hierdoor kan de AI automatisch samenvattingen maken van klantgesprekken, leads categoriseren op basis van interesse en gepersonaliseerde e-mailconcepten klaarzetten voor je salesteam in je CRM (Customer Relationship Management, het systeem waarin je al je klantgegevens beheert). Het komt nu al voor dat claude-cowork dit al automatisch geïntegreerd heeft."
                        />
                        <FaqItem
                            question="Hoe kan ik AI-agents inzetten om mijn sales-opvolging te versnellen?"
                            answer="In het kort: Een AI-salesagent (een zelfstandig werkend AI-programma) reageert binnen 2 minuten op elke inkomende lead (potentiële klant), beantwoordt eerste vragen en plant direct een afspraak in de agenda van je accountmanager. Dit zorgt voor een enorme stijging in conversie (het percentage leads dat daadwerkelijk klant wordt) omdat mensen worden geholpen op het moment dat hun interesse het hoogst is."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-white text-center">
                <div className="max-w-2xl mx-auto scroll-fade-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">Klaar om te automatiseren?</h2>
                    <p className="text-dark/60 text-base md:text-lg mb-8 leading-relaxed">
                        Plan een gratis kennismaking in. Ik kijk samen met jou welke processen het meeste tijd kosten en hoe ik die voor je kan overnemen.
                    </p>
                    <a
                        href="https://calendly.com/inovisionn/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-magnetic bg-primary text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        Plan een kennismaking <ArrowRight size={18} />
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Tools;
