# Terraform infrastructure bootstrap

This directory seeds the cloud baseline for the HUB Fiscalização platform. The
initial prototype focuses on standing up network primitives, an application
runtime (EKS), and storage endpoints for build artifacts and generated
relatórios.

## Layout

```text
infra/terraform
├── environments
│   └── dev             # Sample environment wiring the shared modules together
└── modules
    ├── artifacts       # S3 bucket + ECR repository for build outputs
    ├── eks             # Managed Kubernetes control plane and node group
    └── network         # VPC, subnets, and routing configuration
```

Each environment folder can be copied to create staging and production stacks.
The `dev` environment ships with sensible defaults so that `terraform
validate`/`plan` can be executed without extra configuration.

## Getting started

1. Configure AWS credentials with permissions to provision VPC, EKS, ECR, and
   S3 resources.
2. Initialise Terraform:

   ```bash
   cd infra/terraform/environments/dev
   terraform init \
     -backend-config="bucket=<state-bucket>" \
     -backend-config="key=terraform/dev/terraform.tfstate" \
     -backend-config="region=<aws-region>"
   ```

3. Review the plan and apply when satisfied:

   ```bash
   terraform plan
   terraform apply
   ```

Outputs expose the VPC, subnets, EKS cluster endpoint, S3 bucket, and ECR
repository URL so that CI/CD and application stacks can be wired automatically.
