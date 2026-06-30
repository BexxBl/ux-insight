#!/usr/bin/env python3
"""
validate.py — Validate a UX Insight report against its schema + cross-field rules.

Usage:
    python3 scripts/validate.py reports/<target>/v<n>/report.json
    python3 scripts/validate.py            # validates all reports/**/report.json

Exit code 0 = all valid, 1 = at least one failure (CI-friendly).
"""
import json
import sys
import glob
import os

try:
    from jsonschema import Draft202012Validator
except ImportError:
    sys.exit("Missing dependency: pip install jsonschema")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMA_DIR = os.path.join(ROOT, "schemas", "ux-report")


def load_schema(version):
    path = os.path.join(SCHEMA_DIR, f"v{version}.json")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Schema {version} not found at {path}")
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def cross_checks(d):
    """Rules JSON Schema can't express on its own."""
    problems = []
    cat_keys = {c["key"] for c in d["scoring"]["categories"]}

    for f in d["findings"]:
        if f["categoryKey"] not in cat_keys:
            problems.append(f"finding {f['id']}: categoryKey '{f['categoryKey']}' not in scoring.categories")

    for q in d.get("quickWins", []):
        fid = q.get("findingId")
        if fid and fid not in {f["id"] for f in d["findings"]}:
            problems.append(f"quickWin {q['id']}: findingId '{fid}' does not exist")

    for r in d.get("recommendationsRoadmap", []):
        for fid in r.get("relatedFindingIds", []):
            if fid not in {f["id"] for f in d["findings"]}:
                problems.append(f"roadmap {r['id']}: relatedFindingId '{fid}' does not exist")

    cats = d["scoring"]["categories"]
    den = sum(c["weight"] for c in cats)
    if den:
        calc = round(sum(c["score"] * c["weight"] for c in cats) / den)
        if calc != d["scoring"]["overall"]:
            problems.append(f"scoring.overall={d['scoring']['overall']} but weighted mean computes to {calc}")

    return problems


def validate_file(path):
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    schema = load_schema(data.get("schemaVersion", ""))
    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda e: list(e.path))
    cross = cross_checks(data)

    rel = os.path.relpath(path, ROOT)
    if not errors and not cross:
        print(f"✅ {rel}")
        return True

    print(f"❌ {rel}")
    for e in errors:
        print(f"   schema: {list(e.path)} → {e.message}")
    for c in cross:
        print(f"   logic:  {c}")
    return False


def main():
    args = sys.argv[1:]
    if args:
        targets = args
    else:
        targets = glob.glob(os.path.join(ROOT, "reports", "**", "report.json"), recursive=True)
    if not targets:
        print("No report.json files found.")
        return 0
    ok = all(validate_file(t) for t in targets)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
