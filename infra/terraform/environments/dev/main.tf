module "network" {
  source = "../../modules/network"

  name                 = local.name_prefix
  cidr_block           = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  tags                 = local.tags
}

module "eks" {
  source = "../../modules/eks"

  name               = local.name_prefix
  version            = var.eks_version
  vpc_id             = module.network.vpc_id
  subnet_ids         = module.network.private_subnet_ids
  public_subnet_ids  = module.network.public_subnet_ids
  tags               = local.tags
  desired_capacity   = var.eks_desired_capacity
  min_capacity       = var.eks_min_capacity
  max_capacity       = var.eks_max_capacity
  instance_types     = var.eks_instance_types
}

module "artifacts" {
  source = "../../modules/artifacts"

  name                      = "${local.name_prefix}-artifacts"
  tags                      = local.tags
  untagged_retention_in_days = var.artifact_repository_retention
}
