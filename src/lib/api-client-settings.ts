/**
 * Client-side API utilities for Settings pages
 */

type ApiEnvelope<T> =
  | { data: T; meta: unknown }
  | { error: { message: string }; meta: unknown }
  | T;

export type ApiListResponse<T> = { data: T[] };

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiEnvelope<T>;
  if (body && typeof body === "object" && "data" in body && "meta" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

async function parseErrorMessage(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return "Request failed";
  }

  const maybeBody = body as { error?: unknown; data?: unknown };
  const errorValue = maybeBody.error;

  if (typeof errorValue === "string") return errorValue;
  if (errorValue && typeof errorValue === "object") {
    const maybeError = errorValue as { message?: unknown };
    if (typeof maybeError.message === "string") return maybeError.message;
  }

  const dataValue = maybeBody.data;
  if (dataValue && typeof dataValue === "object") {
    const maybeData = dataValue as { error?: unknown };
    const nestedError = maybeData.error;
    if (typeof nestedError === "string") return nestedError;
    if (nestedError && typeof nestedError === "object") {
      const maybeNested = nestedError as { message?: unknown };
      if (typeof maybeNested.message === "string") return maybeNested.message;
    }
  }

  return "Request failed";
}

// API Keys
export type ApiKeyListItem = {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
};

export type CreateApiKeyResponse = {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
  key: string;
  message: string;
};

export async function fetchApiKeys(): Promise<ApiListResponse<ApiKeyListItem>> {
  const response = await fetch("/api/settings/api-keys");
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<ApiListResponse<ApiKeyListItem>>(response);
}

export async function createApiKey(name: string): Promise<CreateApiKeyResponse> {
  const response = await fetch("/api/settings/api-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<CreateApiKeyResponse>(response);
}

export async function deleteApiKey(id: string): Promise<null> {
  const response = await fetch(`/api/settings/api-keys/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<null>(response);
}

// Phone Numbers
export type PhoneNumberListItem = {
  id: string;
  phoneNumber: string;
  provider: string;
  isActive: boolean;
  createdAt: string;
};

export async function fetchPhoneNumbers(): Promise<ApiListResponse<PhoneNumberListItem>> {
  const response = await fetch("/api/settings/phone-numbers");
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<ApiListResponse<PhoneNumberListItem>>(response);
}

export async function deletePhoneNumber(id: string): Promise<null> {
  const response = await fetch(`/api/settings/phone-numbers/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<null>(response);
}

export async function togglePhoneNumber(
  id: string,
  isActive: boolean
): Promise<PhoneNumberListItem | null> {
  const response = await fetch(`/api/settings/phone-numbers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<PhoneNumberListItem | null>(response);
}

// Webhooks
export type WebhookListItem = {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
};

export async function fetchWebhooks(): Promise<ApiListResponse<WebhookListItem>> {
  const response = await fetch("/api/settings/webhooks");
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<ApiListResponse<WebhookListItem>>(response);
}

export async function createWebhook(data: {
  url: string;
  events: string[];
}): Promise<WebhookListItem> {
  const response = await fetch("/api/settings/webhooks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<WebhookListItem>(response);
}

export async function updateWebhook(
  id: string,
  data: { url?: string; events?: string[]; isActive?: boolean }
): Promise<WebhookListItem | null> {
  const response = await fetch(`/api/settings/webhooks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<WebhookListItem | null>(response);
}

export async function deleteWebhook(id: string): Promise<null> {
  const response = await fetch(`/api/settings/webhooks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<null>(response);
}

// Billing
export type BillingInfoResponse = {
  id: string;
  organizationId: string;
  stripeCustomerId: string;
  paymentMethodId: string | null;
  implementationFee: number;
  monthlyMaintenanceFee: number;
  implementationPaidAt: string | null;
  serviceStatus: string;
  billingCycle: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchBillingInfo(): Promise<BillingInfoResponse> {
  const response = await fetch("/api/settings/billing");
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<BillingInfoResponse>(response);
}

// Team Members
export type TeamMember = {
  id: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export async function fetchTeamMembers(): Promise<ApiListResponse<TeamMember>> {
  const response = await fetch("/api/organizations/members");
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<ApiListResponse<TeamMember>>(response);
}

export async function inviteTeamMember(email: string, role: string): Promise<TeamMember> {
  const response = await fetch("/api/organizations/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<TeamMember>(response);
}

export async function updateMemberRole(id: string, role: string): Promise<TeamMember> {
  const response = await fetch(`/api/organizations/members/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<TeamMember>(response);
}

export async function removeMember(id: string): Promise<null> {
  const response = await fetch(`/api/organizations/members/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
  return parseJson<null>(response);
}
