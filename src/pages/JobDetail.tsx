import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
  Timer,
  User,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const URGENCY_OPTIONS: Record<string, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "bg-destructive/10 text-destructive border-destructive/20" },
  soon: { label: "Within a Week", color: "bg-amber-100 text-amber-700 border-amber-200" },
  this_week: { label: "This Week", color: "bg-amber-100 text-amber-700 border-amber-200" },
  flexible: { label: "Flexible", color: "bg-secondary/10 text-secondary-foreground border-secondary/20" },
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyRate, setApplyRate] = useState("");

  // Fetch job details
  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["job-detail", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;

      // Fetch poster profile
      const { data: poster } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, created_at")
        .eq("id", data.user_id)
        .single();

      return { ...data, poster_name: poster?.full_name || "Anonymous", poster_avatar: poster?.avatar_url, poster_joined: poster?.created_at };
    },
  });

  // Check if user already applied
  const { data: existingApplication } = useQuery({
    queryKey: ["job-application-check", id],
    enabled: !!user && !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("id, status, created_at")
        .eq("job_id", id!)
        .eq("applicant_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch applications count
  const { data: applicationsData } = useQuery({
    queryKey: ["job-applications-list", id],
    enabled: !!id && !!user && user.id === job?.user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("id, applicant_id, cover_message, proposed_rate, status, created_at")
        .eq("job_id", id!)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Enrich with profile data
      const applicantIds = (data || []).map((a) => a.applicant_id);
      if (applicantIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", applicantIds);

      const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
      return (data || []).map((app) => ({
        ...app,
        applicant_name: profileMap.get(app.applicant_id)?.full_name || "Unknown",
        applicant_email: profileMap.get(app.applicant_id)?.email || "",
      }));
    },
  });

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("job_applications").insert({
        job_id: id!,
        applicant_id: user!.id,
        cover_message: applyMessage.trim() || null,
        proposed_rate: applyRate ? parseFloat(applyRate) : null,
      });
      if (error) throw error;

      const applicantName = user?.user_metadata?.full_name || user?.email || "A cleaner";
      supabase.functions.invoke("send-job-application-notification", {
        body: {
          jobId: id,
          applicantName,
          coverMessage: applyMessage.trim() || null,
          proposedRate: applyRate ? parseFloat(applyRate) : null,
        },
      }).catch((err) => console.error("Failed to send notification:", err));
    },
    onSuccess: () => {
      toast({ title: "Application Sent!", description: "The job poster will be notified." });
      queryClient.invalidateQueries({ queryKey: ["job-application-check", id] });
      queryClient.invalidateQueries({ queryKey: ["job-detail", id] });
      setApplyDialogOpen(false);
      setApplyMessage("");
      setApplyRate("");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  // Update application status (for job owner)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ appId, status }: { appId: string; status: string }) => {
      const { error } = await supabase
        .from("job_applications")
        .update({ status })
        .eq("id", appId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applications-list", id] });
      toast({ title: "Status Updated" });
    },
    onError: () => toast({ title: "Error", description: "Failed to update status.", variant: "destructive" }),
  });

  const formatBudget = (min: number | null, max: number | null) => {
    if (min && max) return `$${min} – $${max}`;
    if (min) return `From $${min}`;
    if (max) return `Up to $${max}`;
    return "Open budget";
  };

  const getUrgencyBadge = (urgency: string) => {
    const opt = URGENCY_OPTIONS[urgency] || URGENCY_OPTIONS.flexible;
    return <Badge variant="outline" className={`text-xs font-medium ${opt.color}`}>{opt.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Open</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      case "filled":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Filled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAppStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-amber-300 text-amber-600">Pending</Badge>;
      case "accepted":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center max-w-4xl">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">This job posting may have been removed or doesn't exist.</p>
          <Button onClick={() => navigate("/jobs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.id === job.user_id;
  const hasApplied = !!existingApplication;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground" onClick={() => navigate("/jobs")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Jobs
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {getStatusBadge(job.status)}
                  {getUrgencyBadge(job.urgency)}
                  <Badge variant="outline" className="text-xs">{job.service_type}</Badge>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{job.title}</h1>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    {formatBudget(job.budget_min, job.budget_max)}
                  </span>
                  {job.duration_hours && (
                    <span className="flex items-center gap-1.5">
                      <Timer className="h-4 w-4" />
                      {job.duration_hours} hour{job.duration_hours !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {job.applications_count} application{job.applications_count !== 1 ? "s" : ""}
                  </span>
                </div>

                <Separator className="my-4" />

                {/* Description */}
                <div>
                  <h2 className="font-semibold text-foreground mb-2">Job Description</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.description}</p>
                </div>

                {/* Schedule preferences */}
                {(job.preferred_date || job.preferred_time) && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h2 className="font-semibold text-foreground mb-2">Schedule Preferences</h2>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {job.preferred_date && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(job.preferred_date), "EEEE, MMMM d, yyyy")}
                          </span>
                        )}
                        {job.preferred_time && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {job.preferred_time}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="my-4" />

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Posted {format(new Date(job.created_at), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </CardContent>
            </Card>

            {/* Applications list (visible to job owner) */}
            {isOwner && applicationsData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    Applications ({applicationsData.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applicationsData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">No applications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applicationsData.map((app: any) => (
                        <div
                          key={app.id}
                          className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-muted/20"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                  {app.applicant_name?.charAt(0)?.toUpperCase() || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{app.applicant_name}</p>
                                <p className="text-xs text-muted-foreground">{app.applicant_email}</p>
                              </div>
                              {getAppStatusBadge(app.status)}
                            </div>
                            {app.cover_message && (
                              <p className="text-sm text-muted-foreground mt-2 italic">"{app.cover_message}"</p>
                            )}
                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                              {app.proposed_rate && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  ${app.proposed_rate}/hr
                                </span>
                              )}
                              <span>{format(new Date(app.created_at), "MMM d, yyyy")}</span>
                            </div>
                          </div>

                          {app.status === "pending" && (
                            <div className="flex gap-2 shrink-0">
                              <Button
                                size="sm"
                                onClick={() => updateStatusMutation.mutate({ appId: app.id, status: "accepted" })}
                                disabled={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatusMutation.mutate({ appId: app.id, status: "rejected" })}
                                disabled={updateStatusMutation.isPending}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply / Status Card */}
            <Card>
              <CardContent className="p-6">
                {!user ? (
                  <div className="text-center">
                    <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Sign in to apply for this job</p>
                    <Button className="w-full" asChild>
                      <a href="/auth">Sign In to Apply</a>
                    </Button>
                  </div>
                ) : isOwner ? (
                  <div className="text-center">
                    <Briefcase className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="font-semibold text-foreground mb-1">Your Job Posting</p>
                    <p className="text-sm text-muted-foreground mb-4">Manage this job from your dashboard</p>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard/my-jobs")}>
                      Go to My Jobs
                    </Button>
                  </div>
                ) : hasApplied ? (
                  <div className="text-center">
                    <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                    <p className="font-semibold text-foreground mb-1">Application Submitted</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Status: {getAppStatusBadge(existingApplication!.status)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applied {format(new Date(existingApplication!.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                ) : job.status !== "open" ? (
                  <div className="text-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-semibold text-foreground mb-1">Job Closed</p>
                    <p className="text-sm text-muted-foreground">This job is no longer accepting applications</p>
                  </div>
                ) : (
                  <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply for this Job</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label>Cover Message</Label>
                          <Textarea
                            value={applyMessage}
                            onChange={(e) => setApplyMessage(e.target.value)}
                            placeholder="Introduce yourself and explain why you're a good fit..."
                            rows={4}
                            maxLength={500}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Proposed Hourly Rate ($)</Label>
                          <Input
                            type="number"
                            value={applyRate}
                            onChange={(e) => setApplyRate(e.target.value)}
                            placeholder="e.g. 35"
                            min="0"
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => applyMutation.mutate()}
                          disabled={applyMutation.isPending}
                        >
                          {applyMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Submit Application
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>

            {/* Posted by Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3 text-sm">Posted By</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {job.poster_name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-foreground">{job.poster_name}</p>
                    {job.poster_joined && (
                      <p className="text-xs text-muted-foreground">
                        Member since {format(new Date(job.poster_joined), "MMM yyyy")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Details */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-foreground text-sm mb-1">Job Summary</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">{job.service_type}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-foreground">{job.location}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium text-foreground">{formatBudget(job.budget_min, job.budget_max)}</span>
                  </div>
                  {job.duration_hours && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">{job.duration_hours}h</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications</span>
                    <span className="font-medium text-foreground">{job.applications_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetail;
