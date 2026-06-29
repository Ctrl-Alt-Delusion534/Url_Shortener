# ScaleUrl

What happens when a URL shortener gets hit with thousands of clicks at once? ScaleUrl is built to handle it.

Most URL shorteners slow down under load because they force users to wait while the server logs the click to a database. ScaleUrl is a high-speed redirection engine that solves this latency bottleneck using Node.js, Express, Upstash Redis, and MongoDB.

![ScaleUrl System Architecture](./architecture.png)

## Core Design & Performance Decisions

### **1. Decoupled Read Path**
Redirect requests are read-heavy. To keep latency low:
- We check the Redis cache first. If it's a hit, the redirect resolves in under 1ms. If it's a miss, we fetch from MongoDB and write it to Redis for subsequent hits.
- To prevent database write locks from blocking redirects, click counts are logged asynchronously. The server sends the response to the client immediately and delegates the MongoDB update to Node's event loop using `setImmediate()`. 
- **The Trade-off**: Decoupling the write path means click analytics are processed a split-second after the user redirects, but it cut our worst-case (p99) latency by 83% (from 4.6s down to 758ms) under stress tests.

### **2. Bitwise IP Subnet Matching (SSRF Blocker)**
To prevent users from shortening links pointing to internal services or cloud metadata endpoints (e.g. AWS/GCP's `169.254.169.254`), we enforce IP validation on creation.
- The destination hostname is parsed, split, and converted into a 32-bit integer.
- This blocks loopbacks, private networks, and alternative IP representations (hex/octal/integer bypasses) instantly in CPU registers.

### **3. Session Management**
Authentication uses a split-token architecture:
- On login/register, the server issues a 10-minute access token and a 7-day refresh token in HttpOnly cookies.
- When the access token expires, the client automatically requests a refresh token exchange at `/api/auth/refresh` to get a new access token, preventing session theft while keeping the user logged in.

### **4. Telemetry Endpoint**
The backend exposes a standard Prometheus-format metrics route at `/metrics`. It tracks cache hits/misses, rate limit blocks, and process memory usage.

---

## 🛠️ Tech Stack

- **Backend**: Node.js (ES Modules), Express
- **Frontend**: React (Vite), **TanStack Router**, Tailwind CSS, TanStack Query
- **Databases**: MongoDB Atlas (Persistent store), Upstash Redis (Cache & Rate Limiting)
- **Authentication**: JWT Access Token + HttpOnly Refresh Token cookies
- **Testing/Observability**: Autocannon (Load-testing), Prometheus specification

---

## Backend Setup

### **0. Setup .env file**

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
JWT_SECRET=your_secret
REFRESH_SECRET=your_refresh_secret
APP_URL=http://localhost:5173
NODE_ENV=development
