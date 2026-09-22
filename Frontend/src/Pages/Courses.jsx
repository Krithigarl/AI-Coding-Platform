import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row, Card, Spinner, Accordion ,Button} from "react-bootstrap";
import axios from "axios";

import pythonImg from "../assets/python.png";
import cImg from "../assets/c.png";
import cppImg from "../assets/c++.png";
import javaImg from "../assets/java.png";

const API_URL = "http://localhost:3000/api/courses";

const imageMap = {
  python: pythonImg,
  c: cImg,
  cpp: cppImg,
  java: javaImg,
  javascript: javaImg,
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [course, setCourse] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError("");
        const res = await axios.get(API_URL);
        setCourses(res.data);

        if (res.data.length > 0) {
          setSelectedCourse(res.data[0].slug);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Could not load courses. Make sure the backend is running.");
      } finally {
        setListLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchCourse = async () => {
      try {
        setDetailLoading(true);
        setError("");
        const res = await axios.get(`${API_URL}/${selectedCourse}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setCourse(null);
        setError("Could not load course syllabus.");
      } finally {
        setDetailLoading(false);
      }
    };

    fetchCourse();
  }, [selectedCourse]);

  const handleCourseClick = (slug) => {
    if (slug !== selectedCourse) {
      setSelectedCourse(slug);
    }
  };

  if (listLoading) {
    return (
      <div className="text-center mt-5 page-content">
        <Spinner animation="border" />
        <p className="mt-3">Loading courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="page-content text-center">
        <h2>No courses available</h2>
        <p>{error || "Courses will appear here once they are added."}</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <div className="mb-4">
          <h2>Courses</h2>
        </div>

        <Row className="mt-4 g-4">
          <Col md={3} lg={2}>
            <div className="course-sidebar">
              <h4>Courses</h4>
              <ul className="course-list">
                {courses.map((item) => (
                  <li
                    key={item._id || item.slug}
                    className={selectedCourse === item.slug ? "active" : ""}
                    onClick={() => handleCourseClick(item.slug)}
                  >
                    {item.language}
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col md={9} lg={10}>
            {detailLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-3">Loading syllabus...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <p className="text-danger">{error}</p>
              </div>
            ) : course ? (
              <>
                <Card className="course-card mb-4">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={3} className="text-center mb-3 mb-md-0">
                        <img
                          src={imageMap[course.slug] || pythonImg}
                          alt={course.language}
                          width="140"
                          height="140"
                          className="img-fluid"
                        />
                      </Col>
                      <Col md={9}>
                        <h2>{course.language.toUpperCase()} PROGRAMMING</h2>
                        <p className="text-muted mb-2">Beginner to Advanced</p>
                        <p className="mb-0">
                          Learn {course.language} step by step. Open a level,
                          then click a topic to see its description and task.
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => {
                            const isLoggedIn = Boolean(localStorage.getItem("token"));

                            if (!isLoggedIn) {
                              navigate("/login", { state: { from: "/course" } });
                              return;
                            }

                            navigate(`/enroll/${course.slug}`);
                          }}
                        >
                          Enroll
                        </Button>

                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="course-card syllabus-card">
                  <Card.Body>
                    <h4 className="mb-4">{course.language} Syllabus</h4>

                    <Accordion
                      key={course.slug}
                      defaultActiveKey="0"
                      className="syllabus-level-accordion"
                    >
                      {course.levels?.map((level, levelIndex) => (
                        <Accordion.Item
                          eventKey={String(levelIndex)}
                          key={levelIndex}
                        >
                          <Accordion.Header>{level.level}</Accordion.Header>
                          <Accordion.Body>
                            <Accordion className="syllabus-topic-accordion">
                              {level.topics?.map((topic, topicIndex) => (
                                <Accordion.Item
                                  eventKey={`${levelIndex}-${topicIndex}`}
                                  key={`${levelIndex}-${topicIndex}-${topic.title}`}
                                >
                                  <Accordion.Header>
                                    {topic.title}
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <div className="topic-detail">
                                      <p className="topic-description">
                                        {topic.description}
                                      </p>
                                      <div className="topic-task">
                                        <span className="task-label">Task</span>
                                        <p className="mb-0">{topic.task}</p>
                                      </div>
                                    </div>
                                  </Accordion.Body>
                                </Accordion.Item>
                              ))}
                            </Accordion>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Card.Body>
                </Card>
              </>
            ) : (
              <div className="text-center py-5">
                <p>Select a course to view its syllabus.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Courses;
