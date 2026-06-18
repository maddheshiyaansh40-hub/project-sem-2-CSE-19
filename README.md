# Quiz Generator and Quiz Management System

A modern responsive React application for creating, managing, playing, and reviewing quizzes. This project uses React functional components, React Hooks, Bootstrap 5, and Local Storage.

## Features

- Create quizzes with title, description, and unlimited questions.
- Add, edit, and delete questions.
- Select correct answers and validate inputs.
- Save quizzes to Local Storage.
- Play quizzes one question at a time with navigation and timer.
- Auto-advance after 30 seconds per question.
- Show quiz progress and results.
- Display total questions, attempted, correct, wrong, percentage, and pass/fail.
- View correct answers after submitting.
- Toggle dark/light mode.
- Randomize questions and options.
- Search quizzes and questions.
- Import and export quiz JSON files.
- Maintain leaderboard in Local Storage.
- Responsive design for desktop, tablet, and mobile.

## Project Structure

```
quiz-generator/
│
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── QuizCreator.jsx
│   │   ├── QuizPlayer.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── Result.jsx
│   │   └── Footer.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

## Installation

1. Open a terminal in the `quiz-generator` folder.
2. Run:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the displayed local URL in your browser.

## Build for Production

```bash
npm run build
```

## Notes

- The app stores quizzes and leaderboard entries in Local Storage.
- You can import or export quiz data using JSON files.
- The timer uses a 30-second countdown for each question.
- Dark mode persists between sessions.
