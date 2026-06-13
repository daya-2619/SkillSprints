variable "vpc_id" {}
variable "subnet_ids" {
  type = list(string)
}

resource "aws_ecs_cluster" "main" {
  name = "skillsprint-cluster"
}

resource "aws_ecs_task_definition" "api" {
  family                   = "skillsprint-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name  = "api"
      image = "skillsprint-api:latest"
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "api" {
  name            = "skillsprint-api-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    assign_public_ip = true
  }
}

output "cluster_name" {
  value = aws_ecs_cluster.main.name
}
