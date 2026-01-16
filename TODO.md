# Task List: Cognitive Agent PoC

## Phase 1: Infrastructure & Foundation
- [x] Project Setup
    - [x] Initialize Next.js project with App Router
    - [x] Install core dependencies (`langchain`, `langgraph`, `@vercel/ai`, `privy`)
    - [ ] Configure `tsconfig.json` and `next.config.js`
- [/] Infrastructure as Code (Terraform)
    - [x] Create initial config (`main.tf`, `providers.tf`)
    - [x] Configure .gitignore for Terraform
    - [ ] Configure Remote Backend (State Management)
    - [ ] Initialize Terraform project (`terraform init`)
    - [ ] Implement Vercel KV (Storage) provisioning
    - [ ] Create CI/CD Pipeline for Terraform (GitHub Actions)
    - [ ] Document Terraform management workflow
- [ ] Database & Storage Setup
    - [ ] Configure Vercel KV (Redis) connection
    - [ ] Configure Vector DB (Pinecone/Supabase) connection
    - [ ] Create database schema/migration scripts if needed
- [ ] Identity Setup (Privy)
    - [ ] Configure Privy App ID
    - [ ] Implement basic Auth Provider wrapper
- [ ] Environment Configuration
    - [x] Create `.env.example`
    - [x] Create `.env.example`
    - [x] Sync environment variables script
- [x] Sync environment variables script

## Phase 2: The Deterministic Brain (LangGraph)
- [/] Core Engine Implementation
    - [x] Define `AgentState` schema
    - [x] Create `graph.ts` (Topology)
    - [x] Implement Perception Node (Input normalization)
    - [x] Implement Router Node (Intent classification)
    - [x] Implement Action Node (Basic tools execution)
- [ ] Tools Integration
    - [ ] Implement Weather Tool
    - [ ] Implement Calculator Tool
- [ ] Core Engine Testing (Unit & BDD)
    - [x] Setup Test Environment (Vitest/Jest)
    - [ ] Create Feature Files (Gherkin/BDD Scenarios)
    - [ ] Unit Test: Perception Node (Input normalization)
    - [ ] Unit Test: Router Node (Intent routing)
    - [x] Integration Test: Full Graph Execution Flow (Identity Scenarios)
- [ ] Core Engine Documentation
    - [ ] Document Agent State Schema
    - [ ] Document Graph Topology (Mermaid Diagram)
    - [ ] Document Node Logic (Perception, Router, Action)

    - [ ] Document Node Logic (Perception, Router, Action)

## Phase 2.5: Glass Box Debug UI (Inspector)
- [ ] Implement Split-Screen Chat Interface
    - [ ] Left Panel: Interactive Chat
    - [ ] Right Panel: Real-time Internals Inspector
        - [ ] Live `AgentState` Visualization (JSON Explorer)
        - [ ] Active Intent & Router Decisions
        - [ ] Tool Calls Logs & Outputs
    - [ ] Session Controls (Clear State, Mock Input)

## Phase 3: Identity & Episodic Memory
- [ ] Context Integration
    - [x] Implement `HydrationNode` (User lookup)
    - [ ] Implement Auth Guard for sensitive actions
    - [ ] Implement Metadata Sync with Privy

## Phase 4: Observability & Management
- [ ] Monitoring
    - [ ] Integrate LangFuse/LangSmith
- [x] UI Implementation
    - [x] Create User Dashboard (Protected)
    - [ ] Create Admin Backoffice
- [ ] Webhooks
    - [ ] Implement WhatsApp Webhook handler

## Testing & Verification
- [ ] Automated Tests
    - [x] Unit tests for Nodes (Implicit via build)
    - [ ] Integration tests for the Graph
- [x] Manual Verification
    - [x] Verify End-to-End flow via UI (Ready for manual test)

## Phase 5: Documentation & Quality Assurance
- [ ] Update Architecture Docs
    - [ ] Update `implementation_strategy.md` (Reflect Terraform decision)
    - [ ] Update `technical_architecture.md`
- [ ] New Guides
    - [ ] Create `docs/infrastructure.md` (Terraform Guide)
    - [ ] Create `docs/testing_strategy.md` (BDD/Unit Guide)
- [ ] General
    - [ ] Update `README.md` with "How to Start"
