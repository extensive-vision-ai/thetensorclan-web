import React, { useState } from "react";
import {
    Row,
    Col,
    ToggleButton,
    ButtonGroup,
    Spinner,
    Button,
    Toast,
    Image,
    Alert,
} from "react-bootstrap";

import axios from "axios";

import { GENERATORS_ENDPOINT } from "../constants/APIEndpoints";
import FadeInContainer from "./animated/FadeInContainer";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};

const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const getBgAndTextColor = (f) => {
    const bg_scaled = Math.floor(scale(f, -1, 1, 0, 255));
    let text_scaled = 255 - bg_scaled;

    if (bg_scaled >= 80 && bg_scaled <= 180) {
        text_scaled = 255;
    }

    return [
        rgbToHex(bg_scaled, bg_scaled, bg_scaled),
        rgbToHex(text_scaled, text_scaled, text_scaled),
    ];
};

const LATENTZ_SIZE = 64;

const RedCarGAN = () => {
    // why 64 ? because thats the size car gan expects for the latent z vector
    const [latentz, setLatentz] = useState(
        Array.from(Array(LATENTZ_SIZE)).map((x) => Math.random() * 2.0 - 1.0)
    );

    const [showLoading, setShowLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [result, setResult] = useState("");

    const [currIdx, setCurrIdx] = useState(0);

    // useEffect(() => {
    //     // effect
    //     onGeneratorClicked();
    //     return () => {
    //         // cleanup
    //     };
    // }, [latentz]);

    const sliderChange = (event) => {
        let newLatentZ = [...latentz];
        newLatentZ[currIdx] = parseFloat(event.target.value);
        setLatentz(newLatentZ);
    };

    const selectValue = (index) => {
        setCurrIdx(index);
    };

    const makePositive = () => {
        const newLatentZ = latentz.map((e) => Math.abs(e));
        setLatentz(newLatentZ);
    };

    const makeNegative = () => {
        const newLatentZ = latentz.map((e) => -1.0 * Math.abs(e));
        setLatentz(newLatentZ);
    };

    const makeRandom = () => {
        const newLatentZ = latentz.map((e) => Math.random() * 2.0 - 1.0);
        setLatentz(newLatentZ);
    };

    const makeRandomLg = () => {
        const newLatentZ = latentz.map((e) => Math.random() * 20.0 - 10.0);
        setLatentz(newLatentZ);
    };

    const onGeneratorClicked = async () => {
        try {
            // Reset all the states and show loading
            setMessage("");
            setResult("");
            setShowLoading(true);

            const formData = new FormData();
            formData.append("latent_z", latentz);
            // console.log(...formData);

            // send the latent_z vector to server
            const generatedCar = await axios.post(
                `${GENERATORS_ENDPOINT}/red-car-gan-generator`,
                formData,
                {
                    crossDomain: true,
                }
            );

            setResult(generatedCar.data);
        } catch (e) {
            setMessage(JSON.stringify(e));
            setResult("");
        }

        // done with the request, close the loading widget
        setShowLoading(false);
    };

    return (
        <FadeInContainer>
            <Row>
                <Col>
                    <Alert variant="warning">
                        <Alert.Heading>
                            Instructions on using Car GAN
                        </Alert.Heading>
                        <p>
                            This is a very simple model, which was done using
                            3.5M parameters
                            <ul>
                                <li>Select the value you want to change</li>
                                <li>Slide the slider to change the value</li>
                                <li>Click on Generate !</li>
                            </ul>
                            I've provided a few Presets you can play with, try
                            them out ! see which parameters affect which part of
                            the car.
                        </p>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col lg={6} md={6} sm={10}>
                    <h2 className="text-center">Select Values</h2>
                    <Row className="justify-content-center">
                        <Button
                            variant="dark"
                            className="mb-3 mx-auto shadow-md"
                            size="md"
                            onClick={onGeneratorClicked}
                        >
                            Generate !
                        </Button>
                    </Row>
                    <Row>
                        <p>Presets</p>
                    </Row>
                    <Row>
                        <Button
                            as={Col}
                            variant="dark"
                            className="mb-3 mx-1 shadow-md"
                            size="md"
                            onClick={makePositive}
                        >
                            Positive
                        </Button>

                        <Button
                            as={Col}
                            variant="dark"
                            className="mb-3 mx-1 shadow-md"
                            size="md"
                            onClick={makeNegative}
                        >
                            Negative
                        </Button>

                        <Button
                            as={Col}
                            variant="dark"
                            className="mb-3 mx-1 shadow-md"
                            size="md"
                            onClick={makeRandom}
                        >
                            Randomize
                        </Button>

                        <Button
                            as={Col}
                            variant="dark"
                            className="mb-3 mx-1 shadow-md"
                            size="md"
                            onClick={makeRandomLg}
                        >
                            Random Lg
                        </Button>
                    </Row>
                    <Row className="justify-content-center p-3">
                        <input
                            type="range"
                            className="form-control-range"
                            min="-1"
                            max="1"
                            step="0.02"
                            value={latentz[currIdx]}
                            onChange={sliderChange}
                        />
                    </Row>
                    <Row xs="4" className="mt-3">
                        {latentz.map((val, idx) => (
                            <ButtonGroup toggle>
                                <ToggleButton
                                    key={idx}
                                    type="checkbox"
                                    variant="outline-dark"
                                    onClick={() => selectValue(idx)}
                                    as={Col}
                                    value="1"
                                    className="p-1 m-2"
                                    style={{
                                        backgroundColor: getBgAndTextColor(
                                            val
                                        )[0],
                                        color: getBgAndTextColor(val)[1],
                                    }}
                                >
                                    {val.toFixed(2)}
                                </ToggleButton>
                            </ButtonGroup>
                        ))}
                    </Row>
                </Col>
                <Col lg={6} md={6} sm={10}>
                    <Row className="justify-content-center">
                        <h2 className="text-center">Result</h2>
                    </Row>
                    {showLoading && (
                        <Row className="justify-content-center mt-5">
                            <Spinner animation="grow" size="lg" />
                        </Row>
                    )}
                    <Row className="p-3 justify-content-center">
                        <Toast
                            onClose={() => setMessage("")}
                            show={message !== ""}
                            className="mx-auto m-3 bg-dark text-white shadow-lg"
                            as={Row}
                        >
                            <Toast.Header>
                                <strong className="mr-auto">Message</strong>
                                <small>just now</small>
                            </Toast.Header>
                            <Toast.Body>{message}</Toast.Body>
                        </Toast>

                        {result !== "" && (
                            <Image
                                src={result}
                                style={{ width: "85%" }}
                                className="mx-auto mt-5"
                                rounded
                                fluid
                            />
                        )}
                    </Row>
                </Col>
            </Row>
        </FadeInContainer>
    );
};

export default RedCarGAN;
