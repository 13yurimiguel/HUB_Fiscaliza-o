output "bucket_name" {
  description = "Name of the S3 bucket storing build and report artifacts."
  value       = aws_s3_bucket.artifacts.bucket
}

output "repository_url" {
  description = "URL of the ECR repository used for container images."
  value       = aws_ecr_repository.containers.repository_url
}
