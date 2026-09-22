import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

import python from "../assets/python.png";

const CourseEnroll = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  const fetchCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/courses/${id}`
      );

      if (!response.ok) {
        throw new Error("Course not found");
      }

      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (!course) {
    return (
      <Container className="text-center py-5">
        <h3>Loading...</h3>
      </Container>
    );
  }

  // Beginner topics (first level)
  const beginnerTopics = course.levels?.[0]?.topics || [];
  const leftTopics = beginnerTopics.slice(
    0,
    Math.ceil(beginnerTopics.length / 2)
  );
  const rightTopics = beginnerTopics.slice(
    Math.ceil(beginnerTopics.length / 2)
  );

  return (
    <Container className="course-page py-4">
      <Card className="enroll-card shadow-lg">

        <hr className="divider" />

        <div className="px-3">

          {/* Back Button */}
          <div
            className="back-btn"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <FaArrowLeft className="me-2" />
            Back
          </div>

          <Card className="inner-card mt-3">
            <Card.Body>

              <Row className="align-items-center">

                <Col md={3} xs={12} className="text-center mb-3 mb-md-0">
                  <img
                    src={python}
                    alt={course.language}
                    className="course-image"
                  />
                </Col>

                <Col md={9} xs={12}>
                  <h2 className="course-title">
                    {course.language} Programming
                  </h2>

                  <p className="course-level">
                    Beginner to Advanced
                  </p>

                  <p className="course-desc">
                    Learn {course.language} from beginner to advanced with practical tasks.
                  </p>
                </Col>

              </Row>

              <hr className="divider" />

              {/* Course Info */}
              <Row className="text-center mb-4">

                <Col>
                  <p className="info-title">Level</p>
                  <p className="info-value">Beginner to Advanced</p>
                </Col>

                <Col>
                  <p className="info-title">Duration</p>
                  <p className="info-value">Self-paced</p>
                </Col>

                <Col>
                  <p className="info-title">Price</p>
                  <p className="info-value free-text">Free</p>
                </Col>

              </Row>

              {/* What you'll learn */}
              <h5 className="learn-title">What you'll learn</h5>

              <Row className="mt-3">

                <Col md={6}>
                  <ul className="learn-list">
                    {leftTopics.map((topic, index) => (
                      <li key={index}>
                        <FaCheck className="me-2" />
                        {topic.title}
                      </li>
                    ))}
                  </ul>
                </Col>

                <Col md={6}>
                  <ul className="learn-list">
                    {rightTopics.map((topic, index) => (
                      <li key={index}>
                        <FaCheck className="me-2" />
                        {topic.title}
                      </li>
                    ))}
                  </ul>
                </Col>

              </Row>

              <Button
                className="enroll-btn w-100 mt-3"
                onClick={() => navigate(`/course-register/${course.slug || id}`)}
              >
                Enroll for Free
              </Button>

            </Card.Body>
          </Card>

        </div>

      </Card>
    </Container>
  );
};

export default CourseEnroll;