import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Header.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import patrimoinePic from './../assets/3d-cartoon-view-law-enforcement-building.jpg'
import possessionPic from './../assets/villa-house-model-key-drawing-retro-desktop-real-estate-sale-concept.jpg'





const App = () => {
  return (
    <div>
      <div className="navHeader">
        <a href="/" className="text-light fs-1 fw-bolder">
          Gestion de patrimoine</a>
      </div>

      <div className="container mt-5 d-flex justify-content-around">
        {/* patrimoine redirection card */}
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Img variant="top" src={patrimoinePic} />
            <Card.Title className='container mt-4 fs-4'>Patrimoine</Card.Title>
            <Card.Text className='container mt-4'>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <LinkContainer to="/patrimoine">
              <Button variant="success">
                Go to Patrimoine
              </Button>
            </LinkContainer>
          </Card.Body>
        </Card>

        {/* possession redirection card */}
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Img variant="top" src={possessionPic} />
            <Card.Title>Possessions</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <LinkContainer to="/possession">
              <Button variant="success">
                Go to Possession
              </Button>
            </LinkContainer>
          </Card.Body>
        </Card>
      </div>
    </div >
  );
};

export default App;
