locals {
  name = "taskflow-${var.env}"
}

module "vpc" {
  source = "../../modules/vpc"
  name   = local.name
}

module "iam" {
  source = "../../modules/iam"
  name   = local.name
}

module "s3" {
  source      = "../../modules/s3"
  bucket_name = "${local.name}-frontend"
}


