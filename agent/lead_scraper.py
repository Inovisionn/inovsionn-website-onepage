import os
import smtplib
import json
import argparse
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import urlparse
import anthropic
from google import genai as google_genai

# API Keys
TAVILY_API_KEY   = os.environ.get("TAVILY_API_KEY")
HUNTER_API_KEY   = os.environ.get("HUNTER_API_KEY")
SNOV_USER_ID     = os.environ.get("SNOV_API_USER_ID")
SNOV_SECRET      = os.environ.get("SNOV_API_SERCET")
PROSPEO_API_KEY  = os.environ.get("PROSPEO_API_KEY")
APOLLO_API_KEY   = os.environ.get("APOLLO_API_KEY")
CLAUDE_API_KEY   = os.environ.get("CLAUDE_API_KEY")
GEMINI_API_KEY   = os.environ.get("GEMINI_API_KEY")
OVERHEID_API_KEY = os.environ.get("OVERHEID_API_KEY")
SERP_API_KEY     = os.environ.get("SERP_API_KEY")
APIFY_API_KEY    = os.environ.get("APIFY_API_KEY")

# Gmail (verstuurt als "Inovisionn")
SMTP_SERVER      = "smtp.gmail.com"
SMTP_PORT        = 587
GMAIL_EMAIL      = os.environ.get("GMAIL_EMAIL")
GMAIL_PASSWORD   = os.environ.get("GMAIL_APP_PASSWORD")
SENDER_NAME      = "Inovisionn"


# ─── HULPFUNCTIES ─────────────────────────────────────────────────────────────

def extract_domain(url):
    try:
        parsed = urlparse(url if url.startswith("http") else "https://" + url)
        domain = parsed.netloc or parsed.path
        return domain.replace("www.", "").split("/")[0].strip()
    except Exception:
        return None


# ─── BRON 1: Overheid.io — Officiële KvK bedrijven ───────────────────────────

def search_companies_overheid(branche, regio):
    print(f"🏛️  Overheid.io: zoeken naar '{branche}' in '{regio}'...")
    headers = {"ovio-api-key": OVERHEID_API_KEY}
    params = {"q": f"{branche} {regio}", "size": 20}
    try:
        r = requests.get("https://api.overheid.io/openkvk", headers=headers, params=params, timeout=10)
        if r.status_code == 200:
            items = r.json().get("_embedded", {}).get("bedrijf", [])
            print(f"✅ {len(items)} bedrijven via Overheid.io.")
            return [{"handelsnaam": i.get("handelsnaam", ""), "kvk": i.get("dossiernummer", "")} for i in items if i.get("handelsnaam")]
    except Exception as e:
        print(f"⚠️  Overheid.io fout: {e}")
    return []


# ─── BRON 2: SerpAPI Google Maps — Lokale bedrijven met telefoon ──────────────

def search_companies_googlemaps(branche, regio):
    print(f"🗺️  Google Maps: zoeken naar '{branche}' in '{regio}'...")
    params = {
        "engine": "google_maps",
        "q": f"{branche} {regio}",
        "type": "search",
        "api_key": SERP_API_KEY,
        "hl": "nl",
        "gl": "nl"
    }
    try:
        r = requests.get("https://serpapi.com/search.json", params=params, timeout=15)
        if r.status_code == 200:
            results = r.json().get("local_results", [])
            print(f"✅ {len(results)} bedrijven via Google Maps.")
            companies = []
            for res in results:
                companies.append({
                    "handelsnaam": res.get("title", ""),
                    "website": res.get("website", ""),
                    "telefoonnummer": res.get("phone", ""),
                    "locatie": res.get("address", regio),
                    "kvk": ""
                })
            return companies
    except Exception as e:
        print(f"⚠️  Google Maps fout: {e}")
    return []


# ─── VERRIJKING: Tavily — Website + LinkedIn URL ──────────────────────────────

