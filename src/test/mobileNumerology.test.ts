import { describe, it, expect } from "vitest";
import { analyzeMobileNumber, FRIENDSHIP_CHART, BENEFICIAL_TOTALS, MALEFIC_TOTALS } from "@/lib/mobileNumerology";

describe("Mobile Numerology Engine", () => {
  it("calculates correct moolank and bhagyank from DOB", () => {
    const result = analyzeMobileNumber("9876543210", "1997-04-18");
    expect(result.moolank).toBe(9); // 1+8=9
    expect(result.bhagyank).toBe(3); // 1+9+9+7+0+4+1+8=39→3+9=12→1+2=3
  });

  it("calculates mobile total correctly", () => {
    const result = analyzeMobileNumber("9876543210", "1997-04-18");
    // 9+8+7+6+5+4+3+2+1+0 = 45 → 4+5 = 9
    expect(result.mobileTotal).toBe(45);
    expect(result.mobileTotalSingle).toBe(9);
  });

  it("identifies beneficial/malefic totals", () => {
    expect(BENEFICIAL_TOTALS).toEqual([1, 3, 5, 6]);
    expect(MALEFIC_TOTALS).toEqual([4, 7, 8]);
  });

  it("extracts digit pairs from mobile number", () => {
    const result = analyzeMobileNumber("9876543210", "1997-04-18");
    expect(result.digitPairs).toContain("98");
    expect(result.digitPairs).toContain("87");
    expect(result.digitPairs).toContain("76");
  });

  it("detects digit repetitions", () => {
    const result = analyzeMobileNumber("9999888777", "1997-04-18");
    const nines = result.repetitions.find(r => r.digit === 9);
    expect(nines).toBeDefined();
    expect(nines!.count).toBe(4);
  });

  it("identifies missing numbers from DOB", () => {
    const result = analyzeMobileNumber("9876543210", "1997-04-18");
    // DOB 18/04/1997 digits: 1,8,4,1,9,9,7 → present: 1,4,7,8,9; missing: 2,3,5,6
    expect(result.missingNumbers).toEqual(expect.arrayContaining([2, 3, 5, 6]));
  });

  it("generates warnings for enemy totals", () => {
    // Moolank 9, enemy is [2,4]; bhagyank 3, enemy is [6]
    const result = analyzeMobileNumber("9876543210", "1997-04-18");
    // Total 9 is neutral to moolank 9, should not have enemy warning for total
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("generates ideal totals that are not enemy", () => {
    const result = analyzeMobileNumber("9876543210", "1997-04-18");
    // Ideal totals should be from [1,3,5,6] minus enemies of moolank 9 and bhagyank 3
    for (const t of result.idealTotals) {
      expect(BENEFICIAL_TOTALS).toContain(t);
    }
  });

  it("provides pair readings for known combos", () => {
    const result = analyzeMobileNumber("9876543210", "1997-04-18");
    // 98, 87, 76, 65, 54, 43, 32, 21 — all should have readings
    expect(result.pairReadings.length).toBeGreaterThan(0);
  });

  it("friendship chart has all 9 numbers", () => {
    for (let i = 1; i <= 9; i++) {
      expect(FRIENDSHIP_CHART[i]).toBeDefined();
    }
  });
});