from dotenv import load_dotenv
import os

load_dotenv()

GROQ_API_KEYS = [
    os.getenv("GROQ_API_KEY1"),
    os.getenv("GROQ_API_KEY2"),
    os.getenv("GROQ_API_KEY3"),
]

# Remove empty values
GROQ_API_KEYS = [key for key in GROQ_API_KEYS if key]

MODEL_NAME = os.getenv("MODEL_NAME")