resource "aws_cloudwatch_composite_alarm" "CPU_and_Mem" {
  alarm_description = "Composite alarm that monitors CPU Utilization and Memory"
  alarm_name        = "CPU_MEM_Composite_Alarm"
  alarm_actions = [aws_sns_topic.CPU_MEM_topic.arn]

  alarm_rule = "ALARM(${aws_cloudwatch_metric_alarm.Grade-Tracker-ECS-High_CPU.alarm_name}) OR ALARM(${aws_cloudwatch_metric_alarm.Grade-Tracker-ECS-Low_CPU.alarm_name}) OR ALARM(${aws_cloudwatch_metric_alarm.Grade-Tracker-ECS-High_MEM.alarm_name}) OR ALARM(${aws_cloudwatch_metric_alarm.Grade-Tracker-ECS-Low_MEM.alarm_name})"


  depends_on = [
    aws_cloudwatch_metric_alarm.Grade-Tracker-ECS-High_CPU,
    aws_cloudwatch_metric_alarm.Grade-Tracker-ECS-Low_CPU,
    aws_cloudwatch_metric_alarm.Grade-Tracker-ECS-High_MEM,
    aws_cloudwatch_metric_alarm.Grade-Tracker-ECS-Low_MEM,
    aws_sns_topic.CPU_MEM_topic,
    aws_sns_topic_subscription.email-target
  ]
}

resource "aws_sns_topic" "CPU_MEM_topic" {
  name = "CPU_MEM_topic"
}
 
#Grade_Tracker_Resources

# resource "aws_sns_topic" "topic" {
#   name = "topic-name"
# }

resource "aws_sns_topic_subscription" "email-target" {
  topic_arn = aws_sns_topic.CPU_MEM_topic.arn
  protocol  = "email"
  endpoint  = "teamfranns@gmail.com"

  depends_on = [
    aws_sns_topic.CPU_MEM_topic
  ]
}


# Cloudwatch Alarm for ECS Cluster

resource "aws_cloudwatch_metric_alarm" "Grade-Tracker-ECS-High_CPU" {
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
}

resource "aws_cloudwatch_metric_alarm" "Grade-Tracker-ECS-Low_CPU" {
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
}

resource "aws_cloudwatch_metric_alarm" "Grade-Tracker-ECS-High_MEM" {
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
}

resource "aws_cloudwatch_metric_alarm" "Grade-Tracker-ECS-Low_MEM" {
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