import { describe, expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Player from '@/app/player/page';

const add = (a: number, b: number) => {
  return a + b;
};

describe("test add function", () => {
  test("should add two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });

  test("should work with 0", () => {
    expect(add(14, 0)).toBe(14);
  })

  test("should work with just 0's", () => {
    expect(add(0, 0)).toBe(0);
  })

  test("should work with negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
  })

  test("should work with negative and positive numbers", () => {
    expect(add(-1, 2)).toBe(1);
  })

  test("should work with negative and postive numbers", () => {
    expect(add(1, -2)).toBe(-1);
  })
})