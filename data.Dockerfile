FROM python:3.10

WORKDIR /app

COPY data/pyproject.toml ./

RUN pip install --upgrade --no-cache-dir pip
RUN pip install --no-cache-dir poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev --no-interaction --no-ansi --no-cache

COPY data/ ./

CMD ["poetry", "run", "uvicorn", "data:app", "--host", "0.0.0.0", "--port", "80"]