import { Button, Container } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide public navigation on dashboard, learning, roadmap, auth, and course-register pages
  if (
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/learning") ||
    location.pathname.startsWith("/roadmap") ||
    location.pathname === "/login" ||
    location.pathname.startsWith("/course-register")
  ) {
    return null;
  }

  return (
    <div>
      {/* Navigation bar */}
      <Navbar expand="lg" className='pt-3 navigation'>
          <Container>
              <Navbar.Brand href="#home" className='text-white'>Code<span className='heading'>Genius</span></Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="nav-pages">
                      <Nav.Link href="#home" className='text-white'>Home</Nav.Link>
                      <Nav.Link href="#features" className='text-white'>Feature</Nav.Link>
                      <Nav.Link href="#about" className='text-white'>About</Nav.Link>
                      <Nav.Link href="#course" className='text-white'>Course</Nav.Link>
                      <Nav.Link href="#testimonials" className='text-white'>Testimonial</Nav.Link>
                      <Nav.Link href="#contact" className='text-white'>Contact</Nav.Link>
                  </Nav>
              </Navbar.Collapse>
              <Button className='login-btn' onClick={()=>navigate('/login')}>Login</Button>
          </Container>
      </Navbar>
    </div>
  );
};

export default Navigation