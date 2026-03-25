import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Star, Zap, BarChart3, Clock, User } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

const OverMij = () => {
    const [activeReview, setActiveReview] = useState(0);

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
        <div className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary">
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
                            <p className="text-accent font-medium text-xs mb-4 uppercase tracking-widest">AI Automatisering Specialist · Roermond, Limburg</p>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                                Hoi, ik ben<br />
                                <span className="font-drama italic text-accent">Niels.</span>
                            </h1>
                            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
                                Ik ben Niels Heijman, oprichter van Inovisionn, gevestigd in Roermond. Ik help mkb-bedrijven in Nederland de bottlenecks in hun dagelijkse processen te automatiseren, niet met tijdelijke pleisters, maar met slimme AI-workflows die het echte werk voor je overnemen.
                            </p>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <span className="bg-white/10 border border-white/20 text-white/80 text-xs px-3 md:px-4 py-2 rounded-full font-medium">✓ Make.com Gecertificeerd</span>
                                <span className="bg-white/10 border border-white/20 text-white/80 text-xs px-3 md:px-4 py-2 rounded-full font-medium">✓ n8n Gecertificeerd</span>
                                <span className="bg-white/10 border border-white/20 text-white/80 text-xs px-3 md:px-4 py-2 rounded-full font-medium">✓ Claude Gecertificeerd</span>
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
                <div className="max-w-4xl mx-auto">
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
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 tracking-tight leading-tight">Wat ik voor klanten heb gebouwd.</h2>
                    <p className="text-dark/60 text-base md:text-lg mb-12 max-w-2xl leading-relaxed">
                        Hieronder drie concrete automatiseringen die ik heb gebouwd. Geen theorie, dit zijn echte processen die dagelijks voor mijn klanten doordraaien.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-background rounded-[1.5rem] p-6 border border-dark/5">
                            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                                <BarChart3 size={20} className="text-accent" />
                            </div>
                            <h3 className="font-bold text-primary text-lg mb-3 leading-tight">Amazon Product Research</h3>
                            <p className="text-dark/60 text-sm leading-relaxed mb-5">
                                Een Amazon-verkoper deed zijn product research volledig handmatig: uren per week zoeken, vergelijken en noteren. Ik bouwde een systeem dat binnen enkele minuten de Amazon-pagina scrapt en een compleet Excel-overzicht genereert van producten die voldoen aan zijn wensen, met inkoopprijs, verkoopprijs, concurrentieanalyse en concrete verbeterpunten om zich te onderscheiden.
                            </p>
                            <div className="bg-accent/10 rounded-xl px-4 py-2 inline-block">
                                <span className="text-accent font-bold text-sm">Uren handwerk → minuten</span>
                            </div>
                        </div>

                        <div className="bg-background rounded-[1.5rem] p-6 border border-dark/5">
                            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                                <Zap size={20} className="text-accent" />
                            </div>
                            <h3 className="font-bold text-primary text-lg mb-3 leading-tight">AI Klantenservice Bot</h3>
                            <p className="text-dark/60 text-sm leading-relaxed mb-5">
                                Voor een webshop bouwde ik een support bot die het eerste-lijns klantencontact volledig overneemt. De bot haalt bestellingen op uit de backend door middel van naam of bestelnummer, herkent terugkerende klanten en past zijn toon daarop aan. Hij leert continu van feedback en gouden voorbeelden.
                            </p>
                            <div className="bg-accent/10 rounded-xl px-4 py-2 inline-block">
                                <span className="text-accent font-bold text-sm">80%+ vragen geautomatiseerd</span>
                            </div>
                        </div>

                        <div className="bg-background rounded-[1.5rem] p-6 border border-dark/5">
                            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                                <Clock size={20} className="text-accent" />
                            </div>
                            <h3 className="font-bold text-primary text-lg mb-3 leading-tight">Automatische Advertentie­rapportages</h3>
                            <p className="text-dark/60 text-sm leading-relaxed mb-5">
                                Een ondernemer met meerdere advertentiekanalen moest wekelijks handmatig data ophalen en samenvoegen om te bekijken welke kanalen goed lopen en welke vooruit of achteruit zijn gegaan. Nu haalt een workflow automatisch alle kanaaldata op, voegt deze samen en genereert een rapport met conclusies en aanbevelingen, op het juiste moment, in de inbox.
                            </p>
                            <div className="bg-accent/10 rounded-xl px-4 py-2 inline-block">
                                <span className="text-accent font-bold text-sm">Wekelijks uren teruggewonnen</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Aanpak */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-background">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 tracking-tight leading-tight">Hoe ik werk.</h2>
                    <p className="text-dark/60 text-base md:text-lg leading-relaxed max-w-2xl">
                        Elk traject begint hetzelfde: we kijken samen naar welke processen de meeste tijd innemen of terugkerende taken zijn. We analyseren alle bottlenecks en bekijken welke oplossing daar het beste bij past. Geen onnodige complexiteit, geen nieuwe software om te leren. De automatisering werkt onzichtbaar op de achtergrond, terwijl jij je richt op wat écht telt.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 tracking-tight">Veelgestelde vragen.</h2>
                    <div className="bg-background rounded-[1.5rem] md:rounded-[2rem] border border-dark/5 px-6 md:px-10 divide-y divide-dark/5">
                        <FaqItem
                            question="Wat kost AI automatisering voor een mkb-bedrijf?"
                            answer={[
                                "De kosten van AI automatisering hangen af van meerdere factoren. Denk aan de complexiteit van het proces, het aantal systemen dat gekoppeld moet worden en hoe intensief de automatisering gebruikt wordt. Een workflow die één keer per dag een rapport verstuurt vraagt minder dan een klantenservice bot die continu draait en duizenden berichten per maand verwerkt.",
                                "Om een concreet beeld te geven: een eenvoudige automatisering kan vanaf ongeveer 300 euro gebouwd worden. Een uitgebreidere oplossing, zoals een volledige klantenservice bot of een rapportagesysteem dat meerdere kanalen samenvoegt, kan richting de duizend of duizenden euro's gaan. Wat het precies kost hangt echt af van wat je wilt en wat je nodig hebt.",
                                "Wat ik wel kan zeggen: de investering verdient zich in de meeste gevallen binnen enkele maanden terug. Zeker als je bedenkt hoeveel uren er wekelijks opgaan aan taken die een workflow volledig kan overnemen. Tijdens een vrijblijvend kennismakingsgesprek breng ik samen met jou in kaart wat een automatisering jou zou opleveren en wat het realistisch kost."
                            ]}
                        />
                        <FaqItem
                            question="Wat is het verschil tussen Make.com en n8n?"
                            answer={[
                                "Beide platforms zijn krachtige tools voor het bouwen van automatiseringen, maar ze hebben elk hun eigen sterktes.",
                                "Make.com is visueel, intuïtief en werkt volledig in de cloud. Het is ideaal voor bedrijven die snel willen starten zonder technische infrastructuur. n8n is een open-source platform dat je ook zelf kunt hosten. Dat geeft meer controle over je data en is op de lange termijn voordeliger bij hoog gebruik.",
                                "In de praktijk kies ik het platform op basis van jouw situatie. Heb je gevoelige klantdata en wil je volledige controle? Dan is n8n vaak de betere keuze. Wil je snel schakelen en heb je geen eigen server? Dan past Make.com beter. Soms combineer ik beide platforms binnen één oplossing."
                            ]}
                        />
                        <FaqItem
                            question="Welke processen zijn geschikt voor AI automatisering?"
                            answer={[
                                "Een proces is geschikt voor automatisering als het regelmatig terugkomt, altijd ongeveer hetzelfde verloopt en weinig creatieve beslissingen vereist. Denk aan het verwerken van binnenkomende orders, het beantwoorden van veelgestelde klantvragen, het opstellen van rapportages, het verrijken van leads of het doorsturen van gegevens tussen systemen.",
                                "AI voegt daar een extra laag aan toe. Waar traditionele automatisering stopt bij vaste regels, kan een AI-workflow ook tekst begrijpen, samenvatten, beoordelen en genereren. Dat maakt het mogelijk om ook complexere taken te automatiseren, zoals het opstellen van offertes op basis van een intake, het categoriseren van klantvragen of het analyseren van reviews.",
                                "Een goede vuistregel: als je een taak aan een nieuwe medewerker zou kunnen uitleggen in een paar stappen, is de kans groot dat een AI-workflow het kan overnemen."
                            ]}
                        />
                        <FaqItem
                            question="Hoe weet ik of automatisering iets voor mijn bedrijf is?"
                            answer={[
                                "Als je regelmatig tijd kwijt bent aan taken die steeds hetzelfde zijn, is de kans groot dat automatisering iets voor jou kan betekenen. Denk aan het handmatig kopiëren van gegevens tussen systemen, het beantwoorden van dezelfde klantvragen, het opstellen van wekelijkse rapporten of het opvolgen van leads.",
                                "Maar ook als je een idee hebt, iets wat je denkt dat misschien mogelijk is, is een kennismakingsgesprek waardevol. Tegenwoordig kun je zo gek niet bedenken of het is te bouwen. In een vrijblijvend gesprek kijk ik samen met jou of jouw idee werkelijkheid kan worden. Blijkt het toch niet haalbaar of niet zinvol? Dan ben ik daar eerlijk over. Geen verkooppraatje, gewoon een eerlijk gesprek over wat wel en niet werkt voor jouw situatie."
                            ]}
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
                <div className="max-w-2xl mx-auto">
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
