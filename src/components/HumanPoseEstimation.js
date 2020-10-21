import React, { useState } from "react";
import {
    Row,
    Col,
    Form,
    Image,
    Button,
    ProgressBar,
    Spinner,
    Toast,
} from "react-bootstrap";
import { HUMAN_POSE_ESTIMATION_ENDPOINT } from "../constants/APIEndpoints";
import axios from "axios";
import FadeInContainer from "./animated/FadeInContainer";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const HumanPoseEstimation = () => {
    const [humanImage, setHumanImage] = useState({});
    const [poseDetectedImage, setPoseDetectedImage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const detectPose = async () => {
        const formData = new FormData();
        formData.append("file", humanImage);

        try {
            // clear out the messages
            setShowMessage(false);
            setMessage("");
            setPoseDetectedImage("");
            // show the progress bar
            setShowLoading(true);
            const results = await axios.post(
                `${HUMAN_POSE_ESTIMATION_ENDPOINT}`,
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
            setPoseDetectedImage(results.data);
        } catch (e) {
            // some error occured, reset states and show message
            setMessage(JSON.stringify(e));
            setShowMessage(true);
            setPoseDetectedImage("");
            console.log(e);
        }

        // we are done, now turn off the loading and progress bar
        setShowLoading(false);

        setTimeout(() => {
            setUploadPercentage(0);
        }, 5000);
    };

    return (
        <FadeInContainer>
            <Form>
                <Row className="justify-content-around">
                    <Col>
                        <Form.Group as={Row}>
                            <Form.Label>
                                <h5>
                                    <strong>Select Human Pose Image</strong>
                                </h5>
                                <code>
                                    NOTE: The image must have "single" human
                                    with some pose
                                </code>
                            </Form.Label>

                            <Form.File custom>
                                <Form.File.Input
                                    onChange={(e) =>
                                        setHumanImage(e.target.files[0])
                                    }
                                    accept=".jpg,.png,.jpeg"
                                />
                                <Form.File.Label data-browse="Browse">
                                    {humanImage.name === undefined
                                        ? "Browse Human Image"
                                        : humanImage.name}
                                </Form.File.Label>
                            </Form.File>
                            {humanImage.name && (
                                <Image
                                    src={URL.createObjectURL(humanImage)}
                                    style={{ width: "85%" }}
                                    className="mx-auto mt-5"
                                    rounded
                                    fluid
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Button
                        variant="dark"
                        className="mt-5 mx-auto shadow-lg"
                        size="lg"
                        disabled={humanImage.name === undefined}
                        onClick={() => detectPose()}
                    >
                        Detect Pose !
                    </Button>
                </Row>
                <Row>
                    <Col>
                        {/* Show the Upload Progress */}
                        <ProgressBar
                            className="mt-5"
                            striped
                            variant="dark"
                            now={uploadPercentage}
                            label={`${uploadPercentage}%`}
                            hidden={!showLoading}
                        />
                    </Col>
                </Row>
                <Row>
                    <Button
                        variant="dark"
                        className="mt-5"
                        hidden={!showLoading}
                        disabled
                        block
                    >
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />{" "}
                        Loading...
                    </Button>
                </Row>
                {poseDetectedImage !== "" && (
                    <Row>
                        <Col md={6} lg={6} className="mx-auto mt-5">
                            <h1 className="text-center">Detected Pose</h1>
                            <Image
                                src={poseDetectedImage}
                                style={{ width: "85%" }}
                                className="mx-auto mt-5"
                                rounded
                                fluid
                            />
                        </Col>
                    </Row>
                )}
                <Row>
                    <Toast
                        onClose={() => setShowMessage(false)}
                        show={showMessage}
                        className="mx-auto mt-5 bg-dark text-white shadow-lg"
                        as={Row}
                    >
                        <Toast.Header>
                            <strong className="mr-auto">Message</strong>
                            <small>just now</small>
                        </Toast.Header>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                </Row>
            </Form>
        </FadeInContainer>
    );
};

export default HumanPoseEstimation;
