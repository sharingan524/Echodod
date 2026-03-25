"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Clock,
  CalendarDays,
  MessageSquare,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface ClientProfile {
  id: string;
  businessName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  industry: string | null;
  timezone: string;
}

interface BusinessHoursEntry {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface Holiday {
  id: string;
  date: string;
  name: string;
  isClosed: boolean;
  specialOpenTime: string | null;
  specialCloseTime: string | null;
}

interface GreetingMessage {
  id: string;
  channel: string;
  message: string;
  isActive: boolean;
}

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profile state
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Business hours state
  const [hours, setHours] = useState<BusinessHoursEntry[]>([]);
  const [hoursLoading, setHoursLoading] = useState(true);

  // Holidays state
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidaysLoading, setHolidaysLoading] = useState(true);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");

  // Greetings state
  const [greetings, setGreetings] = useState<GreetingMessage[]>([]);
  const [greetingsLoading, setGreetingsLoading] = useState(true);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Load profile
  const loadProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      const res = await apiClient.getClientProfile();
      setProfile(res.data as unknown as ClientProfile);
    } catch {
      setError("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Load hours
  const loadHours = useCallback(async () => {
    try {
      setHoursLoading(true);
      const res = await apiClient.getBusinessHours();
      setHours(res.data as unknown as BusinessHoursEntry[]);
    } catch {
      setError("Failed to load business hours");
    } finally {
      setHoursLoading(false);
    }
  }, []);

  // Load holidays
  const loadHolidays = useCallback(async () => {
    try {
      setHolidaysLoading(true);
      const res = await apiClient.getHolidays();
      setHolidays(res.data as unknown as Holiday[]);
    } catch {
      setError("Failed to load holidays");
    } finally {
      setHolidaysLoading(false);
    }
  }, []);

  // Load greetings
  const loadGreetings = useCallback(async () => {
    try {
      setGreetingsLoading(true);
      const res = await apiClient.getGreetings();
      setGreetings(res.data as unknown as GreetingMessage[]);
    } catch {
      setError("Failed to load greetings");
    } finally {
      setGreetingsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadHours();
    loadHolidays();
    loadGreetings();
  }, [loadProfile, loadHours, loadHolidays, loadGreetings]);

  // Save profile
  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      await apiClient.updateClientProfile({
        businessName: profile.businessName,
        address: profile.address || undefined,
        phone: profile.phone || undefined,
        email: profile.email || undefined,
        website: profile.website || undefined,
        description: profile.description || undefined,
        industry: profile.industry || undefined,
        timezone: profile.timezone,
      });
      showSuccess("Profile saved");
    } catch {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // Save hours
  const saveHours = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiClient.updateBusinessHours({
        hours: hours.map((h) => ({
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        })),
      });
      showSuccess("Business hours saved");
    } catch {
      setError("Failed to save business hours");
    } finally {
      setSaving(false);
    }
  };

  // Add holiday
  const addHoliday = async () => {
    if (!newHolidayName || !newHolidayDate) return;
    setSaving(true);
    setError(null);
    try {
      await apiClient.createHoliday({
        name: newHolidayName,
        date: newHolidayDate,
        isClosed: true,
      });
      setNewHolidayName("");
      setNewHolidayDate("");
      loadHolidays();
      showSuccess("Holiday added");
    } catch {
      setError("Failed to add holiday");
    } finally {
      setSaving(false);
    }
  };

  // Delete holiday
  const deleteHoliday = async (id: string) => {
    try {
      await apiClient.deleteHoliday(id);
      loadHolidays();
    } catch {
      setError("Failed to delete holiday");
    }
  };

  // Save greetings
  const saveGreetings = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiClient.updateGreetings({
        greetings: greetings.map((g) => ({
          channel: g.channel as "phone" | "chat" | "email" | "sms",
          message: g.message,
          isActive: g.isActive,
        })),
      });
      showSuccess("Greetings saved");
    } catch {
      setError("Failed to save greetings");
    } finally {
      setSaving(false);
    }
  };

  const updateHour = (index: number, field: keyof BusinessHoursEntry, value: string | boolean) => {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [field]: value } : h)));
  };

  const updateGreeting = (index: number, field: keyof GreetingMessage, value: string | boolean) => {
    setGreetings((prev) => prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)));
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-bold">My Business</h1>
        <p className="text-muted-foreground mb-6">
          Manage your business profile, hours, holidays, and greeting messages.
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {successMsg}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Hours</span>
            </TabsTrigger>
            <TabsTrigger value="holidays" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Holidays</span>
            </TabsTrigger>
            <TabsTrigger value="greetings" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Greetings</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <GlassCard>
              <GlassCardContent>
                {profileLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : profile ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={profile.businessName}
                        onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profile.address || ""}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone || ""}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email || ""}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profile.website || ""}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          value={profile.industry || ""}
                          onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        value={profile.description || ""}
                        onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        placeholder="e.g. America/Chicago"
                      />
                    </div>
                    <Button onClick={saveProfile} disabled={saving}>
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Profile
                    </Button>
                  </div>
                ) : null}
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Business Hours Tab */}
          <TabsContent value="hours">
            <GlassCard>
              <GlassCardContent>
                {hoursLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {hours.map((h, i) => (
                        <div
                          key={h.id}
                          className="border-border/50 flex items-center gap-4 rounded-lg border p-3"
                        >
                          <span className="w-24 text-sm font-medium">{DAY_NAMES[h.dayOfWeek]}</span>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={!h.isClosed}
                              onCheckedChange={(checked) => updateHour(i, "isClosed", !checked)}
                            />
                            <span className="text-muted-foreground text-xs">
                              {h.isClosed ? "Closed" : "Open"}
                            </span>
                          </div>
                          {!h.isClosed && (
                            <>
                              <Input
                                type="time"
                                value={h.openTime}
                                onChange={(e) => updateHour(i, "openTime", e.target.value)}
                                className="w-32"
                              />
                              <span className="text-muted-foreground text-sm">to</span>
                              <Input
                                type="time"
                                value={h.closeTime}
                                onChange={(e) => updateHour(i, "closeTime", e.target.value)}
                                className="w-32"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button onClick={saveHours} disabled={saving}>
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Hours
                    </Button>
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Holidays Tab */}
          <TabsContent value="holidays">
            <GlassCard>
              <GlassCardContent>
                {holidaysLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label htmlFor="holidayName">Holiday Name</Label>
                        <Input
                          id="holidayName"
                          value={newHolidayName}
                          onChange={(e) => setNewHolidayName(e.target.value)}
                          placeholder="e.g. Christmas Day"
                        />
                      </div>
                      <div>
                        <Label htmlFor="holidayDate">Date</Label>
                        <Input
                          id="holidayDate"
                          type="date"
                          value={newHolidayDate}
                          onChange={(e) => setNewHolidayDate(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={addHoliday}
                        disabled={saving || !newHolidayName || !newHolidayDate}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>

                    {holidays.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center text-sm">
                        No holidays scheduled. Add one above.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {holidays.map((h) => (
                          <div
                            key={h.id}
                            className="border-border/50 flex items-center justify-between rounded-lg border p-3"
                          >
                            <div>
                              <p className="text-sm font-medium">{h.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {new Date(h.date).toLocaleDateString()}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteHoliday(h.id)}>
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Greetings Tab */}
          <TabsContent value="greetings">
            <GlassCard>
              <GlassCardContent>
                {greetingsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(["phone", "chat", "email", "sms"] as const).map((channel) => {
                      const idx = greetings.findIndex((g) => g.channel === channel);
                      const greeting = idx >= 0 ? greetings[idx] : null;
                      return (
                        <div key={channel} className="border-border/50 rounded-lg border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <Label className="capitalize">{channel}</Label>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">
                                {greeting?.isActive !== false ? "Active" : "Inactive"}
                              </span>
                              <Switch
                                checked={greeting?.isActive !== false}
                                onCheckedChange={(checked) => {
                                  if (idx >= 0) {
                                    updateGreeting(idx, "isActive", checked);
                                  } else {
                                    setGreetings((prev) => [
                                      ...prev,
                                      {
                                        id: "",
                                        channel,
                                        message: "",
                                        isActive: checked,
                                      },
                                    ]);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <Textarea
                            rows={2}
                            placeholder={`Enter ${channel} greeting message...`}
                            value={greeting?.message || ""}
                            onChange={(e) => {
                              if (idx >= 0) {
                                updateGreeting(idx, "message", e.target.value);
                              } else {
                                setGreetings((prev) => [
                                  ...prev,
                                  {
                                    id: "",
                                    channel,
                                    message: e.target.value,
                                    isActive: true,
                                  },
                                ]);
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                    <Button onClick={saveGreetings} disabled={saving}>
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Greetings
                    </Button>
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
