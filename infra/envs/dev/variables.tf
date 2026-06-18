variable "env" {
  type = string
  default = "dev"
}
variable "region" {
  type = string
  default = "us-east-1"
}
variable "backend_image" {
  type = string
  default = "taskflow-backend:latest"
}
variable "db_password" {
  type = string
  default = "taskflow"
  sensitive = true
}
variable "jwt_secret" {
  type = string
  default = "dev-only-change-me"
  sensitive = true
}
