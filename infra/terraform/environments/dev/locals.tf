locals {
  name_prefix = "hub-fiscalizacao-${var.environment}"

  tags = {
    Project     = "HUB Fiscalizacao"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
