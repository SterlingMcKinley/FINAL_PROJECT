resource "aws_lb_target_group" "frontend-final-project" {
  name        = "frontend-final-project-staging"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.app_vpc.id

  health_check {
    enabled = true
    path = "/"
    port = 80
    healthy_threshold = 6
    unhealthy_threshold = 6
    timeout = 2
    interval = 5
    matcher = "200"
  }

  depends_on = [aws_alb.final-project]
}

resource "aws_lb_target_group" "backend-user-final-project" {
  name        = "backend-user-f-proj-stage"
  port        = 5000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.app_vpc.id

  health_check {
    enabled = true
    path = "/"
    port = 5000
    healthy_threshold = 6
    unhealthy_threshold = 6
    timeout = 50
    interval = 5
    matcher = "200"
  }

  depends_on = [aws_alb.final-project]
}

resource "aws_lb_target_group" "backend-assignment-final-project" {
  name        = "backend-assignment-f-proj-stage"
  port        = 5500
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.app_vpc.id

  health_check {
    enabled = true
    path = "/"
    port = 5500
    healthy_threshold = 6
    unhealthy_threshold = 6
    timeout = 50
    interval = 5
    matcher = "200"
  }

  depends_on = [aws_alb.final-project]
}

resource "aws_lb_target_group" "adminer-final-project" {
  name        = "adminer-final-project-staging"
  port        = 9000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.app_vpc.id

  health_check {
    enabled = true
    path = "/"
    port = 9000
    healthy_threshold = 6
    unhealthy_threshold = 6
    timeout = 2
    interval = 5
    matcher = "200"
  }

  depends_on = [aws_alb.final-project]
}

resource "aws_alb" "final-project" {
  name               = "final-project-lb-staging"
  internal           = false
  load_balancer_type = "application"

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id,
  ]

  security_groups = [
    aws_security_group.http.id, aws_security_group.ingress_app.id, aws_security_group.ingress_admin.id
  ]

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_alb_listener" "frontend-final-project_listener" {
  load_balancer_arn = aws_alb.final-project.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend-final-project.arn
  }
}

resource "aws_alb_listener" "backend-user-final-project_listener" {
  load_balancer_arn = aws_alb.final-project.arn
  port              = "5000"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend-user-final-project.arn
  }
}

resource "aws_alb_listener" "backend-assignment-final-project_listener" {
  load_balancer_arn = aws_alb.final-project.arn
  port              = "5500"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend-assignment-final-project.arn
  }
}

resource "aws_alb_listener" "adminer-final-project_listener" {
  load_balancer_arn = aws_alb.final-project.arn
  port              = "9000"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.adminer-final-project.arn
  }
}

output "alb_url" {
  value = "http://${aws_alb.final-project.dns_name}"
}
