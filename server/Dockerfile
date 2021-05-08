#syntax=docker/dockerfile:1
FROM python:3.8.5-alpine
WORKDIR /app/server
ENV FLASK_APP=./flaskkr
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev python3-dev libffi-dev openssl-dev cargo linux-headers
RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
EXPOSE 5000
COPY ./flaskkr ./flaskkr
COPY ./db.yaml ./db.yaml
