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
      <h1>Juu!</h1>
      <img
        src="https://media.giphy.com/media/26uf7WGUJLbiqIryo/giphy.gif"
        alt="great"
      />
    </PageWrapper>
  </Layout>
)

export default ConfirmationPage
