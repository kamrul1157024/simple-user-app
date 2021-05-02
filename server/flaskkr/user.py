class User:
    def __init__(
            self,
            first_name: str,
            last_name: str,
            email_address: str,
            mobile_no: str
    ):
        self.first_name: str = first_name
        self.last_name: str = last_name
        self.email_address: str = email_address
        self.mobile_no: str = mobile_no
