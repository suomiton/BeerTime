import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"

const PageWrapper = styled.div`
  max-width: 600px;
  margin: 100px auto;
  background-color: #fff;
  padding: 30px;
`

const ConfirmationPage = () => (
  <Layout>
    <PageWrapper>
      <h1>Thank you!</h1>
      <img
        src="https://media.giphy.com/media/KJ1f5iTl4Oo7u/giphy.gif"
        alt="great"
      />
    </PageWrapper>
  </Layout>
)

export default ConfirmationPage
