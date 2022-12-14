terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 4.0"
        }
    }
    backend "s3" {
        encrypt = true
        bucket = "~bucketname~"
        dynamodb_table = "~tablename~"
        key = "terraform.tfstate"
        region = "~region~"
    }
}