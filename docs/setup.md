# Setup

Usefull commands needed to setup, run the code, database etc.

## Virtual environment

To create a virtual environment `python3 -m venv <folder name>`

To remove all the packages in a virtual environment run `pip uninstall -y -r <(pip freeze)`

## Generate requirements.txt file

Then to generate requirements.txt we use `pip-tools`. Install it with `pip install pip-tools`

To generate the requirements-_.txt file run `pip-compile requirements-_.in `.

Create two files `requirements-base.in`, `requirements-dev.in`. The `requirements-base.in` can contain all the packages necessary for the project. And the `requirements-dev.in` can contain all the packages necessary for formatting, linting etc only required for development.

Then run the following command to generate the requirements-\*.txt file(s).

```sh
pip-compile requirements-dev.in
pip-compile requirements-base.in
```

## Postgresql

To connect psql without prompting password `PGPASSWORD=<password> psql -U <username> -d <db name>`.

Other usefull commands

```sh
# Create a new database
PGPASSWORD=moriaty dropdb qanet -U postgres
# Drops a database
PGPASSWORD=moriaty createdb qanet -U postgres
# Shows the list of tables in a db. Execute in psql
\dt
```

## Environment variables required

To run the app we need the following environment variables set.

```sh
export SQLALCHEMY_DATABASE_URI="postgresql+psycopg2://user:password@localhost:5432/db"
export DB_PASSWORD="password"
export QANET_JWT_SECRET="password"
export VENV_PATH="venv path"
export STATIC_DIR="src/qanet/static/qanet/public"
```

## vscode settings

The following vscode settings needs to be there to run the app through vscode

**settings.json**

```json
{
  "python.venvPath": "${env:VENV_PATH}",
  "python.pythonPath": "${env:VENV_PATH}/bin/python",
  "python.languageServer": "Pylance",
  "python.linting.flake8Enabled": true,
  "python.linting.flake8Path": "${env:VENV_PATH}/bin/flake8",
  "python.formatting.blackPath": "${env:VENV_PATH}/bin/black",
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--line-length", "100"],
  "editor.formatOnSave": true,
  "python.linting.enabled": true,
  "editor.tabSize": 4,
  "python.analysis.extraPaths": ["./src/qanet"]
}
```

**launch.json**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Server Debug",
      "type": "python",
      "request": "launch",
      "env": {
        "PYTHONPATH": "src"
      },
      "program": "${workspaceFolder}/bin/run.py"
    }
  ]
}
```

## To run

Then press `f5` to run the app through vscode.

To run in terminal execute the command `PYTHONPATH=src python bin/run.py`.

Once the successfully launched we can browse the docs in http://localhost:8000/api/v1/docs.
