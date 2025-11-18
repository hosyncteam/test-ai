"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsType, Plan } from "@/lib/types";

type Tab = "account" | "billing" | "privacy";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan>("STARTER");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchCurrentPlan();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch("/api/billing/plan");
      const data = await response.json();
      if (data.success) {
        setCurrentPlan(data.data.plan);
      }
    } catch (error) {
      console.error("Failed to fetch plan:", error);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        alert("Settings saved successfully");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgradePlan = async (plan: Plan) => {
    try {
      const response = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentPlan(plan);
        alert(`Successfully upgraded to ${plan} plan`);
      }
    } catch (error) {
      console.error("Failed to upgrade plan:", error);
      alert("Failed to upgrade plan");
    }
  };

  if (loading || !settings) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "account"
              ? "text-primary-blue border-b-2 border-primary-blue"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "billing"
              ? "text-primary-blue border-b-2 border-primary-blue"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Billing
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "privacy"
              ? "text-primary-blue border-b-2 border-primary-blue"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Privacy
        </button>
      </div>

      {activeTab === "account" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card className="border-rose-heart">
            <CardHeader>
              <CardTitle className="text-rose-heart">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="danger">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{currentPlan}</p>
                  <p className="text-gray-600">
                    {currentPlan === "STARTER" && "$5/year"}
                    {currentPlan === "PREMIUM" && "$29/year"}
                    {currentPlan === "FOREVER" && "$99 one-time"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={currentPlan === "STARTER" ? "border-2 border-primary-blue" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">Starter</CardTitle>
                    <p className="text-2xl font-semibold">$5<span className="text-sm text-gray-600">/year</span></p>
                  </CardHeader>
                  <CardContent>
                    {currentPlan === "STARTER" ? (
                      <Button variant="secondary" disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => handleUpgradePlan("STARTER")}
                      >
                        Downgrade
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className={currentPlan === "PREMIUM" ? "border-2 border-golden-sand" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">Premium</CardTitle>
                    <p className="text-2xl font-semibold">$29<span className="text-sm text-gray-600">/year</span></p>
                  </CardHeader>
                  <CardContent>
                    {currentPlan === "PREMIUM" ? (
                      <Button variant="secondary" disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleUpgradePlan("PREMIUM")}
                      >
                        Upgrade
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className={currentPlan === "FOREVER" ? "border-2 border-primary-blue" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">Forever</CardTitle>
                    <p className="text-2xl font-semibold">$99<span className="text-sm text-gray-600"> one-time</span></p>
                  </CardHeader>
                  <CardContent>
                    {currentPlan === "FOREVER" ? (
                      <Button variant="secondary" disabled className="w-full">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleUpgradePlan("FOREVER")}
                      >
                        Upgrade
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">No billing history yet</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>Control how your messages are delivered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Make delivery links expire after viewing</Label>
                  <p className="text-sm text-gray-600">
                    Recipients can only view the message once
                  </p>
                </div>
                <Switch
                  checked={settings.linkExpires}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, linkExpires: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow recipients to download videos</Label>
                  <p className="text-sm text-gray-600">
                    Recipients can save videos to their device
                  </p>
                </div>
                <Switch
                  checked={settings.allowDownload}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, allowDownload: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Protect your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, twoFactorEnabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Future Self Messages</CardTitle>
              <CardDescription>Settings for messages to your future self</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow reminders for my future self messages</Label>
                  <p className="text-sm text-gray-600">
                    Get notified before your message is delivered
                  </p>
                </div>
                <Switch
                  checked={settings.selfReminderEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, selfReminderEnabled: checked })
                  }
                />
              </div>

              {settings.selfReminderEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="reminderTiming">Reminder timing</Label>
                  <Select
                    id="reminderTiming"
                    value={settings.selfReminderTiming}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        selfReminderTiming: e.target.value as "SAME_DAY" | "ONE_DAY" | "ONE_WEEK" | "ONE_MONTH",
                      })
                    }
                  >
                    <option value="SAME_DAY">Same day</option>
                    <option value="ONE_DAY">1 day before</option>
                    <option value="ONE_WEEK">1 week before</option>
                    <option value="ONE_MONTH">1 month before</option>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save Privacy Settings"}
          </Button>
        </div>
      )}
    </div>
  );
}
