import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row, Spinner, Toast } from 'react-bootstrap'
import { useReactMediaRecorder } from 'react-media-recorder';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import FadeInContainer from './animated/FadeInContainer'

import { SPEECH_TO_TEXT } from '../constants/APIEndpoints'

import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const sample_audios = [
    "happy.wav",
    "bird.wav",
    "dog.wav",
    "marvin.wav",
    "house.wav",
    "on.wav",
    "sheila.wav",
    "right.wav",
    "tree.wav",
    "stop.wav"
]

const RecordButtonStyle = styled(Button)`
        padding: 0;
        height: 70px;
        width: 70px;
        border-radius: 50%;
        border: none;
        ${props => props.isRecording ? css`
            background-color: #c0392b;
            &:hover, &:focus {
                background-color: #e74c3c;
            }
        ` : css`
            background-color: #2980b9;
            &:hover, &:focus {
                background-color: #3498db;
            }
        `}
    `;

const RecordButton = ({ status, startRecording, stopRecording, resetWatch, setIsRecording }) => {
    // status: "idle" | "acquiring_media" | "delayed_start" | "recording" | "stopping" | "stopped";

    if (status === 'idle' || status === 'stopped') {
        return (<RecordButtonStyle className="mt-3" onClick={() => {
            // to unfocus the element
            document.activeElement.blur();

            // start recording
            startRecording();
            resetWatch();
            setIsRecording(true);
        }}><i class="fas fa-microphone-alt fa-2x" /></RecordButtonStyle>)
    } else {
        return (<RecordButtonStyle isRecording className="mt-3" onClick={() => {
            document.activeElement.blur();
            stopRecording();
            setIsRecording(false);
        }}><i class="fas fa-microphone-alt fa-2x" /></RecordButtonStyle>)
    }
}

const SpeechToText = () => {
    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({
        video: false,
        audio: true,
        blobPropertyBag: {
            type: "audio/wav"
        }
    });

    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [selectedSample, setSelectedSample] = useState("NONE");
    const [recordedAudio, setRecordedAudio] = useState(null);

    const setAudioFileFromSample = async (filename) => {
        let res = await fetch(
            process.env.PUBLIC_URL + `/sample_audio/${filename}`
        );

        let data = await res.blob();

        let blobUrl = URL.createObjectURL(data);

        console.log(blobUrl);

        setRecordedAudio(blobUrl);
    }

    useEffect(() => {
        setAudioFileFromSample(sample_audios[0]);
    }, []);

    useEffect(() => {
        // effect
        console.log(mediaBlobUrl);
        setRecordedAudio(mediaBlobUrl);
    }, [mediaBlobUrl])

    const speechToText = async () => {
        try {
            setMessage("");
            setResult("")
            setLoading(true);

            const audioBlob = await fetch(recordedAudio).then(r => r.blob());

            // console.log(audioBlob);

            const ext = audioBlob.type.split("/")[1];

            const audiofile = new File([audioBlob], `${uuidv4()}.${"wav"}`, { type: "audio/wav" })

            console.log(audiofile);

            const formData = new FormData();

            formData.append("file", audiofile);

            const result = await axios.post(
                `${SPEECH_TO_TEXT}/speech-recognition-residual-model`,
                formData,
                {
                    crossDomain: true,
                }
            )

            console.log(result)
            // console.log(result.data['text'])
            setResult(result.data['text'])

        } catch (e) {
            if (e.reponse !== undefined) {
                console.log(e.response);
                setMessage(JSON.stringify(e.response));
            } else if (e.message !== undefined) {
                console.log(e);
                setMessage(JSON.stringify(e.message));
            } else {
                console.log(e);
                setMessage(JSON.stringify(e));
            }
        }

        setLoading(false);
    }

    const resetWatch = () => {
        setElapsedTime(0);
        setIsRecording(false);
    }

    useEffect(() => {
        let interval = null;

        if (isRecording) {
            interval = setInterval(() => {
                setElapsedTime(elapsedTime => elapsedTime + 1);
            }, 1000);
        } else if (!isRecording && elapsedTime !== 0) {
            clearInterval(interval);
        }

        // effect
        return () => {
            // cleanup
            clearInterval(interval);
        }
    }, [isRecording, elapsedTime])


    return (
        <FadeInContainer>
            <Row className="mb-4">
                <Col>
                    <Alert variant="warning">
                        <Alert.Heading className="text-center">
                            Speech To Text
                        </Alert.Heading>
                        <p>
                            Record your audio speaking a word, and let my model predict what you spoke !
                            (Pls record single words only 😅)
                        </p>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Row className="justify-content-center">
                        <h4>Record Your Audio</h4>
                    </Row>
                    <Row className="justify-content-center">
                        <Col className="text-center">
                            <div className="h1">{elapsedTime}s</div>
                            <RecordButton status={status} startRecording={startRecording} stopRecording={stopRecording} resetWatch={resetWatch} setIsRecording={setIsRecording} />
                            <div className="mt-1"><h4>{status}</h4></div>
                        </Col>
                    </Row>
                    <Form.Group as={Row} className="justify-content-center">
                        <Form.Label>
                            <h5>or Select a Sample</h5>
                        </Form.Label>
                        <Form.Control
                            as="select"
                            onClick={(e) => {
                                // console.log(e.target.value);
                            }}
                            onChange={(e) => {
                                const filename = e.target.value;
                                setSelectedSample(filename);
                                setAudioFileFromSample(filename);
                            }}
                            value={selectedSample}
                        >
                            {
                                sample_audios.map((val, idx) => (
                                    <option key={idx} value={val}>{val}</option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col className="text-center">
                    <div>
                        <h4>Test Your Audio</h4>
                    </div>
                    <div>
                        <audio src={recordedAudio} controls autoplay />
                    </div>
                    <div className="mt-3">
                        <Button
                            variant="dark"
                            className="shadow-lg m-2 mb-4"
                            size="lg"
                            disabled={loading || isRecording || recordedAudio === null}
                            onClick={() => {
                                // translateText("de", "en");
                                speechToText();
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
                                        Running...
                                    </>
                            ) : (
                                    "Guess Me!"
                                )}
                        </Button>
                    </div>
                    <div className="mt-4">
                        <h4>Prediction</h4>
                    </div>
                    <div>
                        <Card className="m-4">
                            <Card.Body>

                                {result === "" ? "<EMPTY>" : result}
                            </Card.Body>
                        </Card>
                    </div>
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
        </FadeInContainer>
    )
}

export default SpeechToText
