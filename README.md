
# Echo Chat System

**Assignment Phase 1 - Software Frameworks**

## Overview

The Echo Chat System is a real-time communication platform built using the MEAN stack (MongoDB, Express, Angular, Node.js), along with Socket.io for real-time communication and Peer.js for video chat capabilities. The system allows users to chat within different groups and channels, with three levels of permissions: Super Admin, Group Admin, and User.

## Repository Organization

This repository contains the following main components:

- **chat-backend**: Contains the Node.js server-side code, including API routes, authentication, and Socket.io setup.
- **chat-frontend**: Contains the Angular frontend code, including components, services, and routing.

### Branching Strategy

- **main**: The main branch contains stable, production-ready code.
- **localdev**: A branch for local development and testing new features before merging into the main branch.

### Update Frequency

- Frequent commits are made to the `localdev` branch during development. Once features are tested and stable, they are merged into `main`.

## Data Structures

### Server-Side (Node.js)

- **User**: Represents a chat user with attributes like `username`, `email`, `id`, `roles`, and `groups`.
- **Group**: Represents a collection of users with associated channels.
- **Channel**: Represents a chat room within a group where users can communicate.

### Client-Side (Angular)

- **User Model**: Represents the user entity with attributes like `username`, `email`, `roles`, and `groups`.
- **Group Model**: Represents the group entity with its associated channels and members.
- **Channel Model**: Represents the channel entity with a list of messages and participants.

## Angular Architecture

- **Components**: The Angular application is divided into several components, each responsible for a specific part of the UI.
  - **LoginComponent**: Handles user authentication.
  - **GroupComponent**: Displays a list of groups the user is a member of.
  - **ChannelComponent**: Displays channels within a selected group and handles chat interactions.
  
- **Services**: Angular services are used to handle data retrieval, user authentication, and communication with the server.
  - **AuthService**: Manages user authentication and token storage.
  - **GroupService**: Handles CRUD operations for groups.
  - **ChannelService**: Manages channels and chat messages.
  
- **Models**: Used to define the data structures for users, groups, and channels.
  - `User`, `Group`, `Channel` models are used to represent data on the client side.
  
- **Routes**: The application is organized into routes, allowing users to navigate between different parts of the application.
  - `/login`: Route for user login.
  - `/groups`: Route for displaying the user's groups.
  - `/group/:id/channels`: Route for displaying channels within a specific group.

## Node Server Architecture

- **Modules**: The server is divided into several modules for better organization.
  - **UserModule**: Handles user registration, login, and authentication.
  - **GroupModule**: Manages groups, including creation, deletion, and modification.
  - **ChannelModule**: Handles channels and message broadcasting.
  
- **Functions**: Key functions include user authentication, group management, and real-time message broadcasting.
  - `loginUser()`, `createGroup()`, `sendMessage()`, etc.
  
- **Files**:
  - `server.js`: The entry point for the Node.js server.
  - `routes.js`: Defines API routes for handling client requests.
  - `auth.js`: Middleware for handling authentication and authorization.

- **Global Variables**:
  - `io`: The Socket.io instance used for real-time communication.
  - `users`, `groups`, `channels`: Arrays or collections storing user, group, and channel data.

## API Routes

- **/api/login** - POST: Authenticates a user.
- **/api/groups** - GET: Retrieves groups the authenticated user belongs to.
- **/api/groups** - POST: Creates a new group (Group Admin only).
- **/api/groups/:id/channels** - GET: Retrieves channels within a group.
- **/api/groups/:groupId/channels/:channelId/messages** - GET: Retrieves messages from a channel.
- **/api/groups/:groupId/channels/:channelId/messages** - POST: Sends a message to a channel.

## Client-Server Interaction

### Login Process
1. The user enters their username and password.
2. The Angular app sends a POST request to `/api/login` with the user's credentials.
3. The server verifies the credentials and returns a token.
4. The token is stored in the client's local storage and used for subsequent authenticated requests.

### Group and Channel Interaction
1. After login, the user is presented with a list of groups.
2. When a group is selected, a GET request is sent to `/api/groups/:id/channels` to retrieve available channels.
3. When a channel is selected, a GET request is sent to `/api/groups/:groupId/channels/:channelId/messages` to load the chat history.
4. The user can send a message, which triggers a POST request to the same endpoint, and the message is broadcasted to other users in real-time.

## Running the Application

### Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or later)
- [Angular CLI](https://angular.io/cli)
- [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/YourUsername/Echo-Software-Frameworks-Assignment-.git
cd Echo-Software-Frameworks-Assignment-
```

### Running the Backend (Node.js Server)

1. Navigate to the `chat-backend` directory:

    ```bash
    cd chat-backend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Start the Node.js server:

    ```bash
    npm start
    ```

    The server should now be running on `http://localhost:3000`.

### Running the Frontend (Angular App)

1. Open a new terminal window and navigate to the `chat-frontend` directory:

    ```bash
    cd ../chat-frontend
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Start the Angular development server:

    ```bash
    ng serve
    ```

    The frontend should now be accessible at `http://localhost:4200`.

### Accessing the Application

- Open your browser and go to `http://localhost:4200`.
- You will be prompted to log in. Use the credentials:
  - **Username**: `super`
  - **Password**: `123`
- After logging in, you will be able to create groups, channels, and start chatting.

## Data Structures

### Server-Side (Node.js)

- **User Schema**: Stores user details including:
  - `username`, `email`, `passwordHash`, `roles` (e.g., Super Admin, Group Admin, User), and `groups`.
- **Group Schema**: Represents a group with fields like:
  - `name`, `admins`, `members`, and `channels`.
- **Channel Schema**: Represents a channel within a group with fields like:
  - `name`, `groupId`, and `messages`.

### Client-Side (Angular)

- **User Model**: Represents the user entity with attributes such as `username`, `email`, `roles`, and `groups`.
- **Group Model**: Represents a group with its associated channels and members.
- **Channel Model**: Represents a chat channel with its messages and participants.

## Angular Architecture

### Components

- **LoginComponent**: Manages user authentication.
- **GroupComponent**: Displays a list of groups the user is a member of.
- **ChannelComponent**: Manages chat interactions within a selected channel.
- **VideoComponent**: Manages video chat functionality using PeerJS.

### Services

- **AuthService**: Manages user authentication and token storage.
- **GroupService**: Manages API interactions related to groups.
- **ChannelService**: Manages channels and chat messages.
- **PeerService**: Handles PeerJS connections for video calls.
- **SocketService**: Manages real-time communication using Socket.io.

### Models

- `User`: Defines the user data structure.
- `Group`: Defines the group data structure.
- `Channel`: Defines the channel data structure.

### Routes

- `/login`: Route for user login.
- `/groups`: Displays the user's groups.
- `/group/:groupId`: Displays channels within a specific group.
- `/group/:groupId/channel/:channelId`: Displays messages for a channel.

## Node Server Architecture

### Modules

- **UserModule**: Handles user registration, login, and authentication.
- **GroupModule**: Manages groups, including creation, deletion, and modification.
- **ChannelModule**: Manages channels and message broadcasting.

### Functions

- `loginUser()`, `createGroup()`, `sendMessage()`, etc. manage authentication, group creation, and message broadcasting.

### Files

- `server.js`: The entry point for the Node.js server.
- `routes.js`: Defines API routes for handling client requests.
- `auth.js`: Middleware for handling authentication and authorization.

### Global Variables

- **io**: The Socket.io instance used for real-time communication.
- **users**, **groups**, **channels**: Collections or arrays storing user, group, and channel data.

## API Routes

### Authentication Routes

- `/api/auth/login` - **POST**: Authenticates a user. Expects `{username, password}` and returns `{token, userData}`.

### Group Routes

- `/api/groups`:
  - **GET**: Retrieves all groups the authenticated user belongs to. Returns an array of groups.
  - **POST**: Creates a new group. Expects `{name, adminId}` and returns the created group.

### Channel Routes

- `/api/groups/:groupId/channels` - **GET**: Retrieves channels within a group.
- `/api/groups/:groupId/channels/:channelId/messages`:
  - **GET**: Fetches messages for a channel.
  - **POST**: Sends a message to the channel.

### Other Routes

- `/upload-avatar` - **POST**: Handles profile avatar uploads with multipart form data.

## Client-Server Interaction

### Login Process

1. The user enters their username and password.
2. The Angular app sends a POST request to `/api/login` with the user's credentials.
3. The server verifies the credentials and returns a token.
4. The token is stored in the client's local storage and used for subsequent authenticated requests.

### Group and Channel Interaction

1. After login, the user is presented with a list of groups.
2. When a group is selected, a GET request is sent to `/api/groups/:id/channels` to retrieve available channels.
3. When a channel is selected, a GET request is sent to `/api/groups/:groupId/channels/:channelId/messages` to load the chat history.
4. The user can send a message, which triggers a POST request to the same endpoint, and the message is broadcasted to other users in real-time.

### Real-time Messaging

- **Frontend**: Uses `SocketService` to join channels and listen for new messages.
- **Backend**: Broadcasts messages to all connected users in a channel using Socket.io.

### Video Chat

- **Frontend**: `PeerService` initializes a PeerJS connection in `VideoComponent`.
- **Backend**: Hosts the PeerJS server on `/peerjs` to manage video calls.
