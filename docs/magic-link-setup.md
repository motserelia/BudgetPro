# BudgetPRO Magic Link: configuration and verification

## Observed during this change

- Android uses `https://budget-pro-lski.vercel.app/api/auth/magic-link`, not its local `https://budgetpro.app` WebView origin.
- Production OPTIONS returned 204 with CORS. A deliberately invalid email returned 400 without sending mail.
- One user-authorized production email request returned HTTP 500. Delivery was not confirmed. No resend or rate-limit workaround was attempted.
- Vercel CLI has no authenticated credentials in this workspace. Supabase dashboard, SMTP settings and upstream logs were unavailable. SMTP/recipient/rate-limit failure cannot be claimed as the proven production cause.
- Fixed source issues: REST OTP parameters, canonical fallback redirect, strict client success validation, safe localized failure classes, and cold-start App Link processing.
- Public assetlinks endpoint returned 200. The existing package `pro.budget.app` and current debug APK signing certificate match the repository association. Physical Android was not connected.

## Vercel

Set these in the production project's Environment Variables and redeploy:

- `SUPABASE_URL`: the actual project's HTTPS URL from Supabase settings.
- `SUPABASE_ANON_KEY`: the same project's anon/public client key; do not use a service-role/secret key.
- `BUDGETPRO_AUTH_REDIRECT_URL=https://budget-pro-lski.vercel.app/`.

Do not put SMTP passwords, Google credentials or service-role keys into `www`.
The auth function must be deployed with the client changes. Updating an Android APK alone does not update `/api/auth/magic-link`.
A safe error response after deployment identifies `AUTH_RECIPIENT_NOT_ALLOWED`, `AUTH_RATE_LIMITED`, `AUTH_EMAIL_DELIVERY_FAILED`, `AUTH_CONFIG_ERROR` or `AUTH_SERVER_UNAVAILABLE` without exposing the upstream body. The function sends exactly one upstream request.

## Supabase hosted Auth

1. Authentication → Sign In / Providers → Email: enable Email authentication. Allow signups only if new users are intended; this app currently requests `create_user: true`.
2. Authentication → URL Configuration: Site URL `https://budget-pro-lski.vercel.app/`; add exactly this HTTPS URL to Redirect URLs. An environment override must agree with Android's verified domain and the client's allowed origin.
3. Authentication → Email Templates: Magic Link must contain `{{ .ConfirmationURL }}` as its sign-in link. The current client uses the implicit token callback, not a custom token-hash/PKCE callback page. Verify the confirmation template too for newly registered users.
4. Authentication → SMTP Settings: inspect whether custom SMTP is enabled. The built-in provider is restricted to organization-team recipients and a small project-wide email quota; it is not suitable for arbitrary production recipients. Do not add recipients to the organization as a workaround and do not retry around limits.
5. If custom SMTP is needed, configure the provider's SMTP host, port, username, password, sender email and sender name **in Supabase SMTP Settings**. Obtain actual credentials from the chosen provider; verify the sender/domain and provider-required DNS records (SPF/DKIM). Use the provider's documented TLS/port settings, not invented values. Hosted Supabase SMTP does not require new BudgetPRO/Vercel SMTP environment variables.
6. Authentication → Rate Limits: review the email quota and resend frequency for that SMTP configuration. Check the provider's own sandbox/authorized-recipient restrictions and delivery logs as well. Do not raise limits to conceal a delivery failure.
7. For the observed HTTP 500, inspect Auth logs and the Vercel invocation once. Record only the upstream HTTP status and error code; never copy access tokens, refresh tokens, API keys, complete URLs containing sessions, or full upstream responses.

## One real verification after deployment/configuration

Use the address authorized by the user. Wait for existing cooldowns; no automatic retry. Confirm the API returns `{ "ok": true }`, then separately confirm receipt (including Spam and the provider's delivery events). API acceptance alone is not proof of mailbox delivery.

On a connected phone, install the updated APK as an update without clearing data. Check domain verification with `adb shell pm get-app-links pro.budget.app`. Open the real email link with the app both running and fully closed. Confirm sign-in, reopen the app, and check session restoration/refresh without printing tokens.

Release/Play-distributed APKs require their own actual signing certificate SHA-256 in `www/.well-known/assetlinks.json`; do not replace the existing fingerprint with a guessed value. Package ID remains `pro.budget.app`.

## Official references

- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/auth/rate-limits
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://github.com/supabase/auth-js/blob/master/src/GoTrueClient.ts (`signInWithOtp` REST contract)
