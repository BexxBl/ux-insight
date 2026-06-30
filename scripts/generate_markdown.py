#!/usr/bin/env python3
"""
generate_markdown.py — Render a client-ready Markdown report from a UX Insight JSON report.

Frontend-agnostic proof: the same report.json that an Angular/HTML/PDF renderer would
consume is turned into Markdown here. No hand-authored prose — everything comes from data.

Usage:
    python3 scripts/generate_markdown.py reports/rebeccablischke-de/v1/report.json > out.md
"""
import json
import sys
from datetime import datetime

SEV = {"critical": "🔴 Critical", "high": "🟠 High", "medium": "🟡 Medium", "low": "🟢 Low"}
IMP = {"high": "Hoch", "medium": "Mittel", "low": "Niedrig"}
EFF = {"low": "Gering", "medium": "Mittel", "high": "Hoch"}
CONF = {"high": "Hoch", "medium": "Mittel", "low": "Niedrig"}
SEV_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}


def fmt_date(iso):
    try:
        return datetime.fromisoformat(iso).strftime("%d.%m.%Y")
    except Exception:
        return iso


def band_for(score, bands):
    for b in bands:
        if b["min"] <= score <= b["max"]:
            return b["label"]
    return ""


def render(d):
    o = []
    w = o.append

    # ---- Header ----
    w(f"# UX Audit — {d['target']['name']}")
    w("")
    w(f"**{d['summary']['headline']}**")
    w("")
    meta = d["meta"]
    w(f"| | |")
    w(f"|---|---|")
    w(f"| **Auditierte URL** | {d['target']['url']} |")
    w(f"| **Auftraggeber:in** | {d['client']['name']} |")
    w(f"| **Erstellt von** | {meta['author']['name']} — {meta['author'].get('role','')} |")
    w(f"| **Datum** | {fmt_date(meta['createdAt'])} |")
    w(f"| **Report-Typ** | {d['reportType']} · Schema {d['schemaVersion']} · Report v{meta.get('version','1.0')} |")
    w(f"| **Standards** | {', '.join(meta['methodology'].get('standards', []))} |")
    w(f"| **Methodik (Quellen)** | {', '.join(meta['methodology']['sources'])} |")
    w("")

    # ---- Methodik-Transparenz ----
    lims = meta["methodology"].get("limitations", [])
    if lims:
        w("> **⚠️ Methodischer Hinweis — Grenzen dieser Analyse**")
        for l in lims:
            w(f"> - {l}")
        w("")

    # ---- Gesamtbewertung ----
    sc = d["scoring"]
    w("## Gesamtbewertung")
    w("")
    w(f"### {sc['overall']} / {sc['scale']['max']} — {sc.get('overallBand','')}")
    w("")
    w("| Kategorie | Score | Bewertung | Gewicht | Begründung |")
    w("|---|---|---|---|---|")
    for c in sc["categories"]:
        w(f"| {c['label']} | **{c['score']}** | {c.get('band','')} | ×{c['weight']} | {c.get('rationale','')} |")
    w("")
    w("_Der Gesamtwert ist das gewichtete Mittel der Kategorien; die Gewichte sind im Report hinterlegt und reproduzierbar._")
    w("")

    # ---- Executive Summary ----
    w("## Zusammenfassung")
    w("")
    for para in d["summary"]["narrative"].split("\n\n"):
        w(para)
        w("")
    if d["summary"].get("keyTakeaways"):
        w("**Kernpunkte:**")
        w("")
        for t in d["summary"]["keyTakeaways"]:
            w(f"- {t}")
        w("")

    # ---- Stärken ----
    if d.get("strengths"):
        w("## Was bereits stark ist")
        w("")
        for s in d["strengths"]:
            w(f"### ✅ {s['title']}")
            w("")
            w(s["description"])
            ev = s.get("evidence", {})
            if ev.get("locations"):
                locs = "; ".join(f"`{l.get('file','')}{(' '+l['lines']) if l.get('lines') else ''}`" for l in ev["locations"])
                w("")
                w(f"_Beleg: {locs}_")
            w("")

    # ---- Quick Wins ----
    if d.get("quickWins"):
        w("## Quick Wins (hoher Hebel, geringer Aufwand)")
        w("")
        w("| # | Maßnahme | Aufwand | Business-Impact | Finding |")
        w("|---|---|---|---|---|")
        for i, q in enumerate(d["quickWins"], 1):
            w(f"| {i} | {q['title']} | {EFF.get(q.get('effort',''),'')} | {IMP.get(q.get('businessImpact',''),'')} | {q.get('findingId','—')} |")
        w("")

    # ---- Findings ----
    w("## Findings im Detail")
    w("")
    findings = sorted(d["findings"], key=lambda f: (SEV_ORDER.get(f["severity"], 9), f.get("rank", 99)))
    for f in findings:
        opp = " · 💡 Opportunity" if f.get("isOpportunity") else ""
        w(f"### {f['id']} — {f['title']}")
        w("")
        w(f"**Kategorie:** {f.get('categoryLabel', f['categoryKey'])}  ·  "
          f"**Severity:** {SEV.get(f['severity'])}  ·  "
          f"**Business Impact:** {IMP.get(f['businessImpact'])}  ·  "
          f"**Aufwand:** {EFF.get(f['effort'])}  ·  "
          f"**Confidence:** {CONF.get(f['confidence'])}{opp}")
        w("")
        w(f"**Problem.** {f['problem']}")
        w("")
        ev = f.get("evidence", {})
        if ev:
            if ev.get("summary"):
                w(f"**Beleg.** {ev['summary']}")
                w("")
            if ev.get("locations"):
                for l in ev["locations"]:
                    loc = f"`{l.get('file','')}"
                    if l.get("lines"):
                        loc += f" · Z. {l['lines']}"
                    loc += "`"
                    sel = f" — `{l['selector']}`" if l.get("selector") else ""
                    note = f" — {l['note']}" if l.get("note") else ""
                    w(f"- {loc}{sel}{note}")
                w("")
            if ev.get("measurements"):
                w("| Messung | Wert | Schwelle | Status |")
                w("|---|---|---|---|")
                for m in ev["measurements"]:
                    status = "✅ erfüllt" if m.get("passes") else "❌ verfehlt"
                    w(f"| {m['label']} | {m['value']}{m.get('unit','')} | {m.get('threshold','')}{m.get('unit','')} | {status} |")
                w("")
        w(f"**Empfehlung.** {f['recommendation']}")
        w("")
        if f.get("userBenefit"):
            w(f"**Nutzen für User:** {f['userBenefit']}")
            w("")
        if f.get("businessBenefit"):
            w(f"**Nutzen fürs Business:** {f['businessBenefit']}")
            w("")
        line = []
        if f.get("uxPrinciple"):
            line.append(f"**UX-Prinzip:** {f['uxPrinciple']}")
        acc = f.get("accessibility", {})
        if acc.get("wcag"):
            refs = ", ".join(f"{x['criterion']} {x.get('name','')} ({x.get('level','')})" for x in acc["wcag"])
            line.append(f"**WCAG:** {refs}")
        if line:
            w("  ·  ".join(line))
            w("")
        if f.get("media"):
            for m in f["media"]:
                if m.get("placeholder"):
                    w(f"> 📷 _Screenshot-Platzhalter: {m.get('caption','')}_")
            w("")
        w("---")
        w("")

    # ---- Roadmap ----
    if d.get("recommendationsRoadmap"):
        w("## Strategische Empfehlungen (Roadmap)")
        w("")
        horizons = {"now": "Jetzt (dieser Sprint)", "next": "Als Nächstes (dieses Quartal)", "later": "Später (strategisch)"}
        for hk, hl in horizons.items():
            items = [r for r in d["recommendationsRoadmap"] if r["horizon"] == hk]
            if not items:
                continue
            w(f"### {hl}")
            w("")
            for r in items:
                rel = f" _(betrifft {', '.join(r['relatedFindingIds'])})_" if r.get("relatedFindingIds") else ""
                w(f"- **{r['title']}** — {r.get('description','')}{rel}")
            w("")

    # ---- Footer ----
    w("---")
    w("")
    fb = d.get("branding", {}).get("footerText", "UX Insight")
    w(f"_{fb} · Report-ID `{d['reportId']}` · generiert aus `report.json` (Schema {d['schemaVersion']})._")
    w("")

    return "\n".join(o)


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "reports/rebeccablischke-de/v1/report.json"
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    sys.stdout.write(render(data))
