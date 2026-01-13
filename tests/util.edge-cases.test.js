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

describe("Token Generation - Edge Cases", () => {
  test("generateAccessToken with string userId", () => {
    const token = generateAccessToken({ id: "user-abc" });
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    expect(decoded.userId).toBe("user-abc");
  });

  test("generateAccessToken with zero userId", () => {
    const token = generateAccessToken({ id: 0 });
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    expect(decoded.userId).toBe(0);
  });

  test("generateRefreshToken with empty string refreshTokenId", () => {
    const token = generateRefreshToken({ id: 1 }, "");
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    expect(decoded.refreshTokenId).toBe("");
  });

  test("generateInviteToken with numeric groupId", () => {
    const token = generateInviteToken(999);
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    expect(decoded.groupId).toBe(999);
  });

  test("generated tokens should expire at different times", () => {
    const accessToken = generateAccessToken({ id: 1 });
    const refreshToken = generateRefreshToken({ id: 1 }, "rt-1");

    const accessDecoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
    const refreshDecoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Refresh token should expire later than access token (7d vs 60m)
    expect(refreshDecoded.exp).toBeGreaterThan(accessDecoded.exp);
  });
});

describe("Token Verification", () => {
  test("should reject token with wrong secret", () => {
    const token = generateAccessToken({ id: 123 });

    expect(() => {
      jwt.verify(token, "wrong_secret");
    }).toThrow();
  });

  test("should reject expired token", () => {
    const expiredToken = jwt.sign(
      { userId: 123 },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "-1s" }
    );

    expect(() => {
      jwt.verify(expiredToken, process.env.JWT_ACCESS_SECRET);
    }).toThrow("jwt expired");
  });

  test("should accept token within expiry time", () => {
    const token = jwt.sign({ userId: 123 }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    expect(decoded.userId).toBe(123);
  });
});
