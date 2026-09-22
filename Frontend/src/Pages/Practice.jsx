import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaPlay,
  FaLightbulb,
  FaRobot,
  FaCheck,
  FaCopy,
  FaExpand,
  FaCompress,
  FaPlus,
  FaExclamationCircle,
  FaChevronRight,
  FaCode,
  FaSpinner,
  FaMagic,
  FaPaperPlane
} from "react-icons/fa";
import pythonImg from "../assets/python.png";
import "./Practice.css";

const API_BASE_URL = "http://localhost:3000/api/ai";

const Practice = () => {
  const { id } = useParams();

  // Initial code matching screenshot
  const initialCode = `name = "Krithiga"\nage = 22\nprint(name)\nprint(age`;

  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState("python");
  const [activeTab, setActiveTab] = useState("error"); // "output" or "error"
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Execution & AI states
  const [isRunning, setIsRunning] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [output, setOutput] = useState("");
  const [errorDetails, setErrorDetails] = useState(
    `File "main.py", line 4\n  print(age\n          ^\nSyntaxError: '(' was never closed`
  );
  const [errorCount, setErrorCount] = useState(1);

  // AI Mentor State
  const [mentorData, setMentorData] = useState({
    explanation: "The error is because you forgot to close the bracket in the `print()` function.",
    hint: "Every opening parenthesis '(' must have a matching closing parenthesis ')'.",
    suggestedCode: "print(age)",
    quickFix: "Close the parenthesis on line 4"
  });

  // Chat with Mentor state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hi Krithiga! I noticed an unclosed parenthesis on line 4. Click 'Get Hint' or ask me anything to solve it!"
    }
  ]);
  const [isChatSending, setIsChatSending] = useState(false);

  const textareaRef = useRef(null);

  // Line numbers calculation
  const lines = code.split("\n");
  const lineNumbers = lines.map((_, index) => index + 1);

  // Run Code via backend or client simulation
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        code,
        language
      });

      if (response.data.hasError) {
        setErrorDetails(response.data.error);
        setErrorCount(1);
        setActiveTab("error");
        setOutput("");

        // Auto update AI mentor with context
        if (response.data.autoHint) {
          setMentorData({
            explanation: response.data.autoHint.explanation,
            hint: "Check the syntax error in the error tab.",
            suggestedCode: response.data.autoHint.suggestedCode,
            quickFix: "Fix syntax error"
          });
        }
      } else {
        setOutput(response.data.output || "Program finished with exit code 0.");
        setErrorDetails("");
        setErrorCount(0);
        setActiveTab("output");
        setMentorData({
          explanation: "Great job! Your code executed cleanly with no syntax or runtime errors.",
          hint: "Try experimenting with different data types like floats, booleans, or lists!",
          suggestedCode: "",
          quickFix: ""
        });
      }
    } catch (err) {
      // Local fallback in case backend is offline
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;

      if (openParens > closeParens) {
        setErrorDetails(
          `File "main.py", line 4\n  print(age\n          ^\nSyntaxError: '(' was never closed`
        );
        setErrorCount(1);
        setActiveTab("error");
      } else {
        setOutput("Krithiga\n22\n\n=== Code Execution Successful ===");
        setErrorDetails("");
        setErrorCount(0);
        setActiveTab("output");
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Get AI Hint via Gemini API
  const handleGetHint = async () => {
    setIsGettingHint(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/hint`, {
        code,
        language,
        error: errorDetails,
        topic: "Variables & Data Types",
        task: "Write a program that prints your name and age correctly."
      });

      if (response.data.success) {
        setMentorData({
          explanation: response.data.explanation,
          hint: response.data.hint,
          suggestedCode: response.data.suggestedCode,
          quickFix: response.data.quickFix
        });
      }
    } catch (err) {
      console.warn("Failed to reach Gemini hint endpoint, using local fallback", err);
      setMentorData({
        explanation: "The error is because you forgot to close the bracket in the `print()` function.",
        hint: "Every opening bracket '(' requires a closing bracket ')'.",
        suggestedCode: "print(age)",
        quickFix: "Close the parenthesis on line 4"
      });
    } finally {
      setIsGettingHint(false);
    }
  };

  // Apply suggested fix directly to editor
  const handleApplyFix = () => {
    if (!mentorData.suggestedCode) return;

    // Check if suggested code is a single line or full block
    if (mentorData.suggestedCode.includes("\n")) {
      setCode(mentorData.suggestedCode);
    } else {
      // Replace the last line or broken print line
      const linesArr = code.split("\n");
      const brokenLineIdx = linesArr.findIndex((l) => l.includes("print(age"));
      if (brokenLineIdx !== -1) {
        linesArr[brokenLineIdx] = mentorData.suggestedCode;
        setCode(linesArr.join("\n"));
      } else {
        setCode((prev) => `${prev.trim()}\n${mentorData.suggestedCode}`);
      }
    }
  };

  // Copy code suggestion
  const handleCopyCode = () => {
    if (mentorData.suggestedCode) {
      navigator.clipboard.writeText(mentorData.suggestedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Send message to Gemini chat
  const handleSendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsChatSending(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: userMsg,
        codeContext: code,
        language
      });
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.reply }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I'm having trouble reaching the AI server. To fix the current code, ensure line 4 has a closing bracket `)` after `age`."
        }
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Handle Tab key in textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className={`practice-page-container ${isFullscreen ? "fullscreen" : ""}`}>
      {/* 1. Breadcrumbs */}
      <div className="practice-breadcrumbs">
        <span className="practice-breadcrumb-code-icon">
          <FaCode />
        </span>
        <Link to="/dashboard/courses" className="breadcrumb-link">
          My Courses
        </Link>
        <FaChevronRight className="breadcrumb-sep" />
        <Link to="/dashboard/learning" className="breadcrumb-link">
          Python Programming
        </Link>
        <FaChevronRight className="breadcrumb-sep" />
        <span className="breadcrumb-active">Practice</span>
      </div>

      {/* 2. Course Header Banner */}
      <div className="practice-course-banner">
        <div className="practice-banner-left">
          <div className="practice-course-icon-box">
            <img src={pythonImg} alt="Python" className="practice-course-icon" />
          </div>
          <div className="practice-banner-details">
            <h1 className="practice-course-title">Python Programming</h1>
            <div className="practice-course-meta">
              <span className="meta-badge-icon">🛡️</span>
              <span>Beginner to Advanced</span>
              <span className="meta-bullet">•</span>
              <span>12 Weeks</span>
              <span className="meta-bullet">•</span>
              <span>45 Topics</span>
            </div>
          </div>
        </div>

        <div className="practice-banner-right">
          <div className="practice-progress-box">
            <div className="progress-labels">
              <span className="progress-label-text">Overall Progress</span>
              <span className="progress-percent">42%</span>
            </div>
            <div className="practice-progress-bar-track">
              <div
                className="practice-progress-bar-fill"
                style={{ width: "42%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Challenge Section Subheader */}
      <div className="practice-challenge-header">
        <div className="challenge-title-row">
          <div className="challenge-icon-tag">
            <FaCode />
          </div>
          <div className="challenge-headings">
            <h2 className="challenge-title">Practice: Variables & Data Types</h2>
            <p className="challenge-subtitle">
              Write your code below and click Run to see the output or error.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Main Workbench: Code Editor & Output/Error Console */}
      <div className="practice-workbench-grid">
        {/* Left Card: Code Editor */}
        <div className="practice-editor-card">
          <div className="editor-top-bar">
            <div className="editor-tabs-group">
              <button className="editor-tab active">
                <span className="tab-py-dot"></span>
                <span>main.py</span>
              </button>
              <button className="editor-add-tab" title="New file">
                <FaPlus />
              </button>
            </div>

            <div className="editor-actions-group">
              {/* Language Selector */}
              <div className="lang-select-wrapper">
                <img src={pythonImg} alt="lang" className="lang-mini-icon" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="lang-select-input"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              {/* Run Button */}
              <button
                className="practice-run-btn"
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <FaSpinner className="spin-icon" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <FaPlay className="run-play-icon" />
                    <span>Run</span>
                  </>
                )}
              </button>

              {/* Expand/Fullscreen toggle */}
              <button
                className="editor-icon-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>

          {/* Editor Workspace with Line Numbers */}
          <div className="editor-code-body">
            <div className="editor-line-numbers">
              {lineNumbers.map((num) => (
                <div
                  key={num}
                  className={`line-number ${num === 4 && errorCount > 0 ? "has-error" : ""}`}
                >
                  {num}
                </div>
              ))}
            </div>

            <div className="editor-textarea-container">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck="false"
                className="editor-textarea"
                rows={Math.max(12, lines.length)}
              />
            </div>
          </div>
        </div>

        {/* Right Card: Output & Error Console */}
        <div className="practice-console-card">
          <div className="console-tabs-bar">
            <button
              className={`console-tab ${activeTab === "output" ? "active" : ""}`}
              onClick={() => setActiveTab("output")}
            >
              Output
            </button>
            <button
              className={`console-tab error-tab ${activeTab === "error" ? "active" : ""}`}
              onClick={() => setActiveTab("error")}
            >
              <FaExclamationCircle className="tab-error-icon" />
              <span>Error</span>
              {errorCount > 0 && <span className="error-pill">{errorCount}</span>}
            </button>
          </div>

          <div className="console-body-panel">
            {activeTab === "error" ? (
              <div className="console-error-wrapper">
                {errorDetails ? (
                  <div className="console-error-card-inner">
                    <div className="error-header-badge">
                      <div className="error-icon-circle">
                        <FaExclamationCircle />
                      </div>
                      <span className="error-title-text">Error</span>
                    </div>

                    <pre className="error-terminal-text">{errorDetails}</pre>
                  </div>
                ) : (
                  <div className="console-empty-state text-success">
                    ✓ No errors detected in your code.
                  </div>
                )}
              </div>
            ) : (
              <div className="console-output-wrapper">
                {output ? (
                  <pre className="output-terminal-text">{output}</pre>
                ) : (
                  <div className="console-empty-state">
                    Click <strong>Run</strong> to execute your code and see the standard output here.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. AI Mentor Card (Bottom Panel) */}
      <div className="ai-mentor-container-card">
        <div className="ai-mentor-header-row">
          <div className="mentor-title-left">
            <div className="mentor-avatar-circle">
              <FaRobot className="robot-mentor-icon" />
            </div>
            <div className="mentor-title-info">
              <h3 className="mentor-heading">AI Mentor</h3>
              <span className="mentor-status-badge">
                <span className="live-dot"></span> Powered by Gemini
              </span>
            </div>
          </div>

          <div className="mentor-actions-right">
            <button
              className="get-hint-button"
              onClick={handleGetHint}
              disabled={isGettingHint}
            >
              {isGettingHint ? (
                <>
                  <FaSpinner className="spin-icon" />
                  <span>Analyzing with Gemini...</span>
                </>
              ) : (
                <>
                  <FaLightbulb className="hint-bulb-icon" />
                  <span>Get Hint</span>
                </>
              )}
            </button>

            <button
              className={`ask-mentor-toggle-btn ${chatOpen ? "active" : ""}`}
              onClick={() => setChatOpen(!chatOpen)}
              title="Chat with AI Mentor"
            >
              <FaMagic />
              <span>{chatOpen ? "Hide Chat" : "Ask Question"}</span>
            </button>
          </div>
        </div>

        {/* AI Mentor Explanation Box */}
        <div className="mentor-content-body">
          <p className="mentor-explanation-text">
            {mentorData.explanation}
          </p>

          {mentorData.suggestedCode && (
            <div className="mentor-try-box">
              <div className="try-label-row">
                <span className="try-this-label">Try this:</span>
                <div className="code-box-actions">
                  <button
                    className="code-action-btn apply-btn"
                    onClick={handleApplyFix}
                    title="Insert fix into your editor"
                  >
                    <FaMagic /> Apply Fix
                  </button>
                  <button
                    className="code-action-btn copy-btn"
                    onClick={handleCopyCode}
                    title="Copy code"
                  >
                    {copied ? (
                      <>
                        <FaCheck className="text-success" /> Copied
                      </>
                    ) : (
                      <>
                        <FaCopy /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mentor-code-snippet-box">
                <code>{mentorData.suggestedCode}</code>
              </div>
            </div>
          )}
        </div>

        {/* Expandable Chat with AI Mentor */}
        {chatOpen && (
          <div className="ai-mentor-chat-tray">
            <div className="chat-messages-container">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="chat-avatar-mini">
                      <FaRobot />
                    </div>
                  )}
                  <div className={`chat-bubble-content ${msg.sender}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatSending && (
                <div className="chat-bubble-row ai-row">
                  <div className="chat-avatar-mini">
                    <FaRobot />
                  </div>
                  <div className="chat-bubble-content ai typing">
                    <FaSpinner className="spin-icon" /> Gemini is thinking...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChatMessage} className="chat-input-row">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your AI Mentor about this error, variables, or functions..."
                className="chat-text-input"
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={isChatSending || !chatInput.trim()}
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
