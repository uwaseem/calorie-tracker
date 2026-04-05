import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const FIXTURES = path.join(ROOT, "tests", "fixtures")

export function loadTextFixture(filePath: string): string {
  return fs.readFileSync(path.join(FIXTURES, filePath), "utf-8")
}

export function loadImageFixture(filePath: string): Buffer {
  return fs.readFileSync(path.join(FIXTURES, filePath))
}

export function loadJSONFixture<T>(filePath: string): T {
  return JSON.parse(loadTextFixture(filePath)) as T
}

export function getFixturePath(filePath: string): string {
  return path.join(FIXTURES, filePath)
}
