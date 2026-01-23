# Feature: Currency Exchange (US04)

## Description
As a user, I want to check currency exchange rates so that I can plan my finances.

## User Story
**US04**: Check Currency Rates
- **Actor**: Authenticated User
- **Goal**: Retrieve current exchange rates for major currencies (USD, EUR) to BRL.
- **Pre-conditions**: User is logged in (identified).

## Functional Requirements
1. The agent must recognize intents related to "currency", "exchange", "dollar", "euro".
2. The agent must use a `currencyTool` to fetch rates.
3. The system currently mocks the rates for stability.

## Acceptance Criteria (BDD)

### Scenario 1: User asks for Dollar rate
**Given** the user is authenticated
**When** the user says "Quanto tá o dólar?"
**Then** the agent should respond with the current USD to BRL rate.

### Scenario 2: User asks for Euro rate
**Given** the user is authenticated
**When** the user says "Qual a cotação do Euro?"
**Then** the agent should respond with the current EUR to BRL rate.
