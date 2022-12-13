# Cloudwatch Alarm for ECS Cluster

resource "aws_cloudwatch_metric_alarm" "ecs-alert_High-CPUReservation" {
  alarm_name = "Grade-Tracker-ECS-High_CPU"
  comparison_operator = "GreaterThanOrEqualToThreshold"

  period = "60"
  evaluation_periods = "1"
  datapoints_to_alarm = 1

  # second
  statistic = "Average"
  threshold = "80"
  alarm_description = ""

  metric_name = "CPU_High_Usage"
  namespace = "AWS/ECS"
  dimensions = {
    ClusterName = "final-project-ecs-service-staging"
  }

  actions_enabled = true
  insufficient_data_actions = []
  ok_actions = []
  #alarm_actions = [
    #"${var.alarm_actions}",
    #"${aws_autoscaling_policy.ecs-asg_increase.arn}"
   # ]
}

resource "aws_cloudwatch_metric_alarm" "ecs-alert_Low-CPUReservation" {
  alarm_name = "Grade-Tracker-ECS-Low_CPU"
  comparison_operator = "LessThanThreshold"

  period = "300"
  evaluation_periods = "1"
  datapoints_to_alarm = 1

  statistic = "Average"
  threshold = "10"
  alarm_description = ""

  metric_name = "CPU_Low_Usage"
  namespace = "AWS/ECS"
  dimensions = {
    ClusterName = "final-project-ecs-service-staging"
  }

  actions_enabled = true
  insufficient_data_actions = []
  ok_actions = []
  #alarm_actions = [
    #"${var.alarm_actions}",
    #"${aws_autoscaling_policy.ecs-asg_decrease.arn}",
  #]
}

resource "aws_cloudwatch_metric_alarm" "ecs-alert_High-MemReservation" {
  alarm_name = "Grade-Tracker-ECS-High_MEM"
  comparison_operator = "GreaterThanOrEqualToThreshold"

  period = "60"
  evaluation_periods = "1"
  datapoints_to_alarm = 1

  statistic = "Average"
  threshold = "80"
  alarm_description = ""

  metric_name = "Memory_High_Usage"
  namespace = "AWS/ECS"
  dimensions = {
    ClusterName = "final-project-ecs-service-staging"
  }

  actions_enabled = true
  insufficient_data_actions = []
  ok_actions = []
  #alarm_actions = [
    #"${var.alarm_actions}",
    #"${aws_autoscaling_policy.ecs-asg_increase.arn}",
  #]
}

resource "aws_cloudwatch_metric_alarm" "ecs-alert_Low-MemReservation" {
  alarm_name = "Grade-Tracker-ECS-Low_MEM"
  comparison_operator = "LessThanThreshold"

  period = "300"
  evaluation_periods = "1"
  datapoints_to_alarm = 1

  statistic = "Average"
  threshold = "40"
  alarm_description = ""

  metric_name = "Memory_Low_Usage"
  namespace = "AWS/ECS"
  dimensions = {
    ClusterName = "final-project-ecs-service-staging"
  }

  actions_enabled = true
  insufficient_data_actions = []
  ok_actions = []
  #alarm_actions = [
  #  "${var.alarm_actions}",
  #  #"${aws_autoscaling_policy.ecs-asg_decrease.arn}",
  #]
}

# Cloudwatch Alarm for ASG (of ECS Cluster)

# resource "aws_cloudwatch_metric_alarm" "ecs-asg-alert_Has-SystemCheckFailure" {
#   alarm_name = "${var.company}/${var.project}-ECS-Has_SysCheckFailure"
#   comparison_operator = "GreaterThanOrEqualToThreshold"

#   period = "60"
#   evaluation_periods = "1"
#   datapoints_to_alarm = 1

#   # second
#   statistic = "Sum"
#   threshold = "1"
#   alarm_description = ""

#   metric_name = "StatusCheckFailed"
#   namespace = "AWS/EC2"
#   dimensions = {
#     AutoScalingGroupName = "${aws_autoscaling_group.ecs.name}"
#   }

#   actions_enabled = true
#   insufficient_data_actions = []
#   ok_actions = []
#   alarm_actions = [
#     "${var.sns_topic_cloudwatch_alarm_arn}",
#   ]
# }