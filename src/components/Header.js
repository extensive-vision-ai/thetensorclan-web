import React from "react";
import { Navbar, Container, Image } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../logo.svg";

const TitleWrapper = styled(Link)`
    width: 80%;
    /* Medium devices (tablets, 768px and up) */
    @media (min-width: 768px) and (max-width: 991.98px) {
        width: 80%;
    }

    /* Small devices (landscape phones, 576px and up)*/
    @media (min-width: 576px) and (max-width: 767.98px) {
        width: 120%;
    }

    /* Extra small devices (portrait phones, less than 576px) */
    @media (max-width: 575.98px) {
        width: 120%;
    }
`;

const LogoImage = styled(Image)`
    width: 80%;
    /* Medium devices (tablets, 768px and up) */
    @media (min-width: 768px) and (max-width: 991.98px) {
        width: 80%;
    }

    /* Small devices (landscape phones, 576px and up)*/
    @media (min-width: 576px) and (max-width: 767.98px) {
        width: 120%;
    }

    /* Extra small devices (portrait phones, less than 576px) */
    @media (max-width: 575.98px) {
        width: 120%;
    }
`;

const Header = ({ title }) => {
    return (
        <Container>
            <Navbar
                variant="light"
                bg="none"
                sticky="top"
                className="px-2"
                expand="lg"
            >
                <TitleWrapper to="/" className="mx-auto">
                    <LogoImage src={logo} className="mx-auto" />
                </TitleWrapper>
            </Navbar>
            <hr />
        </Container>
    );
};

export default Header;
