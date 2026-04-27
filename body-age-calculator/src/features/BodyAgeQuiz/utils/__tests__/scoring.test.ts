import { describe, it, expect } from 'vitest'
import { calculateBodyAge, getVerdict, getHabitResults } from '../scoring'

describe('calculateBodyAge', () => {
  it('adds positive scores to chronological age', () => {
    const answers = [3, 3, 3, 3, 3, 3, 3, 3, 3]
    expect(calculateBodyAge(30, answers)).toBe(45)
  })

  it('subtracts negative scores from chronological age', () => {
    const answers = [-2, -2, -2, -2, -2, -2, -2, -2, -2]
    expect(calculateBodyAge(30, answers)).toBe(18)
  })

  it('never goes below 18 even if age is low', () => {
    const answers = [-2, -2, -2, -2, -2, -2, -2, -2, -2]
    expect(calculateBodyAge(20, answers)).toBe(18)
  })

  it('calculates mixed scores correctly', () => {
    const answers = [-2, -1, -2, -1, -2, -1, -2, -1, -2]
    expect(calculateBodyAge(35, answers)).toBe(21)
  })

  it('returns exact age when all scores are zero-balanced', () => {
    const answers = [-2, 3, -2, 3, -2, 3, -2, 3, -2]
    expect(calculateBodyAge(40, answers)).toBe(38)
  })
})

describe('getVerdict', () => {
  it('returns fine wine message when 5+ years younger', () => {
    expect(getVerdict(40, 34)).toContain('fine wine')
  })

  it('returns younger message when 1-4 years younger', () => {
    expect(getVerdict(40, 37)).toContain('younger')
  })

  it('returns on track message when same age', () => {
    expect(getVerdict(40, 40)).toContain('track')
  })

  it('returns room to grow message when 1-4 years older', () => {
    expect(getVerdict(40, 43)).toContain('room')
  })

  it('returns love message when 5+ years older', () => {
    expect(getVerdict(40, 46)).toContain('love')
  })
})

describe('getHabitResults', () => {
  it('returns green for scores <= -1', () => {
    const results = getHabitResults([-2, -1, 2, 3, -2, -1, 2, 3, -2])
    expect(results[0].type).toBe('green')
    expect(results[1].type).toBe('green')
  })

  it('returns red for scores >= +2', () => {
    const results = getHabitResults([-2, -1, 2, 3, -2, -1, 2, 3, -2])
    expect(results[2].type).toBe('red')
    expect(results[3].type).toBe('red')
  })
})
