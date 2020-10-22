import React, { useState } from "react";
import FadeInContainer from "./animated/FadeInContainer";

import { STYLE_TRANSFER_ENDPOINT } from "../constants/APIEndpoints";
import axios from "axios";
import {
    Row,
    Col,
    Alert,
    Form,
    Image,
    Button,
    ProgressBar,
    Spinner,
    Toast,
} from "react-bootstrap";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const StyleResult = ({ result, fileName, styleName }) => {
    return (
        <Col>
            <Row className="justify-content-center">
                <Image src={result} style={{ width: "85%" }} rounded fluid />
            </Row>
            <Row className="justify-content-center">
                <Button
                    variant="dark"
                    className="shadow-lg mt-5"
                    size="md"
                    href={result}
                    download={`${fileName}-${styleName}.jpg`}
                >
                    Download
                </Button>
            </Row>
        </Col>
    );
};

const StyleTransfer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [styleType, setStyleType] = useState("candy");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [result, setResult] = useState(undefined);

    const onFileSelect = (e) => {
        if (e.target.files.length === 1) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const stylizeImage = async () => {
        try {
            setMessage("");
            setResult(undefined);
            setShowLoading(true);
            console.log(selectedFile);
            const formData = new FormData();
            formData.append("file", selectedFile);

            // send a POST request to the style-transfer api endpoint
            const result = await axios.post(
                `${STYLE_TRANSFER_ENDPOINT}/fast-style-transfer/${styleType}`,
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
            );

            // console.log(result);
            setResult(result.data);
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
    };

    return (
        <FadeInContainer>
            <Row>
                <Col>
                    <Alert variant="warning">
                        <Alert.Heading>
                            Fast Neural Style Transfer
                        </Alert.Heading>
                        <p>
                            This is a the feed forward version of the neural
                            style transfer, which basically applied a art style
                            on the given imagwe, and make it look more
                            "artisty". There are fixed types of styles i.e.
                        </p>
                        <ul>
                            <li>candy</li>
                            <li>mosaic</li>
                            <li>rain_princess</li>
                            <li>udnie</li>
                        </ul>
                        <p>
                            <a
                                href="https://satyajitghana.github.io/TSAI-DeepVision-EVA4.0-Phase-2/08-SuperResolution_StyleTransfer/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                See Style Examples
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
                    </Col>

                    <Col lg={6} md={6} sm={10}>
                        <Form.Group as={Row} className="justify-content-center">
                            <Form.Label>
                                <h5>Select a Style</h5>
                            </Form.Label>
                            <Form.Control
                                as="select"
                                onChange={(e) => setStyleType(e.target.value)}
                                value={styleType}
                                className="mx-2"
                            >
                                <option value="candy">Candy</option>
                                <option value="mosaic">Mosaic</option>
                                <option value="rain_princess">
                                    Rain Princess
                                </option>
                                <option value="udnie">Udnie</option>
                            </Form.Control>
                        </Form.Group>

                        <Row className="justify-content-center">
                            <Button
                                variant="dark"
                                className="shadow-lg mt-1"
                                size="md"
                                disabled={selectedFile === null}
                                onClick={() => stylizeImage()}
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
                                        Styling...
                                    </>
                                ) : (
                                    "StyleIt !"
                                )}
                            </Button>
                        </Row>
                        <Row className="mt-2">
                            {result !== undefined && (
                                <StyleResult
                                    result={result}
                                    fileName={selectedFile.name}
                                    styleName={styleType}
                                />
                            )}
                        </Row>
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
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </FadeInContainer>
    );
};

export default StyleTransfer;
