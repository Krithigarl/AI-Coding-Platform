import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button, Badge, Spinner, Card } from "react-bootstrap";
import {
  FaRobot,
  FaPaperPlane,
  FaCode,
  FaLightbulb,
  FaTrash,
  FaCopy,
  FaCheck,
  FaQuestionCircle,
  FaGraduationCap,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import axios from "axios";

const quickDoubts = [
  {
    lang: "javascript",
    text: "I am getting an undefined error in JavaScript. Why does it happen?",
  },
  {
    lang: "python",
    text: "Why am I getting 'IndentationError: unexpected indent' in Python?",
  },
  {
    lang: "python",
    text: "What is the difference between a List and a Tuple in Python?",
  },
  {
    lang: "cpp",
    text: "How do pointers and references work in C++? Show me an example.",
  },
  {
    lang: "java",
    text: "What causes a NullPointerException in Java and how do I prevent it?",
  },
];

const Mentor = () => {
  const [language, setLanguage] = useState("python");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: `Hello! I'm your **CodeGenius AI Mentor** 🤖.

I'm here to explain concepts, guide you through bugs, and break down errors in simple, beginner-friendly terms.

Feel free to ask any question or paste code you're stuck on!`,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [codeContext, setCodeContext] = useState("");
  const [showCodeDrawer, setShowCodeDrawer] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isThinking) return;

    const userMsg = {
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: textToSend,
      code: codeContext.trim() || null,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    const attachedCode = codeContext;
    setCodeContext("");
    setShowCodeDrawer(false);
    setIsThinking(true);

    try {
      const res = await axios.post("http://localhost:3000/api/ai/chat", {
        message: textToSend,
        codeContext: attachedCode,
        language,
      });

      const replyText =
        res.data?.reply ||
        "I analyzed your question! Make sure to verify your variable declarations, syntax structure, and types.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: replyText,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `⚠️ **Offline Fallback Answer:**\n\nFor **${language.toUpperCase()}**: Verify that all open parentheses, quotes, and block indentations match properly. If the error continues, check line numbers in the error output.\n\n*(Note: Configure \`GEMINI_API_KEY\` in \`backend/.env\` for live cloud AI answers)*`,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: `Chat cleared! Ask me anything about programming in ${language.toUpperCase()}!`,
      },
    ]);
  };

  return (
    <div className="dashboard-view-wrapper d-flex flex-column" style={{ minHeight: "82vh" }}>
      {/* Mentor Header */}
      <div
        className="dash-content-card mb-3 py-3 px-4"
        style={{
          background: "linear-gradient(135deg, rgba(255,131,0,0.1), rgba(0,210,255,0.06))",
          border: "1px solid rgba(255,131,0,0.25)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8300, #ff9f38)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontSize: 22,
                boxShadow: "0 0 16px rgba(255,131,0,0.4)",
              }}
            >
              <FaRobot />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="text-white mb-0" style={{ fontWeight: 700 }}>
                  AI Coding Mentor
                </h4>
                <Badge bg="success" pill className="px-2 py-1" style={{ fontSize: 11 }}>
                  ● Active &amp; Ready
                </Badge>
                <Badge bg="dark" text="warning" className="border border-warning" style={{ fontSize: 11 }}>
                  Gemini AI Powered
                </Badge>
              </div>
              <p className="text-muted small mb-0 mt-1">
                Ask coding questions, error explanations, or algorithm guidance anytime.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Form.Select
              size="sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                border: "1px solid rgba(255,131,0,0.3)",
                borderRadius: 20,
                padding: "5px 14px",
                width: 140,
                fontSize: 13,
              }}
            >
              <option value="python" style={{ background: "#111827" }}>🐍 Python</option>
              <option value="javascript" style={{ background: "#111827" }}>⚡ JavaScript</option>
              <option value="java" style={{ background: "#111827" }}>☕ Java</option>
              <option value="cpp" style={{ background: "#111827" }}>💻 C++</option>
              <option value="c" style={{ background: "#111827" }}>🔷 C</option>
            </Form.Select>

            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-pill px-3 text-nowrap"
              onClick={clearChat}
              title="Clear conversation"
            >
              <FaTrash className="me-1" /> Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Suggested Quick Doubts */}
      <div className="d-flex gap-2 overflow-auto pb-2 mb-3" style={{ scrollbarWidth: "none" }}>
        {quickDoubts.map((doubt, i) => (
          <Button
            key={i}
            variant="outline-secondary"
            size="sm"
            className="text-nowrap rounded-pill py-1 px-3"
            style={{
              fontSize: 12,
              borderColor: "rgba(255,255,255,0.12)",
              color: "#cbd5e1",
              background: "rgba(255,255,255,0.03)",
            }}
            onClick={() => {
              setLanguage(doubt.lang);
              handleSendMessage(doubt.text);
            }}
          >
            <FaQuestionCircle className="me-1 text-warning" />
            {doubt.text}
          </Button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div
        className="flex-grow-1 p-3 rounded mb-3 d-flex flex-column gap-3"
        style={{
          background: "rgba(13, 19, 33, 0.75)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflowY: "auto",
          maxHeight: "58vh",
          minHeight: "42vh",
        }}
      >
        {messages.map((msg, index) => {
          const isAi = msg.sender === "ai";
          return (
            <div
              key={index}
              className={`d-flex gap-2 ${isAi ? "align-self-start" : "align-self-end flex-row-reverse"}`}
              style={{ maxWidth: "85%" }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: isAi ? "linear-gradient(135deg, #FF8300, #ff9f38)" : "#00d2ff",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {isAi ? <FaRobot /> : <FaGraduationCap />}
              </div>

              {/* Message Bubble */}
              <div
                className="p-3 rounded-4"
                style={{
                  background: isAi ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #FF8300, #ff9f38)",
                  color: isAi ? "#f1f5f9" : "#000000",
                  border: isAi ? "1px solid rgba(255,255,255,0.09)" : "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1 gap-3">
                  <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>
                    {isAi ? "CodeGenius AI Mentor" : "You"}
                  </span>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: 10, opacity: 0.6 }}>{msg.time}</span>
                    {isAi && (
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.text, index)}
                        className="btn btn-link p-0 text-muted"
                        style={{ fontSize: 11 }}
                        title="Copy answer"
                      >
                        {copiedIdx === index ? <FaCheck className="text-success" /> : <FaCopy />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Attached Code snippet */}
                {msg.code && (
                  <div
                    className="p-2 rounded mb-2"
                    style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <div className="small text-warning mb-1" style={{ fontSize: 11 }}>
                      <FaCode className="me-1" /> Attached Code:
                    </div>
                    <pre className="mb-0 text-white" style={{ fontSize: 12, overflowX: "auto" }}>
                      {msg.code}
                    </pre>
                  </div>
                )}

                {/* Formatted Text */}
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="d-flex gap-2 align-self-start" style={{ maxWidth: "80%" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8300, #ff9f38)",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              <FaRobot />
            </div>
            <div
              className="p-3 rounded-4 d-flex align-items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,131,0,0.25)",
                color: "#FF8300",
                fontSize: 13,
              }}
            >
              <Spinner animation="grow" size="sm" />
              <Spinner animation="grow" size="sm" />
              <Spinner animation="grow" size="sm" />
              <span className="ms-2">AI Mentor is analyzing your doubt...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Code Drawer Toggle */}
      {showCodeDrawer && (
        <div
          className="p-3 rounded mb-2"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,131,0,0.3)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-warning fw-bold">
              <FaCode className="me-1" /> Paste your code snippet for the AI Mentor:
            </span>
            <Button
              size="sm"
              variant="link"
              className="text-muted p-0"
              onClick={() => setShowCodeDrawer(false)}
            >
              Hide
            </Button>
          </div>
          <Form.Control
            as="textarea"
            rows={4}
            value={codeContext}
            onChange={(e) => setCodeContext(e.target.value)}
            placeholder={`// Paste your ${language.toUpperCase()} code snippet here...`}
            style={{
              background: "#080d1a",
              color: "#00d2ff",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          />
        </div>
      )}

      {/* Input Action Bar */}
      <div
        className="dash-content-card p-2"
        style={{
          background: "rgba(14, 20, 34, 0.95)",
          border: "1px solid rgba(255,131,0,0.25)",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 42, height: 42, flexShrink: 0 }}
            onClick={() => setShowCodeDrawer(!showCodeDrawer)}
            title={showCodeDrawer ? "Hide code snippet" : "Attach code snippet"}
          >
            <FaCode style={{ color: showCodeDrawer ? "#FF8300" : "#94a3b8" }} />
          </Button>

          <Form.Control
            as="textarea"
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask AI Mentor a question about ${language.toUpperCase()} (e.g., 'What is this error?')`}
            disabled={isThinking}
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: "10px 18px",
              fontSize: 14,
              resize: "none",
            }}
          />

          <Button
            className="continue-btn-orange rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 44, height: 44, flexShrink: 0 }}
            onClick={() => handleSendMessage()}
            disabled={isThinking || !inputMessage.trim()}
            title="Send Message"
          >
            <FaPaperPlane style={{ fontSize: 15 }} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mentor;