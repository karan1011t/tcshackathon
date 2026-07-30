from app.database.mock_db import (
    get_org_rules,
    add_org_rule,
    delete_org_rule
)


class PolicyEngine:

    def get(self, organization):

        return get_org_rules(organization)

    def create(self, rule):

        return add_org_rule(rule)

    def delete(self, rule_id):

        delete_org_rule(rule_id)