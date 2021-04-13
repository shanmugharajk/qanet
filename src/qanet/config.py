from starlette.config import Config

config = Config(".env")

# database
SQLALCHEMY_DATABASE_URI = config("SQLALCHEMY_DATABASE_URI", default=None)

# authentication
QANET_JWT_SECRET = config("QANET_JWT_SECRET", default=None)
QANET_JWT_ALG = config("QANET_JWT_ALG", default="HS256")
QANET_JWT_EXP = config("QANET_JWT_EXP", cast=int, default=86400)  # Seconds
