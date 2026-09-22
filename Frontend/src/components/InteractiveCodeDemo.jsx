import React, { useState } from 'react';
import {
  FaRobot,
  FaPlay,
  FaBug,
  FaMagic,
  FaCheck,
  FaRedo,
  FaTerminal,
  FaCopy,
  FaLightbulb,
  FaBolt,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';

const DEMO_MODES = {
  BUG_FIX: 'bug_fix',
  EXPLAIN: 'explain',
  GENERATE: 'generate'
};

const InteractiveCodeDemo = () => {
  const [activeMode, setActiveMode] = useState(DEMO_MODES.BUG_FIX);
  const [isFixed, setIsFixed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Selected prompt for generation
  const [selectedPrompt, setSelectedPrompt] = useState('fibonacci');

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setIsFixed(false);
    setIsAnalyzing(false);
    setShowTerminal(false);
    setTerminalOutput('');
  };

  const handleFixWithAI = () => {
    setIsAnalyzing(true);
    setShowTerminal(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsFixed(true);
    }, 900);
  };

  const handleResetBug = () => {
    setIsFixed(false);
    setShowTerminal(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setShowTerminal(true);
    setTerminalOutput('Compiling code on cloud runtime...');

    setTimeout(() => {
      setIsRunning(false);
      if (activeMode === DEMO_MODES.BUG_FIX) {
        if (!isFixed) {
          setTerminalOutput(`Traceback (most recent call last):
  File "main.py", line 5, in calculate_average
    return total / len(scores)
ZeroDivisionError: division by zero
[Process crashed with exit code 1]`);
        } else {
          setTerminalOutput(`> python3 main.py
[Output]: Average = 0.0 (empty list handled safely)
[Output]: Average = 92.5
>>> Execution finished in 28ms. Memory: 12.4MB`);
        }
      } else if (activeMode === DEMO_MODES.EXPLAIN) {
        setTerminalOutput(`> node search.js
[Output]: Target 42 found at index: 3
>>> Test cases: 4/4 passed (18ms)`);
      } else {
        setTerminalOutput(`> python3 generate.py
[Output]: Result: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
>>> Verified with 10 test vectors (14ms)`);
      }
    }, 600);
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-demo-window">
      {/* Window Header */}
      <div className="ai-demo-header">
        <div className="window-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>

        {/* Tab switcher */}
        <div className="demo-mode-tabs">
          <button
            className={`demo-tab-btn ${activeMode === DEMO_MODES.BUG_FIX ? 'active' : ''}`}
            onClick={() => handleModeChange(DEMO_MODES.BUG_FIX)}
          >
            <FaBug className="tab-icon" /> AI Bug Fix
          </button>
          <button
            className={`demo-tab-btn ${activeMode === DEMO_MODES.EXPLAIN ? 'active' : ''}`}
            onClick={() => handleModeChange(DEMO_MODES.EXPLAIN)}
          >
            <FaLightbulb className="tab-icon" /> Explain Code
          </button>
          <button
            className={`demo-tab-btn ${activeMode === DEMO_MODES.GENERATE ? 'active' : ''}`}
            onClick={() => handleModeChange(DEMO_MODES.GENERATE)}
          >
            <FaMagic className="tab-icon" /> AI Generate
          </button>
        </div>

        {/* Live Badge */}
        <div className="live-pill">
          <span className="pulse-indicator"></span> Live Demo
        </div>
      </div>

      {/* Editor Subheader / Filename & Actions */}
      <div className="ai-editor-subheader">
        <div className="file-info">
          <span className="file-tag">
            {activeMode === DEMO_MODES.BUG_FIX && '🐍 Python • app.py'}
            {activeMode === DEMO_MODES.EXPLAIN && '⚡ JS • binarySearch.js'}
            {activeMode === DEMO_MODES.GENERATE && '✨ AI Studio • solution.py'}
          </span>
        </div>
        <div className="editor-quick-actions">
          <button
            className="quick-action-btn"
            title="Copy code"
            onClick={() => handleCopy("CodeGenius AI Demo Code")}
          >
            {copied ? <FaCheck className="text-success" /> : <FaCopy />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ai-demo-body">
        {/* MODE 1: BUG FIX */}
        {activeMode === DEMO_MODES.BUG_FIX && (
          <div className="code-view">
            <div className="code-lines">
              <div className="code-line">
                <span className="line-no">1</span>
                <span className="code-text"><span className="kw">def</span> <span className="fn">calculate_average</span>(scores):</span>
              </div>
              <div className="code-line">
                <span className="line-no">2</span>
                <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;total = <span className="builtin">sum</span>(scores)</span>
              </div>

              {!isFixed ? (
                <div className="code-line bug-line">
                  <span className="line-no">3</span>
                  <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">return</span> total / <span className="builtin">len</span>(scores)&nbsp;&nbsp;<span className="comment"># Bug: Crashes on empty list</span></span>
                  <span className="bug-tag"><FaExclamationTriangle /> ZeroDivisionError</span>
                </div>
              ) : (
                <>
                  <div className="code-line fixed-line">
                    <span className="line-no">3</span>
                    <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">if not</span> scores:</span>
                    <span className="fix-tag"><FaCheckCircle /> Guard Clause</span>
                  </div>
                  <div className="code-line fixed-line">
                    <span className="line-no">4</span>
                    <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">return</span> <span className="num">0.0</span>&nbsp;&nbsp;<span className="comment"># Safely handle empty inputs</span></span>
                  </div>
                  <div className="code-line">
                    <span className="line-no">5</span>
                    <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">return</span> total / <span className="builtin">len</span>(scores)</span>
                  </div>
                </>
              )}

              <div className="code-line">
                <span className="line-no">{isFixed ? '6' : '4'}</span>
                <span className="code-text"></span>
              </div>
              <div className="code-line">
                <span className="line-no">{isFixed ? '7' : '5'}</span>
                <span className="code-text"><span className="builtin">print</span>(<span className="fn">calculate_average</span>([]))</span>
              </div>
            </div>

            {/* AI Explanation Callout */}
            <div className={`ai-insight-box ${isFixed ? 'fixed-state' : 'warning-state'}`}>
              <div className="ai-insight-header">
                <FaRobot className="insight-robot" />
                <strong>CodeGenius AI Diagnostic:</strong>
                <span className="confidence-pill">{isFixed ? '100% Fixed' : 'Issue Found'}</span>
              </div>
              <p className="ai-insight-text">
                {!isFixed
                  ? 'If `scores` is empty, `len(scores)` evaluates to 0, resulting in a fatal `ZeroDivisionError` at runtime.'
                  : 'AI added a guard clause `if not scores:` to cleanly return `0.0`, preventing unhandled crashes and stabilizing your pipeline.'}
              </p>
            </div>
          </div>
        )}

        {/* MODE 2: EXPLAIN CODE */}
        {activeMode === DEMO_MODES.EXPLAIN && (
          <div className="code-view">
            <div className="code-lines">
              <div className="code-line">
                <span className="line-no">1</span>
                <span className="code-text"><span className="kw">function</span> <span className="fn">binarySearch</span>(arr, target) &#123;</span>
              </div>
              <div className="code-line">
                <span className="line-no">2</span>
                <span className="code-text">&nbsp;&nbsp;<span className="kw">let</span> left = <span className="num">0</span>, right = arr.length - <span className="num">1</span>;</span>
              </div>
              <div className="code-line">
                <span className="line-no">3</span>
                <span className="code-text">&nbsp;&nbsp;<span className="kw">while</span> (left &lt;= right) &#123;</span>
              </div>
              <div className="code-line">
                <span className="line-no">4</span>
                <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">const</span> mid = Math.<span className="fn">floor</span>((left + right) / <span className="num">2</span>);</span>
              </div>
              <div className="code-line highlight-line">
                <span className="line-no">5</span>
                <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">if</span> (arr[mid] === target) <span className="kw">return</span> mid;</span>
              </div>
              <div className="code-line">
                <span className="line-no">6</span>
                <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">if</span> (arr[mid] &lt; target) left = mid + <span className="num">1</span>;</span>
              </div>
              <div className="code-line">
                <span className="line-no">7</span>
                <span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">else</span> right = mid - <span className="num">1</span>;</span>
              </div>
              <div className="code-line">
                <span className="line-no">8</span>
                <span className="code-text">&nbsp;&nbsp;&#125;</span>
              </div>
              <div className="code-line">
                <span className="line-no">9</span>
                <span className="code-text">&nbsp;&nbsp;<span className="kw">return</span> -<span className="num">1</span>;</span>
              </div>
              <div className="code-line">
                <span className="line-no">10</span>
                <span className="code-text">&#125;</span>
              </div>
            </div>

            {/* AI Breakdown Card */}
            <div className="ai-insight-box explain-state">
              <div className="ai-insight-header">
                <FaRobot className="insight-robot" />
                <strong>AI Algorithm Breakdown:</strong>
                <span className="complexity-badge">O(log N) Time</span>
                <span className="complexity-badge">O(1) Space</span>
              </div>
              <ul className="explain-points">
                <li><strong>Divide & Conquer:</strong> Continuously splits sorted array in half using middle index calculation.</li>
                <li><strong>Pointer Shifting:</strong> If target is greater, search right half (<code>left = mid + 1</code>); else search left half.</li>
              </ul>
            </div>
          </div>
        )}

        {/* MODE 3: GENERATE CODE */}
        {activeMode === DEMO_MODES.GENERATE && (
          <div className="code-view">
            <div className="prompt-selector-bar">
              <span className="prompt-label">Prompt:</span>
              <div className="prompt-chips">
                <button
                  className={`prompt-chip ${selectedPrompt === 'fibonacci' ? 'active' : ''}`}
                  onClick={() => setSelectedPrompt('fibonacci')}
                >
                  Fibonacci Sequence
                </button>
                <button
                  className={`prompt-chip ${selectedPrompt === 'reverse' ? 'active' : ''}`}
                  onClick={() => setSelectedPrompt('reverse')}
                >
                  Reverse Linked List
                </button>
                <button
                  className={`prompt-chip ${selectedPrompt === 'api' ? 'active' : ''}`}
                  onClick={() => setSelectedPrompt('api')}
                >
                  REST API Route
                </button>
              </div>
            </div>

            <div className="code-lines">
              {selectedPrompt === 'fibonacci' && (
                <>
                  <div className="code-line"><span className="line-no">1</span><span className="code-text"><span className="comment"># AI Prompt: Generate optimized Fibonacci generator</span></span></div>
                  <div className="code-line"><span className="line-no">2</span><span className="code-text"><span className="kw">def</span> <span className="fn">generate_fibonacci</span>(n: <span className="builtin">int</span>):</span></div>
                  <div className="code-line"><span className="line-no">3</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;a, b = <span className="num">0</span>, <span className="num">1</span></span></div>
                  <div className="code-line"><span className="line-no">4</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;result = []</span></div>
                  <div className="code-line"><span className="line-no">5</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">for</span> _ <span className="kw">in</span> <span className="builtin">range</span>(n):</span></div>
                  <div className="code-line"><span className="line-no">6</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;result.<span className="fn">append</span>(a)</span></div>
                  <div className="code-line"><span className="line-no">7</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a, b = b, a + b</span></div>
                  <div className="code-line"><span className="line-no">8</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">return</span> result</span></div>
                </>
              )}

              {selectedPrompt === 'reverse' && (
                <>
                  <div className="code-line"><span className="line-no">1</span><span className="code-text"><span className="comment"># AI Prompt: Reverse Singly Linked List in place</span></span></div>
                  <div className="code-line"><span className="line-no">2</span><span className="code-text"><span className="kw">def</span> <span className="fn">reverse_list</span>(head):</span></div>
                  <div className="code-line"><span className="line-no">3</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;prev, curr = <span className="kw">None</span>, head</span></div>
                  <div className="code-line"><span className="line-no">4</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">while</span> curr:</span></div>
                  <div className="code-line"><span className="line-no">5</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nxt = curr.next</span></div>
                  <div className="code-line"><span className="line-no">6</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;curr.next = prev</span></div>
                  <div className="code-line"><span className="line-no">7</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;prev = curr</span></div>
                  <div className="code-line"><span className="line-no">8</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;curr = nxt</span></div>
                  <div className="code-line"><span className="line-no">9</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">return</span> prev</span></div>
                </>
              )}

              {selectedPrompt === 'api' && (
                <>
                  <div className="code-line"><span className="line-no">1</span><span className="code-text"><span className="comment">// AI Prompt: Express.js async endpoint with error handling</span></span></div>
                  <div className="code-line"><span className="line-no">2</span><span className="code-text">app.<span className="fn">get</span>(<span className="str">'/api/user/:id'</span>, <span className="kw">async</span> (req, res) =&gt; &#123;</span></div>
                  <div className="code-line"><span className="line-no">3</span><span className="code-text">&nbsp;&nbsp;<span className="kw">try</span> &#123;</span></div>
                  <div className="code-line"><span className="line-no">4</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">const</span> user = <span className="kw">await</span> User.<span className="fn">findById</span>(req.params.id);</span></div>
                  <div className="code-line"><span className="line-no">5</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;<span className="kw">if</span> (!user) <span className="kw">return</span> res.<span className="fn">status</span>(<span className="num">404</span>).<span className="fn">json</span>(&#123; message: <span className="str">'Not found'</span> &#125;);</span></div>
                  <div className="code-line"><span className="line-no">6</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;res.<span className="fn">json</span>(user);</span></div>
                  <div className="code-line"><span className="line-no">7</span><span className="code-text">&nbsp;&nbsp;&#125; <span className="kw">catch</span> (err) &#123;</span></div>
                  <div className="code-line"><span className="line-no">8</span><span className="code-text">&nbsp;&nbsp;&nbsp;&nbsp;res.<span className="fn">status</span>(<span className="num">500</span>).<span className="fn">json</span>(&#123; error: err.message &#125;);</span></div>
                  <div className="code-line"><span className="line-no">9</span><span className="code-text">&nbsp;&nbsp;&#125;</span></div>
                  <div className="code-line"><span className="line-no">10</span><span className="code-text">&#125;);</span></div>
                </>
              )}
            </div>

            <div className="ai-insight-box generate-state">
              <div className="ai-insight-header">
                <FaRobot className="insight-robot" />
                <strong>AI Synthesized:</strong>
                <span className="gen-tag">Production Ready</span>
              </div>
              <p className="ai-insight-text">
                Generated strictly typed, fully documented code with edge-case checks in <strong>340ms</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Terminal Output Panel */}
        {showTerminal && (
          <div className="demo-terminal-panel">
            <div className="terminal-header">
              <FaTerminal className="terminal-icon" />
              <span>CodeGenius Cloud Sandbox — Output</span>
              <button className="terminal-close" onClick={() => setShowTerminal(false)}>✕</button>
            </div>
            <pre className="terminal-body">{terminalOutput}</pre>
          </div>
        )}
      </div>

      {/* Editor Control Footer */}
      <div className="ai-demo-footer">
        <div className="footer-left">
          {activeMode === DEMO_MODES.BUG_FIX && (
            <>
              {!isFixed ? (
                <button
                  className="ai-action-btn primary-ai-btn"
                  onClick={handleFixWithAI}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      AI Analyzing AST...
                    </>
                  ) : (
                    <>
                      <FaBolt /> ⚡ Fix with AI
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="ai-action-btn secondary-btn"
                  onClick={handleResetBug}
                >
                  <FaRedo /> Reset Bug
                </button>
              )}
            </>
          )}

          {activeMode === DEMO_MODES.EXPLAIN && (
            <button
              className="ai-action-btn primary-ai-btn"
              onClick={() => {
                setShowTerminal(false);
              }}
            >
              <FaRobot /> AI Deep Dive
            </button>
          )}

          {activeMode === DEMO_MODES.GENERATE && (
            <button
              className="ai-action-btn primary-ai-btn"
              onClick={() => handleRunCode()}
            >
              <FaMagic /> Test Output
            </button>
          )}

          <button
            className="ai-action-btn run-btn"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            <FaPlay className="play-icon" /> {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>

        <div className="footer-status">
          <span className="engine-text">Engine: <strong>CodeGenius-v2 (Ultra)</strong></span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCodeDemo;
