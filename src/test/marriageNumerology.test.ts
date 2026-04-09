import { describe, it, expect } from "vitest";
import { analyzeMarriage, NUMBER_ELEMENT, ELEMENT_COMPAT, kuaGroup } from "@/lib/marriageNumerology";

describe("Marriage Numerology Engine", () => {
  it("calculates correct moolank/bhagyank for both partners", () => {
    const r = analyzeMarriage("Rajesh", "1997-04-18", "male", "Priya", "1998-06-25", "female");
    expect(r.personA.moolank).toBe(9); // 1+8=9
    expect(r.personA.bhagyank).toBe(3); // 39→12→3
    expect(r.personB.moolank).toBe(7); // 2+5=7
    expect(r.personB.bhagyank).toBe(4); // 31→4
  });

  it("returns overall score between 0 and 100", () => {
    const r = analyzeMarriage("A", "1990-01-15", "male", "B", "1992-03-20", "female");
    expect(r.overallScore).toBeGreaterThanOrEqual(0);
    expect(r.overallScore).toBeLessThanOrEqual(100);
  });

  it("assigns correct elements to numbers", () => {
    expect(NUMBER_ELEMENT[1]).toBe("Fire");
    expect(NUMBER_ELEMENT[2]).toBe("Water");
    expect(NUMBER_ELEMENT[5]).toBe("Earth");
    expect(NUMBER_ELEMENT[4]).toBe("Air");
  });

  it("correctly identifies Kua groups", () => {
    expect(kuaGroup(1)).toBe("East");
    expect(kuaGroup(2)).toBe("West");
    expect(kuaGroup(9)).toBe("East");
    expect(kuaGroup(6)).toBe("West");
  });

  it("generates recommendations and warnings", () => {
    const r = analyzeMarriage("Sun", "1990-01-01", "male", "Saturn", "1990-08-08", "female");
    // 1 vs 8 are enemies
    expect(r.warnings.length).toBeGreaterThan(0);
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  it("calculates grid overlap correctly", () => {
    const r = analyzeMarriage("A", "1990-01-15", "male", "B", "1992-03-20", "female");
    expect(r.gridOverlap.shared).toBeDefined();
    expect(r.gridOverlap.complement).toBeGreaterThanOrEqual(0);
    expect(r.gridOverlap.complement).toBeLessThanOrEqual(100);
  });

  it("provides score label", () => {
    const r = analyzeMarriage("A", "1990-01-15", "male", "B", "1992-03-20", "female");
    expect(["Excellent", "Good", "Average", "Challenging"]).toContain(r.scoreLabel);
  });
});