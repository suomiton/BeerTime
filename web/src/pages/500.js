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
      <h1>Error! Oof.</h1>
      <img
        src="https://media.giphy.com/media/l2Sq0AdcQXKQ7yIH6/giphy.gif"
        alt="shit"
      />
    </PageWrapper>
  </Layout>
)

export default ErrorPage
