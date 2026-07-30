from app.database.mock_db import (
    get_history,
    save_history
)


class ContextEngine:

    def load(self):

        return get_history()

    def save(self, conversation):

        save_history(conversation)