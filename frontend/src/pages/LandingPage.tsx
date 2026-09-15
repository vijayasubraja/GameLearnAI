import React from 'react';
import { LaunchHero } from '../components/landing/LaunchHero';
import { AdaptiveJourney } from '../components/landing/AdaptiveJourney';
import { AdaptiveLoop } from '../components/landing/AdaptiveLoop';
import { AdaptiveComparison } from '../components/landing/AdaptiveComparison';
import { SimulationShowcase } from '../components/landing/SimulationShowcase';
import { BehaviourVisualization } from '../components/landing/BehaviourVisualization';
import { SkillWorlds } from '../components/landing/SkillWorlds';
import { CTASection } from '../components/landing/CTASection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* 1. Launch Hero with 3D Simulation Canvas & "Enter the Simulation" */}
      <LaunchHero />

      {/* 2. 5-Stage Adaptive Methodology (Assess -> Predict -> Simulate -> Observe -> Adapt) */}
      <AdaptiveJourney />

      {/* 3. The Continuous Intelligence Feedback Loop */}
      <AdaptiveLoop />

      {/* 4. "The World Changes With You" - Dynamic Skill Slider Demonstration */}
      <AdaptiveComparison />

      {/* 5. 3D WebGL Simulation Showcase */}
      <SimulationShowcase />

      {/* 6. Behaviour Telemetry Streamer: Actions Become Intelligence */}
      <BehaviourVisualization />

      {/* 7. 7 Real-Life Skill Worlds Mission Navigator */}
      <SkillWorlds />

      {/* 8. Protocol Ready Call to Action */}
      <CTASection />

      {/* 9. Technical HUD Footer */}
      <LandingFooter />
    </div>
  );
};
