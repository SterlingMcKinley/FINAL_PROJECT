data "aws_route53_zone" "selected" {
  name         = "team.franns.net."
  private_zone = false
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.selected.zone_id 
  name    = "db-app.${data.aws_route53_zone.selected.name}"
  type    = "CNAME"
  ttl     = 300
  records = [aws_db_instance.default.address]
  depends_on = [aws_db_instance.default]
}

output "db_url" {
  value = "http://${aws_route53_record.www.name}"
}