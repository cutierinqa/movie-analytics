import os

from dotenv import load_dotenv
from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole


load_dotenv()


def generate_movie_description(description: str) -> str:
    with GigaChat(
    credentials=os.getenv("GIGACHAT_CREDENTIALS"),
    scope=os.getenv("GIGACHAT_SCOPE", "GIGACHAT_API_PERS"),
    base_url="https://api.giga.chat/v1",
    ca_bundle_file=os.getenv("GIGACHAT_CA_BUNDLE_FILE"),
) as client:
        chat = Chat(
            model="GigaChat-2-Max",
            messages=[
                Messages(
                    role=MessagesRole.SYSTEM,
                    content=(
                        "Ты помощник киноаналитического сайта. "
                        "Сделай короткое и понятное описание фильма "
                        "на русском языке на основе исходного описания. "
                        "Не придумывай факты, которых нет в исходном тексте. "
                        "Не добавляй спойлеры. "
                        "Сохраняй основной сюжет и смысл. "
                        "Пиши естественным человеческим языком. "
                        "Верни только готовое описание."
                    ),
                ),
                Messages(
                    role=MessagesRole.USER,
                    content=description,
                ),
            ],
        )

        response = client.chat(chat)

        return response.choices[0].message.content