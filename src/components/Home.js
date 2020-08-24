import React from "react";
import { Container, CardDeck, Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <CardDeck>
                        <Card
                            className="shadow-lg mb-3"
                            style={{ minWidth: "18rem" }}
                        >
                            <Card.Body>
                                <Card.Title className="font-weight-bold">
                                    Classifier Models
                                </Card.Title>
                                <Card.Text>
                                    The models included are: <br />
                                    <ul>
                                        <li>ImageNetClassifier - ResNet</li>
                                        <li>IFOClassifier - MobileNet</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Link to="/classifiers">
                                    <Button variant="dark" block>
                                        Go to Classifiers{" "}
                                        <i className="fas fa-arrow-right"></i>
                                    </Button>
                                </Link>
                            </Card.Footer>
                        </Card>
                        <Card
                            className="shadow-lg mb-3"
                            style={{ minWidth: "18rem" }}
                        >
                            <Card.Body>
                                <Card.Title className="font-weight-bold">
                                    Face Swap
                                </Card.Title>
                                <Card.Text>
                                    Do you want to see how two people look like
                                    when their faces are swapped ? Head over to
                                    this API to see !
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Link to="/face-swap">
                                    <Button variant="dark" block>
                                        Go to FaceSwap{" "}
                                        <i className="fas fa-arrow-right"></i>
                                    </Button>
                                </Link>
                            </Card.Footer>
                        </Card>
                        <Card
                            className="shadow-lg mb-3"
                            style={{ minWidth: "18rem" }}
                        >
                            <Card.Body>
                                <Card.Title className="font-weight-bold">
                                    Indian Face Recognizer
                                </Card.Title>
                                <Card.Text>
                                    I've trained the model to recognize 10
                                    Indian people Faces !
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Link to="/indian-face-recognizer">
                                    <Button variant="dark" block>
                                        Go to FaceRecognizer{" "}
                                        <i className="fas fa-arrow-right"></i>
                                    </Button>
                                </Link>
                            </Card.Footer>
                        </Card>
                    </CardDeck>
                </Col>
            </Row>
            <Row className="mt-1">
                <Col>
                    <CardDeck>
                        <Card
                            className="shadow-lg mb-3"
                            style={{ minWidth: "18rem" }}
                        >
                            <Card.Body>
                                <Card.Title className="font-weight-bold">
                                    LWF Plus Facial Recognition
                                </Card.Title>
                                <Card.Text>
                                    The Model here was trained on LFW Dataset +
                                    Indian Faces Dataset
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Link to="/lfw-plus-recognizer">
                                    <Button variant="dark" block>
                                        Go to FaceRecognizer{" "}
                                        <i className="fas fa-arrow-right"></i>
                                    </Button>
                                </Link>
                            </Card.Footer>
                        </Card>

                        <Card className="shadow-lg mb-3">
                            <Card.Body>
                                <Card.Title
                                    className="font-weight-bold"
                                    style={{ minWidth: "18rem" }}
                                >
                                    Human Pose Estimation
                                </Card.Title>
                                <Card.Text>
                                    This model uses SOTA Human Pose Estimation
                                    for Single Human Pose Detection
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Link to="/human-pose-estimation">
                                    <Button variant="dark" block>
                                        Go to HumanPoseEstimator{" "}
                                        <i className="fas fa-arrow-right"></i>
                                    </Button>
                                </Link>
                            </Card.Footer>
                        </Card>
                    </CardDeck>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
