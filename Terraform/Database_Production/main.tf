resource "aws_db_instance" "default" {
  allocated_storage      = 10
  max_allocated_storage  = 20
  identifier             = "franns-prod"
  engine                 = "mysql"
  engine_version         = "8.0.28"
  instance_class         = "db.t3.micro"
  db_name                = var.mysqldatabase
  username               = var.mysqlrootuser
  password               = var.mysqlrootpassword
  skip_final_snapshot    = true
  publicly_accessible    = true
  multi_az               = true
  vpc_security_group_ids = [aws_security_group.ingress_db.id]
  depends_on             = [aws_security_group.ingress_db]
}

resource "aws_security_group" "ingress_db" {
  name        = "ingress-db-prod"
  description = "Allow ingress to db"

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}