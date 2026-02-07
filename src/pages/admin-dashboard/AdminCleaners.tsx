import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Briefcase, Star, CheckCircle, XCircle, Loader2, MapPin, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface CleanerProfile {
  id: string;
  user_id: string;
  business_name: string;
  hourly_rate: number;
  is_verified: boolean;
  is_active: boolean;
  services: string[];
  service_areas: string[];
  created_at: string;
}

const AdminCleaners = () => {
  const [cleaners, setCleaners] = useState<CleanerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const { data, error } = await supabase
          .from("cleaner_profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCleaners(data || []);
      } catch (error) {
        console.error("Error fetching cleaners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCleaners();
  }, []);

  const filteredCleaners = cleaners.filter((cleaner) =>
    cleaner.business_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleVerification = async (cleanerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("cleaner_profiles")
        .update({ is_verified: !currentStatus })
        .eq("id", cleanerId);

      if (error) throw error;

      setCleaners((prev) =>
        prev.map((c) =>
          c.id === cleanerId ? { ...c, is_verified: !currentStatus } : c
        )
      );
    } catch (error) {
      console.error("Error updating cleaner:", error);
    }
  };

  const handleToggleActive = async (cleanerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("cleaner_profiles")
        .update({ is_active: !currentStatus })
        .eq("id", cleanerId);

      if (error) throw error;

      setCleaners((prev) =>
        prev.map((c) =>
          c.id === cleanerId ? { ...c, is_active: !currentStatus } : c
        )
      );
    } catch (error) {
      console.error("Error updating cleaner:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Cleaner Management</h2>
        <p className="text-muted-foreground">View and manage service providers on the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Cleaners</CardTitle>
              <CardDescription>
                {cleaners.length} cleaners registered • {cleaners.filter((c) => c.is_verified).length} verified
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cleaners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCleaners.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No cleaners found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCleaners.map((cleaner) => (
                    <TableRow key={cleaner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{cleaner.business_name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {cleaner.service_areas.slice(0, 2).join(", ") || "No areas set"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${cleaner.hourly_rate}/hr</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cleaner.services.slice(0, 2).map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {cleaner.services.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{cleaner.services.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={cleaner.is_verified ? "default" : "secondary"}>
                            {cleaner.is_verified ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
                            ) : (
                              "Unverified"
                            )}
                          </Badge>
                          <Badge variant={cleaner.is_active ? "outline" : "destructive"}>
                            {cleaner.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant={cleaner.is_verified ? "outline" : "default"}
                            onClick={() => handleToggleVerification(cleaner.id, cleaner.is_verified)}
                          >
                            {cleaner.is_verified ? "Unverify" : "Verify"}
                          </Button>
                          <Button
                            size="sm"
                            variant={cleaner.is_active ? "destructive" : "outline"}
                            onClick={() => handleToggleActive(cleaner.id, cleaner.is_active)}
                          >
                            {cleaner.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCleaners;
