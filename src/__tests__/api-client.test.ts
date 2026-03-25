import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient, ApiError } from "@/lib/api-client";

describe("ApiError", () => {
  it("has correct name property", () => {
    const error = new ApiError("Something went wrong", 400, "BAD_REQUEST");
    expect(error.name).toBe("ApiError");
  });

  it("has correct message", () => {
    const error = new ApiError("Not found", 404, "NOT_FOUND");
    expect(error.message).toBe("Not found");
  });

  it("has correct statusCode", () => {
    const error = new ApiError("Server error", 500, "INTERNAL");
    expect(error.statusCode).toBe(500);
  });

  it("has correct code", () => {
    const error = new ApiError("Unauthorized", 401, "UNAUTHORIZED");
    expect(error.code).toBe("UNAUTHORIZED");
  });

  it("extends Error", () => {
    const error = new ApiError("Test", 400);
    expect(error).toBeInstanceOf(Error);
  });

  it("allows code to be undefined", () => {
    const error = new ApiError("Test", 400);
    expect(error.code).toBeUndefined();
  });
});

describe("ApiClient", () => {
  let client: ApiClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    client = new ApiClient();
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  it("creates an instance", () => {
    expect(client).toBeInstanceOf(ApiClient);
  });

  it("has organizationId initially null", () => {
    expect(client.organizationId).toBeNull();
  });

  it("allows setting organizationId", () => {
    client.organizationId = "org-123";
    expect(client.organizationId).toBe("org-123");
  });

  describe("request", () => {
    it("adds Content-Type header", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: "test" }),
      });

      await client.request("/test");

      expect(mockFetch).toHaveBeenCalledOnce();
      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers["Content-Type"]).toBe("application/json");
    });

    it("adds X-Organization-ID header when organizationId is set", async () => {
      client.organizationId = "org-456";
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: "test" }),
      });

      await client.request("/test");

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers["X-Organization-ID"]).toBe("org-456");
    });

    it("does not add X-Organization-ID header when organizationId is null", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: "test" }),
      });

      await client.request("/test");

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers["X-Organization-ID"]).toBeUndefined();
    });

    it("calls fetch with the correct URL", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: "result" }),
      });

      await client.request("/client-profile");

      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("/api/client-profile");
    });

    it("returns parsed JSON body", async () => {
      const responseData = { data: { id: 1, name: "Test" }, meta: {} };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await client.request("/test");
      expect(result).toEqual(responseData);
    });

    it("handles 204 No Content response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({}),
      });

      const result = await client.request("/test");
      expect(result).toEqual({});
    });

    it("throws ApiError on non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({
          error: { message: "Validation failed", code: "VALIDATION_ERROR" },
        }),
      });

      await expect(client.request("/test")).rejects.toThrow(ApiError);
    });

    it("throws ApiError with correct statusCode on failure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: { message: "Not found", code: "NOT_FOUND" },
        }),
      });

      try {
        await client.request("/test");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        const apiError = err as ApiError;
        expect(apiError.statusCode).toBe(404);
        expect(apiError.message).toBe("Not found");
        expect(apiError.code).toBe("NOT_FOUND");
      }
    });

    it("throws ApiError with defaults when response JSON is unparseable", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      try {
        await client.request("/test");
        expect.fail("Should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        const apiError = err as ApiError;
        expect(apiError.statusCode).toBe(500);
        expect(apiError.message).toBe("Request failed");
        expect(apiError.code).toBe("UNKNOWN");
      }
    });

    it("merges custom headers with default headers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: "test" }),
      });

      await client.request("/test", {
        headers: { "X-Custom": "value" },
      });

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers["Content-Type"]).toBe("application/json");
      expect(options.headers["X-Custom"]).toBe("value");
    });

    it("passes request options through to fetch", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: "created" }),
      });

      await client.request("/test", {
        method: "POST",
        body: JSON.stringify({ name: "test" }),
      });

      const [, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("POST");
      expect(options.body).toBe(JSON.stringify({ name: "test" }));
    });
  });
});
