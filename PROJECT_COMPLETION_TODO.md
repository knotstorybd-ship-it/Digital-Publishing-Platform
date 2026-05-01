# Digital Publishing Platform Completion To-Do

Use this as the project roadmap. Start with Phase 1 content. After each item is ready, send the matching "Ask Codex" prompt.

## Phase 1: Content First

### 1. Confirm Brand And Site Text

- [ ] Confirm final platform name: Digital Prokashoni / Digital Publishing Platform / other.
- [ ] Confirm tagline.
- [ ] Confirm homepage hero headline and subheadline.
- [ ] Confirm primary CTA labels.
- [ ] Confirm footer copyright text.
- [ ] Confirm contact email, phone, address, and social links.

Ask Codex:

```text
Review all visible website copy and create a content inventory. Do not rewrite yet. Show me what text is missing, duplicated, weak, or inconsistent across the app.
```

### 2. Prepare Homepage Content

- [ ] Final hero copy.
- [ ] Final "how it works" section content.
- [ ] Final reader benefits.
- [ ] Final writer benefits.
- [ ] Final platform stats, or decide to hide fake stats until real data exists.
- [ ] Final testimonials copy, or decide to use real user testimonials only.
- [ ] Final FAQ list.

Ask Codex:

```text
Audit the homepage content only. Keep the current brand tone, identify missing or placeholder content, and give me the exact final text needed for each homepage section.
```

### 3. Prepare Book Catalog Content

- [ ] Decide the initial number of launch books.
- [ ] Collect each book title.
- [ ] Collect author name.
- [ ] Collect category/genre.
- [ ] Collect price.
- [ ] Collect cover image.
- [ ] Collect PDF/eBook file.
- [ ] Write each book description.
- [ ] Decide which books are featured on the homepage.

Ask Codex:

```text
Create a launch catalog content template for this app. Include all fields needed for each book, author, price, cover, PDF, category, and featured status so I can fill it in.
```

### 4. Prepare Writer/Author Content

- [ ] Define writer onboarding rules.
- [ ] Define writer plan names.
- [ ] Define writer plan prices.
- [ ] Define commission/royalty policy.
- [ ] Define payout schedule.
- [ ] Define accepted book formats.
- [ ] Define content approval policy.
- [ ] Define writer dashboard help text.

Ask Codex:

```text
Review the writer registration and writer dashboard content. Create the missing writer onboarding, plan, royalty, payout, and publishing-policy copy needed for a real launch.
```

### 5. Prepare Legal And Trust Content

- [ ] Terms and Conditions.
- [ ] Privacy Policy.
- [ ] Refund Policy.
- [ ] Copyright / DMCA policy.
- [ ] Content submission policy.
- [ ] Payment terms.
- [ ] Writer agreement.
- [ ] Reader purchase terms.

Ask Codex:

```text
Create a legal-content checklist for this digital publishing app. Tell me which legal pages are missing, where they should appear in the app, and what information I need to provide before drafting them.
```

### 6. Prepare Support Content

- [ ] Support email.
- [ ] Support phone or WhatsApp.
- [ ] Contact form fields.
- [ ] Help/FAQ topics.
- [ ] Reader support flow.
- [ ] Writer support flow.
- [ ] Payment issue support flow.
- [ ] Book upload issue support flow.

Ask Codex:

```text
Audit the support and contact content needed for readers, writers, payment issues, and book upload issues. Create a complete support content plan.
```

### 7. Prepare Admin Content

- [ ] Admin dashboard labels.
- [ ] Book approval statuses.
- [ ] Writer approval statuses.
- [ ] Payment transaction statuses.
- [ ] Order status labels.
- [ ] Testimonial approval labels.
- [ ] Admin empty states.
- [ ] Admin warning/error messages.

Ask Codex:

```text
Review the admin dashboard content and status labels. Create a list of missing admin copy, empty states, confirmation messages, and error messages needed for production use.
```

## Phase 2: Backend And Data

### 8. Supabase Schema And Storage

- [ ] Apply `supabase_setup.sql`.
- [ ] Confirm all required tables exist.
- [ ] Create public `book-covers` bucket.
- [ ] Confirm cover upload works.
- [ ] Confirm eBook/PDF upload works.
- [ ] Confirm testimonials table works.
- [ ] Confirm payment transactions table works.

Ask Codex:

```text
Verify this app's Supabase setup against the source code and supabase_setup.sql. Tell me exactly which tables, policies, buckets, and seed data are missing.
```

### 9. Seed Real Launch Data

- [ ] Add real books.
- [ ] Add real authors.
- [ ] Add real categories.
- [ ] Add homepage featured books.
- [ ] Add approved testimonials if available.
- [ ] Add site settings.

