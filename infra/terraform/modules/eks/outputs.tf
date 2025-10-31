output "cluster_name" {
  description = "Name of the EKS control plane."
  value       = aws_eks_cluster.this.name
}

output "cluster_endpoint" {
  description = "Endpoint URL for the EKS control plane."
  value       = aws_eks_cluster.this.endpoint
}

output "cluster_security_group_id" {
  description = "Security group that protects the control plane."
  value       = aws_security_group.cluster.id
}

output "node_role_arn" {
  description = "IAM role ARN used by the default node group."
  value       = aws_iam_role.node_group.arn
}
