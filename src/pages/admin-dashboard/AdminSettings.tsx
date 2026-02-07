import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, Database, Mail } from "lucide-react";

const AdminSettings = () => {
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
                <Input id="platform-name" defaultValue="The Cleaning Network" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" placeholder="support@example.com" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the platform for maintenance
                </p>
              </div>
              <Switch />
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
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Booking Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when bookings are created
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cleaner Applications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when cleaners register
                </p>
              </div>
              <Switch defaultChecked />
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
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </p>
              </div>
              <Switch />
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
                <p className="text-2xl font-bold text-green-600">Connected</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium">Auth Service</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
