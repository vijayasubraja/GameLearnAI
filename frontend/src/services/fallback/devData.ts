/**
 * DEVELOPMENT FALLBACK DATA
 * -----------------------------------------------------------------------------
 * This module exists ONLY so the frontend can be developed and demonstrated
 * while the corresponding FastAPI endpoints are not yet implemented.
 *
 * It is:
 *  - Gated behind the environment flag `VITE_ENABLE_DEV_FALLBACK=true`
 *  - Never used when the real API responds
 *  - Marked at runtime so the UI can display a "development preview" badge
 *  - NOT authoritative — the backend remains the source of truth
 *
 * When the backend endpoints land, delete this module and the fallback branch
 * in the service layer. Do not treat anything here as production data.
 * -----------------------------------------------------------------------------
 */
import type {
  CoachRecommendation,
  DashboardPayload,
  DifficultyLevel,
  PerformanceResult,
  ProgressHistoryPayload,
  Scenario,
  SimulationCompleteResponse,
  SimulationEventPayload,
  SimulationStartResponse,
  SkillCategoryKey,
  SkillInfo,
  SkillLevel,
} from '../../types/domain';

export const DEV_FALLBACK = Symbol('gamelearn.devFallback');

export const DEV_FALLBACK_ENABLED = import.meta.env.VITE_ENABLE_DEV_FALLBACK === 'true';

export function markDev<T extends object>(data: T): T {
  try {
    Object.defineProperty(data, DEV_FALLBACK, { value: true, enumerable: false, configurable: true });
  } catch {
    /* no-op */
  }
  return data;
}

export function isDevFallback(data: unknown): boolean {
  return !!(
    data &&
    typeof data === 'object' &&
    (data as Record<PropertyKey, unknown>)[DEV_FALLBACK]
  );
}

const SKILLS: Record<SkillCategoryKey, { level: SkillLevel; progress: number }> = {
  road_safety: { level: 'Intermediate', progress: 46 },
  public_transport: { level: 'Beginner', progress: 22 },
  money_management: { level: 'Intermediate', progress: 58 },
  shopping_transactions: { level: 'Advanced', progress: 74 },
  communication: { level: 'Beginner', progress: 15 },
  workplace: { level: 'Beginner', progress: 9 },
  emergency_safety: { level: 'Intermediate', progress: 38 },
};

