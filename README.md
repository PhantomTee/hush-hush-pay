# HushHush Pay
The next-generation, privacy-first payroll system built on Solana and Arcium's decentralized MPC network.

## Getting Started

1. Set up your environment variables by copying `.env.example` to `.env`:
   ```sh
   cp .env.example .env
   ```

2. Open the AI Studio Preview URL to interact with the app.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS v4, Framer Motion
- **Privacy Layer:** Arcium Network (MPC)
- **Circuits:** Arcis (Rust-based MPC circuits located in `/circuits/payroll_circuits.rs`)
- **Backend:** Next.js API Routes (Serverless)

## Folder Structure
- `/app` - Next.js App Router containing all 9 specified pages and API routes
- `/components` - Reusable UI components
- `/lib` - Mock data and Arcium client integration
- `/circuits` - Arcis Rust source matching the requested payroll processing circuits
- `/types` - Missing type declarations

_Note on tailwind.config.ts: We're running Tailwind v4 which manages the theme via `@theme` in `app/globals.css`. Design tokens requested have been injected there._
