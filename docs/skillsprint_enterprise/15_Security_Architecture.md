# Security Architecture - SkillSprint

## Authentication
- **Flow**: Stateless JWT flow.
- **Tokens**: `access_token` (15m expiry), `refresh_token` (7d expiry, stored HTTP-only secure cookie or Expo SecureStore).

## Data Protection
- **In Transit**: TLS 1.2+ mandatory for all endpoints and CloudFront distributions.
- **At Rest**: RDS volumes encrypted via AWS KMS.
- **Passwords**: Hashed via Argon2 or bcrypt.

## API Security
- **Rate Limiting**: Configured via SlowAPI in FastAPI (e.g., max 50 requests/min per IP).
- **CORS**: Restricted to specific mobile app bundle IDs and web dashboard domains.
- **CSRF**: Double submit cookies for web views.
