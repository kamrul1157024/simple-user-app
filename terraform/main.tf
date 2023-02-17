terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-southeast-1"
}

resource "aws_vpc" "user_app_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    "Name" = "user-app-vpc"
  }
}

resource "aws_subnet" "user_app_public_subnet" {
  vpc_id = aws_vpc.user_app_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "ap-southeast-1a"
  tags = {
    "Name" = "user-app-public-subnet"
  }
}

resource "aws_subnet" "user_app_private_subnet" {
  vpc_id = aws_vpc.user_app_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "ap-southeast-1b"
  tags = {
    "Name" = "user-app-private-subnet"
  }
}

resource "aws_internet_gateway" "user_app_igw" {
  vpc_id = aws_vpc.user_app_vpc.id
  tags = {
    "Name" = "user-app-igw"
  }
}

resource "aws_route_table" "user_app_public_subnet_router" {
  vpc_id = aws_vpc.user_app_vpc.id
  tags = {
    "Name" = "user-app-public-subnet-router"
  }
}

resource "aws_route" "public_internet_gateway" {
  route_table_id = aws_route_table.user_app_public_subnet_router.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.user_app_igw.id
}

resource "aws_eip" "user_app_nat_eip" {
  vpc                       = true
  tags = {
    "Name" = "user-app-nat-eip"
  }
}

resource "aws_nat_gateway" "user_app_nat" {
  allocation_id = aws_eip.user_app_nat_eip.id
  subnet_id     = aws_subnet.user_app_private_subnet.id

  tags = {
    Name = "user-app-nat-gateway"
  }

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_internet_gateway.user_app_igw]
}

resource "aws_route_table" "user_app_private_subnet_router" {
  vpc_id = aws_vpc.user_app_vpc.id
  tags = {
    "Name" = "user-app-private-subnet-router"
  }
}

resource "aws_route" "private_subnet_nat_gateway" {
  route_table_id = aws_route_table.user_app_private_subnet_router.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id = aws_nat_gateway.user_app_nat.id
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_key_pair" "user_app_deployer" {
  key_name   = "user-app-deployer-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDeVRewgmpY5RZDFiFk7VZwyLiQYCZPDGOn1zXnlG4M/g1JLiGEkiX/lT1RPyhSWKKfQpfOx1gmBHHUjF8Q5sdY48upAtsSx9oRoXJLaerU1YySVZXNRMaTHD8QuXb+yWtD7CZf5yHzl4JgSXrzHNJUbLiFUAktMRxtLD9NKZve0fj538Cb6lO05DApQHpZD1WM42FrZlm0pwNDHpJltWEzkqiwIVUxOHQlb3uWRFk4qgGb5iWDtttCVn0jNA+S3ZjiyUGQcPpyR1MWGo+iS2eQC2vGaIrhKqEhKaeIoLXuK77/R7xNkBUUKurhTifXj/CJzF3tdMbZf5HDi1enrDmAQ56LIUR107WHVU2yx5VA2VekNc2HFZ1NcROiMxtH09imAFFdL4051T8txVX8FYKGHf8d9Ne/vzWUyxQV2qeHnbOSliRiZafGirhjaIeu042HdWsNJ2Lkjckm7GXOAWAYCDtVBroJradZe45ehUocEOJz9HgGGCMGuWbw9u2JwMk= kamrul@pop-os"
}


resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow HTTP inbound traffic"
  vpc_id      = aws_vpc.user_app_vpc.id

  ingress {
    description      = "HTTP From ELB"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = [aws_vpc.user_app_vpc.cidr_block]
  }

  tags = {
    Name = "allow-http"
  }
}

resource "aws_security_group" "allow_ssh_from_vpc" {
  name        = "allow_ssh_from_vpc"
  description = "Allow SSH from VPC"
  vpc_id      = aws_vpc.user_app_vpc.id

  ingress {
    description      = "HTTP From ELB"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = [aws_vpc.user_app_vpc.cidr_block]
  }

  tags = {
    Name = "allow-ssh-from-vpc"
  }
}

resource "aws_security_group" "allow_ssh_from_internet" {
  name        = "allow_ssh_from_internet"
  description = "Allow SSH from from internet"
  vpc_id      = aws_vpc.user_app_vpc.id

  ingress {
    description      = "HTTP From ELB"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/32"]
  }

  tags = {
    Name = "allow-ssh-from-internet"
  }
}


resource "aws_instance" "user_app_production_1" {
  vpc_security_group_ids = [aws_security_group.allow_http.id, aws_security_group.allow_ssh_from_vpc.id]
  subnet_id = aws_subnet.user_app_private_subnet.id
  associate_public_ip_address = false
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro"
  key_name = aws_key_pair.user_app_deployer.key_name

  tags = {
    Name = "user-app-production-1"
  }
}


resource "aws_instance" "user_app_deployer_ec2" {
  vpc_security_group_ids = [aws_security_group.allow_ssh_from_internet.id]
  subnet_id = aws_subnet.user_app_public_subnet.id
  associate_public_ip_address = true
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro"
  key_name = aws_key_pair.user_app_deployer.key_name

  tags = {
    Name = "user-app-deployer-ec2"
  }
}

