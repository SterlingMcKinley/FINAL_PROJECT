data "aws_route53_zone" "selected" {
  name         = "www.franns.net."
  private_zone = false
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.selected.zone_id 
  name    = "db-dev.${data.aws_route53_zone.selected.name}"
  type    = "CNAME"
  ttl     = 300
  records = [aws_db_instance.default.endpoint]
  depends_on = [aws_db_instance.default]
}