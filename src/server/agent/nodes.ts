import { AgentState } from './state';
import { AIMessage } from '@langchain/core/messages';
import { getUserProfile } from './services/userStore';

// Node: Hydration (Identity First)
export async function hydrationNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  console.log('Hydration Node: Resolving identity...');
  const userId = state.userId || 'anonymous';
  let profile = await getUserProfile(userId);

  if (!profile) {
    console.log(`User ${userId} not found. Creating transient profile.`);
    profile = {
      id: userId,
      name: 'Visitor',
      preferences: {},
    };
  } else {
    console.log(`User ${userId} recognized as ${profile.name}.`);
    if (profile.lastConversationContext) {
      console.log(
        `Audit: Loaded long-term memory context for user ${userId}: "${profile.lastConversationContext}"`
      );
    }
  }

  return {
    userProfile: profile,
    lastActive: Date.now(),
  };
}

// Node: Perception
export async function perceptionNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  console.log(
    `Perception Node: Processing input for ${state.userProfile?.name}...`
  );
  // Here we could normalize input, check safety, etc.
  return { lastActive: Date.now() };
}

// Node: Router (Intent Classification)
export async function routerNode(state: AgentState) {
  const lastMessage = state.messages[state.messages.length - 1];
  const content = lastMessage.content.toString().toLowerCase();

  console.log('Router Node: Deciding next step for:', content);

  if (content.includes('clima') || content.includes('weather')) {
    return 'action';
  }

  if (content.includes('transfer')) {
    return 'security';
  }

  // Default to responding directly (or handoff to LLM generation node)
  return 'response';
}

// Node: Security (US02)
export async function securityNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  console.log('Security Node: Checking verification status...');
  // In a real app, this might check a biometric token or session flag
  // For this POC, we rely on the state.isVerified flag
  const isVerified = state.isVerified === true;

  const outcome = isVerified ? 'approved' : 'denied';
  console.log(
    `Audit: Security Check. User: ${state.userProfile?.id}. Verified: ${isVerified}. Outcome: ${outcome}`
  );

  return {
    securityOutcome: outcome,
  };
}

// Node: Action (Tools)
export async function actionNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  console.log('Action Node: Executing tool...', state.sessionId);
  // Simulation of a tool execution
  return {
    // We would append a ToolMessage here
    messages: [new AIMessage('Tool execution simulated.')],
  };
}

// Node: Agent (Response Generation)
export async function agentNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  console.log('Agent Node: Generating response...');

  // Check for security denial
  if (state.securityOutcome === 'denied') {
    return {
      messages: [
        new AIMessage(
          'Access denied. You need to perform strong authentication (biometrics) to proceed with this action.'
        ),
      ],
    };
  }

  const lastUserMsg = state.messages[state.messages.length - 1].content;
  const name = state.userProfile?.name || 'User';

  return {
    messages: [
      new AIMessage(
        `Hello ${name}. I am the Cognitive Agent. I received your message: "${lastUserMsg}".`
      ),
    ],
  };
}
