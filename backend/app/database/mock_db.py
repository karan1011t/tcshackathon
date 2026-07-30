import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")


def _read_json(filename):
    path = os.path.join(DATA_DIR, filename)

    if not os.path.exists(path):
        return []

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _write_json(filename, data):
    path = os.path.join(DATA_DIR, filename)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


# -------------------------
# Policies
# -------------------------

def get_core_policies():
    return _read_json("policies.json")


# -------------------------
# Organization Rules
# -------------------------

def get_org_rules(organization):

    rules = _read_json("organization_rules.json")

    return [
        rule
        for rule in rules
        if rule["organization"].lower() == organization.lower()
        or rule["organization"] == "Default"
    ]


def add_org_rule(rule):

    rules = _read_json("organization_rules.json")

    rule["id"] = len(rules) + 1

    rules.append(rule)

    _write_json("organization_rules.json", rules)

    return rule


def delete_org_rule(rule_id):

    rules = _read_json("organization_rules.json")

    rules = [r for r in rules if r["id"] != rule_id]

    _write_json("organization_rules.json", rules)


# -------------------------
# Conversation History
# -------------------------

def get_history():

    return _read_json("conversation_history.json")


def save_history(item):

    history = _read_json("conversation_history.json")

    history.append(item)

    _write_json("conversation_history.json", history)


# -------------------------
# Audit Logs
# -------------------------

def get_logs():

    return _read_json("audit_logs.json")


def save_log(log):

    logs = _read_json("audit_logs.json")

    logs.append(log)

    _write_json("audit_logs.json", logs)