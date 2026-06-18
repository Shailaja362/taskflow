# TaskFlow — Full-Stack + DevOps Portfolio Project

A complete, **100% free** project covering the entire Full Stack / DevOps job
description: React + TypeScript frontend, Node.js + Express + PostgreSQL backend,
Docker, Terraform (run free against LocalStack), Jenkins CI/CD, Nginx + TLS,
shell scripting, and Git workflow.

Nothing here costs money: no paid AWS, no paid SaaS. Everything runs locally on
your **Windows + WSL2 (Ubuntu)** machine.

---

## What this covers  

| JD area | Where it lives |
|---|---|
| React / TS / HTML / CSS | `frontend/` |
| Node.js / REST / SQL | `backend/` |
| Docker (multi-stage, compose) | `*/Dockerfile`, `docker-compose.yml` |
| Terraform / IaC (VPC, RDS, ECS, ALB, S3, IAM) | `infra/` |
| AWS services (free via LocalStack) | `infra/docker-compose.localstack.yml` |
| ECS / orchestration | `infra/modules/ecs` |
| Jenkins CI/CD + quality gates | `Jenkinsfile`, `jenkins/` |
| Linux + shell scripting | `scripts/` |
| Networking / Nginx / TLS | `nginx/`, `frontend/nginx.conf` |
| Git workflow | `.github/branching-strategy.md` |

---

## Prerequisites (all free)

On WSL2 Ubuntu, install:

```bash
# Node.js 20 (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20

# Docker Desktop (Windows) with WSL2 integration enabled, OR docker engine in WSL
docker --version
docker compose version

# Terraform
sudo apt-get update && sudo apt-get install -y unzip
curl -fsSL https://releases.hashicorp.com/terraform/1.9.0/terraform_1.9.0_linux_amd64.zip -o tf.zip
unzip tf.zip && sudo mv terraform /usr/local/bin/ && rm tf.zip
terraform version

# (optional) awslocal helper for LocalStack
pip install awscli-local
```

---

# STEP-BY-STEP GUIDE

Do these phases in order. Each phase is independently runnable.

## Phase 1 — Run the app locally (no Docker)

```bash
# Terminal 1: start a Postgres for dev
docker run --rm -d --name tf-db -p 5432:5432 \
  -e POSTGRES_USER=taskflow -e POSTGRES_PASSWORD=taskflow -e POSTGRES_DB=taskflow \
  postgres:16-alpine

# Terminal 1: backend
cd backend
cp .env.example .env
# edit .env: DATABASE_URL=postgres://taskflow:taskflow@localhost:5432/taskflow
npm install
npm run dev          # API on http://localhost:4000

# Terminal 2: frontend
cd frontend
npm install
npm run dev          # UI on http://localhost:5173 (proxies /api to :4000)
```

Open http://localhost:5173 → register an account → create and move tasks.

**You just exercised:** React, TypeScript, REST API, Express, PostgreSQL, JWT auth.

---

## Phase 2 — Containerize everything with Docker

```bash
# from repo root
./scripts/gen-certs.sh          # self-signed TLS cert for the proxy
docker compose up --build -d

docker compose ps               # see db, backend, frontend, proxy
```

- Frontend (via its own Nginx): http://localhost:8080
- API direct: http://localhost:4000/health
- HTTPS via reverse proxy: https://localhost (accept the self-signed warning)

**You just exercised:** multi-stage Dockerfiles, docker compose orchestration,
Nginx reverse proxy, TLS/SSL termination, HTTP→HTTPS redirect, container
healthchecks, service dependencies.

```bash
# Useful ops commands (Linux/Docker skills)
docker compose logs -f backend
./scripts/backup-db.sh          # gzipped DB backup with retention
./scripts/healthcheck.sh        # poll health endpoint
docker compose down             # stop (add -v to wipe data)
```

---

## Phase 3 — Provision infrastructure with Terraform (free, LocalStack)

```bash
# Start the free local AWS emulator
docker compose -f infra/docker-compose.localstack.yml up -d

cd infra/envs/dev
cp terraform.tfvars.example terraform.tfvars

terraform init
terraform validate
terraform plan      # review the VPC, RDS, ECS, ALB, S3, IAM resources
terraform apply -auto-approve
terraform output    # alb_dns_name, s3_website, ecs_cluster
```

Inspect the "AWS" resources you created (free):

```bash
awslocal ec2 describe-vpcs
awslocal s3 ls
awslocal elbv2 describe-load-balancers
awslocal ecs list-clusters
```

Tear down:

```bash
terraform destroy -auto-approve
```

> To target **real AWS** later: in `infra/envs/dev/providers.tf`, remove the
> `endpoints{}` block and the fake credentials / `skip_*` lines, then run
> `aws configure`. The module code does not change — that's the point of IaC.

**You just exercised:** Terraform modules, variables, outputs, remote provider
config, VPC/subnets/IGW/route tables, security groups (firewall rules), RDS,
ECS Fargate task defs + service, ALB + target groups + listeners, IAM roles
(least privilege), CloudWatch log groups, S3.

---

## Phase 4 — CI/CD with Jenkins

```bash
docker compose -f jenkins/docker-compose.jenkins.yml up -d

# Get the unlock password
docker compose -f jenkins/docker-compose.jenkins.yml exec jenkins \
  cat /var/jenkins_home/secrets/initialAdminPassword
```

1. Open http://localhost:8081, unlock, install suggested plugins, install the
   **NodeJS** plugin (Manage Jenkins → Plugins).
2. Manage Jenkins → Tools → add a NodeJS 20 install named `node20`.
   (Then reference it with a `tools { nodejs 'node20' }` block if needed.)
3. New Item → **Pipeline** → "Pipeline script from SCM" → Git → your repo URL →
   Script Path: `Jenkinsfile`.
4. Build Now and watch the stages: checkout → lint → unit tests → build →
   docker build → Trivy security scan → deploy.

**You just exercised:** pipeline-as-code, parallel stages, automated quality
gates (lint, tests, vulnerability scan), Docker image builds in CI, branch-based
deploy logic, build agents.

---

## Phase 5 — Git workflow

```bash
git init && git add . && git commit -m "chore: initial TaskFlow scaffold"
git checkout -b feature/TF-1-task-priority
# ...make a change...
git commit -am "feat: add task priority field"
# push & open a PR into main; CI must pass before merge
```

See `.github/branching-strategy.md`.

---

n Docker. All free.
Ask and I'll generate that project the same way.
