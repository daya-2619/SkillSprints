# Production Launch Checklist - SkillSprint

## Security & Privacy
- [ ] Penetration test completed.
- [ ] Privacy Policy and Terms of Service written and linked in app.
- [ ] No hardcoded secrets in source control.

## Performance
- [ ] Locust load test confirms > 1000 RPS on core read endpoints.
- [ ] Mobile app bundle size optimized (< 50MB).
- [ ] CloudFront caching headers verified.

## Monitoring
- [ ] Sentry installed and alerts routed to Slack.
- [ ] CloudWatch dashboards created for ECS and RDS.
- [ ] Firebase Analytics events mapped.

## App Stores
- [ ] Screenshots and Marketing copy finalized.
- [ ] Apple App Store privacy questionnaire completed.
- [ ] Google Play Data safety form completed.
- [ ] EAS Build triggered for production profiles.
