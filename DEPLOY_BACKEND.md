# Backend Deploy (Option 1)

This project uses a static frontend on GitHub Pages and an Express API backend.

## 1. Deploy backend (Render/Railway)

1. Create a new Web Service from this repository.
2. Use:
   - Build command: `npm install`
   - Start command: `npm start`
3. Set environment variables:
   - `JWT_SECRET`: long random string
   - `ALLOWED_ORIGINS`: `https://baitursagynbekov3-stack.github.io`
   - `SERVE_STATIC`: `false`

## 2. Connect frontend to backend

1. Open `public/config.js`.
2. Set API base URL:

```js
window.KVANTUM_API_BASE_URL = 'https://your-backend-domain.onrender.com';
```

3. Commit and push to `main`.

## 3. Verify

- Backend health: `https://your-backend-domain.onrender.com/api/health`
- Frontend: `https://baitursagynbekov3-stack.github.io/Demo-site-Kvantum/`
- Login/Register should now call the deployed backend.

## Notes

- Current storage is in-memory (`users`, `bookings`, `payments`). Data resets when backend restarts.
- For production, migrate to PostgreSQL or another persistent database.
