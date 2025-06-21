from flask_sqlalchemy import SQLAlchemy
import enum
from sqlalchemy import String, Boolean, Enum as PgEnum
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Roles(enum.Enum):
    BROKER = "broker"
    CARRIER = "carrier"


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    company_name: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False)
    address: Mapped[str] = mapped_column(String(120), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    state: Mapped[str] = mapped_column(String(120), nullable=False)
    zip: Mapped[str] = mapped_column(String(120), nullable=False)
    mc_number: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    usdot_number: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=True)
    type_of_transport: Mapped[str] = mapped_column(String(120), nullable=True)
    number_of_trucks: Mapped[int] = mapped_column(nullable=True)
    role: Mapped[Roles] = mapped_column(PgEnum(Roles, name="roles", create_type=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)
    rating: Mapped[float] = mapped_column(nullable=False, default=5.0)
    password_hash: Mapped[str] = mapped_column(String(300), nullable=False)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "full_name": self.full_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
            "mc_number": self.mc_number,
            "usdot_number": self.usdot_number,
            "type_of_transport": self.type_of_transport,
            "number_of_trucks": self.number_of_trucks,
            "role": self.role.value,
            "is_active": self.is_active,
            "rating": self.rating,
        }
