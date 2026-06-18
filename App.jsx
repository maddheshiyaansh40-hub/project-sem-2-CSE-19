import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import QuizCreator from './components/QuizCreator.jsx';
import QuizPlayer from './components/QuizPlayer.jsx';
import Result from './components/Result.jsx';
import Footer from './components/Footer.jsx';
import './App.css';

const STORAGE_KEYS = {
  quizzes: 'quizGenerator.quizzes',
  theme: 'quizGenerator.theme',
  leaderboard: 'quizGenerator.leaderboard'
};

const defaultQuizTemplate = () => ({
  id: '',
  title: '',
  description: '',
  questions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('creator');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    try {
      const storedQuizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.quizzes) || '[]');
      const storedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
      const storedLeaderboard = JSON.parse(localStorage.getItem(STORAGE_KEYS.leaderboard) || '[]');
      setQuizzes(Array.isArray(storedQuizzes) ? storedQuizzes : []);
      setTheme(storedTheme === 'dark' ? 'dark' : 'light');
      setLeaderboard(Array.isArray(storedLeaderboard) ? storedLeaderboard : []);
    } catch (error) {
      console.error('Failed to load data from Local Storage', error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.leaderboard, JSON.stringify(leaderboard));
  }, [leaderboard]);

  const activeQuiz = useMemo(() => {
    return selectedQuiz ? quizzes.find((quiz) => quiz.id === selectedQuiz) : null;
  }, [quizzes, selectedQuiz]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const saveQuiz = (quiz) => {
    const normalizedQuiz = {
      ...quiz,
      id: quiz.id || `quiz-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };

    setQuizzes((current) => {
      const existingIndex = current.findIndex((item) => item.id === normalizedQuiz.id);
      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = normalizedQuiz;
        return updated;
      }
      return [normalizedQuiz, ...current];
    });

    setActiveView('creator');
    setSelectedQuiz(normalizedQuiz.id);
  };

  const deleteQuiz = (quizId) => {
    setQuizzes((current) => current.filter((quiz) => quiz.id !== quizId));
    if (selectedQuiz === quizId) {
      setSelectedQuiz(null);
      setQuizResult(null);
    }
  };

  const importQuizData = (importedData) => {
    if (!importedData) return;
    const importedArray = Array.isArray(importedData) ? importedData : [importedData];
    const normalized = importedArray
      .filter((item) => item && item.title && Array.isArray(item.questions))
      .map((item) => ({
        ...defaultQuizTemplate(),
        ...item,
        id: item.id || `imported-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        questions: item.questions.map((question, index) => ({
          id: question.id || `question-${index}-${Date.now()}`,
          text: question.text || '',
          options: Array.isArray(question.options) ? question.options.slice(0, 4).concat(Array(4).fill('')).slice(0, 4) : ['', '', '', ''],
          correctIndex: typeof question.correctIndex === 'number' ? question.correctIndex : 0
        })),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

    if (normalized.length === 0) {
      return;
    }

    setQuizzes((current) => [...normalized, ...current]);
    if (normalized[0]) {
      setSelectedQuiz(normalized[0].id);
    }
  };

  const exportQuizById = (quizOrId) => {
    const quiz = typeof quizOrId === 'object'
      ? quizOrId
      : quizzes.find((item) => item.id === quizOrId);
    if (!quiz || !quiz.title) return;
    const data = JSON.stringify(quiz, null, 2);
    const fileName = `${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'quiz'}.json`;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStartQuiz = (quizId) => {
    setSelectedQuiz(quizId);
    setQuizResult(null);
    setActiveView('player');
  };

  const handleQuizResult = (result) => {
    setQuizResult(result);
    setActiveView('player');
    setLeaderboard((current) => [
      {
        id: `score-${Date.now()}`,
        quizTitle: result.quizTitle,
        correct: result.correctAnswers,
        total: result.totalQuestions,
        percentage: result.percentage,
        pass: result.passed,
        date: new Date().toISOString()
      },
      ...current
    ]);
  };

  const handleRestartQuiz = () => {
    setQuizResult(null);
  };

  return (
    <div className={`app-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <Navbar
        activeView={activeView}
        onNavigate={setActiveView}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="container py-4">
        <div className="mb-4">
          <div className="page-title d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
            <div>
              <h1 className="mb-2">Quiz Generator and Management System</h1>
              <p className="lead text-secondary mb-0">
                Build quizzes, challenge learners, and track progress with a responsive interface.
              </p>
            </div>
            <div className="badge bg-primary fs-6 align-self-center">
              {quizzes.length} saved quiz{quizzes.length === 1 ? '' : 'zes'}
            </div>
          </div>
        </div>

        {activeView === 'creator' && (
          <QuizCreator
            quizzes={quizzes}
            onSaveQuiz={saveQuiz}
            onDeleteQuiz={deleteQuiz}
            onImportQuiz={importQuizData}
            onExportQuiz={exportQuizById}
            selectedQuiz={selectedQuiz}
            onSelectQuiz={setSelectedQuiz}
            onLaunchQuiz={handleStartQuiz}
            searchText={searchText}
            setSearchText={setSearchText}
            leaderboard={leaderboard}
          />
        )}

        {activeView === 'player' && (
          <>
            {activeQuiz ? (
              <QuizPlayer
                quiz={activeQuiz}
                quizResult={quizResult}
                onSubmitResult={handleQuizResult}
                onRestart={handleRestartQuiz}
                onGoBack={() => setActiveView('creator')}
                leaderboard={leaderboard}
              />
            ) : (
              <div className="alert alert-info">
                Select a quiz from the creator section or use the list below to start playing.
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
