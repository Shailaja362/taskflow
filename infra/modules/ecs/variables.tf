variable "name" {
  type = string
}
variable "region" {
  type = string
  default = "us-east-1"
}
variable "vpc_id" {
  type = string
}
variable "subnet_ids" {
  type = list(string)
}
variable "alb_sg_id" {
  type = string
}
variable "target_group_arn" {
  type = string
}
variable "execution_role_arn" {
  type = string
}
variable "image" {
  type = string
}
variable "database_url" {
  type = string
}
variable "jwt_secret" {
  type = string
  sensitive = true
}
variable "desired_count" {
  type = number
  default = 2
}
