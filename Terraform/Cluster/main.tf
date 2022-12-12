# Cluster
resource "aws_ecs_cluster" "aws-ecs-cluster" {
  name = "final-project-cluster"
  tags = {
    Name = "final-project-ecs"
  }
}

resource "aws_cloudwatch_log_group" "log-group" {
  name = "/ecs/final-project-logs"

  tags = {
    Application = "final-project"
  }
}

# Task Definition

resource "aws_ecs_task_definition" "aws-ecs-task" {
  family = "final-project-task"

  container_definitions = <<EOF
  [
  {
      "name": "frontend-container",
      "image": "svmckinley/grade_tracker_frontend:latest",
      "essential": false,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/final-project-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "backend-user-container",
      "image": "svmckinley/grade_tracker_backend_microservice_user:latest",
      "essential": false,
      "dependsOn": [{
       "containerName": "mysql-container",
       "condition": "START" }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/final-project-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "backend-assignment-container",
      "image": "svmckinley/grade_tracker_backend_microservice_assignment:latest",
      "essential": false,
      "dependsOn": [{
       "containerName": "mysql-container",
       "condition": "START" }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/final-project-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "mysql-container",
      "image": "svmckinley/grade_tracker_mysql:latest",
      "essential": false,
      "environment": [
                {
                    "name": "MYSQL_ROOT_PASSWORD",
                    "value": "~mysqlrootpassword~"
                },
                {
                    "name": "MYSQL_DATABASE",
                    "value": "~mysqldatabase~"
                }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/final-project-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "adminer-container",
      "image": "svmckinley/grade_tracker_adminer:latest",
      "essential": false,
      "dependsOn": [{
       "containerName": "mysql-container",
       "condition": "START" }],
      "environment": [
                {
                    "name": "ADMINER_DEFAULT_SERVER",
                    "value": "127.0.0.1"
                }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/final-project-logs",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "portMappings": []
    },
      {
      "name": "nginx-container",
      "image": "svmckinley/grade_tracker_nginx:latest",
      "essential": true,
      "dependsOn": [{
       "containerName": "adminer-container",
       "condition": "START" }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/final-project-logs",
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
          "containerPort": 5500
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
  execution_role_arn       = "arn:aws:iam::~awsecsarn~:role/ecsTaskEx"
  task_role_arn            = "arn:aws:iam::~awsecsarn~:role/ecsTaskEx"

}

# ECS Service
resource "aws_ecs_service" "aws-ecs-service" {
  name                 = "final-project-ecs-service"
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
    target_group_arn = aws_lb_target_group.frontend-final-project.arn
    container_name   = "nginx-container"
    container_port   = 80
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend-user-final-project.arn
    container_name   = "nginx-container"
    container_port   = 5000
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend-assignment-final-project.arn
    container_name   = "nginx-container"
    container_port   = 5500
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.adminer-final-project.arn
    container_name   = "nginx-container"
    container_port   = 9000
  }

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

}