def enrich_company_with_tavily(bedrijfsnaam, regio):
    query = f'"{bedrijfsnaam}" {regio} site:linkedin.com/company OR website contact'
    payload = {
        "api_key": TAVILY_API_KEY,
        "query": query,
        "search_depth": "basic",
        "max_results": 5,
        "include_raw_content": False
    }
    try:
        r = requests.post("https://api.tavily.com/search", json=payload, timeout=10)
        if r.status_code == 200:
            results = r.json().get("results", [])
            website, linkedin = None, None
            for res in results:
                url = res.get("url", "")
                if "linkedin.com/company" in url and not linkedin:
                    linkedin = url
                elif not website and "linkedin.com" not in url:
                    website = url
            return website, linkedin
    except Exception as e:
        print(f"  ⚠️ Tavily fout: {e}")
    return None, None


def bulk_tavily_search(branche, regio, extra_criteria):
    """Fallback als beide primaire bronnen leeg zijn."""
    print(f"🔍 Tavily fallback: '{branche}' in '{regio}'...")
    all_results, seen = [], set()
    for query in [
        f"{branche} bedrijf {regio} {extra_criteria} contact",
        f'site:linkedin.com/company "{branche}" {regio}'
    ]:
        payload = {"api_key": TAVILY_API_KEY, "query": query, "search_depth": "advanced", "max_results": 15}
        try:
            r = requests.post("https://api.tavily.com/search", json=payload, timeout=10)
            if r.status_code == 200:
                for res in r.json().get("results", []):
                    domain = extract_domain(res.get("url", ""))
                    if domain and domain not in seen:
                        seen.add(domain)
                        all_results.append(res)
        except Exception as e:
            print(f"  ⚠️ Tavily fout: {e}")
    print(f"✅ {len(all_results)} resultaten via Tavily fallback.")
    return all_results


# ─── VERRIJKING: Apify — LinkedIn company page scrapen ────────────────────────

def scrape_linkedin_apify(linkedin_url):
    """
    Scrapt een LinkedIn bedrijfspagina via Apify voor telefoon,
    bedrijfsgrootte en beschrijving.
    """
    if not linkedin_url or "linkedin.com/company" not in linkedin_url:
        return {}

    print(f"  🔗 Apify LinkedIn scrape: {linkedin_url}...")
    actor = "curious_coder~linkedin-company-scraper"
    url = f"https://api.apify.com/v2/acts/{actor}/run-sync-get-dataset-items"
    params = {"token": APIFY_API_KEY, "timeout": 60}
    payload = {"startUrls": [{"url": linkedin_url}], "maxResults": 1}

    try:
        r = requests.post(url, json=payload, params=params, timeout=90)
        if r.status_code == 200:
            data = r.json()
            if data and isinstance(data, list) and len(data) > 0:
                item = data[0]
                result = {
                    "telefoonnummer": item.get("phone", "") or item.get("phoneNumber", ""),
                    "bedrijfsgrootte": item.get("employeeCount", "") or item.get("staffCount", ""),
                    "beschrijving": item.get("description", "")[:200] if item.get("description") else "",
                    "website": item.get("website", "")
                }
                print(f"  ✅ Apify: telefoon={result['telefoonnummer']}, grootte={result['bedrijfsgrootte']}")
                return result
    except Exception as e:
        print(f"  ⚠️ Apify fout: {e}")
    return {}


# ─── EMAIL WATERVAL: Hunter → Snov → Prospeo → Apollo ────────────────────────

def get_email_hunter(domain):
    try:
        r = requests.get(
            "https://api.hunter.io/v2/domain-search",
            params={"domain": domain, "api_key": HUNTER_API_KEY, "limit": 1},
            timeout=8
        )
        if r.status_code == 200:
            emails = r.json().get("data", {}).get("emails", [])
            if emails:
                print(f"  ✅ Hunter: {emails[0]['value']}")
                return emails[0]["value"]
    except Exception as e:
        print(f"  ⚠️ Hunter fout: {e}")
    return None


def get_snov_token():
    try:
        r = requests.post("https://api.snov.io/v1/oauth/access_token", data={
            "grant_type": "client_credentials",
            "client_id": SNOV_USER_ID,
            "client_secret": SNOV_SECRET
        }, timeout=8)
        if r.status_code == 200:
            return r.json().get("access_token")
    except Exception:
        pass
    return None


