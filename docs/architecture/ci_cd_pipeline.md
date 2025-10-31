# CI/CD pipeline blueprint

The initial CI/CD pipeline validates the three application surfaces (web, mobile,
services) and the Terraform infrastructure configuration. The workflow runs on
GitHub Actions and is split into dedicated jobs so failures remain isolated and
fast to diagnose.

## Pipeline stages

| Job              | Purpose                                                       |
| ---------------- | ------------------------------------------------------------- |
| Web app          | Install Node dependencies, lint Next.js code, and execute Jest unit tests. |
| Fiscaliza API    | Install NestJS dependencies, lint server code, and execute Jest tests. |
| Mobile app       | Fetch Flutter packages, run static analysis, and execute widget/integration tests. |
| AI assistant     | Install FastAPI service dependencies and run pytest test suite. |
| Terraform        | Enforce formatting, initialise providers (without backend), and validate configuration. |

### Concurrency and caching

* Workflow cancels in-flight runs on the same branch to avoid stale deployments.
* Node jobs enable npm caching using the generated lock file when present.
* Future iterations can extend caching to Flutter (`pub-cache`) and Terraform
  plugin directories for faster executions.

## Release automation roadmap

1. **Container build & scan** – extend the pipeline with jobs that build Docker
   images for the API and AI assistant, run Trivy scans, and push to the
   provisioned ECR repository.
2. **Infrastructure pipelines** – promote Terraform plans through dev → staging
   → production using pull-request environments and drift detection.
3. **Preview deployments** – publish Next.js preview builds and ephemeral
   backend stacks for feature branches using GitHub Environments.
4. **Automated reporting** – attach generated PDF/Docx outputs from the web app
   tests as artifacts so QA teams can review regressions.
5. **Release gating** – add quality thresholds (coverage, lint warnings) and
   security checks (Snyk/GHAS) to block non-compliant merges.
