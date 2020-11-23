import React, { useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";
import FadeInContainer from "./animated/FadeInContainer";

const StyledContent = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Layout = ({ children }) => {
    const devMode = false;

    const [isLoading, setIsLoading] = useState(!devMode);
    return isLoading ? (
        <Loader
            onFinishLoad={() => {
                setIsLoading(false);
            }}
        />
    ) : (
            <StyledContent>
                <main>
                    <FadeInContainer>{children}</FadeInContainer>
                </main>
            </StyledContent>
        );
};

export default Layout;
