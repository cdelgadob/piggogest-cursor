# Piggogest Infrastructure

This directory contains Terraform configurations for the Piggogest project infrastructure.

## Prerequisites

- Terraform >= 1.0
- AWS CLI configured with appropriate credentials
- AWS account with necessary permissions

## Getting Started

1. Initialize Terraform:
   ```bash
   terraform init
   ```

2. Review the execution plan:
   ```bash
   terraform plan
   ```

3. Apply the configuration:
   ```bash
   terraform apply
   ```

4. Destroy resources when no longer needed:
   ```bash
   terraform destroy
   ```

## Configuration

The infrastructure creates:
- VPC with public subnet
- Internet Gateway
- Security Groups
- Route Tables

## Variables

Key variables can be customized in `variables.tf` or by creating a `terraform.tfvars` file.

## Outputs

Important resource IDs and information are available as outputs after applying the configuration.