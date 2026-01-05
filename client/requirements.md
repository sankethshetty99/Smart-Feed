## Packages
framer-motion | Smooth animations for list items and page transitions
lucide-react | Beautiful icons for navigation and actions
clsx | Utility for conditional class names (often used with tailwind-merge)
tailwind-merge | Utility for merging tailwind classes safely

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
  mono: ["var(--font-mono)"],
}

API Integration:
- GET /api/feed/:userId
- GET /api/users/:id
- GET /api/users (for simulating login)
