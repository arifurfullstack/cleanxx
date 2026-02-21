import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Trash2, Eye, ShoppingBag, DollarSign, MapPin, Clock, Loader2, Download,
} from "lucide-react";
import { format } from "date-fns";
import logoDefault from "@/assets/logo.jpeg";

type StatusFilter = "all" | "active" | "inactive";

const AdminServiceListings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewListing, setViewListing] = useState<any | null>(null);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin-service-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_listings")
        .select("*, cleaner_profiles(business_name, is_verified, user_id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("service_listings")
        .update({ is_active: active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-listings"] });
      toast({ title: "Status updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("service_listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Service listing deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-service-listings"] });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const filtered = listings.filter((l: any) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase()) ||
      (l.cleaner_profiles?.business_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && l.is_active) ||
      (statusFilter === "inactive" && !l.is_active);
    return matchesSearch && matchesStatus;
  });

  const totalViews = listings.reduce((s: number, l: any) => s + (l.views_count || 0), 0);
  const totalOrders = listings.reduce((s: number, l: any) => s + (l.orders_count || 0), 0);

  const getPriceLabel = (type: string, price: number) => {
    switch (type) {
      case "hourly": return `$${price}/hr`;
      case "starting_at": return `From $${price}`;
      default: return `$${price}`;
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Category", "Price", "Price Type", "Cleaner", "Status", "Views", "Orders", "Created"];
    const rows = listings.map((l: any) => [
      l.title, l.category, l.price, l.price_type,
      l.cleaner_profiles?.business_name || "N/A",
      l.is_active ? "Active" : "Inactive",
      l.views_count, l.orders_count,
      format(new Date(l.created_at), "yyyy-MM-dd"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c: any) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `service-listings-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Service Listings</h1>
        <p className="text-muted-foreground">Manage all cleaner service listings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{listings.length}</p>
              <p className="text-xs text-muted-foreground">Total Listings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Eye className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{listings.filter((l: any) => l.is_active).length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Eye className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{totalViews}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg">All Listings</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, category, or cleaner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Cleaner</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No service listings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((listing: any) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={listing.image_url || logoDefault}
                            alt={listing.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate max-w-[200px]">{listing.title}</p>
                            <p className="text-xs text-muted-foreground">{listing.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{listing.cleaner_profiles?.business_name || "N/A"}</span>
                          {listing.cleaner_profiles?.is_verified && (
                            <Badge variant="secondary" className="text-[10px] px-1">✓</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {getPriceLabel(listing.price_type, listing.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {listing.views_count}</span>
                          <span className="flex items-center gap-0.5"><ShoppingBag className="h-3 w-3" /> {listing.orders_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={listing.is_active}
                          onCheckedChange={(checked) => toggleActive.mutate({ id: listing.id, active: checked })}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(listing.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setViewListing(listing)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => setDeleteId(listing.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewListing} onOpenChange={() => setViewListing(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Service Details</DialogTitle>
          </DialogHeader>
          {viewListing && (
            <div className="space-y-4">
              <img
                src={viewListing.image_url || logoDefault}
                alt={viewListing.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">{viewListing.title}</h3>
                <p className="text-sm text-muted-foreground">{viewListing.category}</p>
              </div>
              <p className="text-sm">{viewListing.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{getPriceLabel(viewListing.price_type, viewListing.price)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{viewListing.duration_hours || 2}h • {viewListing.delivery_time || "Same day"}</span>
                </div>
                {viewListing.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{viewListing.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span>Cleaner: {viewListing.cleaner_profiles?.business_name || "N/A"}</span>
                </div>
              </div>
              {viewListing.features?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Features</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                    {viewListing.features.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                <span>Views: {viewListing.views_count}</span>
                <span>Orders: {viewListing.orders_count}</span>
                <span>Created: {format(new Date(viewListing.created_at), "MMM d, yyyy")}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service Listing</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this service listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminServiceListings;
