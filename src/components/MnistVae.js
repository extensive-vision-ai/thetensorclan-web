import React, { useRef, useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Spinner,
    ButtonGroup,
    ToggleButton,
} from "react-bootstrap";
import { Tensor, InferenceSession, backend } from "onnxjs";
import {
    canvasGetScaled,
    canvasToTensor,
    warmupModel,
    resampleCanvasImage,
    imageDataRgbaToNdarray,
    NdarrayRgbaToMono,
    NdarrayAlphaToMono,
    ndArrayToTensor,
    setCanvasFromMonoTensor,
} from "../onnx/Utils";
import ndarray from "ndarray";
import ops from "ndarray-ops";
import colormap from "colormap";

import encoderModel from "./mnist_vae_encoder_32x32.onnx";
import decoderModel from "./mnist_vae_decoder_32x32_onnxjs.onnx";

const Z_DIMS = 10;

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

let encoderInferenceSession;
let decoderInferenceSession;

const MnistVae = () => {
    const [isReady, setIsReady] = useState(false);
    const canvasRef = useRef(null);
    const dstCanvasRef = useRef(null);
    const [dstContext, setDstContext] = useState(null);
    const [context, setContext] = useState(null);
    const [latentz, setLatentz] = useState(
        Array.from(Array(Z_DIMS)).map((x) => Math.random() * 2.0 - 1.0)
    );
    const [currIdx, setCurrIdx] = useState(0);
    const [dstImage, setDstImage] = useState("");
    const sliderChange = (event) => {
        let newLatentZ = [...latentz];
        newLatentZ[currIdx] = parseFloat(event.target.value);
        setLatentz(newLatentZ);
    };

    const selectValue = (index) => {
        setCurrIdx(index);
    };

    useEffect(() => {
        loadModel();
    }, []);

    const loadModel = async () => {
        encoderInferenceSession = await new InferenceSession();
        await encoderInferenceSession.loadModel(encoderModel);
        await warmupModel(encoderInferenceSession, [1, 1, 32, 32]);

        decoderInferenceSession = await new InferenceSession();
        await decoderInferenceSession.loadModel(decoderModel);
        await warmupModel(decoderInferenceSession, [1, 10, 1, 1]);

        setIsReady(true);
    };

    useEffect(() => {
        // effect

        if (dstCanvasRef.current) {
            const renderCtx = dstCanvasRef.current.getContext("2d");
            if (renderCtx) {
                // canvasOffsetLeft = canvasRef.current.offsetLeft;
                // canvasOffsetTop = canvasRef.current.offsetTop;

                // canvasRef.current.width = canvasRef.current.clientWidth;
                // canvasRef.current.height = canvasRef.current.clientWidth;

                setDstContext(renderCtx);

                // console.log(canvasRef.current.getBoundingClientRect());
            }
        }
        return () => {
            // cleanup
        };
    }, [dstContext]);

    useEffect(() => {
        const updateCanvas = async () => {
            var zTensor = new Tensor(new Float32Array(latentz), "float32", [
                1,
                10,
                1,
                1,
            ]);

            const outputDec = await decoderInferenceSession.run([zTensor]);

            setCanvasFromMonoTensor(
                outputDec.get("output"),
                dstCanvasRef.current
            );
        };
        if (decoderInferenceSession) {
            updateCanvas();
        }

        // effect
        return () => {
            // cleanup
        };
    }, [latentz]);

    const clearCanvases = () => {
        canvasRef.current
            .getContext("2d")
            .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        dstCanvasRef.current
            .getContext("2d")
            .clearRect(
                0,
                0,
                dstCanvasRef.current.width,
                dstCanvasRef.current.height
            );
    };

    useEffect(() => {
        // effect
        let mouseDown = false;
        let start = { x: 0, y: 0 };
        let end = { x: 0, y: 0 };
        let canvasOffsetLeft = () => {
            let rect = canvasRef.current.getBoundingClientRect();
            return rect.left;
        };
        let canvasOffsetTop = () => {
            let rect = canvasRef.current.getBoundingClientRect();
            return rect.top;
        };

        const handleMouseDown = (evt) => {
            mouseDown = true;

            start = {
                x: evt.clientX - canvasOffsetLeft(),
                y: evt.clientY - canvasOffsetTop(),
            };

            end = {
                x: evt.clientX - canvasOffsetLeft(),
                y: evt.clientY - canvasOffsetTop(),
            };
        };

        const reconstructDrawing = async () => {
            const scaledImage = resampleCanvasImage(canvasRef.current, 32, 32);

            const imageArray = imageDataRgbaToNdarray(scaledImage);

            var monoImage = NdarrayAlphaToMono(imageArray);
            ops.divseq(monoImage, 255.0);
            var tensor = ndArrayToTensor(monoImage, 1, 1, 32, 32);

            const output = await encoderInferenceSession.run([tensor]);

            setLatentz(Array.from(output.get("output").data));
        };

        const handleMouseUp = (evt) => {
            mouseDown = false;
            console.log("mouse is up");

            reconstructDrawing();
        };

        const handleMouseMove = (evt) => {
            if (mouseDown && context) {
                start = {
                    x: end.x,
                    y: end.y,
                };

                end = {
                    x: evt.clientX - canvasOffsetLeft(),
                    y: evt.clientY - canvasOffsetTop(),
                };

                // Draw our path
                context.beginPath();
                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);
                context.lineCap = "round";
                context.strokeStyle = "#000";
                // context.lineWidth = 20;
                context.lineWidth = canvasRef.current.width * 0.1;
                context.stroke();
                context.closePath();
            }
        };

        const handleTouchStart = (evt) => {
            if (evt.target === canvasRef.current) {
                evt.preventDefault();
            }
            var touch = evt.touches[0];
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            canvasRef.current.dispatchEvent(mouseEvent);
        };

        const handleTouchEnd = (evt) => {
            if (evt.target === canvasRef.current) {
                evt.preventDefault();
            }
            var mouseEvent = new MouseEvent("mouseup", {});
            canvasRef.current.dispatchEvent(mouseEvent);
        };

        const handleTouchMove = (evt) => {
            if (evt.target === canvasRef.current) {
                evt.preventDefault();
            }
            var touch = evt.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            canvasRef.current.dispatchEvent(mouseEvent);
        };

        if (canvasRef.current) {
            const renderCtx = canvasRef.current.getContext("2d");
            if (renderCtx) {
                canvasRef.current.addEventListener(
                    "mousedown",
                    handleMouseDown
                );
                canvasRef.current.addEventListener("mouseup", handleMouseUp);
                canvasRef.current.addEventListener(
                    "mousemove",
                    handleMouseMove
                );
                canvasRef.current.addEventListener(
                    "touchstart",
                    handleTouchStart
                );
                canvasRef.current.addEventListener("touchend", handleTouchEnd);
                canvasRef.current.addEventListener(
                    "touchmove",
                    handleTouchMove
                );

                // canvasOffsetLeft = canvasRef.current.offsetLeft;
                // canvasOffsetTop = canvasRef.current.offsetTop;

                canvasRef.current.width = canvasRef.current.clientWidth;
                canvasRef.current.height = canvasRef.current.clientWidth;

                setContext(renderCtx);

                // console.log(canvasRef.current.getBoundingClientRect());
            }
        }

        return () => {
            // cleanup

            if (canvasRef.current) {
                canvasRef.current.removeEventListener(
                    "mousedown",
                    handleMouseDown
                );
                canvasRef.current.removeEventListener("mouseup", handleMouseUp);
                canvasRef.current.removeEventListener(
                    "mousemove",
                    handleMouseMove
                );

                canvasRef.current.removeEventListener(
                    "touchstart",
                    handleTouchStart
                );
                canvasRef.current.removeEventListener(
                    "touchend",
                    handleTouchEnd
                );
                canvasRef.current.removeEventListener(
                    "touchmove",
                    handleTouchMove
                );
            }
        };
    }, [context]);

    return (
        <Container fluid>
            <Row style={{ display: isReady ? "none" : "block" }}>
                <Spinner animation="border" role="status" size="lg" />
                <h1>Loading Models ...</h1>
            </Row>
            <Row>
                <Col sm={10} md={6}>
                    <Row className="justify-content-center">
                        <h5>Draw a number</h5>
                    </Row>
                    <Row className="justify-content-center mb-4">
                        <canvas
                            id="srcCanvas"
                            width={28}
                            height={28}
                            ref={canvasRef}
                            style={{
                                border: "2px solid #000",
                                minWidth: "80%",
                                height: "auto",
                            }}
                            data-paper-resize
                        />
                    </Row>
                    <Row className="justify-content-around mb-2">
                        <Button variant="dark" onClick={() => clearCanvases()}>
                            Clear
                        </Button>
                    </Row>
                    <Row className="justify-content-center mb-3">
                        <h5>Change LatentZ values</h5>
                    </Row>
                    <Row className="justify-content-center px-5 mb-5">
                        <input
                            type="range"
                            className="form-control-range"
                            min="-3"
                            max="3"
                            step="0.02"
                            onChange={sliderChange}
                            value={latentz[currIdx]}
                        />
                    </Row>
                    <Row xs={5}>
                        {latentz.map((val, idx) => (
                            <ButtonGroup toggle key={idx}>
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
                <Col sm={10} md={6} className="">
                    <Row className="justify-content-center">
                        <h5>Reconstructed Number</h5>
                    </Row>
                    <Row className="justify-content-center mb-4">
                        <canvas
                            id="dstCanvas"
                            width={32}
                            height={32}
                            ref={dstCanvasRef}
                            style={{
                                border: "2px solid #000",
                                minWidth: "80%",
                                height: "auto",
                            }}
                            data-paper-resize
                        />
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default MnistVae;
