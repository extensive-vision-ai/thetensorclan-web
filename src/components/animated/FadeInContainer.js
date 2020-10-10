import React from "react";
import { Container } from "react-bootstrap";

const FadeInContainer = ({ children }) => {
    return <Container className="uk-animation-fade">{children}</Container>;
};

export default FadeInContainer;
