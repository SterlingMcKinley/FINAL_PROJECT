data "aws_route53_zone" "selected" {
  name         = "www.franns.net."
  private_zone = false
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.selected.zone_id 
  name    = "app.${data.aws_route53_zone.selected.name}"
  type    = "CNAME"
  ttl     = 300
  records = [aws_alb.final-project.dns_name]
  depends_on = [aws_alb.final-project]
}

output "app_url" {
  value = "http://${aws_route53_record.www.name}"
}