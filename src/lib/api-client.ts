/**
 * Client-side API helper for making requests to backend
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private readonly baseUrl = "/api";

  /** Active organization ID — set by OrgProvider */
  organizationId: string | null = null;

  private toQueryString(params?: Record<string, string | number | boolean | undefined>) {
    if (!params) return "";
    const entries = Object.entries(params).filter(([, value]) => value !== undefined);
    if (entries.length === 0) return "";
    return new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.organizationId) {
      headers["X-Organization-ID"] = this.organizationId;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({
        error: { message: "Request failed", code: "UNKNOWN" },
      }));

      const errorPayload = body?.error ||
        body?.data?.error || { message: "Request failed", code: "UNKNOWN" };
      throw new ApiError(
        errorPayload.message || "Request failed",
        response.status,
        errorPayload.code
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const body = await response.json();

    // New API envelope: { data, meta }
    if (body && typeof body === "object" && "data" in body && "meta" in body) {
      return body as T;
    }

    return body as T;
  }

  // ========================================
  // Client Profile
  // ========================================

  async getClientProfile() {
    return this.request<{ data: Record<string, unknown> }>("/client-profile");
  }

  async updateClientProfile(data: Record<string, unknown>) {
    return this.request("/client-profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // Business Hours
  // ========================================

  async getBusinessHours() {
    return this.request<{ data: Array<Record<string, unknown>> }>("/business-hours");
  }

  async updateBusinessHours(data: {
    hours: Array<{
      dayOfWeek: number;
      openTime: string;
      closeTime: string;
      isClosed: boolean;
    }>;
  }) {
    return this.request("/business-hours", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // Holidays
  // ========================================

  async getHolidays() {
    return this.request<{ data: Array<Record<string, unknown>> }>("/holidays");
  }

  async createHoliday(data: Record<string, unknown>) {
    return this.request("/holidays", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteHoliday(id: string) {
    return this.request(`/holidays/${id}`, {
      method: "DELETE",
    });
  }

  // ========================================
  // Greetings
  // ========================================

  async getGreetings() {
    return this.request<{ data: Array<Record<string, unknown>> }>("/greetings");
  }

  async updateGreetings(data: {
    greetings: Array<{
      channel: string;
      message: string;
      isActive: boolean;
    }>;
  }) {
    return this.request("/greetings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // Services (view-only)
  // ========================================

  async getServices() {
    return this.request("/services");
  }

  // ========================================
  // Communication Logs
  // ========================================

  async getLogs(params?: {
    page?: number;
    pageSize?: number;
    channel?: string;
    status?: string;
    outcome?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const query = this.toQueryString(params);
    const queryString = query ? `?${query}` : "";
    return this.request(`/logs${queryString}`);
  }

  // ========================================
  // Dashboard
  // ========================================

  async getDashboardMetrics(): Promise<{
    metrics: {
      communicationsToday: { value: number; change: string };
      activeChannels: { value: number };
      serviceStatus: { value: string };
    };
    recentActivity: Array<{
      id: string;
      createdAt: string;
      content: string;
      contactInfo: string;
      channel: string;
      outcome: string;
    }>;
  }> {
    return this.request("/dashboard/metrics");
  }

  // ========================================
  // Settings - API Keys
  // ========================================

  async getApiKeys() {
    return this.request("/settings/api-keys");
  }

  async createApiKey(data: { name: string }) {
    return this.request("/settings/api-keys", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteApiKey(id: string) {
    return this.request(`/settings/api-keys/${id}`, {
      method: "DELETE",
    });
  }

  // ========================================
  // Settings - Webhooks
  // ========================================

  async getWebhooks() {
    return this.request("/settings/webhooks");
  }

  async createWebhook(data: { url: string; events: string[] }) {
    return this.request("/settings/webhooks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateWebhook(id: string, data: Record<string, unknown>) {
    return this.request(`/settings/webhooks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteWebhook(id: string) {
    return this.request(`/settings/webhooks/${id}`, {
      method: "DELETE",
    });
  }

  // ========================================
  // Settings - Phone Numbers (view-only for SMBs)
  // ========================================

  async getPhoneNumbers() {
    return this.request("/settings/phone-numbers");
  }

  // ========================================
  // Settings - Billing
  // ========================================

  async getBilling() {
    return this.request("/settings/billing");
  }

  // ========================================
  // Analytics
  // ========================================

  async getAnalytics(days = 30) {
    return this.request<{
      summary: {
        totalCommunications: number;
        periodCommunications: number;
        avgDuration: number;
        successRate: number;
      };
      communicationVolume: Array<{ date: string; count: number }>;
      channelDistribution: Array<{ name: string; value: number }>;
      outcomeBreakdown: Array<{ name: string; value: number }>;
      communicationsByHour: Array<{ hour: string; count: number }>;
    }>(`/analytics?days=${days}`);
  }

  // ========================================
  // Admin - Clients
  // ========================================

  async getAdminClients(params?: Record<string, string>) {
    const query = this.toQueryString(params);
    return this.request(`/admin/clients${query ? `?${query}` : ""}`);
  }

  async getAdminClient(id: string) {
    return this.request(`/admin/clients/${id}`);
  }

  async updateAdminClient(id: string, data: Record<string, unknown>) {
    return this.request(`/admin/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // Admin - Services
  // ========================================

  async getAdminClientServices(clientId: string) {
    return this.request(`/admin/clients/${clientId}/services`);
  }

  async createAdminClientService(clientId: string, data: Record<string, unknown>) {
    return this.request(`/admin/clients/${clientId}/services`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // Admin - Tickets
  // ========================================

  async getAdminTickets(params?: Record<string, string>) {
    const query = this.toQueryString(params);
    return this.request(`/admin/tickets${query ? `?${query}` : ""}`);
  }

  async createAdminTicket(data: Record<string, unknown>) {
    return this.request("/admin/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAdminTicket(id: string, data: Record<string, unknown>) {
    return this.request(`/admin/tickets/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // Admin - Maintenance Logs
  // ========================================

  async getAdminMaintenanceLogs(params?: Record<string, string>) {
    const query = this.toQueryString(params);
    return this.request(`/admin/maintenance-logs${query ? `?${query}` : ""}`);
  }

  async createAdminMaintenanceLog(data: Record<string, unknown>) {
    return this.request("/admin/maintenance-logs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // AWS Credentials
  // ========================================

  async getAwsCredentialStatus() {
    return this.request<{
      data: {
        id: string;
        region: string;
        accountId: string | null;
        isValid: boolean;
        lastValidatedAt: string | null;
      } | null;
    }>("/settings/aws-credentials");
  }

  async storeAwsCredentials(data: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }) {
    return this.request("/settings/aws-credentials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // Service Health
  // ========================================

  async getServiceHealth() {
    return this.request<{
      data: {
        services: Array<{
          service: string;
          status: "healthy" | "degraded" | "unhealthy" | "unknown";
          details?: Record<string, unknown>;
          checkedAt: string;
        }>;
      };
    }>("/services/health");
  }

  // ========================================
  // Admin - Provisioning
  // ========================================

  async triggerProvisioning(clientId: string, data?: { tier?: string; ticketId?: string }) {
    return this.request(`/admin/clients/${clientId}/provision`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
  }

  async getProvisioningStatus(clientId: string) {
    return this.request(`/admin/clients/${clientId}/provision`);
  }

  async retryProvisioning(clientId: string, ticketId: string) {
    return this.request(`/admin/clients/${clientId}/provision/retry`, {
      method: "POST",
      body: JSON.stringify({ ticketId }),
    });
  }

  // ========================================
  // Phone Number Management (enhanced)
  // ========================================

  async searchAvailablePhoneNumbers(params?: { countryCode?: string; type?: string }) {
    const query = this.toQueryString(params);
    return this.request(`/settings/phone-numbers/available${query ? `?${query}` : ""}`);
  }

  async claimPhoneNumber(data: { phoneNumber: string; description?: string }) {
    return this.request("/settings/phone-numbers/claim", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ========================================
  // Setup / Provisioning Status (client-facing)
  // ========================================

  async getSetupStatus() {
    return this.request<{
      data: {
        progress: number;
        steps: Array<{
          id: string;
          label: string;
          status: "completed" | "in_progress" | "pending" | "failed";
          detail?: string;
        }>;
        plan: string | null;
        ticketStatus: string | null;
      };
    }>("/provisioning/status");
  }
}

export const apiClient = new ApiClient();
