import React, { Fragment, useState } from "react";
import { ThemeProvider } from "styled-components";
import { Container, Alert } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import GlobalStyles from "./components/GlobalStyles";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Classifiers from "./components/Classifiers";
import FaceSwap from "./components/FaceSwap";
import IndianFaceRecognizer from "./components/IndianFaceRecognizer";
import LFWPlusRecognizer from "./components/LFWPlusRecognizer";
import HumanPoseEstimation from "./components/HumanPoseEstimation";
import RedCarGAN from "./components/RedCarGAN";
import MnistVae from "./components/MnistVae";
import RedCarVAE from "./components/RedCarVAE";
import IFOSR from "./components/IFOSR";
import ScrollToTop from "./components/helpers/ScrollToTop";

function App() {
    const [showAlert, setShowAlert] = useState(true);
    return (
        <ThemeProvider theme={{ fontFamily: "JetBrains Mono" }}>
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
                                    The models are hosted on AWS Lambda, which
                                    needs a cold start, you might recieve
                                    err::TimedOut once or twice, just click on
                                    the button again to send one more Request !
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
                        </Switch>
                        <Footer />
                    </Container>
                </Fragment>
            </Router>
        </ThemeProvider>
    );
}

export default App;
