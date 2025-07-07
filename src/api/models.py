from flask_sqlalchemy import SQLAlchemy
import enum
from sqlalchemy import String, Boolean, Enum as PgEnum, ForeignKey, DateTime, Text
from datetime import datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Roles(enum.Enum):
    carrier = "carrier"
    broker = "broker"
    admin = "admin"


def default_end_date():
    return datetime.now(timezone.utc) + relativedelta(months=1)


def now_utc():
    return datetime.now(timezone.utc)


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
    avatar_url: Mapped[str] = mapped_column(String(300), nullable=True)

    broker_loads: Mapped[list["Load"]] = relationship(
        back_populates="broker",
        foreign_keys="[Load.broker_id]"
    )

    requests_accepted: Mapped[list["Load"]] = relationship(
        back_populates="accepted_carrier",
        foreign_keys="[Load.carrier_id]"
    )
    load_requests_sent: Mapped[list["LoadRequest"]
                               ] = relationship(back_populates="carrier")
    subscription: Mapped["Subscription"] = relationship(
        back_populates="user", uselist=False)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

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
                "broker_loads": [load.serialize() for load in self.broker_loads],
                "requests_accepted": [load.serialize() for load in self.requests_accepted],
                "load_requests_sent": [load.serialize() for load in self.load_requests_sent],
                "subscription": self.subscription.serialize() if self.subscription else None,
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

    load_requests: Mapped[list["LoadRequest"]
                          ] = relationship(back_populates="load")

    def serialize(self, detail_level="full"):
        data = {
            "id": self.id,
            "vehicle_year": self.vehicle_year,
            "vehicle_make": self.vehicle_make,
            "vehicle_model": self.vehicle_model,
            "pickup_location": self.pickup_location,
            "delivery_location": self.delivery_location,
            "payment": self.payment,
            "days_to_deliver": self.days_to_deliver,
            "status": self.status,
            "carrier": self.accepted_carrier.serialize(detail_level="basic") if self.accepted_carrier else None
        }

        if detail_level == "full":
            data["load_requests"] = [
                request.serialize(detail_level="full") for request in self.load_requests
            ]

        return data


class LoadRequest(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    carrier_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False)
    load_id: Mapped[int] = mapped_column(
        ForeignKey("load.id"), nullable=False)
    vehicle: Mapped[str] = mapped_column(
        String(120), nullable=True)
    price_offer: Mapped[float] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(String(120), nullable=True)

    carrier: Mapped["User"] = relationship(
        "User", back_populates="load_requests_sent")
    load: Mapped["Load"] = relationship("Load", back_populates="load_requests")

    def serialize(self, detail_level="full"):
        data = {
            "id": self.id,
            "vehicle": self.vehicle,
            "price_offer": self.price_offer,
            "status": self.status
        }

        if detail_level != "basic":
            data["carrier"] = self.carrier.serialize(
                detail_level="medium") if self.carrier else None
            data["load"] = self.load.serialize(
                detail_level="basic") if self.load else None

        return data


class Subscription(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False, unique=True)
    plan_id: Mapped[int] = mapped_column(
        ForeignKey("plan.id"), nullable=False)
    start_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now_utc)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now_utc)
    end_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=default_end_date)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), onupdate=now_utc)
    status: Mapped[str] = mapped_column(String(120), nullable=False)
    auto_renew: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    user: Mapped["User"] = relationship(back_populates="subscription")
    plan: Mapped["Plan"] = relationship(back_populates="subscriptions")
    payments: Mapped[list["PaymentTransaction"]] = relationship(
        back_populates="subscription")

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.serialize(detail_level="minimal") if self.user else None,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "status": self.status,
            "auto_renew": self.auto_renew,
            "is_active": self.is_active,
            "plan": self.plan.serialize() if self.plan else None,
            "payments": [payment.serialize() for payment in self.payments],
        }


class Plan(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[Roles] = mapped_column(
        PgEnum(Roles, name="roles", create_type=False), nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)
    currency: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    max_screens: Mapped[int] = mapped_column(nullable=False)
    can_view_loads: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), onupdate=now_utc)

    subscriptions: Mapped[list["Subscription"]
                          ] = relationship(back_populates="plan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role.value,
            "price": self.price,
            "currency": self.currency,
            "description": self.description,
            "max_screens": self.max_screens,
            "can_view_loads": self.can_view_loads,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "subscriptions": [subscription.serialize() for subscription in self.subscriptions],
        }


class PaymentTransaction(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    subscription_id: Mapped[int] = mapped_column(
        ForeignKey("subscription.id"), nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)
    currency: Mapped[str] = mapped_column(String(120), nullable=False)
    payment_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now_utc)
    status: Mapped[str] = mapped_column(String(120), nullable=False)
    payment_method: Mapped[str] = mapped_column(String(120), nullable=False)
    transaction_id_gateway: Mapped[str] = mapped_column(
        String(120), nullable=False)
    next_retry_date: Mapped[datetime] = mapped_column(DateTime(
        timezone=True), default=lambda: datetime.now(timezone.utc) + timedelta(days=1))

    subscription: Mapped["Subscription"] = relationship(
        back_populates="payments")

    def serialize(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "currency": self.currency,
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "status": self.status,
            "payment_method": self.payment_method,
            "transaction_id_gateway": self.transaction_id_gateway,
            "next_retry_date": self.next_retry_date.isoformat() if self.next_retry_date else None,
            "subscription": self.subscription.serialize() if self.subscription else None,
        }
