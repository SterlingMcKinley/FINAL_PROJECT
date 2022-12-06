variable "region"{
    type = string
    default = "us-east-1"
}

variable "bucketname"{
    type = string
    default = "terraform-remote-statefile-store-final"
}

variable "tablename"{
    type = string
    default = "terraform_state_lock_table-final"
}