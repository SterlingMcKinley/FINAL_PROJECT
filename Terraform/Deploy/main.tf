provider "aws" {
  access_key = var.aws_access_key_id
  secret_key = var.aws_secret_access_key
  region     = "us-east-1"

}

# Cluster
resource "aws_ecs_cluster" "aws-ecs-cluster" {
  name = "full-stack-app-cluster"
  tags = {
    Name = "full-stack-app-ecs"
  }
}

resource "aws_cloudwatch_log_group" "log-group" {
  name = "/ecs/full-stack-logs"

  tags = {
    Application = "full-stack-app"
  }
}

# Task Definition

resource "aws_ecs_task_definition" "aws-ecs-task" {
  family = "full-stack-app-task"

  container_definitions = <<EOF
  [
  {
      "name": "frontend-container",
      "image": "richarddeodutt/d5-frontend:latest",
      "essential": false,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/full-stack-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "backend-container",
      "image": "richarddeodutt/d5-backend:latest",
      "essential": false,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/full-stack-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "adminer-container",
      "image": "richarddeodutt/d5-adminer:latest",
      "essential": false,
      "environment": [
                {
                    "name": "ADMINER_DEFAULT_SERVER",
                    "value": "127.0.0.1"
                }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/full-stack-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "mysql-container",
      "image": "richarddeodutt/d5-mysql:latest",
      "essential": false,
      "environment": [
                {
                    "name": "MYSQL_ROOT_PASSWORD",
                    "value": "example"
                },
                {
                    "name": "MYSQL_DATABASE",
                    "value": "test"
                }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/full-stack-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "nginx-container",
      "image": "richarddeodutt/d5-nginx:latest",
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/full-stack-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": [
        {
          "containerPort": 80
        },
        {
          "containerPort": 5000
        },
        {
          "containerPort": 9000
        }
      ]
    }
  ]
  EOF

  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  memory                   = "1024"
  cpu                      = "512"
  execution_role_arn       = "arn:aws:iam::498463483397:role/ecsTaskEX"
  task_role_arn            = "arn:aws:iam::498463483397:role/ecsTaskEX"

}

# ECS Service
resource "aws_ecs_service" "aws-ecs-service" {
  name                 = "full-stack-app-ecs-service"
  cluster              = aws_ecs_cluster.aws-ecs-cluster.id
  task_definition      = aws_ecs_task_definition.aws-ecs-task.arn
  launch_type          = "FARGATE"
  scheduling_strategy  = "REPLICA"
  desired_count        = 1
  force_new_deployment = true

  network_configuration {
    subnets = [
      aws_subnet.private_a.id,
      aws_subnet.private_b.id
    ]
    assign_public_ip = false
    security_groups  = [aws_security_group.http.id, aws_security_group.ingress_app.id, aws_security_group.ingress_admin.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend-full-stack-app.arn
    container_name   = "nginx-container"
    container_port   = 80
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend-full-stack-app.arn
    container_name   = "nginx-container"
    container_port   = 5000
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.adminer-full-stack-app.arn
    container_name   = "nginx-container"
    container_port   = 9000
  }

}