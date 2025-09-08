# Blog Admin Frontend

A React-based admin interface for managing my personal blog platform.

## Overview

This private admin frontend interfaces with the [Blog API backend](https://github.com/frrst-ian/forrest-blog-backend) to provide content management capabilities for my personal blog. This interface allows for creating, editing, and managing blog posts.

> **Note:** This is a private admin interface for blog management. Access is restricted to authorized users only.

**Admin Panel:** [https://ianforrest.netlify.app/admin/posts](https://ianforrest.netlify.app/admin/posts)

## Tech Stack

- React
- CSS3
- React Router (navigation)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/frrst-ian/forrest-blog-private.git
   ```

2. Navigate to project directory:
   ```bash
   cd forrest-blog-private
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your API endpoint and admin credentials.

5. Start development server:
   ```bash
   npm start
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## API Integration

This admin interface connects to the Blog API backend for content management operations. The backend handles authentication and restricts access to authorized administrators only.

Backend repository: [forrest-blog-backend](https://github.com/frrst-ian/forrest-blog-backend)

## License

MIT License