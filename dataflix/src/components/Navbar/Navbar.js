import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./Navbar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div style={{ display: "flex" }}>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link className="dataflix" to="/">Dataflix</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link>
                <Link className="title-pages" to="/evolution">
                  Netflix's Evolution
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link className="title-pages" to="/world">
                  Netflix in the World
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link className="title-pages" to="/age-restriction">
                  Restriction Ages on Netflix
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;