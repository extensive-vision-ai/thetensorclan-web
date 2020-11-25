import React, { Fragment, useState } from "react";
import { ThemeProvider } from "styled-components";
import { Container, Alert } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
    GlobalStyles,
    Header,
    Home,
    Footer,
    Classifiers,
    FaceSwap,
    IndianFaceRecognizer,
    LFWPlusRecognizer,
    HumanPoseEstimation,
    RedCarGAN,
    RedCarVAE,
    IFOSR,
    TextClassifier,
    MnistVae,
    StyleTransfer,
    ImageCaptioning,
    SpeechToText,
} from "./components";

import ScrollToTop from "./components/helpers/ScrollToTop";
import Layout from "./components/Layout";
import Translator from "./components/Translator";

function App() {
    const [showAlert, setShowAlert] = useState(true);

    return (
        <ThemeProvider theme={{ fontFamily: "JetBrains Mono" }}>
            <Layout>
                <Router>
                    <ScrollToTop />
                    <Fragment>
                        <GlobalStyles />
                        <Container>
                            <Header title="TheTensorClan" />

                            {showAlert && (
                                <Alert
                                    variant="info"
                                    onClose={() => setShowAlert(false)}
                                    dismissible
                                >
                                    <Alert.Heading>Note</Alert.Heading>
                                    <p>
                                        The models are hosted on AWS Lambda,
                                        which needs a cold start, you might
                                        recieve err::TimedOut once or twice,
                                        just click on the button again to send
                                        one more Request !
                                    </p>
                                </Alert>
                            )}
                            <Switch>
                                <Route exact path="/">
                                    <Home />
                                </Route>
                                <Route path="/classifiers">
                                    <Classifiers />
                                </Route>
                                <Route path="/face-swap">
                                    <FaceSwap />
                                </Route>
                                <Route path="/indian-face-recognizer">
                                    <IndianFaceRecognizer />
                                </Route>
                                <Route path="/lfw-plus-recognizer">
                                    <LFWPlusRecognizer />
                                </Route>
                                <Route path="/human-pose-estimation">
                                    <HumanPoseEstimation />
                                </Route>
                                <Route path="/red-car-gan">
                                    <RedCarGAN />
                                </Route>
                                <Route path="/mnist-vae">
                                    <MnistVae />
                                </Route>
                                <Route path="/red-car-vae">
                                    <RedCarVAE />
                                </Route>
                                <Route path="/ifo-sr">
                                    <IFOSR />
                                </Route>
                                <Route path="/text-classifiers">
                                    <TextClassifier />
                                </Route>
                                <Router path="/style-transfer">
                                    <StyleTransfer />
                                </Router>
                                <Router path="/translator">
                                    <Translator />
                                </Router>
                                <Router path="/image-captioning">
                                    <ImageCaptioning />
                                </Router>
                                <Router path="/speech-to-text">
                                    <SpeechToText />
                                </Router>
                            </Switch>
                            <Footer />
                        </Container>
                    </Fragment>
                </Router>
            </Layout>
        </ThemeProvider>
    );
}

export default App;
