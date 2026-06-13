# Deployment Architecture - SkillSprint

## Cloud Provider
**Amazon Web Services (AWS)**

## Components
1. **Frontend**: Expo EAS Build for generating `.ipa` and `.apk`/`.aab` binaries. Over-the-air updates via EAS Update.
2. **Backend**:
   - Containerized via Docker.
   - Pushed to Amazon ECR.
   - Deployed on Amazon ECS (Fargate) for serverless container orchestration.
3. **Database**: Amazon RDS for PostgreSQL with pgvector extension enabled.
4. **Cache/Broker**: Amazon ElastiCache (Redis).
5. **Assets**: S3 + CloudFront for video and static asset delivery.
6. **Infrastructure as Code**: Terraform.
