import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import hero from '../assets/hero1.png';
import about from '../assets/about.jpg';
import Card from 'react-bootstrap/Card';
import c from '../assets/c.png';
import cpp from '../assets/c++.png';
import python from '../assets/python.png';
import java from '../assets/java.png';
import css from '../assets/css.png';
import Carousel from 'react-bootstrap/Carousel';
import html from '../assets/html.png';
import user1 from '../assets/user1.jpg';
import user2 from '../assets/user2.jpg';
import user3 from '../assets/user3.jpg';
import user4 from '../assets/user4.jpg';
import InteractiveCodeDemo from '../components/InteractiveCodeDemo';

const Home = () => {
    const navigate = useNavigate();
    const feature = [{ id: 101, icon: <i className="uil uil-robot"></i>, title: "AI Mentor", description: "Get instant AI-powered guidance to understand programming concepts " },
    { id: 102, icon: <i className="uil uil-desktop"></i>, title: "Online Compiler", description: "Write, run, and test your code directly in the browser without installing any software." },
    { id: 103, icon: <i className="uil uil-book-open"></i>, title: "Programming Courses", description: "Learn programming courses designed for beginners and advanced learners." },
    { id: 104, icon: <i className="uil uil-bug"></i>, title: "AI Error Fixes", description: "Receive clear explanations and smart solutions for coding errors in real time." },
    { id: 105, icon: <i className="uil uil-trophy"></i>, title: "Coding Challenges", description: "Improve your problem-solving skills with interactive coding exercises and challenges." },
    { id: 106, icon: <i className="uil uil-chart-line"></i>, title: "Progress Tracking", description: "Track your learning progress, quiz scores, and achievements in one place." }
    ];
    const course = [{ id: 201, title: "C", description: "Understand programming fundamentals with the C language.", images: c },
    { id: 202, title: "C++", description: "Learn object-oriented programming and problem-solving with C++", images: cpp },
    { id: 203, title: "Java", description: "Build secure, object-oriented, and enterprise-level applications", images: java },
    { id: 204, title: "Python", description: "Master Python for web development, automation, and AI", images: python },
    { id: 205, title: "HTML", description: "Learn the fundamentals of web page structure using HTML5", images: html },
    { id: 206, title: "CSS", description: "Design beautiful and responsive websites with modern CSS", images: css }
    ];
    const testimonal = [{ id: 301, images: user1, name: "Priya", feedback: "The AI Mentor helped me understand JavaScript concepts easily. The explanations were clear, and the coding challenges improved my confidence." },
    { id: 302, images: user2, name: "Dhivya", feedback: "The online compiler and AI error explanations saved me a lot of time. I can practice coding anywhere without installing software" },
    { id: 303, images: user3, name: "Abhi", feedback: "The structured courses and progress tracking kept me motivated throughout my learning journey. I highly recommend this platform" },
    { id: 304, images: user4, name: "Krithi", feedback: "A perfect platform for beginners. The AI guidance made learning programming enjoyable and helped me solve coding problems faster" }
    ];
    return (
        <div>
            <Container fluid>
              
                {/* Hero Section with Interactive AI Code Demo */}
                <section id='home'>
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={6} className='hero-content mb-4 mb-lg-0'>
                                <div className="hero-badge">
                                    <span className="badge-sparkle">✨</span> Next-Gen AI Coding Platform
                                </div>
                                <h1>Master Coding with <span className="heading">AI Intelligence</span></h1>
                                <p>
                                    Experience real-time AI mentorship, instant 1-click bug fixes, intelligent algorithmic
                                    breakdowns, and interactive cloud compilation. Accelerate from beginner to pro 10x faster.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <Button className='login-btn' onClick={() => navigate('/login')}>Get Started Free</Button>
                                    <Button className='login-btn' onClick={() => { const el = document.getElementById('course'); el?.scrollIntoView({ behavior: 'smooth' }); }}>Explore Courses</Button>
                                </div>
                                <div className="hero-stats-row">
                                    <div className="hero-stat-item">
                                        <h4>50K+</h4>
                                        <span>Code Analyses</span>
                                    </div>
                                    <div className="hero-stat-item">
                                        <h4>99.4%</h4>
                                        <span>AI Fix Accuracy</span>
                                    </div>
                                    <div className="hero-stat-item">
                                        <h4>15+</h4>
                                        <span>Languages</span>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6}>
                                <InteractiveCodeDemo />
                            </Col>
                        </Row>
                    </Container>
                </section>
                {/* Features */}
                <section id='features'>
                    <Container>
                        <h1 className="text-center heading-h1 mt-5 pt-5">OUR FEATURES</h1>
                        <p className="text-center mb-5">
                            Everything you need to learn, practice, and master programming with AI.
                        </p>
                        <Row>
                            {feature.map((a) => (
                                <Col key={a.id} md="4" >
                                    <Card style={{ width: '300px' }} className='card-bg'>
                                        <p className='icon'>{a.icon}</p>
                                        <Card.Body>
                                            <Card.Title style={{ fontSize: "20px", textAlign: "center" }}>{a.title}</Card.Title>
                                            <Card.Text style={{ fontSize: "15px", textAlign: "justify" }}>
                                                {a.description}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}

                        </Row>
                    </Container>
                </section>
                {/* About Section */}
                <section id='about'>
                    <h1 className='text-center heading-h1 mt-5 pt-5'>ABOUT CODEGENIUS</h1>
                    <p className='text-center mb-5'>Learn. Code. Build. Powered by AI.</p>
                    <Container className='about'>
                        <Row>
                            <Col md="4">
                                <img src={about} alt="" width={300} />
                            </Col>
                            <Col md="8" className='about-content'>
                                <h2>Welcome to CodeGenius AI</h2>

                                <p>
                                    CodeGenius AI is an AI-powered coding platform designed to help
                                    students, beginners, and developers learn programming in a
                                    smarter and more interactive way. Our mission is to make coding
                                    simple, engaging, and accessible for everyone.
                                </p>

                                <p>
                                    Whether you're learning HTML, CSS, JavaScript, React, Python,
                                    Java, or C++, our platform provides hands-on practice, instant
                                    feedback, and personalized AI guidance to help you grow your
                                    programming skills.
                                </p>
                                <Button className='login-btn' onClick={() => navigate('/course')}>Explore Courses</Button>
                            </Col>
                        </Row>
                    </Container>
                </section>
                {/* Programming Course */}
                <section id='course'>
                    <Container>
                        <h1 className='text-center heading-h1 mt-5 pt-5'>POPULAR COURSES</h1>
                        <p className='text-center mb-5 pb-5'>Explore our most popular programming courses and start your coding journey today</p>
                        <Row>
                            {course.map((a) => (
                                <Col key={a.id} md="4">
                                    <div className="card-one">
                                        <div className="card-course">
                                            <img src={a.images} alt="" width={80} className='img-card' />
                                        </div>
                                        <Card style={{ width: '300px' }} className='programming-content'>
                                            <Card.Body>
                                                <Card.Title style={{ fontSize: "20px", textAlign: "center", borderBottom: "2px solid #FF8300" }} className='pb-3'>{a.title}</Card.Title>
                                                <Card.Text style={{ fontSize: "15px", textAlign: "justify" }}>
                                                    {a.description}
                                                </Card.Text>
                                                <Button className='login-btn' onClick={()=>navigate('/course')} style={{ marginLeft: "30%" }}>View Details</Button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>
                {/* TESTIMONIALS */}
                <section id="testimonials">
                    <Container>
                        <h1 className='text-center heading-h1 mt-5'>STUDENT TESTIMONIALS</h1>
                        <p className='text-center mb-5'>Hear what our learners say about their experience with CodeGenius AI.</p>
                        <Carousel fade indicators={false}>
                            {testimonal.map((item, index) => (
                                <Carousel.Item key={index}>
                                    <div className="carousel-card text-center">
                                        <img src={item.images} alt={item.name} className="testimonial-img" />
                                        <h3>{item.name}</h3>
                                        <p className="stars">⭐⭐⭐⭐⭐</p>
                                        <p>{item.feedback}</p>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Container>
                </section>
                {/* contact */}
                <section id="contact" className="py-5">
                    <Container>
                        <h1 className="text-center heading-h1">CONTACT US</h1>
                        <p className="text-center mb-5">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                        <Row className="align-items-center">
                            {/* Contact Information */}
                            <Col md={5}>
                                <h3>Get In Touch</h3>
                                <p>📍 Nagercoil, Tamil Nadu, India</p>
                                <p>📧 support@codegeniusai.com</p>
                                <p>📞 +91 98765 43210</p>
                                <p>🌐 www.codegeniusai.com</p>
                            </Col>
                            {/* Contact Form */}
                            <Col md={7}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Your Name"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="email"
                                            placeholder="Your Email"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            placeholder="Your Message"
                                        />
                                    </Form.Group>

                                    <Button className="login-btn w-100">
                                        Send Message
                                    </Button>
                                </Form>
                            </Col>

                        </Row>
                    </Container>
                </section>
            </Container>
        </div>
    )
}

export default Home