"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Phone,
  Key,
  CreditCard,
  Copy,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  AlertCircle,
  Users,
  Cloud,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import {
  fetchApiKeys,
  createApiKey,
  deleteApiKey,
  fetchPhoneNumbers,
  togglePhoneNumber,
  fetchWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  fetchBillingInfo,
  fetchTeamMembers,
  inviteTeamMember,
  updateMemberRole,
  removeMember,
  type TeamMember,
} from "@/lib/api-client-settings";

type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
};

type PhoneNumber = {
  id: string;
  phoneNumber: string;
  provider: string;
  isActive: boolean;
};

type Webhook = {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
};

type BillingInfo = {
  implementationFee: number;
  monthlyMaintenanceFee: number;
  implementationPaidAt: string | null;
  serviceStatus: string;
  billingCycle: string;
};

export default function SettingsPage() {
  const getErrorMessage = (err: unknown) => (err instanceof Error ? err.message : "Request failed");

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loadingApiKeys, setLoadingApiKeys] = useState(true);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);

  // Phone Numbers state
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loadingPhoneNumbers, setLoadingPhoneNumbers] = useState(true);

  // Webhooks state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingWebhooks, setLoadingWebhooks] = useState(true);
  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["communication.received"]);
  const [creatingWebhook, setCreatingWebhook] = useState(false);

  // Billing state
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loadingBilling, setLoadingBilling] = useState(true);

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);

  // AWS Credentials state
  const [awsCredentials, setAwsCredentials] = useState<{
    id: string;
    region: string;
    accountId: string | null;
    isValid: boolean;
    lastValidatedAt: string | null;
  } | null>(null);
  const [loadingAws, setLoadingAws] = useState(true);
  const [savingAws, setSavingAws] = useState(false);
  const [awsAccessKeyId, setAwsAccessKeyId] = useState("");
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState("");
  const [awsRegion, setAwsRegion] = useState("us-east-1");
  const [showSecret, setShowSecret] = useState(false);
  const [awsSuccess, setAwsSuccess] = useState<string | null>(null);

  // General state
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadApiKeys();
    loadPhoneNumbers();
    loadWebhooks();
    loadBillingInfo();
    loadTeam();
    loadAwsCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoadingApiKeys(true);
      const data = await fetchApiKeys();
      setApiKeys(data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingApiKeys(false);
    }
  };

  const loadPhoneNumbers = async () => {
    try {
      setLoadingPhoneNumbers(true);
      const data = await fetchPhoneNumbers();
      setPhoneNumbers(data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingPhoneNumbers(false);
    }
  };

  const loadWebhooks = async () => {
    try {
      setLoadingWebhooks(true);
      const data = await fetchWebhooks();
      setWebhooks(data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingWebhooks(false);
    }
  };

  const loadBillingInfo = async () => {
    try {
      setLoadingBilling(true);
      const data = await fetchBillingInfo();
      setBillingInfo({
        implementationFee: data.implementationFee,
        monthlyMaintenanceFee: data.monthlyMaintenanceFee,
        implementationPaidAt: data.implementationPaidAt,
        serviceStatus: data.serviceStatus,
        billingCycle: data.billingCycle,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingBilling(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      setError("Please enter a name for the API key");
      return;
    }

    try {
      setCreatingKey(true);
      setError(null);
      const data = await createApiKey(newKeyName);
      setNewlyCreatedKey(data.key);
      setNewKeyName("");
      await loadApiKeys();
    } catch (err) {
      setError(getErrorMessage(err));
      setCreatingKey(false);
    } finally {
      setCreatingKey(false);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      await deleteApiKey(id);
      await loadApiKeys();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleTogglePhoneNumber = async (id: string, isActive: boolean) => {
    try {
      await togglePhoneNumber(id, !isActive);
      await loadPhoneNumbers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      setError("Please enter a webhook URL");
      return;
    }

    if (selectedEvents.length === 0) {
      setError("Please select at least one event");
      return;
    }

    try {
      setCreatingWebhook(true);
      setError(null);
      await createWebhook({
        url: newWebhookUrl,
        events: selectedEvents,
      });
      setNewWebhookUrl("");
      setSelectedEvents(["communication.received"]);
      setShowNewWebhookDialog(false);
      await loadWebhooks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCreatingWebhook(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleToggleWebhook = async (id: string, isActive: boolean) => {
    try {
      await updateWebhook(id, { isActive: !isActive });
      await loadWebhooks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteWebhook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return;

    try {
      await deleteWebhook(id);
      await loadWebhooks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Team handlers
  const loadTeam = async () => {
    try {
      setLoadingTeam(true);
      const data = await fetchTeamMembers();
      setTeamMembers(data.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingTeam(false);
    }
  };

  const loadAwsCredentials = async () => {
    try {
      setLoadingAws(true);
      const data = await apiClient.getAwsCredentialStatus();
      setAwsCredentials(data.data);
    } catch (err) {
      // No credentials yet is fine — not an error
      if (!(err instanceof Error && err.message.includes("404"))) {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoadingAws(false);
    }
  };

  const handleSaveAwsCredentials = async () => {
    if (!awsAccessKeyId.trim() || !awsSecretAccessKey.trim()) {
      setError("Please enter both Access Key ID and Secret Access Key");
      return;
    }

    try {
      setSavingAws(true);
      setError(null);
      setAwsSuccess(null);
      await apiClient.storeAwsCredentials({
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
        region: awsRegion,
      });
      setAwsAccessKeyId("");
      setAwsSecretAccessKey("");
      setAwsSuccess("AWS credentials validated and saved successfully.");
      await loadAwsCredentials();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingAws(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      setError("Please enter an email address");
      return;
    }

    try {
      setInviting(true);
      setError(null);
      await inviteTeamMember(inviteEmail, inviteRole);
      setInviteEmail("");
      setInviteRole("member");
      setShowInviteDialog(false);
      await loadTeam();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      setError(null);
      await updateMemberRole(memberId, newRole);
      await loadTeam();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      setError(null);
      await removeMember(memberId);
      await loadTeam();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const data = await response.json();
      const payload = data?.data ?? data;

      if (payload?.url) {
        window.location.href = payload.url;
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-400";
      case "pending":
        return "text-amber-400";
      case "suspended":
        return "text-red-400";
      case "terminated":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, phone numbers, and integrations.
        </p>
      </div>

      {/* Global Error */}
      {error && (
        <div className="border-destructive/30 bg-destructive/10 mb-6 rounded-lg border p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-destructive mt-0.5 h-4 w-4" />
            <div className="flex-1">
              <p className="text-destructive text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-destructive hover:text-destructive/80"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Tabs defaultValue="api" className="space-y-8">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="phone" className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Phone</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="aws" className="gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">AWS</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-6">
          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">API Keys</h2>
                  <p className="text-muted-foreground text-sm">
                    Use these keys to integrate Echodod with your systems
                  </p>
                </div>
                <Button onClick={() => setShowNewKeyDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Key
                </Button>
              </div>

              {loadingApiKeys ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="border-border rounded-lg border border-dashed p-8 text-center">
                  <Key className="text-muted-foreground mx-auto h-8 w-8" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    No API keys yet. Create one to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="border-border bg-background/50 flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-muted-foreground font-mono text-sm">
                          {key.keyPrefix}...
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Created {new Date(key.createdAt).toLocaleDateString()}
                          {key.lastUsedAt &&
                            ` • Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteApiKey(key.id)}
                      >
                        <Trash2 className="text-muted-foreground h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </TabsContent>

        {/* Phone Numbers Tab (View-Only) */}
        <TabsContent value="phone" className="space-y-6">
          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Phone Numbers</h2>
                <p className="text-muted-foreground text-sm">
                  Your provisioned phone numbers (managed by Echodod team)
                </p>
              </div>

              {loadingPhoneNumbers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                </div>
              ) : phoneNumbers.length === 0 ? (
                <div className="border-border rounded-lg border border-dashed p-8 text-center">
                  <Phone className="text-muted-foreground mx-auto h-8 w-8" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    No phone numbers provisioned yet. Contact your account manager.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {phoneNumbers.map((phone) => (
                    <div
                      key={phone.id}
                      className="border-border bg-background/50 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                            <Phone className="text-primary h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-mono font-medium">{phone.phoneNumber}</p>
                            <p className="text-muted-foreground text-sm">{phone.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={phone.isActive}
                            onCheckedChange={() =>
                              handleTogglePhoneNumber(phone.id, phone.isActive)
                            }
                          />
                          <span className="text-muted-foreground text-sm">
                            {phone.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </TabsContent>

        {/* AWS Tab */}
        <TabsContent value="aws" className="space-y-6">
          {/* Credential Status */}
          {awsCredentials && awsCredentials.isValid && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-emerald-400">AWS Connected</p>
                  <p className="text-sm text-emerald-400/80">
                    Account {awsCredentials.accountId} &bull; {awsCredentials.region}
                    {awsCredentials.lastValidatedAt &&
                      ` \u2022 Verified ${new Date(awsCredentials.lastValidatedAt).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {awsSuccess && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <p className="text-sm text-emerald-400">{awsSuccess}</p>
              </div>
            </div>
          )}

          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">AWS Credentials</h2>
                <p className="text-muted-foreground text-sm">
                  {awsCredentials
                    ? "Update your AWS credentials for automated service provisioning."
                    : "Connect your AWS account to enable automated service provisioning."}
                </p>
              </div>

              {loadingAws ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-2">
                      <Shield className="mt-0.5 h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-amber-500">Security Notice</p>
                        <p className="text-sm text-amber-500/80">
                          Credentials are encrypted at rest with AES-256-GCM. We recommend using an
                          IAM user with the minimum required permissions for Connect, SES, and
                          Pinpoint.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="awsAccessKeyId">Access Key ID</Label>
                    <Input
                      id="awsAccessKeyId"
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      value={awsAccessKeyId}
                      onChange={(e) => setAwsAccessKeyId(e.target.value)}
                      disabled={savingAws}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="awsSecretAccessKey">Secret Access Key</Label>
                    <div className="relative">
                      <Input
                        id="awsSecretAccessKey"
                        type={showSecret ? "text" : "password"}
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                        value={awsSecretAccessKey}
                        onChange={(e) => setAwsSecretAccessKey(e.target.value)}
                        disabled={savingAws}
                        className="pr-10 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="awsRegion">Region</Label>
                    <Select value={awsRegion} onValueChange={setAwsRegion}>
                      <SelectTrigger id="awsRegion">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-east-2">US East (Ohio)</SelectItem>
                        <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                        <SelectItem value="eu-west-2">EU (London)</SelectItem>
                        <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        <SelectItem value="ap-southeast-2">Asia Pacific (Sydney)</SelectItem>
                        <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                        <SelectItem value="ap-northeast-2">Asia Pacific (Seoul)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSaveAwsCredentials}
                    disabled={savingAws}
                    className="w-full"
                  >
                    {savingAws && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {awsCredentials ? "Update Credentials" : "Connect AWS Account"}
                  </Button>
                </div>
              )}
            </GlassCardContent>
          </GlassCard>

          {/* Required IAM Permissions */}
          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Required IAM Permissions</h2>
                <p className="text-muted-foreground text-sm">
                  Your IAM user needs these permissions for automated provisioning.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    service: "Amazon Connect",
                    permissions:
                      "connect:CreateInstance, connect:DescribeInstance, connect:CreateQueue, connect:CreateContactFlow, connect:SearchAvailablePhoneNumbers, connect:ClaimPhoneNumber",
                  },
                  {
                    service: "Amazon SES",
                    permissions:
                      "ses:CreateEmailIdentity, ses:GetEmailIdentity, ses:CreateConfigurationSet, ses:GetAccount",
                  },
                  {
                    service: "Amazon Pinpoint SMS",
                    permissions:
                      "sms-voice:CreatePool, sms-voice:RequestPhoneNumber, sms-voice:SendTextMessage, sms-voice:DescribeAccountLimits",
                  },
                  {
                    service: "CloudWatch",
                    permissions: "cloudwatch:GetMetricData",
                  },
                  {
                    service: "STS",
                    permissions: "sts:GetCallerIdentity",
                  },
                ].map((item) => (
                  <div
                    key={item.service}
                    className="border-border bg-background/50 rounded-lg border p-3"
                  >
                    <p className="text-sm font-medium">{item.service}</p>
                    <p className="text-muted-foreground font-mono text-xs">{item.permissions}</p>
                  </div>
                ))}
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* SES DNS Instructions */}
          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">SES Domain Verification (DNS Setup)</h2>
                <p className="text-muted-foreground text-sm">
                  After provisioning starts, you need to add DNS records to verify your domain for
                  sending emails via Amazon SES.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
                  <h3 className="mb-2 text-sm font-medium text-sky-400">Step 1: DKIM Records</h3>
                  <p className="text-muted-foreground text-xs">
                    During provisioning, SES generates 3 CNAME records for DKIM authentication. You
                    will find them in the AWS SES console under your verified domain. Add all three
                    CNAME records to your DNS provider.
                  </p>
                  <div className="mt-2 rounded-md bg-zinc-900 p-3 font-mono text-xs">
                    <p className="text-muted-foreground"># Example CNAME records:</p>
                    <p>selector1._domainkey.yourdomain.com → selector1.dkim.amazonses.com</p>
                    <p>selector2._domainkey.yourdomain.com → selector2.dkim.amazonses.com</p>
                    <p>selector3._domainkey.yourdomain.com → selector3.dkim.amazonses.com</p>
                  </div>
                </div>

                <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
                  <h3 className="mb-2 text-sm font-medium text-sky-400">
                    Step 2: SPF Record (Optional)
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    If you want to send from a custom MAIL FROM domain, add an SPF TXT record:
                  </p>
                  <div className="mt-2 rounded-md bg-zinc-900 p-3 font-mono text-xs">
                    <p>TXT &quot;v=spf1 include:amazonses.com ~all&quot;</p>
                  </div>
                </div>

                <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
                  <h3 className="mb-2 text-sm font-medium text-sky-400">
                    Step 3: DMARC Record (Recommended)
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Add a DMARC TXT record to improve deliverability and protect against spoofing:
                  </p>
                  <div className="mt-2 rounded-md bg-zinc-900 p-3 font-mono text-xs">
                    <p>
                      _dmarc.yourdomain.com → TXT &quot;v=DMARC1; p=quarantine;
                      rua=mailto:dmarc@yourdomain.com&quot;
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground text-xs">
                  DNS propagation typically takes 15-60 minutes. SES will automatically detect the
                  records and complete verification.
                </p>
              </div>
            </GlassCardContent>
          </GlassCard>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <GlassCard className="p-6">
            <GlassCardContent className="p-0">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Team Members</h2>
                  <p className="text-muted-foreground text-sm">
                    Manage who has access to your organization
                  </p>
                </div>
                <Button onClick={() => setShowInviteDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </div>

              {loadingTeam ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="border-border rounded-lg border border-dashed p-8 text-center">
                  <Users className="text-muted-foreground mx-auto h-8 w-8" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    No team members yet. Invite someone to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="border-border bg-background/50 flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 text-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium">
                          {member.user.name
                            ? member.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "??"}
                        </div>
                        <div>
                          <p className="font-medium">{member.user.name || member.user.email}</p>
                          <p className="text-muted-foreground text-sm">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {member.role === "owner" ? (
                          <span className="text-muted-foreground rounded-md border px-2 py-1 text-xs font-medium">
                            Owner
                          </span>
                        ) : (
                          <Select
                            value={member.role}
                            onValueChange={(value) => handleUpdateRole(member.id, value)}
                          >
                            <SelectTrigger className="h-8 w-24 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {member.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="text-muted-foreground h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCardContent>
          </GlassCard>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          {loadingBilling ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              <GlassCard className="p-6">
                <GlassCardContent className="p-0">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold">Billing & Service</h2>
                    <p className="text-muted-foreground text-sm">
                      View your implementation and maintenance billing
                    </p>
                  </div>

                  <div className="border-primary bg-primary/5 rounded-lg border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Service Status</p>
                        <p
                          className={`text-2xl font-bold capitalize ${billingInfo ? getServiceStatusColor(billingInfo.serviceStatus) : ""}`}
                        >
                          {billingInfo?.serviceStatus || "Pending"}
                        </p>
                        {billingInfo?.billingCycle && (
                          <p className="text-muted-foreground text-sm">
                            Next billing {new Date(billingInfo.billingCycle).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" onClick={handleManageBilling}>
                        Manage Billing
                      </Button>
                    </div>
                  </div>

                  {billingInfo && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="border-border rounded-lg border p-4">
                        <p className="text-muted-foreground text-sm">Implementation Fee</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(billingInfo.implementationFee)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {billingInfo.implementationPaidAt
                            ? `Paid ${new Date(billingInfo.implementationPaidAt).toLocaleDateString()}`
                            : "Payment pending"}
                        </p>
                      </div>
                      <div className="border-border rounded-lg border p-4">
                        <p className="text-muted-foreground text-sm">Monthly Maintenance</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(billingInfo.monthlyMaintenanceFee)}
                        </p>
                        <p className="text-muted-foreground text-xs">per month</p>
                      </div>
                      <div className="border-border rounded-lg border p-4">
                        <p className="text-muted-foreground text-sm">Service Status</p>
                        <p
                          className={`text-2xl font-bold capitalize ${getServiceStatusColor(billingInfo.serviceStatus)}`}
                        >
                          {billingInfo.serviceStatus}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {billingInfo.serviceStatus === "active"
                            ? "All services operational"
                            : billingInfo.serviceStatus === "pending"
                              ? "Awaiting setup"
                              : "Contact support"}
                        </p>
                      </div>
                    </div>
                  )}
                </GlassCardContent>
              </GlassCard>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create API Key Dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{newlyCreatedKey ? "Save Your API Key" : "Create API Key"}</DialogTitle>
            <DialogDescription>
              {newlyCreatedKey
                ? "Copy this key now. You won't be able to see it again!"
                : "Give your API key a descriptive name."}
            </DialogDescription>
          </DialogHeader>

          {newlyCreatedKey ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="mb-2 text-sm font-medium text-amber-500">
                  <AlertCircle className="mr-1 inline h-4 w-4" />
                  Important: Save this key now
                </p>
                <p className="text-sm text-amber-500/80">
                  This is the only time you&apos;ll see the full key. Store it securely.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="flex gap-2">
                  <Input value={newlyCreatedKey} readOnly className="font-mono text-sm" />
                  <Button variant="outline" onClick={() => copyToClipboard(newlyCreatedKey)}>
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">API Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="Production Server"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  disabled={creatingKey}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {newlyCreatedKey ? (
              <Button
                onClick={() => {
                  setShowNewKeyDialog(false);
                  setNewlyCreatedKey(null);
                }}
                className="w-full"
              >
                Done
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowNewKeyDialog(false)}
                  disabled={creatingKey}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateApiKey} disabled={creatingKey}>
                  {creatingKey && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Key
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog open={showNewWebhookDialog} onOpenChange={setShowNewWebhookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Webhook</DialogTitle>
            <DialogDescription>
              Receive real-time notifications for communication events.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-server.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                disabled={creatingWebhook}
              />
            </div>

            <div className="space-y-2">
              <Label>Events</Label>
              <div className="space-y-2">
                {["communication.received", "communication.sent", "service.status_changed"].map(
                  (event) => (
                    <label
                      key={event}
                      className="border-border flex items-center gap-2 rounded-lg border p-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([...selectedEvents, event]);
                          } else {
                            setSelectedEvents(selectedEvents.filter((ev) => ev !== event));
                          }
                        }}
                        disabled={creatingWebhook}
                      />
                      <span className="font-mono text-sm">{event}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewWebhookDialog(false)}
              disabled={creatingWebhook}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateWebhook} disabled={creatingWebhook}>
              {creatingWebhook && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Team Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Add a team member by their email address. They must have an existing account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={inviting}
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member — Can view dashboard and logs</SelectItem>
                  <SelectItem value="admin">Admin — Can manage settings and members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInviteDialog(false)}
              disabled={inviting}
            >
              Cancel
            </Button>
            <Button onClick={handleInviteMember} disabled={inviting}>
              {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
