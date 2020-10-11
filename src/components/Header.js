import React from "react";
import { Navbar, Container, Image } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../logo.svg";

const TitleWrapper = styled(Link)`
    font-size: calc(5vh + 1vw);
    max-width: 100%;
    font-weight: bolder;
    color: #000;
    text-decoration: none;
    text-shadow: 4px 3px 4px #8395a7;

    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
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
        width: 100%;
    }

    /* Extra small devices (portrait phones, less than 576px) */
    @media (max-width: 575.98px) {
        width: 100%;
    }
`;

const Header = ({ title }) => {
    return (
        <Container>
            <Navbar variant="light" bg="none" sticky="top" className="px-2">
                {/* <TitleWrapper className="display-4 m-auto py-3" to="/">
                    <i className="fas fa-quidditch" /> {title}
                </TitleWrapper> */}
                {/* <Image src={logo}/> */}
                <LogoImage src={logo} className="mx-auto" />
            </Navbar>
            <hr />
        </Container>
    );
};

export default Header;
