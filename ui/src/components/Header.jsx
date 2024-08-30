import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const App = () => {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">PatrimoineApp</Navbar.Brand>
        <Nav className="mr-auto">
          <LinkContainer to="/patrimoine">
            <Nav.Link>Patrimoine</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/possession">
            <Nav.Link>Possessions</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar>
      <div className="container mt-4">
        <h1>Bienvenue dans l'application de gestion du patrimoine</h1>
      </div>
    </div>
  );
};

export default App;
