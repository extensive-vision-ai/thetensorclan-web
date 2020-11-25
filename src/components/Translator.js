import React, { useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner, Toast } from "react-bootstrap";
import FadeInContainer from "./animated/FadeInContainer";

import { TRANSLATOR_ENDPOINT } from "../constants/APIEndpoints";

import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const Translator = () => {
    const [inputText, setInputText] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const translateText = async (source_ln, target_ln) => {
        try {
            setLoading(true);
            setMessage("");

            const formData = new FormData();
            formData.append("source_text", inputText);

            const result = await axios.post(
                `${TRANSLATOR_ENDPOINT}/${source_ln}/${target_ln}`,
                formData,
                {
                    crossDomain: true,
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

        setLoading(false);

        // simulate a result
        // setTimeout(() => {
        //     setResult("Hey there");
        //     setLoading(false);
        // }, 1000);
    };

    return (
        <FadeInContainer>
            <Row className="mb-4">
                <Col>
                    <Alert variant="warning">
                        <Alert.Heading className="text-center">
                            Translator
                        </Alert.Heading>
                        <p>
                            TTC Translator is still in basic alpha, and supports
                            only German to English Translation
                        </p>
                    </Alert>
                </Col>
            </Row>
            <Form>
                <Row>
                    <Col className="mx-1" lg={true}>
                        <Form.Group as={Row}>
                            <Form.Label>Give a German Text</Form.Label>
                            <Form.Control
                                size="md"
                                type="text"
                                as="textarea"
                                placeholder="Geben Sie einen deutschen Text ein"
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                }}
                            />
                            <Form.Text className="text-muted">
                                Wir werden Ihre sensiblen Daten niemals
                                speichern.
                            </Form.Text>
                        </Form.Group>
                        <Row className="justify-content-center">
                            <Button
                                variant="dark"
                                className="shadow-lg m-2 mb-4"
                                size="lg"
                                disabled={inputText.length === 0 || loading}
                                onClick={() => {
                                    translateText("de", "en");
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
                                        />{" "}
                                        Translating...
                                    </>
                                ) : (
                                        "Übersetzen!"
                                    )}
                            </Button>
                        </Row>
                    </Col>
                    <Col className="mx-1" lg={true}>
                        <Form.Group as={Row}>
                            <Form.Label>English Translation</Form.Label>
                            <Form.Control
                                size="md"
                                type="text"
                                as="textarea"
                                placeholder="Enter a German text"
                                value={result}
                            />

                            <Form.Text className="text-muted">
                                We'll never save your sensitive data.
                            </Form.Text>
                        </Form.Group>
                    </Col>
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

export default Translator;