def get_email_snov(domain):
    try:
        token = get_snov_token()
        if not token:
            return None
        r = requests.post(
            "https://api.snov.io/v1/get-emails-from-domain",
            data={"access_token": token, "domain": domain, "limit": 1, "type": "all"},
            timeout=8
        )
        if r.status_code == 200:
            emails = r.json().get("emails", [])
            if emails:
                email = emails[0].get("email")
                print(f"  ✅ Snov.io: {email}")
                return email
    except Exception as e:
        print(f"  ⚠️ Snov.io fout: {e}")
    return None


def get_email_prospeo(domain):
    try:
        r = requests.post(
            "https://api.prospeo.io/domain-search",
            headers={"X-KEY": PROSPEO_API_KEY, "Content-Type": "application/json"},
            json={"company": domain, "limit": 1},
            timeout=8
        )
        if r.status_code == 200:
            emails = r.json().get("response", {}).get("emails", [])
            if emails:
                email = emails[0].get("email")
                print(f"  ✅ Prospeo: {email}")
                return email
    except Exception as e:
        print(f"  ⚠️ Prospeo fout: {e}")
    return None


def get_email_apollo(domain):
    try:
        r = requests.post(
            "https://api.apollo.io/v1/people/match",
            headers={"Content-Type": "application/json", "X-Api-Key": APOLLO_API_KEY},
            json={"domain": domain},
            timeout=8
        )
        if r.status_code == 200:
            person = r.json().get("person")
            if person and person.get("email"):
                email = person["email"]
                print(f"  ✅ Apollo: {email}")
                return email
    except Exception as e:
        print(f"  ⚠️ Apollo fout: {e}")
    return None


def find_email_waterfall(domain):
    print(f"  📧 Email zoeken voor {domain}...")
    return (
        get_email_hunter(domain) or
        get_email_snov(domain) or
        get_email_prospeo(domain) or
        get_email_apollo(domain)
    )


# ─── AI VERWERKING: Claude primair, Gemini als fallback ──────────────────────

AI_PROMPT_TEMPLATE = """Je bent een B2B Lead Generation specialist.

De klant zoekt bedrijven in de branche "{branche}", regio "{regio}", extra wensen: "{extra_criteria}".

Hier zijn de gevonden leads:
{leads_json}

Taak:
1. Verwijder leads zonder emailadres.
2. Verwijder leads die duidelijk niet passen bij de branche of regio.
3. Schrijf voor elke lead een "AI-Matching" veld: 1 professionele zin waarom dit bedrijf een goede match is.
4. Selecteer de beste 10 leads op relevantie.
5. Retourneer ALLEEN een correcte JSON array zonder markdown.

Vereiste velden per lead:
- "Bedrijfsnaam"
- "Website"
- "Locatie"
- "Branche"
- "Emailadres"
- "Telefoonnummer"
- "LinkedIn"
- "Bedrijfsgrootte"
- "AI-Matching"

Retourneer ALLEEN de JSON array, geen tekst ervoor of erna."""


def parse_ai_json(raw_text):
    raw_text = raw_text.strip()
    for marker in ["```json", "```"]:
        if raw_text.startswith(marker):
            raw_text = raw_text[len(marker):]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
    return json.loads(raw_text.strip())


def enrich_with_claude(prompt):
    print("🤖 Claude verwerkt leads...")
    client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    return parse_ai_json(message.content[0].text)


def enrich_with_gemini(prompt):
    print("🧠 Gemini verwerkt leads (fallback)...")
    client = google_genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return parse_ai_json(response.text)


def enrich_leads_with_ai(leads_raw, branche, regio, extra_criteria):
    leads_json = json.dumps(leads_raw, ensure_ascii=False, indent=2)
    prompt = AI_PROMPT_TEMPLATE.format(
        branche=branche, regio=regio,
        extra_criteria=extra_criteria, leads_json=leads_json
    )

    # Probeer Claude eerst
    if CLAUDE_API_KEY:
        try:
            return enrich_with_claude(prompt)
        except Exception as e:
            print(f"⚠️ Claude fout: {e} — overschakelen naar Gemini...")

    # Fallback naar Gemini
    if GEMINI_API_KEY:
        try:
            return enrich_with_gemini(prompt)
        except Exception as e:
            print(f"⚠️ Gemini fout: {e} — geen AI verwerking mogelijk.")

    print("⚠️ Geen AI beschikbaar — ruwe leads worden verstuurd.")
    return leads_raw


