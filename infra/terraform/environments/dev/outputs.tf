output "vpc_id" {
  description = "Identifier of the provisioned VPC."
  value       = module.network.vpc_id
}

output "private_subnet_ids" {
  description = "List of private subnet identifiers for internal workloads."
  value       = module.network.private_subnet_ids
}

output "eks_cluster_name" {
  description = "Name of the EKS control plane."
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "API endpoint for the EKS control plane."
  value       = module.eks.cluster_endpoint
}

output "artifacts_bucket_name" {
  description = "Name of the S3 bucket storing build and report artifacts."
  value       = module.artifacts.bucket_name
}

output "container_registry_url" {
  description = "URL of the ECR repository storing container images."
  value       = module.artifacts.repository_url
}
