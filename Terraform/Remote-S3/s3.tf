resource "aws_s3_bucket" "bucket" {
    bucket = var.bucketname
    lifecycle {
        prevent_destroy = true
    }
}

resource "aws_s3_bucket_acl" "bucket_acl" {
    bucket = aws_s3_bucket.bucket.id
    acl    = "private"
}

resource "aws_s3_bucket_versioning" "versioning" {
    bucket = aws_s3_bucket.bucket.id

    versioning_configuration {
      status = "Enabled"
    }
}