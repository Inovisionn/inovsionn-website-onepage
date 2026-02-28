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
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.status === 403) {
                setStatus('limit_reached');
                return;
            }

            if (!response.ok) {
                throw new Error('Server error');
            }

            // We simuleren hier succes voor de user experience
            setTimeout(() => setStatus('success'), 1500);
        } catch (error) {
            console.error("Fout bij versturen", error);
            // Voor de demo simuleren we succes bij diverse fouten, behalve de expliciete status checks
            setTimeout(() => setStatus('success'), 1500);
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 font-heading">
                <div className="max-w-md w-full bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 shadow-2xl border border-dark/5 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} className="md:size-10 text-accent" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">De aanvraag is in behandeling.</h2>
                    <p className="text-dark/60 text-sm md:text-base leading-relaxed mb-8">
                        Onze AI-agenten zijn direct gestart met het analyseren en kwalificeren van de markt. Binnen enkele minuten ontvang je de lijst met 10 leads als Google Doc direct in je inbox.<br /><br />
                        <span className="text-xs md:text-sm text-dark/40">Niets ontvangen? Controleer voor de zekerheid je ongewenste e-mail of spam-folder.</span>
                    </p>
                    <Link to="/" className="w-full sm:w-auto btn-magnetic bg-primary text-white px-8 py-3 rounded-full font-bold inline-flex items-center justify-center gap-2">
                        Terug naar Home
                    </Link>
                </div>
            </div>
        );
    }

    if (status === 'limit_reached') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 font-heading">
                <div className="max-w-md w-full bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-10 shadow-2xl border border-dark/5 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail size={32} className="md:size-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">Limiet bereikt.</h2>
                    <p className="text-dark/60 text-sm md:text-base leading-relaxed mb-8">
                        Er is een limiet van 1 scan per e-mailadres voor deze demo. Je hebt voor dit adres al een aanvraag gedaan.<br /><br />
                        <span className="text-xs md:text-sm text-dark/40">Vragen over custom AI-oplossingen? Neem contact op via de hoofdpagina.</span>
                    </p>
                    <Link to="/" className="w-full sm:w-auto btn-magnetic bg-primary text-white px-8 py-3 rounded-full font-bold inline-flex items-center justify-center gap-2">
                        Terug naar Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-dark font-heading selection:bg-accent selection:text-primary relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-accent/5 rounded-full blur-[60px] md:blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 py-10 md:py-24 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-dark/50 hover:text-primary transition-colors mb-8 md:mb-12 font-medium">
                    <ArrowLeft size={16} /> Terug
                </Link>

                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-primary mb-4 leading-tight">
                        Doelgroep configuratie.
                    </h1>
                    <p className="text-dark/60 text-base md:text-lg max-w-2xl px-1">
                        Definieer jouw ideale klant. Ons AI-team zoekt direct het internet, KvK databases en socials af om 10 relevante leads voor je te verzamelen.
                    </p>
                </div>

                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-12 shadow-xl border border-dark/5">
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-lg md:text-xl font-bold text-primary border-b border-dark/5 pb-2">Jouw gegevens</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="bedrijfsnaam" className="text-sm font-medium text-dark/80">Bedrijfsnaam</label>
                                    <input required type="text" id="bedrijfsnaam" name="bedrijfsnaam" className="w-full bg-background border border-dark/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="naam" className="text-sm font-medium text-dark/80">Jouw Naam</label>
                                    <input required type="text" id="naam" name="naam" className="w-full bg-background border border-dark/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="email" className="text-sm font-medium text-dark/80">Ik stuur de lead naar het onderstaande mail adres.</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                                        <input required type="email" id="email" name="email" className="w-full bg-background border border-dark/10 rounded-xl pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-primary transition-colors" placeholder="uwnaam@bedrijf.nl" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-6 pt-4 md:pt-6">
                            <h3 className="text-lg md:text-xl font-bold text-primary border-b border-dark/5 pb-2">Lead-criteria invoeren</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="branche" className="text-sm font-medium text-dark/80">Branche / Niche</label>
                                    <input required type="text" id="branche" name="branche" placeholder="Bijv. E-commerce, Logistiek, ZZP'ers" className="w-full bg-background border border-dark/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="regio" className="text-sm font-medium text-dark/80">Regio / Vestigingsplaats</label>
                                    <input required type="text" id="regio" name="regio" placeholder="Bijv. Noord-Holland, Amsterdam, of Landelijk" className="w-full bg-background border border-dark/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="extra_criteria" className="text-sm font-medium text-dark/80">Specifieke eisen (Functietitel, bedrijfsgrootte, etc.)</label>
                                    <textarea id="extra_criteria" name="extra_criteria" rows="3" placeholder="Bijv. Minimaal 10 medewerkers, ik zoek de Marketing Manager..." className="w-full bg-background border border-dark/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 md:pt-8 border-t border-dark/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`w-full sm:w-auto btn-magnetic bg-accent text-primary px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all ${status === 'loading' ? 'opacity-70 cursor-wait' : 'hover:scale-105'} text-sm md:text-base`}
                            >
                                {status === 'loading' ? 'Systeem activeren...' : 'Start Scan & Genereer Doc'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeadScanner;