# ─── EMAIL: HTML opmaak + versturen ──────────────────────────────────────────

ICON_EMAIL = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>'
ICON_PHONE = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.96 6.96l1.52-1.52a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>'
ICON_WEB  = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'
ICON_LI   = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>'


def build_lead_card(index, lead):
    num = str(index).zfill(2)
    naam     = lead.get("Bedrijfsnaam", "-")
    locatie  = lead.get("Locatie", "")
    match    = lead.get("AI-Matching", "")
    email    = lead.get("Emailadres", "")
    telefoon = lead.get("Telefoonnummer", "")
    website  = lead.get("Website", "")
    linkedin = lead.get("LinkedIn", "")

    tags = ""
    if email:
        tags += f'<a href="mailto:{email}" class="lead-tag blue">{ICON_EMAIL} {email}</a>'
    if telefoon:
        clean_tel = telefoon.replace(" ", "").replace("-", "")
        tags += f'<a href="tel:{clean_tel}" class="lead-tag">{ICON_PHONE} {telefoon}</a>'
    if website:
        domain = website.replace("https://","").replace("http://","").replace("www.","").split("/")[0]
        tags += f'<a href="{website}" class="lead-tag">{ICON_WEB} {domain}</a>'
    if linkedin:
        tags += f'<a href="{linkedin}" class="lead-tag blue">{ICON_LI} LinkedIn</a>'

    return f"""
      <div class="lead-card">
        <div class="lead-number">{num}</div>
        <div class="lead-body">
          <div class="lead-name">{naam}</div>
          {"<div class='lead-location'>📍 " + locatie + "</div>" if locatie else ""}
          {"<div class='lead-match'>" + match + "</div>" if match else ""}
          <div class="lead-contacts">{tags}</div>
        </div>
      </div>"""


