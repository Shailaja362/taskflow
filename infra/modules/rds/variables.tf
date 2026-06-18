variable "name" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "subnet_ids" {
  type = list(string)
}
variable "app_sg_id" {
  type = string
}
variable "db_name" {
  type = string
  default = "taskflow"
}
variable "db_username" {
  type = string
  default = "taskflow"
}
variable "db_password" {
  type = string
  sensitive = true
}
