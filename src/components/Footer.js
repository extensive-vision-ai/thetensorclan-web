import React from "react";
import { Navbar, Container, Col } from "react-bootstrap";

const Footer = () => {
    return (
        <Container className="mt-5">
            <hr />
            <Navbar>
                <Navbar.Text className="m-auto">
                    <Col className="text-center">
                        <a
                            href="https://github.com/satyajitghana/TSAI-DeepVision-EVA4.0-Phase-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-github" /> TSAI-EVA4.0-Phase2{" "}
                        </a>
                        <a
                            href="https://github.com/extensive-vision-ai/thetensorclan-web"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-github" /> thetensorclan-web{" "}
                        </a>
                        <a
                            href="https://github.com/extensive-vision-ai/thetensorclan-backend-heroku"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-github" />{" "}
                            thetensorclan-backend
                        </a>
                    </Col>
                    <Col className="mt-2 text-center">
                        <a
                            href="https://www.linkedin.com/in/satyajitghana"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-linkedin" /> satyajitghana{" "}
                        </a>
                        <a
                            href="https://github.com/satyajitghana"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-github" /> satyajitghana{" "}
                        </a>
                        <a
                            href="http://instagram.com/shadowleaf.satyajit"
                            taget="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fab fa-instagram" />{" "}
                            shadowleaf.satyajit
                        </a>
                    </Col>
                    <Col className="mt-2 text-center ">
                        Made with <i className="fas fa-heart" /> and{" "}
                        <i className="fas fa-mug-hot" /> by TheTensorClan
                    </Col>
                </Navbar.Text>
            </Navbar>
        </Container>
    );
};

export default Footer;
