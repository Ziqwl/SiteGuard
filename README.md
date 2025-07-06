# SiteGuard

SiteGuard is a SaaS solution for website monitoring and security:

- **Uptime checks** for HTTP/HTTPS endpoints  
- **SSL certificate monitoring** with expiry alerts  
- **Performance metrics** (response time)  
- **Dashboard & alerts** via Telegram / Email  
- **Subscription plans** (Free / Pro / Business)

---

## Project Structure

- **infra**/ # Terraform configs for AWS
- **backend**/ # FastAPI (Python) service
- **frontend**/ # React UI
- **monitoring**/ # Prometheus + Grafana setup
- **docker-compose.yml** # Local development & testing

  ---

## Tech Stack

- **Docker & Docker Compose**  
- **FastAPI** (or **Node.js/Express**)  
- **React** (or **Vue.js**)  
- **Prometheus + Grafana**  
- **Terraform** (Infrastructure as Code)  
- **AWS Free Tier** (EC2 t3.micro: 2 vCPU, 1 GiB RAM)

---
