import React from "react"
import styled, { ThemeProvider } from "styled-components"

import Theme from "../utils/theme"
import "../utils/app.css"

const SiteWrapper = styled.main`
  display: block;
`

const Layout = ({ children }) => (
  <ThemeProvider theme={Theme}>
    <>
      <SiteWrapper>{children}</SiteWrapper>
    </>
  </ThemeProvider>
)

export default Layout
