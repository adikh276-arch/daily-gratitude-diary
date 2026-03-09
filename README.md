# Daily Gratitude Diary

A gentle space to notice small good things, one day at a time.

## Project info

This project is a React-based web application for tracking daily gratitude. It features a clean, minimal interface designed to help users focus on positive moments in their lives.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- i18next (Internationalization)
- Framer Motion (Animations)

## Getting Started

### Prerequisites

- Node.js & npm installed

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/adikh276-arch/daily-gratitude-diary
   ```

2. Navigate to the project directory:
   ```sh
   cd daily-gratitude-diary
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Internationalization

This project supports multiple languages. Translations are managed via `i18next` and stored in `src/i18n/locales`.

## Docker and Deployment

A `Dockerfile` and `vite-nginx.conf` are provided for containerized deployment. The application is configured to run under the subpath `/daily_gratitude_journal/`.
