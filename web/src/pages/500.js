import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"

const PageWrapper = styled.div`
  max-width: 600px;
  margin: 100px auto;
  background-color: #fff;
  padding: 30px;
`

const ErrorPage = () => (
  <Layout>
    <PageWrapper>
      <h1>Well Shit! Everything is brokent on teh server.</h1>
      <img
        src="https://media.giphy.com/media/cK0QSfVaTl62A/giphy.gif"
        alt="shit"
      />
    </PageWrapper>
  </Layout>
)

export default ErrorPage
