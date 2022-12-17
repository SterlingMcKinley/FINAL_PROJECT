data "aws_route53_zone" "selected" {
  name         = "team.franns.net."
  private_zone = false
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.selected.zone_id 
  name    = "west.${data.aws_route53_zone.selected.name}"
  type    = "CNAME"
  ttl     = 300
  records = [aws_alb.final-project.dns_name]
  depends_on = [aws_alb.final-project]
}

output "app_url" {
  value = "http://${aws_route53_record.www.name}"
}


resource "aws_route53_record" "www1" {
  zone_id = data.aws_route53_zone.selected.zone_id 
  name    = "app.${data.aws_route53_zone.selected.name}"
  type    = "CNAME"
  ttl     = 60

  failover_routing_policy {
    type = "PRIMARY"
  }

  set_identifier = "www1"

  alias {
    name                   = "east.${data.aws_route53_zone.selected.name}"
    zone_id                = data.aws_route53_zone.selected.zone_id 
    evaluate_target_health = true
  }
  depends_on = [aws_route53_record.www]

}

resource "aws_route53_record" "www2" {
  zone_id = data.aws_route53_zone.selected.zone_id 
  name    = "app.${data.aws_route53_zone.selected.name}"
  type    = "CNAME"
  ttl     = 60

  failover_routing_policy {
    type = "SECONDARY"
  }

  set_identifier = "www2"

  alias {
    name                   = "west.${data.aws_route53_zone.selected.name}"
    zone_id                = data.aws_route53_zone.selected.zone_id 
    evaluate_target_health = true
  }
  depends_on = [aws_route53_record.www1]

}