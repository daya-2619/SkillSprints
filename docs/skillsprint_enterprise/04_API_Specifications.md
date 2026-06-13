# API Specifications - SkillSprint

## Base URL
`/api/v1`

## Authentication
`POST /auth/login`
- Body: `{ email, password }`
- Response: `{ access_token, refresh_token }`

`POST /auth/refresh`
- Body: `{ refresh_token }`
- Response: `{ access_token }`

## Courses & Feeds
`GET /feeds/trending`
- Query: `?limit=10&cursor=uuid`
- Response: `[ { id, video_url, title, instructor_name } ]`

`GET /courses/{id}`
- Response: Course details including Modules and Lessons.

## AI Tutor
`POST /tutor/ask`
- Body: `{ course_id, message_history: [] }`
- Response (SSE): Streaming markdown string.

## Live Sessions
`WS /live/{room_id}`
- Protocol: WebSocket
- Messages: Chat, Polls, Hand-raising.
