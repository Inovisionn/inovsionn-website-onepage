import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import json
import csv
from io import StringIO
import argparse
from google import genai
from google.genai import types
import requests

# Zorg ervoor dat deze API keys in je Github Repository Secrets staan!
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")

# Gmail inloggegevens voor het versturen
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
GMAIL_EMAIL = os.environ.get("GMAIL_EMAIL")
GMAIL_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD") # App password (vereist 2FA)

def search_leads(branche, regio, extra_criteria):
    """
    Gebruikt de Tavily Search API om het internet te doorzoeken op relevante leads.
    """
    print(f"🕵️‍♂️ Zoeken naar: {branche} in {regio}...")
    
    query = f"Bedrijven in de {branche} gevestigd in {regio}. {extra_criteria}"
    url = "https://api.tavily.com/search"
    
    payload = {
        "api_key": TAVILY_API_KEY,
        "query": query,
        "search_depth": "advanced",
        "include_answer": False,
        "include_images": False,
        "include_raw_content": False,
        "max_results": 40
    }
    
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        results = response.json().get("results", [])
        print(f"✅ {len(results)} zoekresultaten gevonden.")
        
        # Voeg de tekst/content van de zoekresultaten samen zodat Gemini dit kan analyseren
        search_context = ""
        for i, res in enumerate(results):
            search_context += f"\n\n--- Resultaat {i+1} ---\nTitel: {res.get('title')}\nURL: {res.get('url')}\nInhoud: {res.get('content')}"
            
        return search_context
    else:
        print(f"❌ Fout bij zoeken: {response.text}")
        return ""

