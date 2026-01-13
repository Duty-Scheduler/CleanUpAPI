describe("Data Transformation Tests", () => {
  describe("User Response Formatting", () => {
    const formatUserResponse = (user) => {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname || "",
        avatar: user.avatar,
        provider: user.provider,
      };
    };

    test("should format complete user object", () => {
      const user = {
        id: 1,
        email: "test@example.com",
        name: "John",
        lastname: "Doe",
        avatar: "https://avatar.com/1.jpg",
        provider: "local",
        password: "hashed_password", // should be excluded
      };

      const formatted = formatUserResponse(user);
      expect(formatted).toHaveProperty("id", 1);
      expect(formatted).toHaveProperty("email", "test@example.com");
      expect(formatted).not.toHaveProperty("password");
    });

    test("should handle missing lastname", () => {
      const user = {
        id: 2,
        email: "test2@example.com",
        name: "Jane",
        avatar: "https://avatar.com/2.jpg",
        provider: "google",
      };

      const formatted = formatUserResponse(user);
      expect(formatted.lastname).toBe("");
    });

    test("should preserve all required fields", () => {
      const user = {
        id: 3,
        email: "test3@example.com",
        name: "Bob",
        lastname: "Smith",
        avatar: null,
        provider: "facebook",
      };

      const formatted = formatUserResponse(user);
      expect(formatted).toHaveProperty("id");
      expect(formatted).toHaveProperty("email");
      expect(formatted).toHaveProperty("name");
      expect(formatted).toHaveProperty("avatar");
      expect(formatted).toHaveProperty("provider");
    });
  });

  describe("Array Manipulation", () => {
    test("should filter empty values", () => {
      const arr = [1, null, 2, undefined, 3, "", 4];
      const filtered = arr.filter(
        (item) => item !== null && item !== undefined && item !== ""
      );
      expect(filtered).toEqual([1, 2, 3, 4]);
    });

    test("should map array of objects", () => {
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];
      const ids = users.map((user) => user.id);
      expect(ids).toEqual([1, 2]);
    });

    test("should reduce array to sum", () => {
      const numbers = [1, 2, 3, 4, 5];
      const sum = numbers.reduce((acc, num) => acc + num, 0);
      expect(sum).toBe(15);
    });

    test("should find item in array", () => {
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ];
      const found = users.find((user) => user.id === 2);
      expect(found).toEqual({ id: 2, name: "Bob" });
    });
  });

  describe("Object Manipulation", () => {
    test("should merge objects", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const merged = { ...obj1, ...obj2 };
      expect(merged).toEqual({ a: 1, b: 3, c: 4 });
    });

    test("should pick properties from object", () => {
      const user = {
        id: 1,
        email: "test@example.com",
        password: "secret",
        name: "Test",
      };
      const { password, ...publicData } = user;
      expect(publicData).not.toHaveProperty("password");
      expect(publicData).toHaveProperty("email");
    });

    test("should check if object has property", () => {
      const obj = { name: "Test", value: 123 };
      expect(obj.hasOwnProperty("name")).toBe(true);
      expect(obj.hasOwnProperty("missing")).toBe(false);
    });

    test("should get object keys", () => {
      const obj = { a: 1, b: 2, c: 3 };
      const keys = Object.keys(obj);
      expect(keys).toEqual(["a", "b", "c"]);
      expect(keys.length).toBe(3);
    });
  });

  describe("String Operations", () => {
    test("should convert to uppercase", () => {
      expect("hello".toUpperCase()).toBe("HELLO");
    });

    test("should convert to lowercase", () => {
      expect("WORLD".toLowerCase()).toBe("world");
    });

    test("should split string", () => {
      const result = "a,b,c".split(",");
      expect(result).toEqual(["a", "b", "c"]);
    });

    test("should join array to string", () => {
      const result = ["a", "b", "c"].join("-");
      expect(result).toBe("a-b-c");
    });

    test("should check string includes substring", () => {
      expect("hello world".includes("world")).toBe(true);
      expect("hello world".includes("test")).toBe(false);
    });

    test("should replace string", () => {
      expect("hello world".replace("world", "there")).toBe("hello there");
    });
  });

  describe("Date Operations", () => {
    test("should create date object", () => {
      const date = new Date("2026-01-13");
      expect(date instanceof Date).toBe(true);
      expect(date.getFullYear()).toBe(2026);
    });

    test("should get current timestamp", () => {
      const now = Date.now();
      expect(typeof now).toBe("number");
      expect(now).toBeGreaterThan(0);
    });

    test("should compare dates", () => {
      const date1 = new Date("2026-01-13");
      const date2 = new Date("2026-01-14");
      expect(date2.getTime()).toBeGreaterThan(date1.getTime());
    });
  });
});
