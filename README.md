# Carrot Clicker - Harvest Your Way to Victory!

A fun incremental game where you click to harvest carrots and build your farming empire!

## Features

- Click to harvest carrots
- Purchase power-ups to automate and increase carrot production
- Leaderboard to compete with other players
- Save and load your game progress

## Getting Started

This project includes both a React frontend and an Express/SQLite backend.

### Prerequisites

- Node.js (v14+ recommended)
- npm (v6+ recommended)

### Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```

3. Build the React app:
```
npm run build
```

4. Start the server (which serves both the API and the built React app):
```
npm run server
```

5. For development with hot reloading:
```
npm run dev
```

This will start both the React development server (on port 3000) and the backend server (on port 5000).

## How to Play

1. Click the carrot to harvest
2. Use your harvested carrots to purchase power-ups
3. Power-ups can either increase your per-click harvest or automatically harvest carrots over time
4. Enter a username to save your progress
5. Check the leaderboard to see how you rank!

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run server`

Runs the backend server that handles the API and serves the production build.

### `npm run dev`

Runs both the frontend development server and backend server concurrently for development.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in the interactive watch mode.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
