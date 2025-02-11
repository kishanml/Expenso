from django.core.mail import EmailMessage
import os


class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['subject'],
            body=data['body'],
            from_email="donotreply.prosquad <do_not_reply@prosquad.com>",
            to=[data['to_email']]
        )
        # print(email)
        email.send()



CHANGE_PASSWORD_EMAIL_FORMAT = """


"""


def GET_FIELD_ERRORS_FORMAT(errors):
    msg = {}
    for error in errors:
        msg[error] = errors[error][0]
    return msg
