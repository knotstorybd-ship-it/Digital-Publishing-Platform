import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage_Premium";
import { BrowsePage } from "./pages/BrowsePage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthorPage } from "./pages/AuthorPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AuthorDashboardPage } from "./pages/AuthorDashboardPage";
import { WriterRegistrationPage } from "./pages/WriterRegistrationPage";
import {
  AboutPage,
  ContactPage,
  LegalPage,
  PaymentInfoPage,
  PublishingPolicyPage,
  ReaderTermsPage,
  SupportPage,
} from "./pages/ContentPages";

import { ErrorPage } from "./pages/ErrorPage";

import { LibraryPage } from "./pages/LibraryPage";
import { ReaderPage } from "./pages/ReaderPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: HomePage },
      { path: "browse", Component: BrowsePage },
      { path: "book/:id", Component: BookDetailPage },
      { path: "library", Component: LibraryPage },
      { path: "writer", Component: AuthorDashboardPage }, // Point to the premium Author dashboard
      { path: "join-writer", Component: WriterRegistrationPage },
      { path: "author-dashboard", element: <Navigate to="/writer" replace /> }, // Redirect old path
      { path: "checkout", Component: CheckoutPage },
      { path: "author/dashboard", element: <Navigate to="/writer" replace /> },
      { path: "author/:name", Component: AuthorPage },
      { path: "admin", Component: AdminDashboardPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "support", Component: SupportPage },
      { path: "terms", Component: LegalPage },
      { path: "privacy", Component: LegalPage },
      { path: "refund-policy", Component: LegalPage },
      { path: "copyright-policy", Component: LegalPage },
      { path: "writer-agreement", Component: LegalPage },
      { path: "payment-terms", Component: LegalPage },
      { path: "publishing-policy", Component: PublishingPolicyPage },
      { path: "reader-terms", Component: ReaderTermsPage },
      { path: "payment-info", Component: PaymentInfoPage },
      { path: "reset-password", Component: ResetPasswordPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "reader/:id",
    Component: ReaderPage
  }
]);
