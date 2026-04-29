# 📚 Digital Publishing Platform (Digital Prokashoni)

A state-of-the-art web application designed to empower authors and readers through a seamless digital ecosystem. This platform facilitates book publishing, distribution, and secure transactions with real-time data synchronization.

---

## 🚀 Core Functionalities

### 1. Author Ecosystem & Dashboard
*   **Tiered Subscriptions**: Three distinct plans (Basic, Pro, Lifetime) with varying commissions and features.
*   **Real-time Analytics**: Dynamic stats for authors including total sales, royalties (83% share), and unique reader counts. (SYNCED REAL-TIME)
*   **Book Management**: A streamlined portal for authors to upload ebooks or hardcopies, manage descriptions, and track earnings.
*   **Profile Customization**: Authors can maintain bios, avatars, and contact information.

### 2. Reader Experience
*   **Digital Library**: A premium, categorized catalog of ebooks and physical books with dynamic filtering and global search.
*   **Interactive Reviews**: A testimonial system where readers can leave feedback (moderated by admin).
*   **Secure Checkout**: A robust cart and checkout flow with multiple payment options (bKash, Nagad, Card).
*   **Personalized Profile**: Readers can track their purchases and manage their account details.
*   **Instant Reading**: Purchased books show a "Read" button to open the digital copy instantly.

### 3. Backend & Infrastructure (Supabase)
*   **Real-time Database**: PostgreSQL with real-time subscriptions for instant UI updates across all tables.
*   **Cloud Storage**: Automated bucket management for book covers and digital files (PDFs).
*   **Row Level Security (RLS)**: Hardened security policies ensuring users can only edit their own data while the public can view published content.
*   **Authentication**: Secure login via Magic Links (OTP) and Social Auth (Google).

### 4. Admin & CMS Capabilities
*   **Site Settings**: A central interface to update hero sections, CTA texts, and featured statistics globally.
*   **Moderation Workflow**: Approval system for user testimonials to maintain platform quality.

---

## 🛠 Technical Architecture

*   **Frontend**: React (Vite) with TypeScript.
*   **State Management**: Custom `useStore` hook using a singleton pattern with real-time listeners.
*   **Styling**: Modern CSS with high-end aesthetics (Gradients, Glassmorphism, Micro-animations).
*   **Database**: Supabase (PostgreSQL) with full factory-reset capability via `supabase_setup.sql`.

---

## ✅ Completed Tasks & Milestones

1.  **Database Factory Reset**: Resolved critical foreign key constraints using `CASCADE` strategy.
2.  **Royalty Alignment**: Standardized author royalties at **83%** across the platform.
3.  **Storage Integration**: Implemented public bucket policies for `book-covers`.
4.  **Global Search**: Integrated Navbar search with real-time filtering across the library.
5.  **Instant Reading**: Added "Read" functionality for owned books in the library.
6.  **Mobile Navigation**: Fixed menu overlaps and added profile links for mobile users.
7.  **Environment Security**: Migrated production credentials to a clean `.env.local` template.

---

## 📋 Pending Tasks (Next Steps)

- [ ] **Storage Bucket Activation**: Manually create the `book-covers` bucket in Supabase and set to "Public".
- [ ] **Real Payments Integration**: Replace simulations with real PGW API keys.
- [ ] **Subscription Guard**: Setup Edge Function to auto-expire writer plans.
- [ ] **Email Automation**: Add SMTP support for purchase receipts.
