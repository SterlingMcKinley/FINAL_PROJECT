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
  alarm_actions = [arn:aws:sns:us-east-1:935884938307:CPU_MEM_topic]
}

resource "aws_cloudwatch_metric_alarm" "Grade-Tracker-ECS-Low_CPU" {
  alarm_name = "Grade-Tracker-ECS-Low_CPU"
  comparison_operator = "LessThanThreshold"

  period = "300"
  evaluation_periods = "1"
  datapoints_to_alarm = 1

  statistic = "Average"
  threshold = "1"
  alarm_description = ""

  metric_name = "CPU_Low_Usage"
  namespace = "AWS/ECS"
  dimensions = {
    ClusterName = "final-project-ecs-service-staging"
  }

  actions_enabled = true
  insufficient_data_actions = []
  alarm_actions = [arn:aws:sns:us-east-1:935884938307:CPU_MEM_topic]
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
  alarm_actions = [arn:aws:sns:us-east-1:935884938307:CPU_MEM_topic]
}

resource "aws_cloudwatch_metric_alarm" "Grade-Tracker-ECS-Low_MEM" {
  alarm_name = "Grade-Tracker-ECS-Low_MEM"
  comparison_operator = "LessThanThreshold"

  period = "300"
  evaluation_periods = "1"
  datapoints_to_alarm = 1

  statistic = "Average"
  threshold = "1"
  alarm_description = ""

  metric_name = "Memory_Low_Usage"
  namespace = "AWS/ECS"
  dimensions = {
    ClusterName = "final-project-ecs-service-staging"
  }

  actions_enabled = true
  insufficient_data_actions = []
  alarm_actions = [arn:aws:sns:us-east-1:935884938307:CPU_MEM_topic]
}