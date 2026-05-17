import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import "./App.css";

function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M20 6L9 17l-5-5" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCross() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
      <path d="M18 6L6 18M6 6l12 12" stroke="#fb7185" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    if (questionsData.questions?.length > 0) {
      setQuizTitle(questionsData.title || "Quiz");
      pickRandomQuestion();
    }
    const stored = localStorage.getItem("quizHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const pickRandomQuestion = () => {
    const idx = Math.floor(Math.random() * questionsData.questions.length);
    setCurrentQuestion(questionsData.questions[idx]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (choice) => {
    if (showResult || !currentQuestion) return;
    setSelectedAnswer(choice);
    setShowResult(true);
    const isCorrect = choice === currentQuestion.answer;
    const entry = {
      question: currentQuestion.question,
      selected: choice,
      correct: currentQuestion.answer,
      explanation: currentQuestion.explanation,
      isCorrect,
      timestamp: new Date().toISOString(),
    };
    const updated = [...history, entry];
    setHistory(updated);
    localStorage.setItem("quizHistory", JSON.stringify(updated));
  };

  const clearHistory = () => {
    localStorage.removeItem("quizHistory");
    setHistory([]);
    setSelectedHistory(null);
  };

  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = history.length ? Math.round((correctCount / history.length) * 100) : 0;

  return (
    <div className="app-shell">
      <div className="app-card">
        {/* Main panel */}
        <div className="main-panel">
          <header className="main-header">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <p className="eyebrow-text">Professional Certification</p>
              </div>
              <h1 className="app-title">{quizTitle || "Quiz"}</h1>
            </div>
            <div className="stats-pill">
              <div className="stat-item">
                <span className="stat-label">Answered</span>
                <span className="stat-value">{history.length}</span>
              </div>
              <div className="stat-item accent">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{accuracy}%</span>
              </div>
            </div>
          </header>

          <div className="question-block">
            {currentQuestion ? (
              <>
                <div className="question-meta">
                  <span className="badge">Question {history.length + 1}</span>
                  <span className="meta-text">Level: Advanced</span>
                </div>
                <h2 className="question-text">{currentQuestion.question}</h2>

                <ul className="choices">
                  {currentQuestion.choices.map((choice, idx) => {
                    let cls = "choice-btn";
                    if (showResult) {
                      if (choice === currentQuestion.answer) cls += " correct";
                      else if (choice === selectedAnswer) cls += " incorrect";
                    }
                    return (
                      <li key={idx}>
                        <button
                          onClick={() => handleAnswerSelect(choice)}
                          disabled={showResult}
                          className={cls}
                        >
                          <span className="choice-letter">{LETTERS[idx]}</span>
                          <span className="choice-text">{choice}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className={`explanation ${showResult ? "show" : ""}`}>
                  <p className="explanation-label">Explanation</p>
                  <p className="explanation-body">{currentQuestion.explanation}</p>
                  <div className="next-row">
                    <button className="next-btn" onClick={pickRandomQuestion}>
                      Next Question →
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: "var(--text-300)" }}>No questions available.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Session Activity</h3>
            <span className="link-btn" style={{ color: "var(--text-500)" }}>
              {history.length} entries
            </span>
          </div>

          {history.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-orb">
                <div className="history-empty-orb-inner" />
              </div>
              <p>No history yet — answer a question to start tracking your performance.</p>
            </div>
          ) : (
            <div className="history-list">
              {[...history].reverse().map((h, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedHistory(h)}
                  className={`history-item ${h.isCorrect ? "correct" : "incorrect"}`}
                >
                  <span className="history-icon">
                    {h.isCorrect ? <IconCheck /> : <IconCross />}
                  </span>
                  <div className="history-text">
                    <p className="history-q">{h.question}</p>
                    <span className="history-meta">{formatTimestamp(h.timestamp)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="sidebar-footer">
            <div className="footer-status">
              <span className="footer-label">Status</span>
              <span className="footer-value">
                {history.length > 0 ? `${correctCount}/${history.length} correct` : "Ready"}
              </span>
            </div>
            <button className="clear-btn" onClick={clearHistory}>
              Clear
            </button>
          </div>
        </aside>
      </div>

      {selectedHistory && (
        <div className="modal-overlay" onClick={() => setSelectedHistory(null)} role="dialog">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">History Detail</h3>
              <button className="clear-btn" onClick={() => setSelectedHistory(null)}>
                Close
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-q">{selectedHistory.question}</p>
              <p><strong>Your answer:</strong> {selectedHistory.selected}</p>
              <p><strong>Correct answer:</strong> {selectedHistory.correct}</p>
              <p><strong>Result:</strong> {selectedHistory.isCorrect ? "Correct ✓" : "Incorrect ✗"}</p>
              <p><strong>When:</strong> {formatTimestamp(selectedHistory.timestamp)}</p>
              {selectedHistory.explanation && (
                <div className="modal-explain">
                  <p className="explanation-label">Explanation</p>
                  <p className="explanation-body">{selectedHistory.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
