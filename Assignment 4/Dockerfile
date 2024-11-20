FROM python:3.9

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir Flask requests gunicorn

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]