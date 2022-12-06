resource "aws_lb_target_group" "frontend-full-stack-app" {
  name        = "frontend-full-stack-app"
  port        = 80
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.app_vpc.id

  health_check {
    enabled = true
    path = "/"
    port = 80
    healthy_threshold = 6
    unhealthy_threshold = 2
    timeout = 2
    interval = 5
    matcher = "200"
  }

  depends_on = [aws_alb.full-stack_app]
}

resource "aws_lb_target_group" "backend-full-stack-app" {
  name        = "backend-full-stack-app"
  port        = 5000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.app_vpc.id

  health_check {
    enabled = true
    path = "/"
    port = 5000
    healthy_threshold = 6
    unhealthy_threshold = 2
    timeout = 2
    interval = 5
    matcher = "200"
  }

  depends_on = [aws_alb.full-stack_app]
}

resource "aws_lb_target_group" "adminer-full-stack-app" {
  name        = "adminer-full-stack-app"
  port        = 9000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.app_vpc.id

  health_check {
    enabled = true
    path = "/"
    port = 9000
    healthy_threshold = 6
    unhealthy_threshold = 2
    timeout = 2
    interval = 5
    matcher = "200"
  }

  depends_on = [aws_alb.full-stack_app]
}

resource "aws_alb" "full-stack_app" {
  name               = "full-stack-lb"
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

resource "aws_alb_listener" "frontend-full-stack_app_listener" {
  load_balancer_arn = aws_alb.full-stack_app.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend-full-stack-app.arn
  }
}

resource "aws_alb_listener" "backend-full-stack_app_listener" {
  load_balancer_arn = aws_alb.full-stack_app.arn
  port              = "5000"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend-full-stack-app.arn
  }
}

resource "aws_alb_listener" "adminer-full-stack_app_listener" {
  load_balancer_arn = aws_alb.full-stack_app.arn
  port              = "9000"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.adminer-full-stack-app.arn
  }
}

output "alb_url" {
  value = "http://${aws_alb.full-stack_app.dns_name}"
}