Ask Codex:

```text
Create a safe Supabase seed plan for this app using the launch content. Include books, authors, categories, testimonials, and site settings.
```

### 10. Authentication And Roles

- [ ] Confirm reader login.
- [ ] Confirm writer signup.
- [ ] Confirm admin access control.
- [ ] Confirm writer role assignment.
- [ ] Confirm protected routes.
- [ ] Confirm auth redirect URLs for live domain.

Ask Codex:

```text
Test and fix the auth flow for reader login, writer registration, admin access, protected routes, and live-domain redirects.
```

### 11. Payments

- [ ] Choose real payment provider.
- [ ] Collect provider credentials.
- [ ] Add backend payment verification.
- [ ] Store verified transactions.
- [ ] Create orders only after verified payment.
- [ ] Add payment failure and retry states.
- [ ] Add admin transaction review.

Ask Codex:

```text
Replace the current sandbox payment flow with a production-ready payment plan. First inspect the existing checkout code, then tell me what provider credentials and backend endpoints are needed.
```

### 12. Security And RLS

- [ ] Review RLS for `orders`.
- [ ] Review RLS for `books`.
- [ ] Review RLS for `authors`.
- [ ] Review RLS for `profiles`.
- [ ] Review RLS for `payment_transactions`.
- [ ] Review storage policies.
- [ ] Prevent authors from seeing other authors' sales.
- [ ] Prevent frontend-only admin bypass.

Ask Codex:

```text
Perform a Supabase RLS and security review for this app. Focus on orders, books, authors, profiles, payment_transactions, storage, and admin access.
```

## Phase 3: Frontend Completion

### 13. Content Integration

- [ ] Replace placeholder text.
- [ ] Add legal pages.
- [ ] Add support/contact pages.
- [ ] Add real FAQ.
- [ ] Add real empty states.
- [ ] Add real error messages.

Ask Codex:

```text
Integrate the approved content into the app without changing the design direction. Replace placeholders, add missing content pages, and keep the app build passing.
```

### 14. User Flow Completion

- [ ] Reader browse flow.
- [ ] Book detail flow.
- [ ] Cart flow.
- [ ] Checkout flow.
- [ ] Purchased book reading flow.
- [ ] Writer registration flow.
- [ ] Writer book upload flow.
- [ ] Admin approval flow.

Ask Codex:

```text
Run a full user-flow audit for reader, writer, checkout, book reading, and admin flows. Fix broken buttons, missing routes, and confusing states.
```

### 15. Responsive And Visual Polish

- [ ] Desktop layout pass.
- [ ] Tablet layout pass.
- [ ] Mobile layout pass.
- [ ] Navigation pass.
- [ ] Forms pass.
- [ ] Dashboard spacing pass.
- [ ] Bangla typography pass.

Ask Codex:

```text
Do a full responsive UI polish pass across the app. Check mobile, tablet, and desktop, then fix spacing, alignment, typography, form layout, and navigation issues.
```

## Phase 4: Verification And Launch

### 16. Local Testing

- [ ] Build passes.
- [ ] No critical console errors.
- [ ] Main routes load.
- [ ] Auth works.
- [ ] Book upload works.
- [ ] Checkout works.
- [ ] Admin dashboard works.

Ask Codex:

```text
Run a complete local smoke test for this app and give me a pass/fail report with blockers, warnings, and exact next fixes.
```

### 17. Production Deployment

- [ ] Push final code to GitHub.
- [ ] Confirm Vercel deployment succeeds.
- [ ] Confirm production env vars.
- [ ] Confirm live domain routes.
- [ ] Confirm live Supabase connection.
- [ ] Confirm live payment flow in test mode or production mode.

Ask Codex:

```text
Deploy and verify the production app. Confirm GitHub remote, Vercel deployment status, live domain, served bundle freshness, env vars, and major user flows.
```

### 18. Final Launch Checklist

- [ ] Real content approved.
- [ ] Real books uploaded.
- [ ] Legal pages live.
- [ ] Support flow live.
- [ ] Supabase schema complete.
- [ ] Storage working.
- [ ] RLS reviewed.
- [ ] Payments verified.
- [ ] Emails configured.
- [ ] Backups planned.
- [ ] Production smoke test passed.

Ask Codex:

```text
Create the final launch readiness report for this app. Check content, backend, frontend, security, payments, deployment, and remaining risks.
```

## Recommended Starting Prompt

Send this first:

```text
Review all visible website copy and create a content inventory. Do not rewrite yet. Show me what text is missing, duplicated, weak, or inconsistent across the app.
```
