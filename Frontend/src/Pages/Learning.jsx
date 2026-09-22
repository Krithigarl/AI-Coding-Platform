import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ProgressBar,
  Button,
  Form,
  Badge,
  Spinner,
  Modal
} from "react-bootstrap";
import {
  FaLightbulb,
  FaCode,
  FaPlay,
  FaCopy,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaArrowRight,
  FaRobot,
  FaPaperPlane,
  FaRocket,
  FaCheckCircle,
  FaTerminal,
  FaLaptopCode,
  FaFileAlt
} from "react-icons/fa";

import pythonImg from "../assets/python.png";
import javaImg from "../assets/java.png";
import cppImg from "../assets/c++.png";
import cImg from "../assets/c.png";
import jsImg from "../assets/c.png";

// Comprehensive syllabus data with Definition, Syntax, Example, Output
const coursesSyllabusData = {
  python: {
    name: "Python Programming",
    slug: "python",
    image: pythonImg,
    levelInfo: "Beginner to Advanced • 12 Weeks • 45 Topics",
    modules: [
      {
        id: "m1",
        number: 1,
        title: "Introduction to Python",
        topics: [
          {
            id: "1.1",
            title: "What is Python?",
            status: "completed",
            definition:
              "Python is a high-level, interpreted programming language known for its simplicity and readability. It is widely used in web development, data science, artificial intelligence, automation and more.",
            syntax: `print("Hello, Python!")`,
            syntaxNote:
              "In Python, we use print() function to display output on the screen.",
            example: `# This is a simple Python program
print("Welcome to Python!")
name = "Krithiga"
print("My name is", name)`,
            output: `Welcome to Python!
My name is Krithiga`,
            task: "Write a program that prints your name and your coding goal for this week."
          },
          {
            id: "1.2",
            title: "Features of Python",
            status: "completed",
            definition:
              "Python is dynamically typed, platform-independent, object-oriented, and supported by an extensive standard library. Code is concise and resembles plain English.",
            syntax: `# Dynamic typing in Python
x = 10       # integer
x = "Hello"  # changed to string automatically`,
            syntaxNote:
              "You don't need to specify variable types explicitly in Python.",
            example: `language = "Python"
version = 3.12
is_fun = True

print(f"{language} version {version} is fun: {is_fun}")`,
            output: `Python version 3.12 is fun: True`,
            task: "Declare three different variables (string, integer, float) and print their values."
          },
          {
            id: "1.3",
            title: "Install Python & Setup",
            status: "completed",
            definition:
              "Python can be installed from python.org. You can run scripts using the terminal, VS Code, or our built-in CodeGenius cloud runtime without any local installation.",
            syntax: `$ python3 --version
$ python3 main.py`,
            syntaxNote:
              "Use terminal commands to verify installation and execute Python script files.",
            example: `import sys

print("Python version:")
print(sys.version_info.major, ".", sys.version_info.minor)`,
            output: `Python version:
3 . 12`,
            task: "Run a python version check script in the cloud terminal."
          },
          {
            id: "1.4",
            title: "First Program & Comments",
            status: "current",
            definition:
              "Comments start with '#' and are ignored by the Python interpreter. They make code easy to understand and document key logic.",
            syntax: `# Single-line comment
"""
Multi-line comment
or docstring
"""`,
            syntaxNote: "Comments help explain the 'why' behind complex code.",
            example: `# Compute sum of two numbers
num1 = 15
num2 = 25
total = num1 + num2

print("The sum is:", total)`,
            output: `The sum is: 40`,
            task: "Write a comment explaining your first math calculation in Python."
          }
        ]
      },
      {
        id: "m2",
        number: 2,
        title: "Variables and Data Types",
        topics: [
          {
            id: "2.1",
            title: "Variables in Python",
            status: "pending",
            definition:
              "Variables are containers for storing data values. In Python, a variable is created the moment you first assign a value to it using the '=' operator.",
            syntax: `variable_name = value`,
            syntaxNote: "Variable names should be descriptive and use snake_case.",
            example: `student_name = "Krithiga"
score = 98.5
passed = True

print(student_name, "scored:", score, "| Passed:", passed)`,
            output: `Krithiga scored: 98.5 | Passed: True`,
            task: "Create variables for student name, age, and course name and print them."
          },
          {
            id: "2.2",
            title: "Numeric Types (int, float)",
            status: "pending",
            definition:
              "Python supports integers (whole numbers) and floats (numbers with decimal fractions). Arithmetic operations are built-in.",
            syntax: `a = 10       # int
b = 3.14     # float
c = a * b    # float multiplication`,
            syntaxNote: "Dividing two integers using '/' always produces a float.",
            example: `radius = 5.0
pi = 3.14159
area = pi * (radius ** 2)

print("Circle Area:", area)`,
            output: `Circle Area: 78.53975`,
            task: "Calculate the area of a rectangle with length 12 and width 8."
          }
        ]
      },
      {
        id: "m3",
        number: 3,
        title: "Operators",
        topics: [
          {
            id: "3.1",
            title: "Arithmetic Operators",
            status: "pending",
            definition:
              "Arithmetic operators include addition (+), subtraction (-), multiplication (*), division (/), floor division (//), modulus (%), and exponentiation (**).",
            syntax: `result = a + b * c`,
            syntaxNote: "PEMDAS operator precedence applies in mathematical expressions.",
            example: `a = 17
b = 4

print("Quotient:", a // b)
print("Remainder:", a % b)
print("Power:", b ** 3)`,
            output: `Quotient: 4
Remainder: 1
Power: 64`,
            task: "Write a program to convert minutes into hours and remaining minutes."
          }
        ]
      },
      {
        id: "m4",
        number: 4,
        title: "Conditional Statements",
        topics: [
          {
            id: "4.1",
            title: "if, elif and else",
            status: "pending",
            definition:
              "Conditional statements execute different blocks of code based on whether a boolean condition evaluates to True or False.",
            syntax: `if condition:
    # do something
elif another_condition:
    # do something else
else:
    # default action`,
            syntaxNote: "Indentation (4 spaces) is strictly required to define blocks.",
            example: `marks = 85

if marks >= 90:
    print("Grade: A+")
elif marks >= 75:
    print("Grade: A")
else:
    print("Grade: B")`,
            output: `Grade: A`,
            task: "Check whether a number is positive, negative, or zero."
          }
        ]
      },
      {
        id: "m5",
        number: 5,
        title: "Loops",
        topics: [
          {
            id: "5.1",
            title: "for and while loops",
            status: "pending",
            definition:
              "Loops allow you to iterate over a sequence (list, range, string) or repeatedly execute code while a condition remains True.",
            syntax: `for item in sequence:
    # process item

while condition:
    # execute until condition is False`,
            syntaxNote: "Use break to exit a loop early or continue to skip an iteration.",
            example: `print("Counting down:")
for i in range(3, 0, -1):
    print(i)
print("Blast off! 🚀")`,
            output: `Counting down:
3
2
1
Blast off! 🚀`,
            task: "Print multiplication table of 5 up to 10."
          }
        ]
      },
      {
        id: "m6",
        number: 6,
        title: "Functions",
        topics: [
          {
            id: "6.1",
            title: "Function Definition & Return",
            status: "pending",
            definition:
              "Functions are reusable blocks of code defined with 'def'. They can accept parameters and return computed results using 'return'.",
            syntax: `def function_name(param1, param2):
    return param1 + param2`,
            syntaxNote: "Functions keep your code modular, clean, and DRY.",
            example: `def calculate_bmi(weight_kg, height_m):
    return round(weight_kg / (height_m ** 2), 2)

print("BMI:", calculate_bmi(65, 1.72))`,
            output: `BMI: 21.97`,
            task: "Write a function that accepts temperature in Celsius and returns Fahrenheit."
          }
        ]
      },
      {
        id: "m7",
        number: 7,
        title: "Lists, Tuples and Sets",
        topics: [
          {
            id: "7.1",
            title: "Data Collections",
            status: "pending",
            definition:
              "Lists are ordered and mutable. Tuples are ordered and immutable. Sets are unordered collections of unique elements.",
            syntax: `my_list = [1, 2, 3]
my_tuple = (10, 20)
my_set = {1, 2, 2, 3}`,
            syntaxNote: "Sets automatically discard duplicate values.",
            example: `skills = ["Python", "React", "AI"]
skills.append("MongoDB")

print("Skills list:", skills)
print("Count:", len(skills))`,
            output: `Skills list: ['Python', 'React', 'AI', 'MongoDB']
Count: 4`,
            task: "Create a list of 5 programming languages and remove the first item."
          }
        ]
      },
      {
        id: "m8",
        number: 8,
        title: "Dictionaries",
        topics: [
          {
            id: "8.1",
            title: "Key-Value Pairs",
            status: "pending",
            definition:
              "Dictionaries store data in key-value pairs. Keys must be unique and immutable, while values can be of any data type.",
            syntax: `my_dict = {"name": "Alice", "age": 22}`,
            syntaxNote: "Access values quickly using dictionary[key] or dict.get(key).",
            example: `student = {
    "name": "Krithiga",
    "course": "Python",
    "xp": 450
}

print(f"{student['name']} has {student['xp']} XP in {student['course']}.")`,
            output: `Krithiga has 450 XP in Python.`,
            task: "Create a dictionary representing a book with title, author, and year."
          }
        ]
      },
      {
        id: "m9",
        number: 9,
        title: "Object-Oriented Programming",
        topics: [
          {
            id: "9.1",
            title: "Classes, Objects & __init__",
            status: "pending",
            definition:
              "OOP models real-world entities through classes (blueprints) and objects (instances). The '__init__' constructor initializes object attributes.",
            syntax: `class ClassName:
    def __init__(self, arg):
        self.arg = arg`,
            syntaxNote: "'self' represents the specific instance being operated on.",
            example: `class Developer:
    def __init__(self, name, lang):
        self.name = name
        self.lang = lang

    def intro(self):
        return f"{self.name} builds with {self.lang}!"

dev = Developer("Krithiga", "Python")
print(dev.intro())`,
            output: `Krithiga builds with Python!`,
            task: "Create a Car class with brand and speed attributes and an accelerate method."
          }
        ]
      },
      {
        id: "m10",
        number: 10,
        title: "Python Projects",
        topics: [
          {
            id: "10.1",
            title: "Real-world Mini Projects",
            status: "pending",
            definition:
              "Combine variables, functions, conditionals, and data structures to build end-to-end applications like Expense Trackers and Automation Bots.",
            syntax: `# Complete project architecture
import random
import datetime`,
            syntaxNote: "Writing modular scripts is the bridge to becoming a full software engineer.",
            example: `def roll_dice():
    import random
    return random.randint(1, 6)

print("You rolled:", roll_dice())`,
            output: `You rolled: 5`,
            task: "Build a number guessing game where the computer picks 1-10."
          }
        ]
      }
    ]
  },
  java: {
    name: "Java Programming",
    slug: "java",
    image: javaImg,
    levelInfo: "Beginner to Advanced • 10 Weeks • 38 Topics",
    modules: [
      {
        id: "jm1",
        number: 1,
        title: "Introduction to Java",
        topics: [
          {
            id: "1.1",
            title: "What is Java & JVM?",
            status: "completed",
            definition:
              "Java is a robust, class-based, object-oriented programming language designed for 'Write Once, Run Anywhere' (WORA) execution via the Java Virtual Machine (JVM).",
            syntax: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
            syntaxNote: "Every Java program must have at least one class and an entry point main method.",
            example: `public class Welcome {
    public static void main(String[] args) {
        String student = "Krithiga";
        System.out.println("Welcome to Java, " + student + "!");
    }
}`,
            output: `Welcome to Java, Krithiga!`,
            task: "Write a program that prints your name and college/company in Java."
          },
          {
            id: "1.2",
            title: "Java Variables & Data Types",
            status: "current",
            definition:
              "Java is strongly and statically typed. Variables must be declared with their specific data type (int, double, boolean, char, String) before use.",
            syntax: `int age = 21;
double gpa = 3.9;
boolean isStudent = true;`,
            syntaxNote: "Primitive types include int, byte, short, long, float, double, boolean, char.",
            example: `public class TypesDemo {
    public static void main(String[] args) {
        int year = 2026;
        double price = 49.99;
        System.out.println("Year: " + year + " | Price: $" + price);
    }
}`,
            output: `Year: 2026 | Price: $49.99`,
            task: "Declare variables for item name, quantity, and unit price and calculate the total."
          }
        ]
      },
      {
        id: "jm2",
        number: 2,
        title: "Control Flow & Methods",
        topics: [
          {
            id: "2.1",
            title: "if-else & switch statements",
            status: "pending",
            definition:
              "Control flow structures determine which branches of code execute based on conditions or expression evaluation.",
            syntax: `if (score >= 90) {
    grade = 'A';
} else {
    grade = 'B';
}`,
            syntaxNote: "Java evaluates boolean expressions strictly inside the condition parentheses.",
            example: `public class GradeChecker {
    public static void main(String[] args) {
        int score = 88;
        if (score >= 75) {
            System.out.println("Passed with Distinction!");
        }
    }
}`,
            output: `Passed with Distinction!`,
            task: "Check whether a given number is even or odd using the modulus operator."
          }
        ]
      }
    ]
  },
  cpp: {
    name: "C++ Programming",
    slug: "cpp",
    image: cppImg,
    levelInfo: "Beginner to Advanced • 12 Weeks • 40 Topics",
    modules: [
      {
        id: "cm1",
        number: 1,
        title: "C++ Fundamentals",
        topics: [
          {
            id: "1.1",
            title: "What is C++?",
            status: "completed",
            definition:
              "C++ is a high-performance, general-purpose programming language developed by Bjarne Stroustrup as an extension of C with classes, templates, and low-level memory control.",
            syntax: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}`,
            syntaxNote: "'cout' is the standard character output stream from the iostream header.",
            example: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string coder = "Krithiga";
    cout << "Welcome to C++, " << coder << "!" << endl;
    return 0;
}`,
            output: `Welcome to C++, Krithiga!`,
            task: "Write a program that takes two integers as input and prints their sum."
          },
          {
            id: "1.2",
            title: "Pointers and References",
            status: "pending",
            definition:
              "A pointer is a variable that stores the memory address of another variable. References act as aliases to existing memory locations.",
            syntax: `int val = 42;
int* ptr = &val;  // pointer holding address of val
int& ref = val;   // reference alias`,
            syntaxNote: "'&' is the address-of operator; '*' is the dereference operator.",
            example: `#include <iostream>
using namespace std;

int main() {
    int num = 100;
    int* p = &num;
    cout << "Value: " << *p << " | Address: " << p << endl;
    return 0;
}`,
            output: `Value: 100 | Address: 0x7ffd9b8f2`,
            task: "Swap two integer values using pointers in a swap() function."
          }
        ]
      }
    ]
  },
  c: {
    name: "C Programming",
    slug: "c",
    image: cImg,
    levelInfo: "Beginner to Advanced • 8 Weeks • 30 Topics",
    modules: [
      {
        id: "c_m1",
        number: 1,
        title: "C Essentials",
        topics: [
          {
            id: "1.1",
            title: "What is C Language?",
            status: "completed",
            definition:
              "C is a foundational procedural programming language developed by Dennis Ritchie at Bell Labs. It provides structured programming and direct hardware/memory access.",
            syntax: `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    return 0;
}`,
            syntaxNote: "The stdio.h library provides printf and scanf standard I/O functions.",
            example: `#include <stdio.h>

int main() {
    char name[] = "Krithiga";
    printf("Welcome to C Language, %s!\\n", name);
    return 0;
}`,
            output: `Welcome to C Language, Krithiga!`,
            task: "Write a C program to calculate simple interest."
          }
        ]
      }
    ]
  }
};

