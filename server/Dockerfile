FROM ubuntu:20.04
RUN apt-get update
RUN apt-get install -y python3.8 python3.8-dev python3.8-distutils python3.8-venv pip
ENV FLASK_APP=./flaskkr
ENV FLASK_RUN_HOST=0.0.0.0
RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
EXPOSE 5000
COPY ./flaskkr ./flaskkr
COPY ./db.yaml ./db.yaml
