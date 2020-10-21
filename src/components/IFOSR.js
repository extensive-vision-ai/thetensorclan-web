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
import { GENERATORS_ENDPOINT } from "../constants/APIEndpoints";
import FadeInContainer from "./animated/FadeInContainer";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const SRResult = ({ results }) => {
    return (
        <>
            <Row className="justify-content-center">
                <Image src={results} style={{ width: "85%" }} rounded fluid />
            </Row>
            <Row className="justify-content-center">
                <Button
                    variant="dark"
                    className="shadow-lg mt-5"
                    size="md"
                    href={results}
                    download="result.png"
                >
                    Download
                </Button>
            </Row>
        </>
    );
};

const IFOSR = () => {
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

    const superResoluteImage = async () => {
        try {
            setMessage("");
            setResults(undefined);
            setShowLoading(true);

            const formData = new FormData();
            formData.append("file", selectedFile);

            // send a POST request to autencoder api endpoint
            const results = await axios.post(
                `${GENERATORS_ENDPOINT}/ifo-sr-gan`,
                formData,
                {
                    crossDomain: true,
                }
            );

            console.log(results);
            setResults(results.data);
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
    };

    return (
        <FadeInContainer>
            <Row>
                <Col>
                    <Alert variant="warning">
                        <Alert.Heading className="text-center">
                            IFO Super Resolution
                        </Alert.Heading>
                        <p>
                            This is a follow up from the IFO Dataset, so in
                            classifier we tried to classify a given image to a
                            Identified Flying Object Class. In this Assignment
                            we are going to convert a blurry identified flying
                            object (low res image) into a high resolution image,
                            i.e. if the IFO is of 100x100 then we are converting
                            it into 200x200
                        </p>
                        <br />
                        <p>
                            <a
                                href="https://github.com/satyajitghana/TSAI-DeepVision-EVA4.0-Phase-2/tree/master/08-SuperResolution_StyleTransfer/IFO_200"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Link to Blurred IFO Images
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
                            onClick={superResoluteImage}
                        >
                            SuperResolution !
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
                    {results !== undefined && <SRResult results={results} />}
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

export default IFOSR;
