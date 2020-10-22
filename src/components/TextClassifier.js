import React, { useState } from "react";
import {
    Form,
    Row,
    Col,
    Button,
    InputGroup,
    Alert,
    Toast,
    Spinner,
    Table,
} from "react-bootstrap";

import FadeInContainer from "./animated/FadeInContainer";
import { TEXT_ENDPOINT } from "../constants/APIEndpoints";

import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const TextClassificationResult = ({ results }) => {
    return (
        <FadeInContainer>
            <Table size="sm" striped bordered responsive>
                <thead>
                    <tr>
                        <th>label_idx</th>
                        <th>label_name</th>
                        <th>confidence</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((e, idx) => (
                        <tr key={idx}>
                            <td>{e.label_idx}</td>
                            <td>{e.label_name}</td>
                            <td>{e.confidence.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </FadeInContainer>
    );
};

const TextClassifier = () => {
    const [inputText, setInputText] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState([]);

    const classifyImage = async () => {
        try {
            setLoading(true);
            setMessage("");
            setResult([]);

            const formData = new FormData();
            formData.append("input_text", inputText);

            // console.log(`${TEXT_ENDPOINT}/conv-sentimental-mclass`);

            const result = await axios.post(
                `${TEXT_ENDPOINT}/conv-sentimental-mclass`,
                formData,
                {
                    crossDomain: true,
                }
            );

            // console.log(result.data);
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
        setLoading(false);
    };

    return (
        <FadeInContainer>
            <Row className="mb-4">
                <Col>
                    <Alert variant="warning">
                        <Alert.Heading className="text-center">
                            Text Classifier
                        </Alert.Heading>
                        <p>
                            These constitute of various NLP Models for Text
                            Classification, the demo here is of a MultiClass
                            Text Question Type Classification. Just type in a
                            query and hit classify!
                            <br />
                            The 6 labels (for the non-fine-grained case)
                            correspond to the 6 types of questions in the
                            dataset:
                            <ul>
                                <li>HUM for questions about humans</li>
                                <li>ENTY for questions about entities</li>
                                <li>
                                    DESC for questions asking you for a
                                    description
                                </li>
                                <li>
                                    NUM for questions where the answer is
                                    numerical
                                </li>
                                <li>
                                    LOC for questions where the answer is a
                                    location
                                </li>
                                <li>
                                    ABBR for questions asking about
                                    abbreviations
                                </li>
                            </ul>
                        </p>
                    </Alert>
                </Col>
            </Row>
            <Form>
                <Row className="justify-content-center">
                    <Col md={7} sm={10}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>
                                    {" "}
                                    <span role="img" aria-label="text">
                                        📄
                                    </span>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                size="lg"
                                type="text"
                                as="textarea"
                                placeholder="Enter a Sentence"
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                }}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={2} sm={10} className="my-auto">
                        <Button
                            variant="dark"
                            className="shadow-lg mt-2"
                            size="lg"
                            disabled={inputText.length === 0 && loading}
                            onClick={() => {
                                classifyImage();
                            }}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        variant="light"
                                        as="span"
                                        animation="border"
                                        size="md"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Classifying...
                                </>
                            ) : (
                                "Classify!"
                            )}
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-4 justify-content-center">
                    {result.length !== 0 && (
                        <TextClassificationResult results={result} />
                    )}
                </Row>
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
            </Form>
        </FadeInContainer>
    );
};

export default TextClassifier;
