variable "name" {
  description = "Base name used for artifact storage resources."
  type        = string
}

variable "tags" {
  description = "Tags applied to created resources."
  type        = map(string)
  default     = {}
}

variable "untagged_retention_in_days" {
  description = "Retention window for untagged container images."
  type        = number
  default     = 30
}
