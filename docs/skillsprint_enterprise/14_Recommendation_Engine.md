# Recommendation Engine Design - SkillSprint

## Objective
Serve the most engaging and relevant educational micro-videos in the TikTok-style feed.

## Data Sources
- **Explicit Signals**: Likes, Bookmarks, Course Enrollments.
- **Implicit Signals**: Watch time duration, drop-off points, re-watches.

## Architecture
1. **Event Streaming**: User interactions hit the FastAPI `/metrics/feed` endpoint and are buffered in Redis.
2. **Batch Processing**: A Celery cron task periodically aggregates these events into the database.
3. **Model (Phase 1)**: Collaborative filtering using matrix factorization (users x video tags).
4. **Serving**: The `/feeds/trending` API combines the base score with freshness (time decay) to return a ranked list of UUIDs.
