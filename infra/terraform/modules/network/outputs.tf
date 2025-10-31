output "vpc_id" {
  description = "Identifier for the created VPC."
  value       = aws_vpc.this.id
}

output "public_subnet_ids" {
  description = "Identifiers for the public subnets."
  value       = [for subnet in aws_subnet.public : subnet.id]
}

output "private_subnet_ids" {
  description = "Identifiers for the private subnets."
  value       = [for subnet in aws_subnet.private : subnet.id]
}
