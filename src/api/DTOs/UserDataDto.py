from dataclasses import dataclass

@dataclass
class UserDataDto:
    id: str
    company_name: str
    full_name: str
    email: str
    phone_number: str
    address: str
    city: str
    state: str
    zip: str
    mc_number: str
    usdot_number:str
    type_of_transport: str
    number_of_trucks:int
    role: str
    is_active: bool
    rating: float
    password_hash: str