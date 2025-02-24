from django.core.mail import send_mail
import os


class Util:
    @staticmethod
    def send_email_to_user(data):
        send_mail(    
            subject=data['subject'],
            message=data['body'],
            from_email="team@expenso.com",
            recipient_list=[data['to_email']],
            html_message=data['html_message']
        )
        # # print(email)
        # email.send()



CHANGE_PASSWORD_EMAIL_FORMAT = """


"""


def GET_FIELD_ERRORS_FORMAT(errors):
    msg = {}
    for error in errors:
        msg[error] = errors[error][0]
    return msg