const SCENARIOS: Scenario[] = [
  {
    id: 'road-safety-pedestrian-crossing-basic',
    title: 'Urban Pedestrian Crossing',
    description: 'Cross a busy two-lane road safely at a signaled crosswalk.',
    skill_category: 'road_safety',
    skill_name: 'Road & Pedestrian Safety',
    difficulty_level: 'Easy',
    estimated_duration_minutes: 5,
    objective: 'Reach the opposite sidewalk safely without entering traffic at the wrong time.',
    real_world_context:
      'Every day pedestrians cross signaled intersections. Reading the signal, checking traffic, and committing only when safe prevents the majority of urban pedestrian incidents.',
    skills_tested: ['Look left / right before stepping off', 'Obey pedestrian signals', 'Cross without distraction'],
    controls: ['WASD / Arrow keys to move', 'L to look left, R to look right', 'E to press the crossing button'],
    success_conditions: [
      'Press the pedestrian signal button',
      'Look left and right before entering the crosswalk',
      'Reach the opposite sidewalk without a close-call event',
    ],
    failure_conditions: [
      'Stepping onto the road while the signal is red',
      'Entering the crosswalk within a danger zone of an approaching vehicle',
      'Failing to look before entering the road',
    ],
    availability: 'available',
    is_recommended: false,
    environment_config: { traffic_density: 'low', has_signal: true, lanes: 2 },
  },
  {
    id: 'road-safety-unmarked-crossing-intermediate',
    title: 'Unmarked Road Crossing',
    description: 'Judge a safe gap and cross a road with no traffic signals.',
    skill_category: 'road_safety',
    skill_name: 'Road & Pedestrian Safety',
    difficulty_level: 'Medium',
    estimated_duration_minutes: 6,
    objective: 'Identify a safe gap in traffic and cross an unmarked road without rushing.',
    real_world_context:
      'Not every road has a signal or a crosswalk. Choosing the right moment and confirming both directions is a core safety judgment.',
    skills_tested: ['Gap assessment', 'Two-way traffic scanning', 'Patience and timing'],
    controls: ['WASD / Arrow keys to move', 'L to look left, R to look right'],
    success_conditions: ['Wait until the gap is clearly safe', 'Look both ways before crossing', 'Cross without hesitation or close calls'],
    failure_conditions: ['Darting across with a vehicle close', 'Crossing without scanning both directions'],
    availability: 'available',
    is_recommended: true,
    environment_config: { traffic_density: 'medium', has_signal: false, lanes: 2 },
  },
  {
    id: 'road-safety-high-traffic-advanced',
    title: 'High-Density Junction',
    description: 'Navigate a multi-lane junction with heavy traffic and turning vehicles.',
    skill_category: 'road_safety',
    skill_name: 'Road & Pedestrian Safety',
    difficulty_level: 'Hard',
    estimated_duration_minutes: 8,
    objective: 'Cross a multi-lane junction safely, accounting for turning vehicles and cycle lanes.',
    real_world_context:
      'Complex junctions combine traffic lights, turning vehicles, and cyclists. Awareness of blind spots and lane priorities is essential.',
    skills_tested: ['Turning-vehicle awareness', 'Multiple-lane scanning', 'Signal patience'],
    controls: ['WASD / Arrow keys to move', 'L to look left, R to look right'],
    success_conditions: ['Cross within the green phase', 'Scan all lanes including turning traffic', 'Avoid cyclists and blind spots'],
    failure_conditions: ['Stepping out in front of a turning vehicle', 'Ignoring cycle lane traffic'],
    availability: 'locked',
    is_recommended: false,
    environment_config: { traffic_density: 'high', has_signal: true, lanes: 4 },
  },
  {
    id: 'public-transport-route-planning-basic',
    title: 'Bus Route Planning',
    description: 'Plan a multi-stop bus journey and board the correct service.',
    skill_category: 'public_transport',
    skill_name: 'Public Transportation',
    difficulty_level: 'Easy',
    estimated_duration_minutes: 5,
    objective: 'Identify the correct bus line, board at the right stop, and ride to the destination.',
    real_world_context:
      'Public transport journeys require reading maps, checking line numbers, and confirming the stop. Misreading a route is a common first-traveler error.',
    skills_tested: ['Reading route information', 'Identifying the correct stop', 'Confirming direction of travel'],
    controls: ['WASD / Arrow keys to move', 'E to interact'],
    success_conditions: ['Select the correct line', 'Board the correct bus', 'Alight at the destination stop'],
    failure_conditions: ['Boarding a wrong-direction service', 'Alighting at the wrong stop'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
  {
    id: 'public-transport-disruption-intermediate',
    title: 'Service Disruption Response',
    description: 'Adapt your route when a service is cancelled mid-journey.',
    skill_category: 'public_transport',
    skill_name: 'Public Transportation',
    difficulty_level: 'Medium',
    estimated_duration_minutes: 7,
    objective: 'Handle a cancelled service calmly and reach the destination using an alternative route.',
    real_world_context:
      'Disruptions happen. Knowing how to re-plan — checking alternatives, asking staff, and not panicking — separates confident travelers from stranded ones.',
    skills_tested: ['Calm re-planning', 'Asking staff effectively', 'Alternative route selection'],
    controls: ['WASD / Arrow keys to move', 'E to interact'],
    success_conditions: ['Recognize the disruption', 'Ask staff for the alternative', 'Complete the journey'],
    failure_conditions: ['Ignoring the announcement and waiting forever', 'Choosing an unverified route'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
  {
    id: 'money-budget-planning-basic',
    title: 'Monthly Budget Builder',
    description: 'Create a balanced monthly budget from a set of income and expenses.',
    skill_category: 'money_management',
    skill_name: 'Money Management',
    difficulty_level: 'Easy',
    estimated_duration_minutes: 6,
    objective: 'Assign income to essential, savings, and discretionary categories so the budget balances.',
    real_world_context:
      'A working budget is the foundation of financial independence. Allocating income before spending prevents debt and builds savings habits.',
    skills_tested: ['Categorizing expenses', 'Prioritizing essentials', 'Balancing a budget'],
    controls: ['Mouse click to select', 'Drag to allocate categories'],
    success_conditions: ['Cover all essentials first', 'Set aside at least 10% savings', 'End with a balanced budget'],
    failure_conditions: ['Overspending discretionary before essentials', 'Ending in a deficit'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
  {
    id: 'money-payment-trouble-intermediate',
    title: 'Overcharged Bill Dispute',
    description: 'Identify an incorrect charge and resolve it with the billing department.',
    skill_category: 'money_management',
    skill_name: 'Money Management',
    difficulty_level: 'Medium',
    estimated_duration_minutes: 7,
    objective: 'Notice the overcharge, gather evidence, and successfully request a correction.',
    real_world_context:
      'Billing errors are common. Checking statements and disputing errors politely but firmly protects personal finances.',
    skills_tested: ['Statement scrutiny', 'Documented evidence', 'Assertive communication'],
    controls: ['Mouse click to select', 'Text prompts with options'],
    success_conditions: ['Spot the wrong charge', 'Reference the correct amount in the call', 'Receive a correction confirmation'],
    failure_conditions: ['Agreeing to an offer without a written record', 'Confronting with no evidence'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
  {
    id: 'shopping-price-comparison-basic',
    title: 'Price Comparison Shopping',
    description: 'Compare unit prices and choose the best value product.',
    skill_category: 'shopping_transactions',
    skill_name: 'Shopping & Transactions',
    difficulty_level: 'Easy',
    estimated_duration_minutes: 5,
    objective: 'Find the lowest unit price while meeting the shopping list requirements.',
    real_world_context:
      'Unit pricing reveals hidden cost differences. Comparing per-unit cost rather than package size saves money consistently.',
    skills_tested: ['Reading unit prices', 'Comparing value', 'Checking receipt accuracy'],
    controls: ['Mouse click to select'],
    success_conditions: ['Select the best unit value', 'Verify the receipt total'],
    failure_conditions: ['Choosing a large pack with worse unit price', 'Ignoring receipt errors'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
  {
    id: 'communication-greeting-basic',
    title: 'First Contact Conversation',
    description: 'Open, sustain, and close a short professional conversation.',
    skill_category: 'communication',
    skill_name: 'Communication & Social Interaction',
    difficulty_level: 'Easy',
    estimated_duration_minutes: 5,
    objective: 'Greet, make small talk, and end the conversation on a positive note.',
    real_world_context:
      'First impressions shape opportunities. A simple structure — greeting, safe topic, polite exit — makes conversation approachable.',
    skills_tested: ['Appropriate greetings', 'Active listening', 'Polite closure'],
    controls: ['Mouse click to choose responses'],
    success_conditions: ['Greet with eye contact', 'Respond to the other person’s cues', 'Close with a clear goodbye'],
    failure_conditions: ['Interrupting repeatedly', 'Ending without acknowledgement'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
  {
    id: 'workplace-email-request-intermediate',
    title: 'Professional Email Request',
    description: 'Compose and send a clear, respectful email request to a manager.',
    skill_category: 'workplace',
    skill_name: 'Workplace Skills',
    difficulty_level: 'Easy',
    estimated_duration_minutes: 6,
    objective: 'Draft an email with a clear subject, polite tone, and an explicit, actionable request.',
    real_world_context:
      'Professional email habits — concise subject lines, polite openers, and explicit asks — determine how coworkers respond to requests.',
    skills_tested: ['Clear subject lines', 'Polite professional tone', 'Actionable requests'],
    controls: ['Select from sentence choices', 'Order paragraphs'],
    success_conditions: ['Use a specific subject line', 'State the request explicitly', 'Include a deadline'],
    failure_conditions: ['Vague subject', 'Demanding tone', 'Ambiguous request'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
  {
    id: 'emergency-fire-exit-basic',
    title: 'Building Fire Evacuation',
    description: 'Respond to a fire alarm and evacuate using the safe route.',
    skill_category: 'emergency_safety',
    skill_name: 'Emergency & Safety',
    difficulty_level: 'Easy',
    estimated_duration_minutes: 5,
    objective: 'React to the alarm, follow the exit route, and gather at the assembly point.',
    real_world_context:
      'Under panic, people freeze or follow crowds. Knowing the exit plan and the assembly point is what saves time in a real evacuation.',
    skills_tested: ['Alarm recognition', 'Route memory', 'Calm assembly'],
    controls: ['WASD / Arrow keys to move'],
    success_conditions: ['Act within 5 seconds of the alarm', 'Use the marked exit', 'Reach the assembly point'],
    failure_conditions: ['Using the elevator', 'Stopping to collect belongings'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
  {
    id: 'emergency-first-aid-intermediate',
    title: 'First Response Priority',
    description: 'Prioritize actions correctly at the scene of a minor injury.',
    skill_category: 'emergency_safety',
    skill_name: 'Emergency & Safety',
    difficulty_level: 'Medium',
    estimated_duration_minutes: 7,
    objective: 'Assess the scene, call for help, and apply the correct first-response sequence.',
    real_world_context:
      'Correct prioritization — scene safety first, then help, then care — prevents secondary injury and wasted minutes.',
    skills_tested: ['Scene safety assessment', 'Calling for help', 'Correct care sequence'],
    controls: ['Mouse click to choose the order of actions'],
    success_conditions: ['Check the scene is safe first', 'Call emergency services', 'Apply first aid in the correct order'],
    failure_conditions: ['Treating before assessing safety', 'Panicking and skipping the help call'],
    availability: 'available',
    is_recommended: false,
    environment_config: {},
  },
];

const skillProgress = (): SkillInfo[] =>
  SKILLS_ORDER.map((key) => {
    const record = SKILLS[key];
    const total = SCENARIOS.filter((s) => s.skill_category === key).length;
    const completed = SCENARIOS.filter((s) => s.skill_category === key && s.availability === 'completed').length;
    return {
      skill_id: key,
      name: SKILL_NAMES[key],
      progress: record.progress,
      level: record.level,
      status: record.progress >= 70 ? 'completed' : record.progress > 0 ? 'in_progress' : 'not_started',
      completed_scenarios: completed,
      total_scenarios: total,
      next_action:
        record.progress === 0
          ? 'Start the introductory scenario'
          : record.progress < 70
            ? 'Redo the scenario below your best score'
            : 'Challenge the next difficulty tier',
    };
  });

const SKILLS_ORDER: SkillCategoryKey[] = Object.keys(SKILLS) as SkillCategoryKey[];

const SKILL_NAMES: Record<SkillCategoryKey, string> = {
  road_safety: 'Road & Pedestrian Safety',
  public_transport: 'Public Transportation',
  money_management: 'Money Management',
  shopping_transactions: 'Shopping & Transactions',
  communication: 'Communication & Social Interaction',
  workplace: 'Workplace Skills',
  emergency_safety: 'Emergency & Safety',
};

const starterScenario = SCENARIOS.find((s) => s.id === 'road-safety-pedestrian-crossing-basic')!;
const nextChallenge = SCENARIOS.find((s) => s.id === 'road-safety-unmarked-crossing-intermediate')!;

const COACH: CoachRecommendation = {
  current_focus: 'Road & Pedestrian Safety',
  next_scenario_title: nextChallenge.title,
  actions: [
    {
      kind: 'recommendation',
      title: 'Next recommended scenario',
      message: 'Complete “Unmarked Road Crossing” to practice gap-judgment skills before moving up in difficulty.',
    },
    {
      kind: 'weak_area',
      title: 'Area to strengthen',
      message: 'Look-before-crossing checks dropped your safety score on the last attempt by 12 points.',
    },
    {
      kind: 'practice',
      title: 'Suggested practice',
      message: 'Repeat the Urban Pedestrian Crossing scenario and aim for a safety score above 90 before advancing.',
    },
  ],
};

export const DEV_DASHBOARD: DashboardPayload = markDev({
  learner: {
    name: 'Safari Learner',
    email: 'safari@example.com',
    joined_at: new Date().toISOString(),
  },
  overall_level: 'Intermediate',
  skill_progress: skillProgress(),
  recommended_scenario: nextChallenge,
  learning_streak_days: 4,
  recent_results: [
    {
      attempt_id: 'dev-attempt-001',
      scenario_id: 'road-safety-pedestrian-crossing-basic',
      scenario_title: 'Urban Pedestrian Crossing',
      skill_category: 'road_safety',
      difficulty_level: 'Easy',
      status: 'completed',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 6).toISOString(),
      overall_score: 84,
    },
    {
      attempt_id: 'dev-attempt-002',
      scenario_id: 'money-budget-planning-basic',
      scenario_title: 'Monthly Budget Builder',
      skill_category: 'money_management',
      difficulty_level: 'Easy',
      status: 'completed',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 48 + 1000 * 60 * 7).toISOString(),
      overall_score: 91,
    },
  ],
  next_challenge: nextChallenge,
  coach: COACH,
});

export const DEV_SKILLS: SkillInfo[] = markDev(skillProgress());

export const DEV_SCENARIOS: Scenario[] = markDev(
  SCENARIOS.map((s) => ({ ...s, availability: s.availability }))
);

export const DEV_RECOMMENDED_SCENARIO: Scenario = markDev({ ...nextChallenge });

export const DEV_STARTER_SCENARIO: Scenario = markDev({ ...starterScenario });

export function devScenarioById(id: string): Scenario | undefined {
  const found = SCENARIOS.find((s) => s.id === id);
  return found ? markDev({ ...found }) : undefined;
}

export const DEV_START: SimulationStartResponse = markDev({
  attempt_id: `dev-attempt-${Date.now()}`,
  scenario_id: '',
  started_at: new Date().toISOString(),
  status: 'active',
});

export const DEV_COMPLETE: SimulationCompleteResponse = markDev({
  attempt_id: '',
  status: 'completed',
  completed_at: new Date().toISOString(),
});

export const devResultFor = (attemptId: string, scenario: Scenario, status: 'completed' | 'failed', events: SimulationEventPayload[]): PerformanceResult => {
  // Deterministic dev-only scoring derived from submitted dev events.
  // This is a stand-in ONLY for the not-yet-implemented scoring backend.
  const looked = events.filter((e) => e.event_type === 'LOOK_ACTION' && e.is_safe).length;
  const dangers = events.filter((e) => e.event_type === 'DANGER_PROXIMITY_EVENT' && !e.is_safe).length;
  const safeEnter = events.some((e) => e.event_type === 'ROAD_ENTRY' && e.is_safe);
  const finished = events.some((e) => e.event_type === 'SIMULATION_FINISH');

  const safety = Math.max(30, 100 - dangers * 35 - (safeEnter ? 0 : 15));
  const accuracy = finished ? Math.max(40, 100 - dangers * 20) : 45;
  const decision = looked >= 2 ? 90 : looked === 1 ? 65 : 40;
  const reaction = safeEnter ? 80 : 50;
  const completion = status === 'completed' && finished ? 100 : 0;

  const overall = Math.round(
    accuracy * 0.3 + safety * 0.25 + decision * 0.2 + reaction * 0.1 + completion * 0.1
  );

  const fallback: DifficultyLevel =
    overall >= 85 ? 'Medium' : overall >= 60 ? 'Easy' : 'Easy';

  return markDev({
    attempt_id: attemptId,
    scenario_id: scenario.id,
    scenario_title: scenario.title,
    overall_score: overall,
    accuracy_score: Math.round(accuracy),
    safety_score: Math.round(safety),
    decision_score: Math.round(decision),
    reaction_score: Math.round(reaction),
    completion_score: Math.round(completion),
    mistake_count: dangers,
    completion_status: status === 'completed' && finished ? 'completed' : 'failed',
    successful_actions: [
      ...(safeEnter ? ['Safe road entry'] : []),
      ...(looked >= 2 ? ['Checked both directions'] : []),
      ...(finished ? ['Reached the destination'] : []),
    ],
    mistakes:
      dangers > 0 ? [`Close call with traffic (${dangers}x)`] : safeEnter ? [] : ['Road entry without a safe signal'],
    improvement_tips: [
      dangers > 0
        ? 'Commit to the crossing only when the nearest vehicle is beyond two full seconds away.'
        : 'Keep scanning traffic until you are fully across the road.',
      looked < 2
        ? 'Build a habit of looking left then right before every entry.'
        : 'Maintain your look-both-ways habit even when the signal is green.',
    ],
    next_difficulty: fallback,
    next_scenario_id: 'road-safety-unmarked-crossing-intermediate',
    next_scenario_title: 'Unmarked Road Crossing',
  });
};

export const DEV_PROGRESS: ProgressHistoryPayload = markDev({
  scores_over_time: [
    {
      attempt_id: 'dev-attempt-002',
      scenario_id: 'money-budget-planning-basic',
      scenario_title: 'Monthly Budget Builder',
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      overall_score: 91,
      difficulty_level: 'Easy',
    },
    {
      attempt_id: 'dev-attempt-001',
      scenario_id: 'road-safety-pedestrian-crossing-basic',
      scenario_title: 'Urban Pedestrian Crossing',
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      overall_score: 84,
      difficulty_level: 'Easy',
    },
    {
      attempt_id: 'dev-attempt-000',
      scenario_id: 'shopping-price-comparison-basic',
      scenario_title: 'Price Comparison Shopping',
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      overall_score: 76,
      difficulty_level: 'Easy',
    },
  ],
  skill_progress: skillProgress(),
  difficulty_progression: [
    { completed_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), attempt_id: 'dev-attempt-000', difficulty_level: 'Easy' },
    { completed_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), attempt_id: 'dev-attempt-002', difficulty_level: 'Easy' },
    { completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), attempt_id: 'dev-attempt-001', difficulty_level: 'Easy' },
  ],
  recent_attempts: [
    {
      attempt_id: 'dev-attempt-001',
      scenario_id: 'road-safety-pedestrian-crossing-basic',
      scenario_title: 'Urban Pedestrian Crossing',
      skill_category: 'road_safety',
      difficulty_level: 'Easy',
      status: 'completed',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 6).toISOString(),
      overall_score: 84,
    },
    {
      attempt_id: 'dev-attempt-002',
      scenario_id: 'money-budget-planning-basic',
      scenario_title: 'Monthly Budget Builder',
      skill_category: 'money_management',
      difficulty_level: 'Easy',
      status: 'completed',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      completed_at: new Date(Date.now() - 1000 * 60 * 60 * 48 + 1000 * 60 * 7).toISOString(),
      overall_score: 91,
    },
  ],
  totals: {
    scenarios_completed: 3,
    average_score: 84,
    current_streak_days: 4,
    best_score: 91,
  },
});