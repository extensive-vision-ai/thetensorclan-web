import React, { useState } from 'react'
import { Alert, Button, Card, Col, Form, Image, ProgressBar, Row, Spinner, Toast } from 'react-bootstrap'
import FadeInContainer from './animated/FadeInContainer'

import { IMAGE_CAPTION_ENDPOINT } from '../constants/APIEndpoints'

import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const ImageCaptioning = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("boooooo :p");
    const [showLoading, setShowLoading] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [result, setResult] = useState(undefined);


    const onFileSelect = (e) => {
        if (e.target.files.length === 1) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }

        setResult(undefined);
    };

    const captionImage = async () => {
        try {
            setMessage("");
            setResult(undefined);
            setShowLoading(true);

            const formData = new FormData();

            formData.append("file", selectedFile);

            const result = await axios.post(
                `${IMAGE_CAPTION_ENDPOINT}/flickr8k-image-caption`,
                formData,
                {
                    crossDomain: true,
                    onUploadProgress: (progressEvent) => {
                        setUploadPercentage(
                            parseInt(
                                Math.round(
                                    (progressEvent.loaded * 100) /
                                    progressEvent.total
                                )
                            )
                        );
                    },
                }
            )
            setResult(result.data['caption'])
        } catch (e) {
            if (e.reponse !== undefined) {
                console.log(e.response);
                setMessage(JSON.stringify(e.response));
            } else {
                console.log(e);
                setMessage(JSON.stringify(e));
            }
        }

        setShowLoading(false);
        setTimeout(() => {
            setUploadPercentage(0);
        }, 5000);
    }

    return (
        <FadeInContainer>
            <Row>

                <Col>
                    <Alert variant="warning">
                        <Alert.Heading>
                            Image Captioning
                        </Alert.Heading>
                        <p>
                            This is a pretty simple and straight forward image captioning, you upload an image, and i tell you what's in the image ! lets's play  !
                        </p>
                        <p>
                            <a
                                href="https://github.com/satyajitghana/TSAI-DeepVision-EVA4.0-Phase-2/tree/master/12-ImageCaptioning/flickrdataset/Flickr8k_Dataset/Flicker8k_Dataset"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                See Sample Images
                            </a>
                        </p>
                    </Alert>
                </Col>
            </Row>
            <Form>
                <Row className="mt-4">
                    <Col lg={6} md={6} sm={10}>
                        <Form.Group as={Row} className="justify-content-center">
                            <Form.Label>
                                <h5>Select an Image</h5>
                            </Form.Label>
                            <Form.File custom className="mx-2">
                                <Form.File.Input
                                    onChange={onFileSelect}
                                    accept=".jpg,.png,.jpeg"
                                />
                                <Form.File.Label data-browse="Browse">
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Please select an Image"}
                                </Form.File.Label>
                            </Form.File>
                        </Form.Group>

                        <Row className="justify-content-center">
                            <Button
                                variant="dark"
                                className="shadow-lg mt-5"
                                size="md"
                                disabled={selectedFile === null}
                                onClick={() => captionImage()}
                            >
                                {showLoading ? (
                                    <>
                                        <Spinner
                                            variant="light"
                                            as="span"
                                            animation="border"
                                            size="md"
                                            role="status"
                                            aria-hidden="true"
                                        />{" "}
                                        Captioning...
                                    </>
                                ) : (
                                        "CaptionIt !"
                                    )}
                            </Button>
                        </Row>

                        <Row>
                            <Col className="my-4">
                                <ProgressBar
                                    striped
                                    variant="dark"
                                    now={uploadPercentage}
                                    label={`${uploadPercentage}%`}
                                    hidden={!showLoading}
                                />
                            </Col>
                        </Row>
                    </Col>

                    <Col lg={6} md={6} sm={10}>

                        <Row className="justify-content-center">
                            {selectedFile && (
                                <Image
                                    src={URL.createObjectURL(selectedFile)}
                                    style={{ maxWidth: "85%", maxHeight: "50vh" }}
                                    rounded
                                    fluid
                                />
                            )}
                        </Row>

                        <Card className="m-4">
                            <Card.Header className="text-center">
                                Caption
                            </Card.Header>
                            <Card.Body>

                                {result === undefined ? "<EMPTY INPUT>" : result}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>

            <Toast
                onClose={() => setMessage("")}
                show={message !== ""}
                className="mx-auto m-3 bg-dark text-white shadow-lg justify-content-center"
                as={Row}
            >
                <Toast.Header>
                    <strong className="mr-auto">Message</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body>{message} </Toast.Body>
            </Toast>
        </FadeInContainer>
    )
}

export default ImageCaptioning
