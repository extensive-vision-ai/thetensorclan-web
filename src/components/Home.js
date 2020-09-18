import React from "react";
import { Container, CardDeck, Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
    const cardsData = [
        {
            title: "Classifier Models",
            body:
                "The models included are: ImageNetClassifier - ResNet, IFOClassifier - MobileNet",
            btntext: "Go to Classifiers",
            url: "/classifiers",
        },
        {
            title: "Face Swap",
            body:
                "Do you want to see how two people look likewhen their faces are swapped ? Head over to this API to see !",
            btntext: "Go to FaceSwap",
            url: "/face-swap",
        },
        {
            title: "Indian Face Recognizer",
            body:
                "I've trained the model to recognize 10 Indian people Faces !",
            btntext: "Go to FaceRecognizer",
            url: "/indian-face-recognizer",
        },
        {
            title: "LWF Plus Facial Recognition",
            body:
                "The Model here was trained on LFW Dataset + Indian Faces Dataset",
            btntext: "Go to FaceRecognizer",
            url: "/lfw-plus-recognizer",
        },
        {
            title: "Human Pose Estimation",
            body:
                " This model uses SOTA Human Pose Estimation for Single Human Pose Detection",
            btntext: "Go to HumanPoseEstimator",
            url: "/human-pose-estimation",
        },
        {
            title: "Red Car Generator",
            body: "This is a custom GAN to generate Red Coloured Cars !",
            btntext: "Go to RedCarGAN",
            url: "/red-car-gan",
        },
        {
            title: "MNIST VAE",
            body:
                "Play with the MNIST VAE, see how a machine learns to encode and decode information",
            btntext: "Go to VAE",
            url: "/mnist-vae",
        },
    ];

    return (
        <Container className="mt-5">
            <Row xl={3} xs={1} className="justify-content-around">
                {cardsData.map((card, idx) => (
                    <Container as={Col} className="p-2">
                        <Card
                            className="shadow-lg p-0 m-0"
                            style={{
                                minWidth: "18rem",
                                height: "15rem",
                            }}
                            as={Col}
                        >
                            <Card.Body>
                                <Card.Title>{card.title}</Card.Title>
                                <Card.Text>{card.body}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Link to={card.url}>
                                    <Button variant="dark" as={Col}>
                                        {card.btntext}{" "}
                                        <i className="fas fa-arrow-right" />
                                    </Button>
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Container>
                ))}
            </Row>
        </Container>
    );

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

                        <Card className="shadow-lg mb-3">
                            <Card.Body>
                                <Card.Title
                                    className="font-weight-bold"
                                    style={{ minWidth: "18rem" }}
                                >
                                    Red Car Generator
                                </Card.Title>
                                <Card.Text>
                                    This is a custom GAN to generate Red
                                    Coloured Cars !
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Link to="/red-car-gan">
                                    <Button variant="dark" block>
                                        Go to RedCarGAN{" "}
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
