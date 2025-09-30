# Socket.IO Chat Application Demo

A real-time chat application built with Socket.IO demonstrating WebSocket communication.

## Features

- Real-time messaging using WebSocket protocol
- Live typing indicators
- Dark/Light theme toggle
- Real-time connection status
- Message timestamps with formatting

## Note

**Network Requirements:** All devices must be connected to the same local network.

- Multiple frontend instances can run on a single device
- Multiple devices can connect as clients
- Only one backend server is required to handle all connections

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/BadLuckZ/Study-Socket-Programming.git
cd study-socket-programming
```

2. Configure the server:

   - Navigate to `/backend/utils/config.ts`
   - Configure the following settings:
     - `MY_IP`: Your device's local IP address
     - `SERVER_IP`: Server's IP address (same as MY_IP if running server)
     - `PORT`: Server port number (default: 3000)

3. Start the backend server:

```bash
cd backend
npm install
npm run dev
```

Note: Ensure only one backend server instance is running on the network

4. Launch the frontend application:

```bash
cd frontend
npm install
npm run dev
```

You can run multiple frontend instances either:

- On the same device using different browser windows
- On different devices within the same network

5. Access the application:
   - Open your web browser
   - Navigate to the local URL displayed in your terminal
