from pydantic import BaseModel, EmailStr

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str
