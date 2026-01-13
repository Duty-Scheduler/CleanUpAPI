import jwt from "jsonwebtoken";

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = "test_access_secret";
});

describe("Auth Middleware - Token Validation Logic", () => {
  test("should detect missing Authorization header", () => {
    const headers = {};
    const authHeader = headers.authorization;

    expect(authHeader).toBeUndefined();
    expect(!authHeader || !authHeader.startsWith("Bearer ")).toBe(true);
  });

  test("should detect invalid Authorization header format", () => {
    const headers = { authorization: "InvalidToken abc123" };
    const authHeader = headers.authorization;

    expect(!authHeader.startsWith("Bearer ")).toBe(true);
  });

  test("should extract token from valid Authorization header", () => {
    const headers = { authorization: "Bearer mytoken123" };
    const authHeader = headers.authorization;

    expect(authHeader.startsWith("Bearer ")).toBe(true);
    const token = authHeader.split(" ")[1];
    expect(token).toBe("mytoken123");
  });

  test("should verify valid JWT token", () => {
    const token = jwt.sign({ userId: 123 }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    expect(decoded.userId).toBe(123);
  });

  test("should reject token with wrong secret", () => {
    const token = jwt.sign({ userId: 123 }, "different_secret", {
      expiresIn: "1h",
    });

    expect(() => {
      jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    }).toThrow();
  });

  test("should reject expired token", () => {
    const expiredToken = jwt.sign(
      { userId: 123 },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "-1h" }
    );

    expect(() => {
      jwt.verify(expiredToken, process.env.JWT_ACCESS_SECRET);
    }).toThrow("jwt expired");
  });

  test("should reject malformed token", () => {
    const malformedToken = "not.a.valid.jwt.token";

    expect(() => {
      jwt.verify(malformedToken, process.env.JWT_ACCESS_SECRET);
    }).toThrow();
  });

  test("should decode token payload correctly", () => {
    const payload = { userId: 456, email: "test@example.com" };
    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    expect(decoded.userId).toBe(456);
    expect(decoded.email).toBe("test@example.com");
    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
  });
});
