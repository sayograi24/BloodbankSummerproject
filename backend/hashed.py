import bcrypt

# Hash the password "123"
hashed_password = bcrypt.hashpw("123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
print(hashed_password)