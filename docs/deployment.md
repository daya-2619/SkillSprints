# Deployment Guide

We use Terraform and GitHub Actions to deploy to AWS.

## CI/CD Pipeline
- **CI**: On PR to main, runs linting, tests, and Terraform formatting checks.
- **CD**: On merge to main, builds and pushes Docker images, applies Terraform, and triggers EAS builds for the frontend.

## Terraform Apply
Manual deployment can be run via:
```bash
cd infra
terraform init
terraform plan
terraform apply
```
