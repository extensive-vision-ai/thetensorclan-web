import React, { useState } from "react";
import {
    Row,
    Col,
    Form,
    Image,
    Button,
    Spinner,
    Toast,
    Alert,
} from "react-bootstrap";
import axios from "axios";
import { AUTOENCODERS_ENDPOINT } from "../constants/APIEndpoints";
import FadeInContainer from "./animated/FadeInContainer";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const VAEResult = ({ results }) => {
    const { recon_image, latent_z } = results;
    return (
        <>
            <Row className="justify-content-center">
                <Image
                    src={recon_image}
                    style={{ width: "85%" }}
                    rounded
                    fluid
                />
            </Row>
            <Row className="justify-content-center">
                <Button
                    variant="dark"
                    className="shadow-lg mt-5"
                    size="md"
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify(latent_z)
                    )}`}
                    download="latentz.json"
                >
                    Download LatentZ (Encoded)
                </Button>
            </Row>
        </>
    );
};

const RedCarVAE = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");
    const [results, setResults] = useState(undefined);
    const [showLoading, setShowLoading] = useState(false);

    const onFileSelect = (e) => {
        if (e.target.files.length === 1) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const autoEncodeImage = async () => {
        try {
            setMessage("");
            setResults(undefined);
            setShowLoading(true);

            const formData = new FormData();
            formData.append("file", selectedFile);

            // send a POST request to autencoder api endpoint
            const results = await axios.post(
                `${AUTOENCODERS_ENDPOINT}/red-car-autoencoder`,
                formData,
                {
                    crossDomain: true,
                }
            );

            console.log(results);
            setResults(results.data);
        } catch (e) {
            console.log(e.response);
            setMessage(JSON.stringify(e.response));
        }

        setShowLoading(false);
    };

    return (
        <FadeInContainer>
            <Row>
                <Col>
                    <Alert variant="warning">
                        <Alert.Heading>Red CAR VAE</Alert.Heading>
                        <p>
                            This is a follow up from the Red Car GAN, the only
                            difference is that we are using a VAE (Variational
                            AutoEncoder) here, so what's the benefit ? it can be
                            used to compress(encode) images to small size and
                            can be generated from the encoded vector using the
                            decoder. So here is a demonstration in which you can
                            upload a car image and it will encode and decode it,
                            shows the proof of concept.
                        </p>
                        <br />
                        <p>
                            <a
                                href="https://github.com/satyajitghana/TSAI-DeepVision-EVA4.0-Phase-2/tree/master/06-GenerativeAdversarialNetworks/car_images_100x100/red_cars"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Link to Car Images
                            </a>
                        </p>
                    </Alert>
                </Col>
            </Row>
            <Row className="py-4">
                <Col lg={6} md={6} sm={10}>
                    <Form>
                        <Form.Group as={Row} className="justify-content-center">
                            <Form.Label>
                                <h5>Select an Image</h5>
                            </Form.Label>
                            <Form.File custom>
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
                    </Form>
                    <Row className="justify-content-center">
                        {selectedFile && (
                            <Image
                                src={URL.createObjectURL(selectedFile)}
                                style={{ width: "85%" }}
                                rounded
                                fluid
                            />
                        )}
                    </Row>
                    <Row className="justify-content-center">
                        <Button
                            variant="dark"
                            className="shadow-lg mt-5"
                            size="md"
                            disabled={selectedFile === null}
                            onClick={autoEncodeImage}
                        >
                            AutoEncode !
                        </Button>
                    </Row>
                </Col>

                <Col lg={6} md={6} sm={10}>
                    <Row className="justify-content-center">
                        <h5>Result</h5>
                    </Row>
                    {showLoading && (
                        <Row className="justify-content-center mt-5">
                            <Spinner animation="grow" size="lg" />
                        </Row>
                    )}
                    {results !== undefined && <VAEResult results={results} />}
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
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                </Col>
            </Row>
        </FadeInContainer>
    );
};

export default RedCarVAE;
