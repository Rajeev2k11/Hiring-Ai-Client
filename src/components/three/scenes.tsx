"use client";

import { Stage } from "./Stage";
import { CandidateAvatar, CompanyTower, PricingGem } from "./models";

export function PricingScene({ className }: { className?: string }) {
  return (
    <Stage className={className} camera={{ position: [0, 0, 4.6], fov: 45 }}>
      <PricingGem />
    </Stage>
  );
}

export function CompanyScene({ className }: { className?: string }) {
  return (
    <Stage className={className} camera={{ position: [3.2, 1.2, 4.2], fov: 45 }}>
      <CompanyTower />
    </Stage>
  );
}

export function CandidateScene({ className }: { className?: string }) {
  return (
    <Stage className={className} camera={{ position: [0, 0.3, 4.4], fov: 45 }}>
      <CandidateAvatar />
    </Stage>
  );
}
