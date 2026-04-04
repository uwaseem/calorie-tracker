import { describe, it, expect, beforeEach, afterEach } from "vitest"

import { getEnvValue } from "../../../src/config/env.js"

const ORIGINAL_ENV = process.env

describe("getEnvValue", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  describe("when the environment variable is not defined", () => {
    it("should throw an error", () => {
      delete process.env.TEST_VARIABLE

      expect(() => getEnvValue("TEST_VARIABLE")).toThrow(
        "Environment variable TEST_VARIABLE is not defined"
      )
    })
  })

  describe("when the environment variable is defined", () => {
    it("should return the value of the environment variable", () => {
      process.env.TEST_VARIABLE = "test_value"

      const value = getEnvValue("TEST_VARIABLE")
      expect(value).toBe("test_value")
    })
  })
})