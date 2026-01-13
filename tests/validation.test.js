describe("Request Validation Tests", () => {
  describe("Email Validation", () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    test("should accept valid email addresses", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("test.user@domain.co.uk")).toBe(true);
      expect(isValidEmail("user+tag@example.org")).toBe(true);
    });

    test("should reject invalid email addresses", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("notanemail")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("user @example.com")).toBe(false);
    });
  });

  describe("Password Validation", () => {
    const isStrongPassword = (password) => {
      if (!password || typeof password !== "string") return false;
      return password.length >= 6;
    };

    test("should accept strong passwords", () => {
      expect(isStrongPassword("password123")).toBe(true);
      expect(isStrongPassword("SecureP@ss")).toBe(true);
      expect(isStrongPassword("123456")).toBe(true);
    });

    test("should reject weak passwords", () => {
      expect(isStrongPassword("")).toBe(false);
      expect(isStrongPassword("12345")).toBe(false);
      expect(isStrongPassword("abc")).toBe(false);
      expect(isStrongPassword(null)).toBe(false);
      expect(isStrongPassword(undefined)).toBe(false);
    });
  });

  describe("Required Fields Validation", () => {
    const validateLoginRequest = (body) => {
      const { email, password } = body;
      const errors = [];

      if (!email) errors.push("email is required");
      if (!password) errors.push("password is required");

      return { isValid: errors.length === 0, errors };
    };

    test("should pass when all required fields are present", () => {
      const result = validateLoginRequest({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should fail when email is missing", () => {
      const result = validateLoginRequest({ password: "password123" });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("email is required");
    });

    test("should fail when password is missing", () => {
      const result = validateLoginRequest({ email: "test@example.com" });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("password is required");
    });

    test("should fail when all fields are missing", () => {
      const result = validateLoginRequest({});
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe("Registration Validation", () => {
    const validateRegisterRequest = (body) => {
      const { email, password, name } = body;
      const errors = [];

      if (!email) errors.push("email is required");
      if (!password) errors.push("password is required");
      if (!name) errors.push("name is required");
      if (password && password.length < 6) errors.push("password too short");

      return { isValid: errors.length === 0, errors };
    };

    test("should pass with valid registration data", () => {
      const result = validateRegisterRequest({
        email: "new@example.com",
        password: "securepass",
        name: "John Doe",
      });
      expect(result.isValid).toBe(true);
    });

    test("should fail with short password", () => {
      const result = validateRegisterRequest({
        email: "new@example.com",
        password: "123",
        name: "John Doe",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("password too short");
    });

    test("should fail when name is missing", () => {
      const result = validateRegisterRequest({
        email: "new@example.com",
        password: "securepass",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("name is required");
    });
  });
});
