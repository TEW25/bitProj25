import bcrypt

def hash_password(plain_password: str) -> str:
    # Generate salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a bcrypt hash."""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

if __name__ == "__main__":
    password = input("Enter password to hash: ")
    hashed = hash_password(password)
    print("BCrypt hash:", hashed)

    # Optionally verify
    to_verify = input("Enter password to verify (leave blank to skip): ")
    if to_verify:
        if verify_password(to_verify, hashed):
            print("Password matches the hash!")
        else:
            print("Password does NOT match the hash.")