def process_leads_with_gemini(search_context, branche, regio, extra_criteria):
    """
    Gebruikt de Google Gemini API om de ongestructureerde zoekresultaten 
    te filteren en te formatteren in een strakke JSON lead lijst.
    """
    print("🧠 Gemini analyseert de data...")
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    prompt = f"""
    Jij bent een analytische B2B Lead Generation Agent.
    Ik heb een internetzoekopdracht gedaan naar bedrijven in de {branche} in {regio} met deze extra eisen: {extra_criteria}.
    
    Hier is de ruwe data van het internet:
    {search_context}
    
    Taak:
    1. Filter de ruwe data en extraheer EXACT 10 kloppende B2B leads. Negeer verzamelsites, startpagina's en vacaturesites.
    2. Format deze leads STRIKT als een correcte JSON array van objecten, zonder enige markdown formatteringsblokken (dus geen ```json aan het begin en einde).
    3. Elk JSON object MOET exact de volgende sleutels hebben.
    
    BELANGRIJKE EIS VOOR 100% KWALITEIT: Elk veld MOET concrete, kloppende data bevatten.
    Ligt een lead-detail (zoals "Emailadres", "Telefoonnummer", "LinkedIn") niet expliciet en 100% helder in de tekst besloten? Dan voldoet deze lead NIET aan de eisen, en moet je deze lead VOLLEDIG NEGEREN en verder zoeken naar een ander bedrijf in de resultaten tot je er 10 hebt waarbij ALLES concreet is ingevuld.
    Gebruik in GEEN ENKEL geval woorden als "Onbekend", "N.v.t.", "-" of snelle aannames als je het niet zeker weet. 
    De data moet foutloos en hyper-compleet zijn voor de B2B koude acquisitie.
    
    Vereiste sleutels in de JSON per lead:
       - "Bedrijfsnaam"
       - "Website URL"
       - "Locatie" (Stad/Regio)
       - "Branche"
       - "Emailadres"
       - "Telefoonnummer"
       - "LinkedIn" (volledige URL of handle van hun bedrijfspagina)
       - "Bedrijfsgrootte" (Bijv. '10-50', maak een professionele data-gedreven schatting als het niet letterlijk is benoemd, NOOIT 'onbekend')
       - "AI-Matching" (1 professionele zin waarin je uitlegt waarom precies dit bedrijf een 100% match is voor de criteria van de gebruiker)
       
    Retourneer ALLEEN de JSON array met EXACT 10 resultaten. Geen tekst voor of na de JSON.
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    
    raw_text = response.text.strip()
    # Fallback cleanup just in case Gemini adds markdown anyway
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
        
    try:
        leads_data = json.loads(raw_text.strip())
        return leads_data
    except Exception as e:
        print(f"❌ Fout bij het parsen van Gemini JSON: {e}")
        return []

def send_gmail_email(to_email, to_name, leads_data):
    """
    Verstuurt de HTML mail met tabel en CSV bijlage via Gmail SMTP.
    """
    print(f"📧 Mail versturen naar {to_email} ({to_name}) via Gmail...")
    
    msg = MIMEMultipart("mixed")
    msg["Subject"] = f"Je AI-gegeneerde Leadlijst voor {to_name} is klaar!"
    msg["From"] = f"Inovisionn Automation <{GMAIL_EMAIL}>"
    msg["To"] = to_email
    msg["X-Priority"] = "3"
    msg["X-Mailer"] = "Inovisionn-Agent-v1"
    
    full_html = f"""
    <html>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <p>Beste {to_name},</p>
          <br>
          <p>Terwijl jij je focus hield op andere zaken, heeft onze AI-agent zojuist je criteria geanalyseerd en de markt gescand.</p>
          <p>De resultaten zijn binnen.</p>
          <p>In de bijlage vind je de gekwalificeerde leads die exact aansluiten op het profiel dat je hebt opgegeven. Om de kwaliteit te waarborgen, heeft de agent niet alleen data verzameld, maar elk bedrijf ook direct gescoord op relevantie.</p>
          
          <p><strong>Wat je in dit bestand vindt:</strong></p>
          <ul style="padding-left: 20px; color: #475569;">
            <li style="margin-bottom: 8px;"><strong>Geverifieerde bedrijfsdata:</strong> Direct inzetbaar.</li>
            <li><strong>AI-Matching:</strong> Waarom deze bedrijven bij jouw criteria passen.</li>
          </ul>
          
          <div style="background-color: #f1f5f9; padding: 15px; border-left: 4px solid #cc5833; margin: 25px 0; font-style: italic;">
            Dit is slechts 1% van de mogelijkheden.<br><br>
            Deze scan is een geïsoleerd proces, uitgevoerd door één enkele agent. Stel je voor wat er gebeurt als we een compleet AI-team integreren in je volledige backoffice, van administratie tot diepe klantanalyse.
          </div>
          
          <p style="font-weight: bold; font-size: 16px; margin-top: 30px;">
            Wil je ontdekken waar jouw grootste tijdwinst ligt?
          </p>
          
          <div style="margin: 30px 0;">
            <a href="https://calendly.com/inovisionn/30min" style="background-color: #cc5833; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Plan een kennismakingsgesprek</a>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">Met innovatieve groet,</p>
            <br>
            <p style="margin: 0; font-weight: bold; color: #cc5833;">Niels Heijman</p>
            <p style="margin: 0; color: #64748b;">Inovisionn</p>
          </div>
        </div>
      </body>
    </html>
    """
    
    msg_body = MIMEMultipart("alternative")
    msg_body.attach(MIMEText("Je e-mail client ondersteunt geen HTML. Bekijk de CSV bijlage voor het rapport.", "plain"))
    msg_body.attach(MIMEText(full_html, "html"))
    msg.attach(msg_body)
    
    # 2. Genereer CSV (Spreadsheet) Bijlage
    if leads_data:
        headers = ["Bedrijfsnaam", "Website URL", "Locatie", "Branche", "Emailadres", "Telefoonnummer", "LinkedIn", "Bedrijfsgrootte", "AI-Matching"]
        csv_file = StringIO()
        writer = csv.DictWriter(csv_file, fieldnames=headers)
        writer.writeheader()
        for lead in leads_data:
            # Fallback for keys just in case
            row_data = {}
            for h in headers:
                row_data[h] = lead.get(h, "Fout: Ontbreekt in AI generatie")
            writer.writerow(row_data)
            
        csv_bytes = csv_file.getvalue().encode('utf-8')
        
        part = MIMEBase("text", "csv", charset="utf-8")
        part.set_payload(csv_bytes)
        encoders.encode_base64(part)
        part.add_header("Content-Disposition", f"attachment; filename=Inovisionn_Leads.csv")
        msg.attach(part)
    
    try:
        print(f"DEBUG: Connecting to {SMTP_SERVER}:{SMTP_PORT}...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.set_debuglevel(1) # Extra logging
        server.starttls()
        print(f"DEBUG: Logging in as {GMAIL_EMAIL}...")
        server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
        print(f"DEBUG: Sending mail to {to_email}...")
        server.sendmail(GMAIL_EMAIL, to_email, msg.as_string())
        server.quit()
        print("✅ E-mail succesvol verzonden!")
    except Exception as e:
        print(f"❌ Fout bij het versturen van de email: {str(e)}")
        import traceback
        traceback.print_exc()

def send_contact_email(naam, email, bedrijfsnaam, vraag):
    # Stuur de mail direct naar de eigenaar in plaats van naar de aanvrager
    to_email = "inovisionn@hotmail.com"
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🚀 Nieuwe Aanvraag: {bedrijfsnaam}"
    msg["From"] = f"Inovisionn Web <{GMAIL_EMAIL}>"
    msg["To"] = to_email
    msg["X-Priority"] = "2"
    
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Nieuw bericht op Inovisionn.com</h2>
        <p>Er is zojuist een nieuw contactformulier ingevuld op de website.</p>
        <hr />
        <p><strong>Naam:</strong> {naam}</p>
        <p><strong>Bedrijf:</strong> {bedrijfsnaam}</p>
        <p><strong>Emailadres:</strong> {email}</p>
        <br>
        <p><strong>Bericht / Vraag:</strong><br/>
        {vraag}
        </p>
      </body>
    </html>
    """
    
    msg.attach(MIMEText(html_body, "html"))
    
    try:
        print(f"DEBUG: Connecting to {SMTP_SERVER}:{SMTP_PORT} for contact mail...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.set_debuglevel(1) # Extra logging
        server.starttls()
        print(f"DEBUG: Logging in as {GMAIL_EMAIL}...")
        server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
        print(f"DEBUG: Sending contact mail to {to_email}...")
        server.sendmail(GMAIL_EMAIL, to_email, msg.as_string())
        server.quit()
        print("✅ Contact e-mail succesvol verzonden naar beheerder!")
    except Exception as e:
        print(f"❌ Fout bij het versturen van de contact email: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Inovisionn Lead Scraper Agent")
    parser.add_argument("--form_type", default="lead_scraper")
    parser.add_argument("--bedrijfsnaam", required=True)
    parser.add_argument("--naam", required=True)
    parser.add_argument("--email", required=True)
    parser.add_argument("--vraag", default="")
    parser.add_argument("--branche", default="")
    parser.add_argument("--regio", default="")
    parser.add_argument("--extra_criteria", default="")
    args = parser.parse_args()
    
    if args.form_type == "contact":
        print(f"Binnenkomend contact verzoek van {args.naam}. Mail naar beheerder sturen.")
        send_contact_email(args.naam, args.email, args.bedrijfsnaam, args.vraag)
    else:
        # 1. Zoek the ruwe data via Tavily
        raw_data = search_leads(args.branche, args.regio, args.extra_criteria)
        
        if raw_data:
            # 2. Verwerk en formatteer met Gemini in JSON
            leads_data = process_leads_with_gemini(raw_data, args.branche, args.regio, args.extra_criteria)
            
            # 3. Verstuur de Gmail e-mail inclusief format en CSV
            if leads_data:
                send_gmail_email(args.email, args.naam, leads_data)
            else:
                print("Geen bruikbare JSON data van Gemini ontvangen.")
        else:
            print("Kan geen rapport genereren zonder internet data.")
