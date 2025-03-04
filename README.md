# Spring Boot WebSocket Chat Application

This is a real-time chat application built using **React** for the frontend and **Spring Boot WebSockets** for the backend. It allows users to join a chat room, send messages, and receive real-time updates.

---

## Features
- **Real-time messaging** using WebSockets
- **User join/leave notifications**
- **Message history persistence** (Optional, if backend supports it)
- **User avatars** with unique colors
- **Responsive UI** with a simple chat layout

---

## Technologies Used

### Frontend (React)
- React.js
- Stomp.js (WebSocket Client)
- SockJS
- CSS (for styling)

### Backend (Spring Boot)
- Spring Boot
- Spring WebSockets
- SockJS & STOMP protocol
- Maven (Build tool)

---

## Installation

### Prerequisites
- **Node.js** (for React frontend)
- **Java 17+** (for Spring Boot backend)
- **Maven**

### Clone Repository
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/chat-app.git
cd chat-app
```

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Build the project using Maven:
   ```sh
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```sh
   mvn spring-boot:run
   ```

By default, the backend will start on `http://localhost:8080`.

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```

By default, the frontend will run on `http://localhost:3000`.

---

## WebSocket Communication Flow
1. A user enters a username and connects to the WebSocket server.
2. The backend handles user connection and notifies others.
3. Messages are sent using STOMP over WebSockets.
4. The frontend updates in real-time when new messages arrive.

---

## Folder Structure
```
chat-app/
│── backend/        # Spring Boot backend
│── frontend/       # React frontend
│── README.md       # Project documentation
```

---

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ws` | WebSocket | WebSocket connection endpoint |
| `/app/chat.sendMessage` | STOMP | Send a chat message |
| `/app/chat.addUser` | STOMP | Notify users when someone joins |
| `/topic/public` | STOMP Subscription | Broadcast chat messages |

---

## Contributing
Feel free to fork this repository, open issues, and submit pull requests!

