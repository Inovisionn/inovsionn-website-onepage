import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ChevronDown, ChevronUp, Zap, GitBranch, Brain } from 'lucide-react';
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

const ToolSection = ({ icon: Icon, name, intro, goed, wanneer, minder, bg }) => (
    <section className={`py-20 md:py-28 px-6 md:px-16 ${bg}`}>
        <div className="max-w-5xl mx-auto">
            <div className="flex items-start gap-5 mb-8">
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-accent" />
                </div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight">{name}</h2>
                </div>
            </div>

            <div className="space-y-4 text-dark/70 text-base leading-relaxed mb-10 max-w-3xl">
                {intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-[1.5rem] p-6 border border-dark/5">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Waar {name} goed in is</h3>
                    <p className="text-dark/60 text-sm leading-relaxed">{goed}</p>
                </div>
                <div className="bg-white rounded-[1.5rem] p-6 border border-dark/5">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Wanneer kies ik voor {name}?</h3>
                    <p className="text-dark/60 text-sm leading-relaxed">{wanneer}</p>
                </div>
                <div className="bg-white rounded-[1.5rem] p-6 border border-dark/5">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Waar {name} minder geschikt voor is</h3>
                    <p className="text-dark/60 text-sm leading-relaxed">{minder}</p>
                </div>
            </div>
        </div>
    </section>
);

const Tools = () => {
    return (
        <div className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary">
            <Helmet>
                <title>Make.com, n8n &amp; Claude Code | AI Automatisering Tools | Inovisionn</title>
                <meta name="description" content="Ontdek hoe Inovisionn Make.com, n8n en Claude Code inzet voor AI-automatisering van bedrijfsprocessen. Van workflow-automatisering tot maatwerk AI-agents voor mkb-bedrijven in Nederland." />
                <link rel="canonical" href="https://www.inovisionn.com/tools" />
            </Helmet>

            <div className="sr-only">
                <p>Inovisionn gebruikt Make.com, n8n en Claude Code als primaire tools voor AI-automatisering. Make.com verzorgt visuele workflow-koppelingen, n8n biedt flexibele zelfgehoste automatisering, en Claude Code maakt maatwerk applicaties en agentic workflows mogelijk. De juiste tool wordt gekozen op basis van complexiteit, dataprivacy en budget.</p>
            </div>

            <Navbar />

            {/* Hero */}
            <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-16 bg-primary text-white">
                <div className="max-w-5xl mx-auto">
                    <p className="text-accent font-medium text-xs mb-4 uppercase tracking-widest">De technische stack</p>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                        De tools achter<br />
                        <span className="font-drama italic text-accent">de automatisering.</span>
                    </h1>
                    <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                        Elke automatisering die ik bouw, draait op een van deze drie platforms: Make.com, n8n of Claude Code. Welke tool ik inzet hangt af van de complexiteit van wat er geautomatiseerd moet worden. Ik kies altijd de oplossing die het beste resultaat geeft tegen de laagst mogelijke kosten.
                    </p>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl mt-4">
                        Op deze pagina leg ik uit wat elke tool doet, wanneer ik welke inzet en waarom deze combinatie werkt voor mkb-bedrijven in Nederland.
                    </p>
                </div>
            </section>

            {/* Make.com */}
            <ToolSection
                icon={Zap}
                name="Make.com"
                bg="bg-background"
                intro={[
                    "Stel je voor dat al je systemen met elkaar kunnen praten. Je CRM weet automatisch wanneer er een nieuwe bestelling binnenkomt. Je boekhouding wordt bijgewerkt zodra een factuur betaald is. Een nieuw contactformulier leidt direct tot een taak in je projecttool. Dat is wat Make.com doet.",
                    "Make.com is een visueel platform waarmee ik koppelingen bouw tussen de systemen die jij al gebruikt. Zonder code, zonder technische kennis aan jouw kant. Je ziet het resultaat, de rest gebeurt automatisch."
                ]}
                goed="Make.com is ideaal voor het verbinden van bekende tools zoals HubSpot, Exact, Gmail, Shopify, Google Sheets en honderden andere applicaties. Het platform werkt visueel, waardoor ik snel kan bouwen en jij altijd kunt zien hoe een workflow in elkaar zit."
                wanneer="Ik zet Make.com in als de kern van een automatisering. Het is mijn eerste keuze voor de meeste projecten, omdat het snel werkt, stabiel is en aansluit op bijna elke tool die een mkb-bedrijf gebruikt."
                minder="Make.com werkt via de cloud, wat betekent dat data door de servers van Make.com gaat. Voor de meeste bedrijven is dat geen probleem. Maar voor sectoren waar privacy extra zwaar weegt, zoals zorg of juridische dienstverlening, kan dat een reden zijn om een andere keuze te maken."
            />

            {/* n8n */}
            <ToolSection
                icon={GitBranch}
                name="n8n"
                bg="bg-white"
                intro={[
                    "n8n doet in de basis hetzelfde als Make.com: het verbindt systemen en automatiseert processen. Maar n8n is open-source en kan op een eigen server gehost worden. Dat betekent dat alle data intern blijft, op jouw server, in jouw beheer.",
                    "Daarnaast biedt n8n meer ruimte voor complexe logica. Denk aan workflows met veel vertakkingen, specifieke rekenregels of koppelingen met systemen die geen standaard integratie hebben."
                ]}
                goed="n8n is de betere keuze als dataprivacy een vereiste is, als de workflow technisch complex is of als het volume zo hoog is dat de kosten van Make.com te hoog oplopen. n8n heeft geen limieten op het aantal keren dat een workflow draait per maand."
                wanneer="Ik kies voor n8n als een klant in een privacygevoelige sector werkt, als er maatwerk code nodig is in de workflow of als er koppelingen gelegd moeten worden met interne systemen die niet standaard ondersteund worden."
                minder="n8n vereist iets meer technische kennis om op te zetten en te onderhouden. Voor eenvoudige koppelingen tussen veelgebruikte tools is Make.com vaak sneller en eenvoudiger."
            />

            {/* Claude Code */}
            <ToolSection
                icon={Brain}
                name="Claude Code"
                bg="bg-background"
                intro={[
                    "Make.com en n8n zijn krachtige tools, maar ze volgen regels. Ze verplaatsen data van A naar B op basis van vaste instructies. Claude Code gaat een stap verder.",
                    "Met Claude Code bouw ik oplossingen die verder gaan dan automatisering alleen. Denk aan volledige dashboards, applicaties, websites en echte agentic workflows waarbij AI zelfstandig taken oppakt, beslissingen neemt en acties uitvoert zonder dat daar een vaste workflow voor geprogrammeerd hoeft te zijn. Het is verreweg de meest uitgebreide en krachtige manier van werken, maar ook de meest complexe.",
                    "Claude gebruik ik daarnaast als AI-model binnen Make.com en n8n. Dus ook in eenvoudigere workflows is Claude aanwezig als het brein achter de beslissingen: het leest tekst, begrijpt context en genereert de juiste output. Denk aan het automatisch beantwoorden van klantvragen, het samenvatten van documenten of het schrijven van rapportteksten."
                ]}
                goed="Claude Code is de juiste keuze als een project verder gaat dan het koppelen van bestaande systemen. Als je een eigen applicatie wilt, een intern dashboard, een op maat gemaakte tool of een AI-agent die volledig zelfstandig werkt, dan is Claude Code het platform waarmee dat mogelijk wordt."
                wanneer="Ik kies voor Claude Code als de gewenste oplossing niet past binnen de mogelijkheden van Make.com of n8n, of als een klant iets wil bouwen dat echt uniek is en volledig aansluit op zijn eigen processen en wensen."
                minder="Claude Code is complexer om te bouwen en te onderhouden. Voor standaard koppelingen tussen bestaande tools is Make.com of n8n sneller, goedkoper en eenvoudiger. Claude Code zet ik in als de situatie er echt om vraagt."
            />

            {/* Hoe de drie samenwerken */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-primary text-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight leading-tight">Hoe de drie samenwerken.</h2>
                    <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mb-12">
                        De kracht zit in de combinatie. Make.com of n8n fungeert als het zenuwstelsel: het verbindt systemen, triggert processen en verplaatst data. Claude fungeert als het brein binnen die workflows: het begrijpt context, neemt beslissingen en genereert inhoud. En als een oplossing verder gaat dan wat Make.com of n8n aankan, bouw ik met Claude Code een volledig maatwerk applicatie, dashboard of agentic workflow die zelfstandig werkt.
                    </p>
                    <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-3xl mb-12">
                        Vanuit Roermond help ik mkb-bedrijven door heel Nederland met deze combinatie van tools, altijd afgestemd op wat jouw situatie vraagt.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Voorbeeld 1 */}
                        <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8">
                            <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-5">Voorbeeld: automatische klantenservice</p>
                            <div className="flex flex-col gap-3">
                                {[
                                    "Klantvraag binnenkomt via e-mail of chat",
                                    "Make.com detecteert het bericht en start de workflow",
                                    "Claude leest de vraag en categoriseert deze als klacht, orderinfo of algemene vraag",
                                    "Make.com haalt ordergegevens op uit de webshop backend",
                                    "Claude schrijft een gepersonaliseerd antwoord op basis van de data",
                                    "Antwoord wordt verstuurd en in het CRM geregistreerd",
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="font-data text-accent text-xs bg-accent/20 px-2 py-1 rounded-full shrink-0 mt-0.5">_{String(i + 1).padStart(2, '0')}</span>
                                        <p className="text-white/80 text-sm leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Voorbeeld 2 */}
                        <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8">
                            <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-5">Voorbeeld: maatwerk rapportage dashboard</p>
                            <div className="flex flex-col gap-3">
                                {[
                                    "Meerdere advertentiekanalen genereren dagelijks data",
                                    "n8n haalt alle data op en voegt deze samen",
                                    "Claude analyseert de resultaten en schrijft conclusies en aanbevelingen",
                                    "Claude Code genereert een overzichtelijk dashboard dat altijd up-to-date is",
                                    "De ondernemer opent elke ochtend één scherm met alles wat hij nodig heeft",
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="font-data text-accent text-xs bg-accent/20 px-2 py-1 rounded-full shrink-0 mt-0.5">_{String(i + 1).padStart(2, '0')}</span>
                                        <p className="text-white/80 text-sm leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-background">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 tracking-tight">Veelgestelde vragen.</h2>
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-dark/5 px-6 md:px-10 divide-y divide-dark/5">
                        <FaqItem
                            question="Heb ik technische kennis nodig om met AI automatisering te werken?"
                            answer={[
                                "Nee, helemaal niet. De automatiseringen die ik bouw werken volledig op de achtergrond. Jij merkt er niets van, behalve het resultaat. Een rapport dat elke maandagochtend in je inbox staat. Een klantvraag die automatisch beantwoord wordt. Een CRM dat zichzelf bijwerkt zodra er een nieuwe lead binnenkomt.",
                                "Je hoeft geen nieuwe software te leren, geen instellingen aan te passen en geen technische handelingen te verrichten. De automatisering werkt onzichtbaar, terwijl jij je richt op je werk."
                            ]}
                        />
                        <FaqItem
                            question="Kan ik zelf AI automatisering bouwen?"
                            answer={[
                                "Technisch gezien wel. Make.com en n8n zijn beschikbaar voor iedereen met een gratis account, en er zijn veel tutorials te vinden online. Maar in de praktijk merken de meeste ondernemers dat het bouwen van een goede automatisering meer vraagt dan het volgen van een stappenplan.",
                                "De combinatie van Make.com of n8n met een AI-model zoals Claude, of het bouwen van een maatwerk applicatie met Claude Code, vereist kennis van alle platformen én een goed begrip van hoe automatisering werkt in de context van jouw specifieke processen. Wat werkt voor het ene bedrijf, werkt niet per se voor het andere. Dat maatwerk is precies wat ik lever, vanuit Roermond voor mkb-bedrijven door heel Nederland."
                            ]}
                        />
                        <FaqItem
                            question="Wat is het verschil tussen Make.com en n8n?"
                            answer={[
                                "Beide platforms automatiseren processen en koppelen systemen aan elkaar, maar ze hebben elk hun eigen sterktes.",
                                "Make.com is visueel, gebruiksvriendelijk en werkt volledig in de cloud. Het is ideaal voor bedrijven die snel willen starten en werken met veelgebruikte tools zoals HubSpot, Exact, Gmail of Shopify. n8n is open-source en kan op een eigen server gehost worden. Dat betekent dat alle data intern blijft, wat belangrijk is voor bedrijven in privacygevoelige sectoren zoals zorg, finance of juridische dienstverlening. Daarnaast heeft n8n geen limieten op het aantal keren dat een workflow per maand draait, wat bij hoge volumes voordeliger is.",
                                "In de praktijk kies ik het platform op basis van jouw situatie, jouw data en jouw budget. Soms gebruik ik beide binnen één oplossing. En als een oplossing verder gaat dan wat beide platforms aankunnen, schakel ik over naar Claude Code."
                            ]}
                        />
                        <FaqItem
                            question="Wat is het verschil tussen een gewone automatisering en Claude Code?"
                            answer={[
                                "Een gewone automatisering via Make.com of n8n volgt vaste regels: als dit gebeurt, doe dan dat. Dat is krachtig voor de meeste processen. Maar soms wil je meer. Een eigen applicatie, een intern dashboard, een AI-agent die zelfstandig taken oppakt en beslissingen neemt zonder dat daar een vaste workflow voor geprogrammeerd is.",
                                "Dat is waar Claude Code om de hoek komt. Met Claude Code bouw ik oplossingen die volledig op maat zijn en verder gaan dan wat standaard automatiseringsplatforms bieden. Het is de meest uitgebreide aanpak, maar ook de meest complexe. Ik zet het in als de situatie er echt om vraagt."
                            ]}
                        />
                        <FaqItem
                            question="Werkt AI automatisering ook voor kleine bedrijven?"
                            answer={[
                                "Ja, en juist voor kleine bedrijven kan het een groot verschil maken. Bij grote bedrijven zijn er vaak meerdere medewerkers die taken verdelen. Bij een klein bedrijf of eenmanszaak doe jij alles zelf. Dat betekent dat terugkerend handmatig werk direct ten koste gaat van de tijd die je aan je klanten, je groei of je werk zelf kunt besteden.",
                                "Een eenvoudige automatisering kan al een paar uur per week schelen. Bij meerdere geautomatiseerde processen loopt dat snel op. Ik werk voor mkb-bedrijven in Nederland van alle groottes, van zelfstandige ondernemers in de regio Roermond tot bedrijven met tientallen medewerkers door heel het land."
                            ]}
                        />
                        <FaqItem
                            question="Werken deze tools met mijn huidige software?"
                            answer={[
                                "In de meeste gevallen wel. Make.com integreert met meer dan 2.000 applicaties. n8n met honderden. Denk aan veelgebruikte tools zoals HubSpot, Pipedrive, Exact, Snelstart, Moneybird, Gmail, Outlook, Slack, Shopify, WooCommerce, Google Sheets en Notion.",
                                "Gebruik je software die minder bekend is of een eigen systeem? Ook dan zijn er vaak mogelijkheden via een API-koppeling. En voor systemen die helemaal geen koppeling ondersteunen, kan Claude Code een maatwerk oplossing bieden. In een kennismakingsgesprek breng ik snel in kaart wat er mogelijk is voor jouw specifieke situatie."
                            ]}
                        />
                        <FaqItem
                            question="Wat zijn de kosten van Make.com, n8n en Claude?"
                            answer={[
                                "Make.com heeft een gratis versie en betaalde plannen vanaf circa 9 euro per maand. De kosten nemen toe naarmate een workflow vaker draait of er meer systemen gekoppeld zijn. n8n heeft betaalde plannen vanaf 24 euro per maand. Wil je n8n zelf hosten op een eigen server, dan betaal je alleen voor de server zelf, wat bij de meeste hostingproviders een paar euro per maand kost. Claude van Anthropic werkt op basis van gebruik: je betaalt per verwerkt stuk tekst, ook wel tokens genoemd. Bij normaal gebruik zijn deze kosten laag.",
                                "In de meeste gevallen zijn de maandelijkse toolkosten marginaal ten opzichte van de tijdsbesparing die de automatisering oplevert. Tijdens een kennismakingsgesprek geef ik een eerlijke inschatting van zowel de bouwkosten als de verwachte maandelijkse toolkosten voor jouw specifieke situatie."
                            ]}
                        />
                        <FaqItem
                            question="Is mijn data veilig bij het gebruik van AI automatisering?"
                            answer={[
                                "Veiligheid en privacy zijn een belangrijk onderdeel van elke automatisering die ik bouw. Make.com en Claude verwerken data via beveiligde API-verbindingen. Beide platforms voldoen aan de gangbare beveiligingsstandaarden.",
                                "Voor bedrijven waarbij data absoluut niet buiten de eigen omgeving mag komen, bied ik een alternatieve oplossing: n8n zelfgehost op een eigen server, in combinatie met een lokaal of privé AI-model. Zo blijft alle data binnen jouw eigen infrastructuur en heb je volledige controle.",
                                "Werk je in een sector met strenge privacyregels, zoals zorg, juridische dienstverlening of finance? Dan bespreek ik in het kennismakingsgesprek altijd welke aanpak het beste past binnen jouw GDPR-vereisten."
                            ]}
                        />
                        <FaqItem
                            question="Hoe lang duurt het voordat een automatisering live is?"
                            answer={[
                                "Dat hangt af van de complexiteit. Een eenvoudige workflow, zoals het automatisch doorsturen van leads naar je CRM of het versturen van een wekelijks rapport, kan binnen een week live zijn. Een uitgebreidere oplossing zoals een volledige klantenservice bot of een rapportagesysteem dat meerdere kanalen samenvoegt, neemt doorgaans twee weken in beslag. Een maatwerk applicatie of dashboard gebouwd met Claude Code kan langer duren, afhankelijk van de omvang.",
                                "Ik werk altijd met een duidelijke afbakening vooraf, zodat je weet wat je kunt verwachten en wanneer. Na oplevering test je het in de praktijk. Loopt er iets niet zoals verwacht? Dan pas ik het direct aan."
                            ]}
                        />
                        <FaqItem
                            question="Hoe automatiseer ik mijn bedrijfsprocessen met AI?"
                            answer={[
                                "De eerste stap is inzicht. Veel ondernemers weten dat ze tijd verliezen aan terugkerend handwerk, maar hebben nog nooit precies in kaart gebracht waar dat precies zit. Dat is waar we beginnen.",
                                "In een kennismakingsgesprek kijk ik samen met jou naar je dagelijkse werkzaamheden. Welke taken komen steeds terug? Waar gaat de meeste tijd naartoe? Waar zit de frustratie? Vaak zie ik binnen een half uur meerdere processen die direct in aanmerking komen voor automatisering.",
                                "Daarna bepaal ik welke tool of combinatie het meest geschikt is, of dat nu Make.com, n8n of Claude Code is, en bouw ik de workflow op maat. Geen onnodige complexiteit, geen nieuwe software om te leren. De automatisering werkt op de achtergrond, terwijl jij je richt op wat écht telt.",
                                "Plan een gratis kennismakingsgesprek in om te beginnen."
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 px-6 md:px-16 bg-white text-center">
                <div className="max-w-2xl mx-auto">
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
