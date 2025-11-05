# 0053-split-github-action-stages

Split the GitHub Actions CI workflow into separate test and build stages for better parallelization and failure isolation.

## Tasks

- [x] Modify .github/workflows/ci.yml to have separate test and build jobs
- [x] Ensure build job depends on test job success
- [x] Test the updated workflow
