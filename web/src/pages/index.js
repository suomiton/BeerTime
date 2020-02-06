import React from "react"
import styled from "styled-components"

import Layout from "../components/layout"
import SEO from "../components/seo"
import moment from "moment"
import { postRequest } from "../utils/http-client"
import { navigate, StaticQuery, graphql } from "gatsby"
import media from "../utils/media"
import theme from "../utils/theme"

const PageWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto 100px;
  background-color: #fff;
  padding: 30px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  box-shadow: 0 8px 40px -15px #aaa;

  ${media.phone560`
    margin: 30px auto 100px;
  `}
`

const SectionWrapper = styled.section`
  margin-bottom: 20px;

  &.centered {
    text-align: center;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-content: center;

  label {
    flex: 1 1 auto;
    font-size: 16px;
    font-weight: 300;
  }
  &.add-margin {
    margin-bottom: 15px;
  }
`

const FormGroup = styled(InputGroup)`
  display: block;
`

const ScoreWrapper = styled.div`
  flex: 0 0 50px;
  font-weight: 600;
  margin-right: 15px;
`

const TextInput = styled.input`
  display: block;
  padding: 6px 8px;
  border: 2px solid #eee;
  border-radius: 3px;
  width: 100%;
`

const TextArea = styled.textarea`
  padding: 6px 8px;
  border: 2px solid #eee;
  border-radius: 3px;
  display: block;
  width: 100%;
  height: 150px;
`

const CenteredImageWrapper = styled.div`
  margin: 10px auto 20px;
  text-align: center;
  > img {
    margin: 0 auto;
    width: 100%;
  }
`

const SubmitButton = styled.button`
  border: 0 none;
  outline: none;
  padding: 15px 30px;
  background-color: ${theme.colors.green};
  color: #fff;
  margin: 0 auto;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
`

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    const end = moment("2020-06-01")
    const dates = {}

    for (
      let start = moment("2020-01-06");
      start.isBefore(end);
      start.add(1, "days")
    ) {
      if (start.day() === 5 || start.day() === 6) {
        const month = start.format("MMMM")
        if (!Array.isArray(dates[month])) {
          dates[month] = []
        }
        dates[month].push(start.clone())
      }
    }

    this.state = {
      dates,
      selectedDates: [],
      name: null,
      additionalMessage: null,
      isSubmitting: false,
    }
  }

  render() {
    const { dates, isSubmitting } = this.state

    return (
      <StaticQuery
        query={graphql`
          query {
            doodleScoredEntries {
              scores {
                score
                timeStamp
              }
            }
          }
        `}
        render={data => {
          const { scores } = data.doodleScoredEntries
          return (
            <Layout>
              <SEO title="Lanit millo?" />
              <PageWrapper>
                <CenteredImageWrapper>
                  <h1>Lanit millo?</h1>
                  <img
                    src="https://media.giphy.com/media/l2SpW34J18fYgHdRe/giphy.gif"
                    alt="Party"
                  />
                </CenteredImageWrapper>
                <SectionWrapper>
                  {Object.keys(dates).map(key =>
                    this.renderMonth(key, dates, scores)
                  )}
                </SectionWrapper>
                <SectionWrapper>
                  <FormGroup>
                    <label>Nick</label>
                    <TextInput
                      type="text"
                      name="name"
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </SectionWrapper>
                <SectionWrapper>
                  <FormGroup>
                    <label>Mitä pelataa</label>
                    <TextArea
                      name="additionalMessage"
                      onChange={this.handleInputChange}
                    ></TextArea>
                  </FormGroup>
                </SectionWrapper>
                {!isSubmitting && (
                  <SectionWrapper className="centered">
                    <SubmitButton type="button" onClick={this.onSubmit}>
                      Lähetä
                    </SubmitButton>
                  </SectionWrapper>
                )}
              </PageWrapper>
            </Layout>
          )
        }}
      />
    )
  }

  onSubmit = async _ => {
    const { selectedDates, name, additionalMessage } = this.state

    if (!!!name || !selectedDates.length) {
      alert("Maybe gimme ya name and select sum dates!")
      return false
    }

    this.setState({ isSubmitting: true })

    const code = process.env.GATSBY_FUNCTION_CODE
    const partition = process.env.GATSBY_PARTITION
    const response = await postRequest(
      `InsertAnswer?code=${code}&partition=${partition}`,
      {
        name,
        additionalMessage,
        selectedDates,
      }
    )

    if (response.ok) {
      navigate("/confirmation")
    } else {
      navigate("/500")
    }
  }

  handleInputChange = event => {
    const { value, name } = event.target
    this.setState({ [name]: value })
  }

  renderMonth = (month, dates, scores) => (
    <div key={month}>
      <h1>{month}</h1>
      <div>
        {dates[month].map((d, i) => this.renderDatePicker(d, i, scores))}
      </div>
    </div>
  )

  renderDatePicker = (date, index, scores) => {
    const scoreItem = scores.find(
      s => s.timeStamp === date.format("YYYY-MM-DDT00:00:00")
    )
    const score = !!scoreItem ? scoreItem.score * 100 : null
    return (
      <InputGroup
        className={date.format("ddd") === "Sat" ? "add-margin" : ""}
        key={index}
      >
        <ScoreWrapper title="Percentage of users voted this date!">
          {!!score ? `${score} %` : ""}
        </ScoreWrapper>
        <label>
          <input
            type="checkbox"
            value={date.format("YYYY-MM-DD")}
            onChange={this.handleCheckboxChange}
          />{" "}
          {date.format("ddd, DD.MM.YYYY")}
        </label>
      </InputGroup>
    )
  }

  handleCheckboxChange = event => {
    const { value } = event.target
    const { selectedDates } = this.state
    const index = selectedDates.indexOf(value)
    if (index > -1) {
      selectedDates.splice(index, 1)
    } else {
      selectedDates.push(value)
    }
    this.setState({ selectedDates })
  }
}

export default IndexPage