const Learning = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const courseSlug = (id || "python").toLowerCase();
  const currentCourse =
    coursesSyllabusData[courseSlug] || coursesSyllabusData.python;

  // Flattened list of all topics for easy Next/Prev navigation
  const allTopicsList = [];
  currentCourse.modules.forEach((mod) => {
    mod.topics.forEach((top) => {
      allTopicsList.push({ ...top, moduleId: mod.id, moduleTitle: mod.title });
    });
  });

  const [expandedModules, setExpandedModules] = useState({
    [currentCourse.modules[0].id]: true
  });
  const [activeTopic, setActiveTopic] = useState(allTopicsList[0]);
  const [activeTab, setActiveTab] = useState("learn"); // 'learn' | 'example' | 'task'

  useEffect(() => {
    if (currentCourse?.modules?.length > 0) {
      setExpandedModules({
        [currentCourse.modules[0].id]: true
      });
      if (currentCourse.modules[0].topics?.length > 0) {
        const firstTopic = currentCourse.modules[0].topics[0];
        setActiveTopic({
          ...firstTopic,
          moduleId: currentCourse.modules[0].id,
          moduleTitle: currentCourse.modules[0].title
        });
      }
    }
  }, [courseSlug]);

  // Copy feedback
  const [copiedSection, setCopiedSection] = useState("");

  // AI Mentor Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hi Krithiga! 👋 How can I help you with this topic today?"
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [aiThinking, setAiThinking] = useState(false);

  // Quick Action Modal (Editor / Terminal)
  const [showConsoleModal, setShowConsoleModal] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState("");

  // Toggle Module Accordion
  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  // Select Topic
  const handleSelectTopic = (topic) => {
    setActiveTopic(topic);
    // Expand parent module
    setExpandedModules((prev) => ({
      ...prev,
      [topic.moduleId]: true
    }));
  };

  // Find index of active topic
  const activeIndex = allTopicsList.findIndex((t) => t.id === activeTopic.id);

  const handleNextTopic = () => {
    if (activeIndex < allTopicsList.length - 1) {
      const nextTopic = allTopicsList[activeIndex + 1];
      setActiveTopic(nextTopic);
      setExpandedModules((prevModules) => ({ ...prevModules, [nextTopic.moduleId]: true }));
    }
  };

  const handlePrevTopic = () => {
    if (activeIndex > 0) {
      const prevTopic = allTopicsList[activeIndex - 1];
      setActiveTopic(prevTopic);
      setExpandedModules((prevModules) => ({ ...prevModules, [prevTopic.moduleId]: true }));
    }
  };

  const handleCopy = (text, sectionName) => {
    navigator.clipboard?.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(""), 2000);
  };

  // AI Prompt handler
  const handleQuickPrompt = (promptType) => {
    let questionText = "";
    if (promptType === "explain") {
      questionText = `Can you explain "${activeTopic.title}" in simple words with a relatable analogy?`;
    } else if (promptType === "hint") {
      questionText = `Can you give me a hint on how to practice "${activeTopic.title}"?`;
    } else if (promptType === "check") {
      questionText = `How can I verify if my code for "${activeTopic.title}" has any bugs?`;
    } else if (promptType === "optimize") {
      questionText = `What are the best practices and optimization tips for "${activeTopic.title}"?`;
    }

    sendAiMessage(questionText);
  };

  const sendAiMessage = (userText) => {
    if (!userText.trim()) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputQuestion("");
    setAiThinking(true);

    setTimeout(() => {
      let aiReply = "";
      if (userText.includes("explain")) {
        aiReply = `Great question! Think of "${activeTopic.title}" like a recipe step: ${activeTopic.definition} It allows your program to make structured decisions without hardcoding every scenario.`;
      } else if (userText.includes("hint")) {
        aiReply = `💡 Pro-Tip for ${activeTopic.title}: Always pay close attention to syntax indentation and make sure your variable names clearly describe what they hold!`;
      } else if (userText.includes("check") || userText.includes("verify")) {
        aiReply = `✓ To test your code for ${activeTopic.title}: Test with both normal inputs and edge cases (like empty strings, 0, or negative values). Everything compiles clean!`;
      } else if (userText.includes("optimize")) {
        aiReply = `⚡ Performance tip: In modern Python 3, using f-strings and avoiding redundant operations keeps memory footprint under 12MB and execution ultra-fast!`;
      } else {
        aiReply = `I understand! Regarding "${activeTopic.title}": The key rule is ${activeTopic.syntaxNote} Keep experimenting with the example code!`;
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setAiThinking(false);
    }, 700);
  };

  // Run code simulation
  const handleRunCodeAction = () => {
    setShowConsoleModal(true);
    setConsoleOutput("Initializing CodeGenius Python Virtual Runtime...\nExecuting script...");
    setTimeout(() => {
      setConsoleOutput(
        `> python3 solution.py\n${activeTopic.output}\n\n✓ Process finished with exit code 0 (Execution time: 24ms)`
      );
    }, 500);
  };

  if (!activeTopic || !activeTopic.id) {
    return (
      <div className="learning-page-wrapper text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-secondary">Loading learning module...</p>
      </div>
    );
  }

  return (
    <div className="learning-page-wrapper">
      {/* Breadcrumb & Top Course Banner */}
      <div className="learning-top-banner mb-4">
        <div className="breadcrumb-nav mb-2">
          <span>My Courses</span> &gt;{" "}
          <span>{currentCourse.name}</span> &gt;{" "}
          <span className="current-crumb">Learning</span>
        </div>

        <div className="course-banner-card">
          <div className="banner-left">
            <div className="banner-logo-box">
              <img src={currentCourse.image} alt={currentCourse.name} />
            </div>
            <div className="banner-info">
              <h2 className="banner-title mb-1">{currentCourse.name}</h2>
              <p className="banner-sub mb-2">{currentCourse.levelInfo}</p>
              <div className="banner-progress-wrap">
                <ProgressBar now={42} className="banner-progress-bar" />
                <span className="banner-progress-label">42% Completed</span>
              </div>
            </div>
          </div>

          <div className="banner-right">
            <Button
              className="btn-back-roadmap"
              onClick={() => navigate(`/dashboard/roadmap/${currentCourse.slug}`)}
            >
              <FaArrowLeft className="me-2" /> Back to Roadmap
            </Button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Learning Grid */}
      <div className="learning-grid-container">
        {/* COLUMN 1: SYLLABUS ACCORDION */}
        <aside className="syllabus-column">
          <div className="syllabus-card-container">
            <h4 className="syllabus-heading">Syllabus</h4>

            <div className="syllabus-modules-list">
              {currentCourse.modules.map((mod) => {
                const isExpanded = Boolean(expandedModules[mod.id]);
                const containsActiveTopic = mod.topics.some(
                  (t) => t.id === activeTopic.id
                );

                return (
                  <div
                    key={mod.id}
                    className={`syllabus-module-group ${
                      containsActiveTopic ? "active-group" : ""
                    }`}
                  >
                    {/* Module Accordion Header */}
                    <div
                      className="module-header-row"
                      onClick={() => toggleModule(mod.id)}
                    >
                      <div className="module-title-wrap">
                        <span className="module-number-circle">
                          {mod.number}
                        </span>
                        <span className="module-title-text">
                          {mod.number}. {mod.title}
                        </span>
                      </div>
                      <span className="module-chevron">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>

                    {/* Topics Sub-list */}
                    {isExpanded && (
                      <div className="module-topics-list">
                        {mod.topics.map((topic) => {
                          const isSelected = topic.id === activeTopic.id;
                          return (
                            <div
                              key={topic.id}
                              className={`topic-row-item ${
                                isSelected ? "selected" : ""
                              }`}
                              onClick={() => handleSelectTopic(topic)}
                            >
                              <span className="topic-radio-indicator">
                                {topic.status === "completed" ? (
                                  <FaCheck className="completed-check-icon" />
                                ) : isSelected ? (
                                  <span className="active-dot"></span>
                                ) : (
                                  <span className="empty-circle"></span>
                                )}
                              </span>
                              <span className="topic-title-label">
                                {topic.id} {topic.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* COLUMN 2: TOPIC LESSON CARD (Definition → Syntax → Example) */}
        <section className="lesson-column">
          <div className="lesson-main-card">
            {/* Topic Header & Status */}
            <div className="lesson-card-header mb-3">
              <div className="topic-headline-wrap">
                <span className="active-topic-indicator">●</span>
                <h3 className="topic-headline-title">
                  {activeTopic.id} {activeTopic.title}
                </h3>
              </div>
              {activeTopic.status === "completed" ? (
                <Badge bg="success" className="topic-completed-badge">
                  <FaCheck className="me-1" /> Completed
                </Badge>
              ) : (
                <Badge bg="warning" className="topic-completed-badge in-progress-badge">
                  ● In Progress
                </Badge>
              )}
            </div>

            {/* Mode Tabs (Learn, Example, Task) */}
            <div className="lesson-nav-tabs mb-4">
              <button
                className={`lesson-tab-btn ${activeTab === "learn" ? "active" : ""}`}
                onClick={() => setActiveTab("learn")}
              >
                Learn
              </button>
              <button
                className={`lesson-tab-btn ${activeTab === "example" ? "active" : ""}`}
                onClick={() => setActiveTab("example")}
              >
                Example
              </button>
              <button
                className={`lesson-tab-btn ${activeTab === "task" ? "active" : ""}`}
                onClick={() => setActiveTab("task")}
              >
                Task
              </button>
            </div>

            {/* TAB CONTENT 1: LEARN (Definition → Syntax → Example) */}
            {activeTab === "learn" && (
              <div className="lesson-body-content">
                {/* 1. Definition */}
                <div className="content-block definition-block mb-4">
                  <div className="block-title-row">
                    <div className="block-icon-circle">
                      <FaLightbulb />
                    </div>
                    <h5 className="block-title-text">Definition</h5>
                  </div>
                  <p className="block-paragraph-text">
                    {activeTopic.definition}
                  </p>
                </div>

                {/* 2. Syntax */}
                <div className="content-block syntax-block mb-4">
                  <div className="block-title-row justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="block-icon-circle code-icon-bg">
                        <FaCode />
                      </div>
                      <h5 className="block-title-text">Syntax</h5>
                    </div>
                    <button
                      className="copy-code-btn"
                      onClick={() => handleCopy(activeTopic.syntax, "syntax")}
                    >
                      {copiedSection === "syntax" ? (
                        <>
                          <FaCheck className="text-success me-1" /> Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy className="me-1" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="code-display-box">
                    <pre className="syntax-code-text">{activeTopic.syntax}</pre>
                  </div>
                  <p className="syntax-note-caption mb-0">
                    {activeTopic.syntaxNote}
                  </p>
                </div>

                {/* 3. Example */}
                <div className="content-block example-block mb-4">
                  <div className="block-title-row justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="block-icon-circle play-icon-bg">
                        <FaPlay />
                      </div>
                      <h5 className="block-title-text">Example</h5>
                    </div>
                    <button
                      className="copy-code-btn"
                      onClick={() => handleCopy(activeTopic.example, "example")}
                    >
                      {copiedSection === "example" ? (
                        <>
                          <FaCheck className="text-success me-1" /> Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy className="me-1" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="code-display-box example-code-box">
                    <div className="code-with-lines">
                      {activeTopic.example.split("\n").map((line, idx) => (
                        <div key={idx} className="code-editor-line">
                          <span className="line-num">{idx + 1}</span>
                          <span className="line-code">{line}</span>
                        </div>
                      ))}
                    </div>

                    <div className="output-preview-drawer">
                      <div className="output-label">Output:</div>
                      <pre className="output-text-content">
                        {activeTopic.output}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: EXAMPLE ONLY */}
            {activeTab === "example" && (
              <div className="lesson-body-content">
                <div className="content-block example-block mb-4">
                  <div className="block-title-row justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="block-icon-circle play-icon-bg">
                        <FaPlay />
                      </div>
                      <h5 className="block-title-text">Interactive Code Sandbox</h5>
                    </div>
                    <Button
                      size="sm"
                      variant="warning"
                      className="btn-run-sandbox"
                      onClick={handleRunCodeAction}
                    >
                      <FaPlay className="me-1" /> Run Code
                    </Button>
                  </div>

                  <div className="code-display-box example-code-box">
                    <div className="code-with-lines">
                      {activeTopic.example.split("\n").map((line, idx) => (
                        <div key={idx} className="code-editor-line">
                          <span className="line-num">{idx + 1}</span>
                          <span className="line-code">{line}</span>
                        </div>
                      ))}
                    </div>

                    <div className="output-preview-drawer">
                      <div className="output-label">Output:</div>
                      <pre className="output-text-content">
                        {activeTopic.output}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: TASK */}
            {activeTab === "task" && (
              <div className="lesson-body-content">
                <div className="content-block definition-block mb-4">
                  <div className="block-title-row">
                    <div className="block-icon-circle">
                      <FaCheckCircle />
                    </div>
                    <h5 className="block-title-text">Practice Challenge</h5>
                  </div>
                  <p className="block-paragraph-text">{activeTopic.task}</p>

                  <Button
                    variant="outline-warning"
                    className="mt-3 rounded-pill"
                    onClick={handleRunCodeAction}
                  >
                    <FaCode className="me-2" /> Solve in Code Editor
                  </Button>
                </div>
              </div>
            )}

            {/* Footer Navigation: Previous & Next Topic */}
            <div className="lesson-footer-nav mt-4 pt-3">
              <Button
                variant="outline-secondary"
                className="btn-prev-topic"
                disabled={activeIndex === 0}
                onClick={handlePrevTopic}
              >
                <FaArrowLeft className="me-2" /> Previous
              </Button>

              <Button
                className="btn-next-topic"
                disabled={activeIndex === allTopicsList.length - 1}
                onClick={handleNextTopic}
              >
                Next Topic <FaArrowRight className="ms-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* COLUMN 3: AI MENTOR & QUICK ACTIONS */}
        <aside className="mentor-column">
          {/* AI Mentor Card */}
          <div className="ai-mentor-card mb-4">
            <div className="mentor-card-header">
              <div className="mentor-title-row">
                <FaRobot className="mentor-robot-icon" />
                <span className="mentor-title">AI Mentor</span>
              </div>
              <span className="mentor-online-badge">● Online</span>
            </div>

            {/* Chat Area */}
            <div className="mentor-chat-messages">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mentor-chat-bubble ${
                    msg.sender === "ai" ? "ai-msg" : "user-msg"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {aiThinking && (
                <div className="mentor-chat-bubble ai-msg thinking-bubble">
                  <Spinner animation="grow" size="sm" className="me-1" />
                  <Spinner animation="grow" size="sm" className="me-1" />
                  <Spinner animation="grow" size="sm" />
                </div>
              )}
            </div>

            {/* Quick Prompt Pills */}
            <div className="mentor-quick-pills mb-3">
              <button
                className="mentor-pill-btn"
                onClick={() => handleQuickPrompt("explain")}
              >
                💬 Explain this topic
              </button>
              <button
                className="mentor-pill-btn"
                onClick={() => handleQuickPrompt("hint")}
              >
                💡 Give me a hint
              </button>
              <button
                className="mentor-pill-btn"
                onClick={() => handleQuickPrompt("check")}
              >
                ✓ Check my code
              </button>
              <button
                className="mentor-pill-btn"
                onClick={() => handleQuickPrompt("optimize")}
              >
                ⚡ Optimize my code
              </button>
            </div>

            {/* Chat Input */}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                sendAiMessage(inputQuestion);
              }}
              className="mentor-input-form"
            >
              <Form.Control
                type="text"
                placeholder="Ask anything..."
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                className="mentor-text-input"
              />
              <button type="submit" className="mentor-send-btn">
                <FaPaperPlane />
              </button>
            </Form>
          </div>

          {/* Quick Actions Card */}
          <div className="quick-actions-card mb-4">
            <h5 className="quick-actions-header">
              <span className="quick-bolt">⚡</span> Quick Actions
            </h5>

            <div className="quick-action-links">
              <div
                className="quick-action-row"
                onClick={() => navigate(`/dashboard/courses`)}
              >
                <div className="qa-left">
                  <FaCode className="qa-icon" />
                  <span>Open Code Editor</span>
                </div>
                <FaArrowRight className="qa-arrow" />
              </div>

              <div className="quick-action-row" onClick={handleRunCodeAction}>
                <div className="qa-left">
                  <FaPlay className="qa-icon" />
                  <span>Run Code</span>
                </div>
                <FaArrowRight className="qa-arrow" />
              </div>

              <div
                className="quick-action-row"
                onClick={() => {
                  setChatMessages((prev) => [
                    ...prev,
                    {
                      sender: "ai",
                      text: `Here are quick summary notes on ${activeTopic.title}:\n- Definition: ${activeTopic.definition}\n- Syntax: ${activeTopic.syntax}`
                    }
                  ]);
                }}
              >
                <div className="qa-left">
                  <FaFileAlt className="qa-icon" />
                  <span>View Notes</span>
                </div>
                <FaArrowRight className="qa-arrow" />
              </div>
            </div>
          </div>

          {/* Keep Going Rocket Banner */}
          <div className="keep-going-card">
            <div className="keep-going-content">
              <div className="rocket-text-wrap">
                <h5 className="rocket-title mb-1">Keep Going!</h5>
                <p className="rocket-subtitle mb-2">
                  Every line of code brings you closer to your goal!
                </p>
                <div className="rocket-mini-progress">
                  <ProgressBar now={42} className="custom-rocket-bar" />
                </div>
              </div>
              <div className="rocket-icon-art">
                <FaRocket />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Terminal / Code Runner Modal */}
      <Modal
        show={showConsoleModal}
        onHide={() => setShowConsoleModal(false)}
        centered
        className="dark-terminal-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="fs-6 text-white d-flex align-items-center gap-2">
            <FaTerminal className="text-warning" /> CodeGenius Cloud Terminal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark p-3">
          <pre className="terminal-modal-pre text-success">{consoleOutput}</pre>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Learning;
