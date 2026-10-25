import { describe, it, expect } from 'vitest';
import { getOfficeState, setCyberpunkLightsOff } from '../../workspace/backend/src/office.service';

describe('REQ-002: Virtual 3D Office State & 10 AI Agent Telemetry', () => {
  it('returns valid office state with exactly 10 AI agents (REQ-002)', () => {
    const state = getOfficeState();
    expect(state.agents.length).toBe(10);

    const techAgents = state.agents.filter((a) => a.division === 'TECH_FACTORY');
    const bizAgents = state.agents.filter((a) => a.division === 'BIZ_OPS');
    expect(techAgents.length).toBe(6);
    expect(bizAgents.length).toBe(4);
  });

  it('provides 3D coordinates and toggles Cyberpunk Lights Off mode (REQ-002)', () => {
    setCyberpunkLightsOff(true);
    const nightState = getOfficeState();
    expect(nightState.cyberpunkLightsOff).toBe(true);

    const architect = nightState.agents.find((a) => a.agentCode === '00-chief-architect');
    expect(architect).toBeDefined();
    expect(architect?.position.x).toBe(-4.0);
    expect(architect?.position.z).toBe(3.0);
  });
});
