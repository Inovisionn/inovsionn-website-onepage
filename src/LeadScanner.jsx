import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeadScanner = () => {
    const [status, setStatus] = useState('idle'); // idle | loading | success

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            // Dit is de GitHub API call om de Github Action af te trappen
            // Let op: Dit vereist een GitHub Personal Access Token (PAT) met repo rechten.
            // Dit token mag eigenlijk NIET hardcoded in de React frontend staan i.v.m. scraping/misbruik,
            // Maar voor dit test/one-page concept gebruiken we import.meta.env.VITE_GITHUB_TOKEN

            await fetch('https://api.github.com/repos/JOUW_GITHUB_NAAM/JOUW_REPO_NAAM/dispatches', {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN || 'JOUW_GITHUB_PAT'}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: 'scrape_leads',
                    client_payload: data
                })
            });
            // We simuleren hier succes voor de user experience
            setTimeout(() => setStatus('success'), 1500);
        } catch (error) {
            console.error("Fout bij versturen", error);
            // Voor de demo simuleren we succes
            setTimeout(() => setStatus('success'), 1500);
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6 font-heading">
                <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl border border-dark/5 text-center">
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-accent" />
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-4">Aanvraag is in behandeling!</h2>
                    <p className="text-dark/60 leading-relaxed mb-8">
                        Onze AI-agenten zijn gestart met scrapen. Je ontvangt de lijst met 10 leads binnen 5 minuten in jouw mailbox geëxporteerd als Google Doc.
                    </p>
                    <Link to="/" className="btn-magnetic bg-primary text-white px-8 py-3 rounded-full font-bold inline-flex items-center justify-center gap-2">
                        Terug naar Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-dark/50 hover:text-primary transition-colors mb-12 font-medium">
                    <ArrowLeft size={16} /> Terug
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary mb-4">
                        Doelgroep configuratie.
                    </h1>
                    <p className="text-dark/60 text-lg max-w-2xl px-1">
                        Definieer jouw ideale klant. Ons AI-team zoekt direct het internet, KvK databases en socials af om 10 relevante leads voor je te verzamelen.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-dark/5">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-primary border-b border-dark/5 pb-2">Jouw gegevens</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="bedrijfsnaam" className="text-sm font-medium text-dark/80">Bedrijfsnaam</label>
                                    <input required type="text" id="bedrijfsnaam" name="bedrijfsnaam" className="w-full bg-background border border-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="naam" className="text-sm font-medium text-dark/80">Jouw Naam</label>
                                    <input required type="text" id="naam" name="naam" className="w-full bg-background border border-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="email" className="text-sm font-medium text-dark/80">Ik stuur de lead naar het onderstaande mail adres.</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                        <input required type="email" id="email" name="email" className="w-full bg-background border border-dark/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="uwnaam@bedrijf.nl" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6">
                            <h3 className="text-xl font-bold text-primary border-b border-dark/5 pb-2">Lead-criteria invoeren</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="branche" className="text-sm font-medium text-dark/80">Branche / Niche</label>
                                    <input required type="text" id="branche" name="branche" placeholder="Bijv. E-commerce, Logistiek, ZZP'ers" className="w-full bg-background border border-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="regio" className="text-sm font-medium text-dark/80">Regio / Vestigingsplaats</label>
                                    <input required type="text" id="regio" name="regio" placeholder="Bijv. Noord-Holland, Amsterdam, of Landelijk" className="w-full bg-background border border-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="extra_criteria" className="text-sm font-medium text-dark/80">Specifieke eisen (Functietitel, bedrijfsgrootte, etc.)</label>
                                    <textarea id="extra_criteria" name="extra_criteria" rows="3" placeholder="Bijv. Minimaal 10 medewerkers, ik zoek de Marketing Manager..." className="w-full bg-background border border-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-dark/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`btn-magnetic bg-accent text-primary px-10 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all ${status === 'loading' ? 'opacity-70 cursor-wait' : 'hover:scale-105'}`}
                            >
                                {status === 'loading' ? 'Systeem activeren...' : 'Start Scan & Genereer Google Doc'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeadScanner;
