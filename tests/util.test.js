import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
  generateInviteToken,
} from "../lib/util.js";

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = "test_access_secret";
  process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
});

test("generateAccessToken -> payload contains userId", () => {
  const token = generateAccessToken({ id: 123 });
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  expect(decoded.userId).toBe(123);
  expect(typeof decoded.exp).toBe("number");
});

test("generateRefreshToken -> payload contains userId and refreshTokenId", () => {
  const token = generateRefreshToken({ id: 45 }, "rt-id-1");
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  expect(decoded.userId).toBe(45);
  expect(decoded.refreshTokenId).toBe("rt-id-1");
  expect(typeof decoded.exp).toBe("number");
});

test("generateInviteToken -> payload contains groupId", () => {
  const token = generateInviteToken("group-abc");
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  expect(decoded.groupId).toBe("group-abc");
  expect(typeof decoded.exp).toBe("number");
});
