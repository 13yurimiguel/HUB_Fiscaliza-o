variable "name" {
  description = "Base name applied to EKS resources."
  type        = string
}

variable "version" {
  description = "Kubernetes version for the control plane."
  type        = string
}

variable "vpc_id" {
  description = "Identifier for the VPC hosting the cluster."
  type        = string
}

variable "subnet_ids" {
  description = "Private subnet IDs for control plane and worker nodes."
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet IDs used for load balancers."
  type        = list(string)
}

variable "desired_capacity" {
  description = "Desired size of the node group."
  type        = number
}

variable "min_capacity" {
  description = "Minimum size of the node group."
  type        = number
}

variable "max_capacity" {
  description = "Maximum size of the node group."
  type        = number
}

variable "instance_types" {
  description = "Instance types used by the worker node group."
  type        = list(string)
}

variable "tags" {
  description = "Tags applied to EKS resources."
  type        = map(string)
  default     = {}
}
