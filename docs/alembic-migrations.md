# alembic migrations

**To initialise**

To init alembic run `alembic init alembic` in the `src/qanet` folder. Then change the 

```sh
script_location = alembic
```

to

```sh
script_location = qanet:alembic
```

**To generate migrations**

Edit the `env.py` file that alembic generates to update the `sqlalchemy.url`. Add the following

```py
from qanet.database.core import Base

# sets the database connection uri.
config.set_main_option("sqlalchemy.url", str(SQLALCHEMY_DATABASE_URI))
target_metadata = Base.metadata
```

To auto-generate the revision `PYTHONPATH=src alembic -c src/qanet/alembic.ini revision --autogenerate` 

To update db `PYTHONPATH=src alembic -c src/qanet/alembic.ini upgrade head`