def build_email_html(to_name, leads_data):
    lead_cards = "".join(build_lead_card(i + 1, lead) for i, lead in enumerate(leads_data))
    num_leads  = len(leads_data)

    return f"""<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inovisionn – AI Lead Rapport</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ background-color:#0F172A; font-family:'Inter',sans-serif; color:#F1F5F9; -webkit-font-smoothing:antialiased; }}
  .email-wrapper {{ max-width:680px; margin:0 auto; background-color:#1E293B; }}
  .header {{ background:linear-gradient(135deg,#1E293B 0%,#0F172A 60%); padding:48px 48px 36px; border-bottom:1px solid #334155; position:relative; overflow:hidden; }}
  .header::before {{ content:''; position:absolute; top:-60px; right:-60px; width:260px; height:260px; background:radial-gradient(circle,rgba(59,130,246,0.18) 0%,transparent 70%); border-radius:50%; }}
  .logo-row {{ display:flex; align-items:center; gap:12px; margin-bottom:32px; }}
  .logo-icon {{ width:40px; height:40px; background:linear-gradient(135deg,#3B82F6,#1D4ED8); border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:'Sora',sans-serif; font-weight:800; font-size:18px; color:#fff; flex-shrink:0; }}
  .logo-text {{ font-family:'Sora',sans-serif; font-size:20px; font-weight:700; color:#F1F5F9; letter-spacing:-0.3px; }}
  .header-badge {{ display:inline-block; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.35); color:#93C5FD; font-size:11px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; padding:5px 12px; border-radius:20px; margin-bottom:16px; }}
  .header-title {{ font-family:'Sora',sans-serif; font-size:30px; font-weight:800; line-height:1.2; color:#F1F5F9; margin-bottom:10px; letter-spacing:-0.5px; }}
  .header-title span {{ color:#3B82F6; }}
  .header-sub {{ font-size:15px; color:#94A3B8; line-height:1.6; max-width:480px; }}
  .body {{ padding:40px 48px; }}
  .greeting {{ font-size:15px; color:#94A3B8; margin-bottom:20px; line-height:1.7; }}
  .greeting strong {{ color:#F1F5F9; font-weight:600; }}
  .stats-row {{ display:flex; gap:12px; margin-bottom:36px; }}
  .stat-box {{ flex:1; background:#0F172A; border:1px solid #334155; border-radius:12px; padding:18px 16px; text-align:center; }}
  .stat-number {{ font-family:'Sora',sans-serif; font-size:28px; font-weight:800; color:#3B82F6; line-height:1; margin-bottom:6px; }}
  .stat-label {{ font-size:11px; color:#64748B; font-weight:500; letter-spacing:0.3px; text-transform:uppercase; }}
  .section-title {{ font-family:'Sora',sans-serif; font-size:13px; font-weight:700; color:#3B82F6; text-transform:uppercase; letter-spacing:1.4px; margin-bottom:16px; display:flex; align-items:center; gap:8px; }}
  .section-title::after {{ content:''; flex:1; height:1px; background:#1E3A5F; }}
  .leads-list {{ margin-bottom:36px; }}
  .lead-card {{ background:#0F172A; border:1px solid #1E3A5F; border-left:3px solid #3B82F6; border-radius:12px; padding:18px 20px; margin-bottom:10px; display:flex; align-items:flex-start; gap:16px; }}
  .lead-number {{ width:28px; height:28px; background:rgba(59,130,246,0.12); border:1px solid rgba(59,130,246,0.25); border-radius:8px; font-family:'Sora',sans-serif; font-size:12px; font-weight:700; color:#3B82F6; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }}
  .lead-body {{ flex:1; min-width:0; }}
  .lead-name {{ font-family:'Sora',sans-serif; font-size:14px; font-weight:700; color:#F1F5F9; margin-bottom:2px; }}
  .lead-location {{ font-size:11px; color:#64748B; margin-bottom:8px; }}
  .lead-match {{ font-size:12.5px; color:#94A3B8; line-height:1.55; margin-bottom:10px; }}
  .lead-contacts {{ display:flex; flex-wrap:wrap; gap:8px; }}
  .lead-tag {{ display:inline-flex; align-items:center; gap:5px; background:#1E293B; border:1px solid #334155; border-radius:6px; padding:4px 9px; font-size:11px; color:#94A3B8; text-decoration:none; }}
  .lead-tag.blue {{ background:rgba(59,130,246,0.08); border-color:rgba(59,130,246,0.25); color:#93C5FD; }}
  .divider {{ height:1px; background:linear-gradient(90deg,transparent,#334155,transparent); margin:32px 0; }}
  .capabilities-box {{ background:linear-gradient(135deg,rgba(59,130,246,0.08),rgba(59,130,246,0.03)); border:1px solid rgba(59,130,246,0.2); border-radius:16px; padding:28px; margin-bottom:36px; }}
  .cap-title {{ font-family:'Sora',sans-serif; font-size:16px; font-weight:700; color:#F1F5F9; margin-bottom:6px; }}
  .cap-sub {{ font-size:13px; color:#64748B; margin-bottom:20px; }}
  .cap-grid {{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }}
  .cap-item {{ display:flex; align-items:flex-start; gap:10px; background:rgba(15,23,42,0.6); border:1px solid #1E3A5F; border-radius:10px; padding:12px 14px; }}
  .cap-icon {{ font-size:17px; line-height:1; flex-shrink:0; margin-top:1px; }}
  .cap-text strong {{ display:block; font-size:12px; font-weight:600; color:#E2E8F0; margin-bottom:2px; }}
  .cap-text span {{ font-size:11px; color:#64748B; line-height:1.4; }}
  .teaser-box {{ background:#0F172A; border:1px solid #334155; border-radius:14px; padding:24px 28px; margin-bottom:32px; text-align:center; }}
  .teaser-label {{ font-size:11px; font-weight:600; color:#64748B; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:10px; }}
  .teaser-text {{ font-family:'Sora',sans-serif; font-size:18px; font-weight:700; color:#F1F5F9; line-height:1.4; margin-bottom:8px; }}
  .teaser-text span {{ color:#3B82F6; }}
  .teaser-sub {{ font-size:13px; color:#64748B; line-height:1.6; }}
  .cta-section {{ text-align:center; margin-bottom:36px; }}
  .cta-button {{ display:inline-block; background:linear-gradient(135deg,#3B82F6,#2563EB); color:#fff; font-family:'Sora',sans-serif; font-size:15px; font-weight:700; padding:16px 38px; border-radius:12px; text-decoration:none; letter-spacing:0.2px; box-shadow:0 8px 24px rgba(59,130,246,0.3); margin-bottom:12px; }}
  .cta-note {{ font-size:12px; color:#64748B; }}
  .footer {{ background:#0F172A; border-top:1px solid #1E293B; padding:32px 48px; }}
  .sig-name {{ font-family:'Sora',sans-serif; font-size:16px; font-weight:700; color:#F1F5F9; margin-bottom:2px; }}
  .sig-role {{ font-size:13px; color:#3B82F6; font-weight:500; margin-bottom:14px; }}
  .sig-contacts {{ display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }}
  .sig-contact {{ font-size:13px; color:#94A3B8; display:flex; align-items:center; gap:8px; text-decoration:none; }}
  .footer-note {{ font-size:11px; color:#334155; line-height:1.6; border-top:1px solid #1E293B; padding-top:16px; }}
  @media (max-width:600px) {{
    .header,.body,.footer {{ padding-left:24px; padding-right:24px; }}
    .header-title {{ font-size:24px; }}
    .stats-row {{ flex-direction:column; }}
    .cap-grid {{ grid-template-columns:1fr; }}
    .lead-card {{ flex-direction:column; gap:10px; }}
  }}
</style>
</head>
<body>
<div class="email-wrapper">

  <div class="header">
    <div class="logo-row">
      <div class="logo-icon">I</div>
      <div class="logo-text">Inovisionn</div>
    </div>
    <div class="header-badge">🤖 AI-Powered Lead Rapport</div>
    <div class="header-title">Jouw <span>{num_leads} gekwalificeerde</span><br>leads zijn klaar, {to_name}</div>
    <div class="header-sub">Onze AI-agent heeft de markt gescand en geselecteerd op jouw criteria. Dit zijn de bedrijven die direct aansluiten op jouw zoekopdracht.</div>
  </div>

  <div class="body">

    <p class="greeting">Beste <strong>{to_name}</strong>,<br><br>
    Hieronder vind je <strong>{num_leads} direct inzetbare leads</strong> – compleet met contactgegevens, locatie en een AI-gegenereerde match-analyse. Elk bedrijf is geselecteerd op basis van jouw criteria.</p>

    <div class="stats-row">
      <div class="stat-box"><div class="stat-number">{num_leads}</div><div class="stat-label">Gekwalificeerde leads</div></div>
      <div class="stat-box"><div class="stat-number">1%</div><div class="stat-label">Van het totale marktpotentieel</div></div>
      <div class="stat-box"><div class="stat-number">1</div><div class="stat-label">Actieve AI-agent</div></div>
    </div>

    <div class="section-title">Geselecteerde leads</div>
    <div class="leads-list">{lead_cards}</div>

    <div class="divider"></div>

    <div class="section-title">Wat Inovisionn voor jou kan bouwen</div>
    <div class="capabilities-box">
      <div class="cap-title">Dit is slechts het topje van de ijsberg</div>
      <div class="cap-sub">Één agent. Één scan. {num_leads} leads. Stel je voor wat een volledig AI-team doet.</div>
      <div class="cap-grid">
        <div class="cap-item"><div class="cap-icon">🔍</div><div class="cap-text"><strong>Lead Generation Agents</strong><span>Automatisch marktscans uitvoeren op jouw criteria, 24/7</span></div></div>
        <div class="cap-item"><div class="cap-icon">📧</div><div class="cap-text"><strong>Outreach Automatisering</strong><span>Gepersonaliseerde e-mails versturen op schaal zonder handmatig werk</span></div></div>
        <div class="cap-item"><div class="cap-icon">🤖</div><div class="cap-text"><strong>AI Backoffice Integratie</strong><span>Van CRM-updates tot rapportages – volledig geautomatiseerd</span></div></div>
        <div class="cap-item"><div class="cap-icon">📊</div><div class="cap-text"><strong>Dashboards & Rapportages</strong><span>Real-time inzicht in je pijplijn, conversies en marktpositie</span></div></div>
        <div class="cap-item"><div class="cap-icon">💬</div><div class="cap-text"><strong>AI Chatbots & Assistenten</strong><span>Klantenservice, onboarding en sales – deels of volledig geautomatiseerd</span></div></div>
        <div class="cap-item"><div class="cap-icon">⚙️</div><div class="cap-text"><strong>Workflow Automatisering</strong><span>Koppeling van tools (CRM, e-mail, ERP) via slimme AI-pipelines</span></div></div>
      </div>
    </div>

    <div class="teaser-box">
      <div class="teaser-label">💡 Wist je dat</div>
      <div class="teaser-text">Dit rapport is <span>1% van wat mogelijk is</span><br>met een volledig AI-team in jouw backoffice</div>
      <div class="teaser-sub">De bedrijven die vandaag AI integreren, werken morgen 10× sneller dan hun concurrenten. Hoeveel uur verlies jij nog aan repetitieve taken?</div>
    </div>

    <div class="cta-section">
      <a href="https://calendly.com/inovisionn/30min" class="cta-button">📅 Plan een gratis kennismakingsgesprek</a>
      <div class="cta-note">Geen verplichtingen • 30 minuten • Ontdek waar jouw tijdwinst ligt</div>
    </div>

  </div>

  <div class="footer">
    <div class="sig-name">Niels Heijman</div>
    <div class="sig-role">Founder – Inovisionn</div>
    <div class="sig-contacts">
      <a href="tel:+31615088920" class="sig-contact"><span>📞</span> +31 6 150 889 20</a>
      <a href="mailto:inovisionn@hotmail.com" class="sig-contact"><span>✉️</span> inovisionn@hotmail.com</a>
      <a href="https://www.inovisionn.com" class="sig-contact"><span>🌐</span> www.inovisionn.com</a>
      <a href="https://www.linkedin.com/in/niels-heijman/" class="sig-contact"><span>💼</span> linkedin.com/in/niels-heijman</a>
    </div>
    <div class="footer-note">Dit rapport is automatisch gegenereerd door de Inovisionn AI Lead Agent. De contactgegevens zijn verzameld uit publiek beschikbare bronnen.</div>
  </div>

</div>
</body>
</html>"""


