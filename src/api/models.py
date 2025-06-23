from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, 

db = SQLAlchemy()

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
    role: Mapped[Roles] = mapped_column(
        PgEnum(Roles, name="roles", create_type=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)
    rating: Mapped[float] = mapped_column(nullable=False, default=5.0)
    password_hash: Mapped[str] = mapped_column(String(300), nullable=False)

    def serialize(self, detail_level="full"):
        if detail_level == "minimal":
            return {"id": self.id, "company_name": self.company_name, "full_name": self.full_name}
        elif detail_level == "medium":
            return {
                "id": self.id,
                "company_name": self.company_name,
                "full_name": self.full_name,
                "email": self.email,
                "phone_number": self.phone_number,
                "type_of_transport": self.type_of_transport,
                "rating": self.rating,
            }
        else:
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

