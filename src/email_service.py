from flask_mail import Message
from app import create_app, mail

app = create_app()


def enviar_correo(destinatario, asunto, cuerpo):
    with app.app_context():  # <- IMPORTANTE
        msg = Message(
            subject=asunto,
            sender=app.config['MAIL_USERNAME'],
            recipients=[destinatario],
            body=cuerpo
        )
        mail.send(msg)
        print("📬 Correo enviado con éxito")