def send_lead_email(to_email, to_name, leads_data):
    print(f"\n📨 Mail versturen naar {to_email}...")
    full_html = build_email_html(to_name, leads_data)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"🤖 Jouw {len(leads_data)} AI-gekwalificeerde leads zijn klaar, {to_name}"
    msg["From"] = f"{SENDER_NAME} <{GMAIL_EMAIL}>"
    msg["To"] = to_email
    msg.attach(MIMEText("Je e-mailclient ondersteunt geen HTML.", "plain"))
    msg.attach(MIMEText(full_html, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
        server.sendmail(GMAIL_EMAIL, to_email, msg.as_string())
        server.quit()
        print("✅ E-mail succesvol verzonden!")
    except Exception as e:
        print(f"❌ Fout bij versturen: {e}")


def send_contact_email(naam, email, bedrijfsnaam, vraag):
    html_body = f"""
    <html><body style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
      <h2>Nieuw bericht op Inovisionn.com</h2><hr/>
      <p><strong>Naam:</strong> {naam}</p>
      <p><strong>Bedrijf:</strong> {bedrijfsnaam}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Bericht:</strong><br/>{vraag}</p>
    </body></html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Nieuwe Inovisionn Website Aanvraag: {bedrijfsnaam}"
    msg["From"] = f"Inovisionn Website <{GMAIL_EMAIL}>"
    msg["To"] = "inovisionn@hotmail.com"
    msg.attach(MIMEText(html_body, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
        server.sendmail(GMAIL_EMAIL, "inovisionn@hotmail.com", msg.as_string())
        server.quit()
        print("✅ Contact e-mail verzonden!")
    except Exception as e:
        print(f"❌ Fout bij versturen contact email: {e}")


# ─── MAIN ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
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
        send_contact_email(args.naam, args.email, args.bedrijfsnaam, args.vraag)
        exit(0)

    leads_raw = []
    seen_domains = set()

    # ── Bron 1: Overheid.io — officiële KvK bedrijfsnamen ─────────────────────
    overheid_results = search_companies_overheid(args.branche, args.regio)

    # ── Bron 2: Google Maps — lokale bedrijven met telefoon ───────────────────
    maps_results = search_companies_googlemaps(args.branche, args.regio)

    # Verwerk Google Maps resultaten eerst (hebben al telefoon + website)
    for item in maps_results:
        if len(leads_raw) >= 20:
            break
        naam = item.get("handelsnaam", "")
        website = item.get("website", "")
        domain = extract_domain(website) if website else None
        if not naam or not domain or domain in seen_domains:
            continue
        seen_domains.add(domain)

        # Tavily voor LinkedIn
        _, linkedin = enrich_company_with_tavily(naam, args.regio)

        # Apify LinkedIn scrape voor extra data
        apify_data = scrape_linkedin_apify(linkedin) if linkedin else {}

        # Email waterval
        email_found = find_email_waterfall(domain)

        leads_raw.append({
            "Bedrijfsnaam": naam,
            "Website": website,
            "Locatie": item.get("locatie", args.regio),
            "Branche": args.branche,
            "Emailadres": email_found or "",
            "Telefoonnummer": apify_data.get("telefoonnummer") or item.get("telefoonnummer", ""),
            "LinkedIn": linkedin or "",
            "Bedrijfsgrootte": str(apify_data.get("bedrijfsgrootte", "")),
            "AI-Matching": ""
        })

    # Verwerk Overheid.io resultaten (aanvulling)
    for item in overheid_results:
        if len(leads_raw) >= 20:
            break
        naam = item.get("handelsnaam", "")
        if not naam:
            continue

        # Tavily voor website + LinkedIn
        website, linkedin = enrich_company_with_tavily(naam, args.regio)
        domain = extract_domain(website) if website else None
        if not domain or domain in seen_domains:
            continue
        seen_domains.add(domain)

        # Apify LinkedIn scrape
        apify_data = scrape_linkedin_apify(linkedin) if linkedin else {}

        # Email waterval
        email_found = find_email_waterfall(domain)

        leads_raw.append({
            "Bedrijfsnaam": naam,
            "Website": website or "",
            "Locatie": args.regio,
            "Branche": args.branche,
            "Emailadres": email_found or "",
            "Telefoonnummer": apify_data.get("telefoonnummer", ""),
            "LinkedIn": linkedin or "",
            "Bedrijfsgrootte": str(apify_data.get("bedrijfsgrootte", "")),
            "KvK": item.get("kvk", ""),
            "AI-Matching": ""
        })

    # ── Fallback: Tavily als beide bronnen leeg zijn ───────────────────────────
    if not leads_raw:
        print("⚠️  Geen resultaten via primaire bronnen — Tavily fallback...")
        tavily_results = bulk_tavily_search(args.branche, args.regio, args.extra_criteria)
        for result in tavily_results:
            if len(leads_raw) >= 20:
                break
            url = result.get("url", "")
            domain = extract_domain(url)
            if not domain or domain in seen_domains:
                continue
            seen_domains.add(domain)
            email_found = find_email_waterfall(domain)
            leads_raw.append({
                "Bedrijfsnaam": result.get("title", domain),
                "Website": url,
                "Locatie": args.regio,
                "Branche": args.branche,
                "Emailadres": email_found or "",
                "Telefoonnummer": "",
                "LinkedIn": "",
                "Bedrijfsgrootte": "",
                "AI-Matching": ""
            })

    print(f"\n📋 {len(leads_raw)} leads verzameld. Naar Claude voor filtering...")

    # ── Claude filtert en verrijkt ────────────────────────────────────────────
    leads_final = enrich_leads_with_ai(
        leads_raw, args.branche, args.regio, args.extra_criteria
    )

    if not leads_final:
        print("❌ Geen bruikbare leads na Claude verwerking.")
        exit(1)

    print(f"✅ {len(leads_final)} gekwalificeerde leads klaar.")

    # ── Verstuur via Outlook ──────────────────────────────────────────────────
    send_lead_email(args.email, args.naam, leads_final)
