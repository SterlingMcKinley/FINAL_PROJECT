resource "aws_db_instance" "default" {
  allocated_storage     = 10
  max_allocated_storage = 20
  identifier            = "franns-staging"
  engine                = "mysql"
  engine_version        = "8.0.28"
  instance_class        = "db.t3.micro"
  db_name               = "test"
  username              = "admin"
  password              = "example"
  skip_final_snapshot   = true
  publicly_accessible   = true
  multi_az              = true
}