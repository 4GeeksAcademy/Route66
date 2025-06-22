from flask_sqlalchemy import SQLAlchemy
import enum
from sqlalchemy import String, Boolean, Enum as PgEnum, ForeignKey, Column, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Roles(enum.Enum):
    BROKER = "broker"
    CARRIER = "carrier"


load_requests = Table(
    "load_requests",
    db.Model.metadata,
    Column("carrier_id", ForeignKey("user.id"), primary_key=True),
    Column("load_id", ForeignKey("load.id"), primary_key=True)
)


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

    broker_loads: Mapped[list["Load"]] = relationship(
        back_populates="broker",
        foreign_keys="[Load.broker_id]"
    )
    requested_loads: Mapped[list["Load"]] = relationship(
        secondary=load_requests,
        back_populates="interested_carriers"
    )
    requests_accepted: Mapped[list["Load"]] = relationship(
        back_populates="accepted_carrier",
        foreign_keys="[Load.carrier_id]"
    )

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def serialize(self, detail_level="full"):
        if detail_level == "minimal":
            return {"id": self.id, "company_name": self.company_name}
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
                "broker_loads": [load.serialize() for load in self.broker_loads],
                "requested_loads": [load.serialize() for load in self.requested_loads],
                "requests_accepted": [load.serialize() for load in self.requests_accepted],

            }


class Load(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    broker_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    vehicle_year: Mapped[str] = mapped_column(
        String(120), nullable=False)
    vehicle_make: Mapped[str] = mapped_column(String(120), nullable=False)
    vehicle_model: Mapped[str] = mapped_column(String(120), nullable=False)
    pickup_location: Mapped[str] = mapped_column(String(120), nullable=False)
    delivery_location: Mapped[str] = mapped_column(String(120), nullable=False)
    payment: Mapped[float] = mapped_column(nullable=False)
    days_to_deliver: Mapped[int] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(String(120), nullable=False)
    carrier_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=True)

    broker: Mapped["User"] = relationship(
        back_populates="broker_loads",
        foreign_keys=[broker_id]
    )
    accepted_carrier: Mapped["User"] = relationship(
        back_populates="requests_accepted",
        foreign_keys=[carrier_id]
    )
    interested_carriers: Mapped[list["User"]] = relationship(
        secondary=load_requests,
        back_populates="requested_loads"
    )

    def serialize(self):
        return {
            "id": self.id,
            "vehicle_year": self.vehicle_year,
            "vehicle_make": self.vehicle_make,
            "vehicle_model": self.vehicle_model,
            "pickup_location": self.pickup_location,
            "delivery_location": self.delivery_location,
            "payment": self.payment,
            "days_to_deliver": self.days_to_deliver,
            "status": self.status,
            "broker": self.broker.serialize(detail_level="medium") if self.broker else None,
            "accepted_carrier": self.accepted_carrier.serialize(detail_level="medium") if self.accepted_carrier else None,
            "interested_carriers": [user.serialize(detail_level="medium") for user in self.interested_carriers],
        }
