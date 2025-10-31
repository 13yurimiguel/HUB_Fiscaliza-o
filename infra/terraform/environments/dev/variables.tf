variable "environment" {
  description = "Deployment environment identifier (e.g. dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region where resources will be created."
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the primary VPC."
  type        = string
  default     = "10.20.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to spread networking resources across."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets. Must align in length with availability_zones."
  type        = list(string)
  default     = ["10.20.0.0/20", "10.20.16.0/20"]

  validation {
    condition     = length(var.public_subnet_cidrs) == length(var.availability_zones)
    error_message = "Provide a public subnet CIDR for each availability zone."
  }
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets. Must align in length with availability_zones."
  type        = list(string)
  default     = ["10.20.32.0/20", "10.20.48.0/20"]

  validation {
    condition     = length(var.private_subnet_cidrs) == length(var.availability_zones)
    error_message = "Provide a private subnet CIDR for each availability zone."
  }
}

variable "eks_version" {
  description = "Kubernetes version for the EKS control plane."
  type        = string
  default     = "1.29"
}

variable "eks_desired_capacity" {
  description = "Desired number of worker nodes for the default node group."
  type        = number
  default     = 2
}

variable "eks_min_capacity" {
  description = "Minimum number of worker nodes for the default node group."
  type        = number
  default     = 1
}

variable "eks_max_capacity" {
  description = "Maximum number of worker nodes for the default node group."
  type        = number
  default     = 4
}

variable "eks_instance_types" {
  description = "Allowed EC2 instance types for the default node group."
  type        = list(string)
  default     = ["t3.medium"]
}

variable "artifact_repository_retention" {
  description = "Number of days to retain untagged images in the ECR repository."
  type        = number
  default     = 14
}
