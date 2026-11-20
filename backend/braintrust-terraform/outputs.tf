###############################################################################
# BrainTrust — Outputs
# These print to console after `terraform apply` — save them!
###############################################################################

output "ec2_public_ip" {
  description = "Elastic IP of the EC2 instance — use this everywhere"
  value       = module.ec2.elastic_ip
}

output "ec2_instance_id" {
  description = "EC2 instance ID"
  value       = module.ec2.instance_id
}

output "ssh_command" {
  description = "Ready-to-run SSH command"
  value       = "ssh -i $HOME/.ssh/${var.key_pair_name}.pem ec2-user@${module.ec2.elastic_ip}"
}

output "scp_schema_command" {
  description = "Sube el esquema SQL (ejecutar desde la raíz del repo, ANTES del primer docker-compose up)"
  value       = "scp -i $HOME/.ssh/${var.key_pair_name}.pem backend/init/01_schema.sql backend/init/02_plagiarism_tables.sql ec2-user@${module.ec2.elastic_ip}:/home/ec2-user/init/"
}

output "ssh_tunnel_postgres_command" {
  description = "Túnel SSH para conectar pgAdmin a localhost:5432 (Postgres no está expuesto a internet)"
  value       = "ssh -i $HOME/.ssh/${var.key_pair_name}.pem -N -L 5432:localhost:5432 ec2-user@${module.ec2.elastic_ip}"
}

output "nip_io_hostname" {
  description = "Hostname gratuito para HTTPS con Certbot (nip.io resuelve a la Elastic IP)"
  value       = "${replace(module.ec2.elastic_ip, ".", "-")}.nip.io"
}

output "api_base_url" {
  description = "Backend API base URL (HTTPS vía Nginx + Let's Encrypt)"
  value       = "https://${replace(module.ec2.elastic_ip, ".", "-")}.nip.io"
}

output "health_check_url" {
  description = "Spring Boot actuator health endpoint"
  value       = "https://${replace(module.ec2.elastic_ip, ".", "-")}.nip.io/actuator/health"
}

output "swagger_url" {
  description = "Swagger UI URL"
  value       = "https://${replace(module.ec2.elastic_ip, ".", "-")}.nip.io/swagger-ui/index.html"
}

output "next_steps" {
  description = "What to do after terraform apply"
  value       = <<-EOT

  ┌─────────────────────────────────────────────────────────────┐
  │  BrainTrust Infrastructure Created!                         │
  │                                                             │
  │  NEXT STEPS:                                                │
  │  1. Wait ~5 min for the user_data bootstrap to finish       │
  │  2. Upload SQL schema:                                      │
  │     terraform output -raw scp_schema_command                │
  │  3. SSH in (ssh_command) and run: docker-compose up -d      │
  │  4. Logs: docker-compose logs -f braintrust-backend         │
  │  5. HTTPS: certbot on nip_io_hostname, then Vercel          │
  └─────────────────────────────────────────────────────────────┘

  EOT
}
