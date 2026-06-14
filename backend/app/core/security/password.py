# backend/app/core/security/password.py
import bcrypt

def get_password_hash(password: str) -> str:
    """Return a bcrypt hash of the given password."""
    # bcrypt.gensalt() returns bytes, hashpw returns bytes. We decode to store as string.
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hashed version."""
    # Both arguments must be bytes for checkpw.
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

