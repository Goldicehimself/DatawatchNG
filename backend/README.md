# DataWatch NG Backend

Express and MongoDB API backend for DataWatch NG.

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Use this health check once MongoDB is running:

```bash
GET http://localhost:5000/api/health
```

## MVP API Map

- `POST /api/auth/request-otp` - phone-only onboarding OTP.
- `POST /api/auth/verify-otp` - verifies OTP and returns a session token.
- `GET /api/auth/me` - current authenticated profile.
- `POST /api/demo/start` - creates a demo user with simulated telecom data.
- `GET /api/tracking/usage` - usage history.
- `POST /api/tracking/usage` - record app-by-app usage.
- `GET /api/analytics/dashboard` - daily usage, app breakdown, heatmap, spend, fraud timeline.
- `GET /api/alerts` - fraud, usage, background, and subscription alerts.
- `POST /api/alerts/scan` - run MVP fraud scan against usage and subscriptions.
- `PATCH /api/alerts/:id/read` - mark alert as read.
- `GET /api/subscriptions` - active, hidden, flagged, and cancelled subscriptions.
- `POST /api/subscriptions/:id/cancel` - MVP cancellation simulation.
- `GET /api/assistant/messages` - Watcher chat history.
- `POST /api/assistant/messages` - English/Pidgin assistant reply with usage context.
- `POST /api/assistant/voice` - voice transcript endpoint for speech-to-text integrations.
- `POST /api/whatsapp/webhook` - Twilio WhatsApp webhook; also accepts JSON for local testing.
- `PATCH /api/settings` - notification, tracking, language, and AI settings.

## WhatsApp Sandbox

For Twilio Sandbox, expose the local API with ngrok:

```bash
ngrok http 5000
```

Set the Twilio Sandbox incoming message webhook to:

```txt
https://YOUR-NGROK-DOMAIN.ngrok-free.app/api/whatsapp/webhook
```

Use `POST`. Incoming WhatsApp messages are saved to chat history and replied to with Watcher AI context.

## OTP Providers

Local/demo OTP is enabled when:

```env
ENABLE_DEMO_OTP=true
OTP_PROVIDER=local
```

Twilio Verify OTP is enabled when:

```env
ENABLE_DEMO_OTP=false
OTP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
TWILIO_VERIFY_CHANNEL=sms
```

Sendchamp OTP is enabled when:

```env
ENABLE_DEMO_OTP=false
OTP_PROVIDER=sendchamp
SENDCHAMP_API_KEY=your_sendchamp_secret_key
SENDCHAMP_BASE_URL=https://api.sendchamp.com/api/v1
SENDCHAMP_SENDER=DataWatch
SENDCHAMP_OTP_CHANNEL=sms
SENDCHAMP_OTP_LENGTH=6
```
