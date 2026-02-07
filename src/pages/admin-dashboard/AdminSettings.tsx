import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, Database, Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PlatformSettings {
  id: string;
  platform_name: string;
  support_email: string | null;
  maintenance_mode: boolean;
  notify_new_users: boolean;
  notify_new_bookings: boolean;
  notify_cleaner_applications: boolean;
  require_email_verification: boolean;
  require_2fa_admins: boolean;
  updated_at: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [dbStatus, setDbStatus] = useState<"connected" | "error" | "checking">("checking");
  const [authStatus, setAuthStatus] = useState<"active" | "error" | "checking">("checking");

  // Form state
  const [platformName, setPlatformName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [notifyNewUsers, setNotifyNewUsers] = useState(true);
  const [notifyNewBookings, setNotifyNewBookings] = useState(true);
  const [notifyCleanerApps, setNotifyCleanerApps] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [require2faAdmins, setRequire2faAdmins] = useState(false);

  useEffect(() => {
    fetchSettings();
    checkSystemStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
        setPlatformName(data.platform_name);
        setSupportEmail(data.support_email || "");
        setMaintenanceMode(data.maintenance_mode);
        setNotifyNewUsers(data.notify_new_users);
        setNotifyNewBookings(data.notify_new_bookings);
        setNotifyCleanerApps(data.notify_cleaner_applications);
        setRequireEmailVerification(data.require_email_verification);
        setRequire2faAdmins(data.require_2fa_admins);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    // Check database connectivity
    try {
      const { error } = await supabase.from("profiles").select("id").limit(1);
      setDbStatus(error ? "error" : "connected");
    } catch {
      setDbStatus("error");
    }

    // Check auth service
    try {
      const { data } = await supabase.auth.getSession();
      setAuthStatus(data.session ? "active" : "active"); // If we got a response, auth is working
    } catch {
      setAuthStatus("error");
    }
  };

  const handleSave = async () => {
    if (!settings?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("platform_settings")
        .update({
          platform_name: platformName,
          support_email: supportEmail || null,
          maintenance_mode: maintenanceMode,
          notify_new_users: notifyNewUsers,
          notify_new_bookings: notifyNewBookings,
          notify_cleaner_applications: notifyCleanerApps,
          require_email_verification: requireEmailVerification,
          require_2fa_admins: require2faAdmins,
          updated_by: user?.id,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast.success("Settings saved successfully");
      fetchSettings(); // Refresh to get updated_at
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = settings && (
    platformName !== settings.platform_name ||
    supportEmail !== (settings.support_email || "") ||
    maintenanceMode !== settings.maintenance_mode ||
    notifyNewUsers !== settings.notify_new_users ||
    notifyNewBookings !== settings.notify_new_bookings ||
    notifyCleanerApps !== settings.notify_cleaner_applications ||
    requireEmailVerification !== settings.require_email_verification ||
    require2faAdmins !== settings.require_2fa_admins
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Admin Settings</h2>
        <p className="text-muted-foreground">Configure platform settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>General platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="Enter platform name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@example.com"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the platform for maintenance
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure admin notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New User Registrations</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new users sign up
                </p>
              </div>
              <Switch
                checked={notifyNewUsers}
                onCheckedChange={setNotifyNewUsers}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Booking Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when bookings are created
                </p>
              </div>
              <Switch
                checked={notifyNewBookings}
                onCheckedChange={setNotifyNewBookings}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cleaner Applications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when cleaners register
                </p>
              </div>
              <Switch
                checked={notifyCleanerApps}
                onCheckedChange={setNotifyCleanerApps}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Users must verify email before accessing the platform
                </p>
              </div>
              <Switch
                checked={requireEmailVerification}
                onCheckedChange={setRequireEmailVerification}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </p>
              </div>
              <Switch
                checked={require2faAdmins}
                onCheckedChange={setRequire2faAdmins}
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Information
            </CardTitle>
            <CardDescription>Platform system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Database Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {dbStatus === "checking" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : dbStatus === "connected" ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <p className={`text-2xl font-bold ${
                    dbStatus === "connected" ? "text-primary" : 
                    dbStatus === "error" ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {dbStatus === "checking" ? "Checking..." : 
                     dbStatus === "connected" ? "Connected" : "Error"}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Auth Service</p>
                <div className="flex items-center gap-2 mt-1">
                  {authStatus === "checking" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : authStatus === "active" ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <p className={`text-2xl font-bold ${
                    authStatus === "active" ? "text-primary" : 
                    authStatus === "error" ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {authStatus === "checking" ? "Checking..." : 
                     authStatus === "active" ? "Active" : "Error"}
                  </p>
                </div>
              </div>
            </div>
            {settings?.updated_at && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(settings.updated_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={saving}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
