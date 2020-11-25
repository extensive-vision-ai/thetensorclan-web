import React from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
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
            title: "Style Transfer",
            body:
                "Try out various awesome image filter styles on your image/portraits!",
            btntext: "Go to StyleTransfer",
            url: "/style-transfer",
        },
        {
            title: "Image Captioning",
            body: "This is an Image to Text Tranlation tool",
            btntext: "Go to ImageCaptioning",
            url: "/image-captioning"
        },
        {
            title: "MNIST VAE",
            body:
                "Play with the MNIST VAE, see how a machine learns to encode and decode information",
            btntext: "Go to VAE",
            url: "/mnist-vae",
        },
        {
            title: "Text Classifiers",
            body:
                "Try various different text classification nlp models, from sentiment analysis to multi class classification",
            btntext: "Go to TextClassifiers",
            url: "text-classifiers",
        },
        {
            title: "Speech to Text",
            body: "Try saying a word and my model will convert it to text !",
            btntext: "Go to SpeechToText",
            url: "speech-to-text",
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
            title: "Red Car VAE",
            body:
                "Reconstructs a Red Car Image, see how well it does, something like this can be used for Image compression",
            btntext: "Go to RedCarVAE",
            url: "/red-car-vae",
        },
        {
            title: "IFO Super Resolution",
            body:
                "Convert a Low Resolution Identified Flying Object and super resolution it to 2X !",
            btntext: "Go to SuperResolution",
            url: "ifo-sr",
        },
        {
            title: "DE to EN Translator",
            body:
                "This is a pretty simple German to English text translator that can translate upto 100 words pretty decently !",
            btntext: "Go to Translator",
            url: "translator",
        },
    ];

    return (
        <Container className="mt-5 uk-animation-scale-up">
            <Row xl={3} xs={1} className="justify-content-around">
                {cardsData.map((card, idx) => (
                    <Container
                        key={idx}
                        as={Col}
                        className="p-2"
                        data-uk-scrollspy={`cls: uk-animation-slide-bottom; target: .uk-card; delay: ${idx * 50
                            } ; repeat: false`}
                    >
                        <Card
                            className="shadow-lg p-0 m-0 uk-card"
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
};

export default Home;
