import { useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Landmark,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  Banknote,
  FileText,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";

type PaymentStatus = "pending" | "under_review" | "verified" | "rejected";

interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  cleanerName: string;
  cleanerEmail: string;
  amount: number;
  serviceFee: number;
  totalAmount: number;
  paymentMethod: string;
  status: PaymentStatus;
  submittedAt: Date;
  bookingDate: Date;
  bookingTime: string;
  serviceType: string;
  customerAddress: string;
  referenceNumber: string;
  notes: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
}

// Mock data for pending payments
const mockPendingPayments: Payment[] = [
  {
    id: "PAY-001",
    bookingId: "BK-2024-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    cleanerName: "SparklePro Cleaning",
    cleanerEmail: "sparklepro@email.com",
    amount: 180.00,
    serviceFee: 18.00,
    totalAmount: 198.00,
    paymentMethod: "bank",
    status: "pending",
    submittedAt: new Date("2024-02-05T10:30:00"),
    bookingDate: new Date("2024-02-10"),
    bookingTime: "9:00 AM",
    serviceType: "Deep Cleaning",
    customerAddress: "123 Main St, Toronto, ON",
    referenceNumber: "TRF-78234",
    notes: "Payment sent from TD Bank",
  },
  {
    id: "PAY-002",
    bookingId: "BK-2024-002",
    customerName: "Michael Chen",
    customerEmail: "m.chen@email.com",
    cleanerName: "CleanSweep Services",
    cleanerEmail: "cleansweep@email.com",
    amount: 240.00,
    serviceFee: 24.00,
    totalAmount: 264.00,
    paymentMethod: "bank",
    status: "pending",
    submittedAt: new Date("2024-02-06T14:15:00"),
    bookingDate: new Date("2024-02-12"),
    bookingTime: "2:00 PM",
    serviceType: "Standard Home Cleaning",
    customerAddress: "456 Oak Ave, Vancouver, BC",
    referenceNumber: "ETR-91847",
    notes: "",
  },
  {
    id: "PAY-003",
    bookingId: "BK-2024-003",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.r@email.com",
    cleanerName: "Fresh & Clean Co",
    cleanerEmail: "freshclean@email.com",
    amount: 150.00,
    serviceFee: 15.00,
    totalAmount: 165.00,
    paymentMethod: "bank",
    status: "under_review",
    submittedAt: new Date("2024-02-04T09:00:00"),
    bookingDate: new Date("2024-02-08"),
    bookingTime: "11:00 AM",
    serviceType: "Move In/Out Cleaning",
    customerAddress: "789 Pine Rd, Calgary, AB",
    referenceNumber: "RBC-45621",
    notes: "Amount mismatch - customer sent $160",
  },
  {
    id: "PAY-004",
    bookingId: "BK-2024-004",
    customerName: "David Kim",
    customerEmail: "d.kim@email.com",
    cleanerName: "Pristine Home Care",
    cleanerEmail: "pristine@email.com",
    amount: 320.00,
    serviceFee: 32.00,
    totalAmount: 352.00,
    paymentMethod: "bank",
    status: "verified",
    submittedAt: new Date("2024-02-03T11:45:00"),
    bookingDate: new Date("2024-02-07"),
    bookingTime: "10:00 AM",
    serviceType: "Post-Construction",
    customerAddress: "321 Elm St, Montreal, QC",
    referenceNumber: "BMO-33291",
    notes: "Verified by admin",
    verifiedAt: new Date("2024-02-03T15:30:00"),
    verifiedBy: "Admin User",
  },
  {
    id: "PAY-005",
    bookingId: "BK-2024-005",
    customerName: "Lisa Thompson",
    customerEmail: "lisa.t@email.com",
    cleanerName: "EcoClean Solutions",
    cleanerEmail: "ecoclean@email.com",
    amount: 200.00,
    serviceFee: 20.00,
    totalAmount: 220.00,
    paymentMethod: "bank",
    status: "rejected",
    submittedAt: new Date("2024-02-02T16:20:00"),
    bookingDate: new Date("2024-02-06"),
    bookingTime: "3:00 PM",
    serviceType: "Office Cleaning",
    customerAddress: "555 Business Blvd, Ottawa, ON",
    referenceNumber: "",
    notes: "No payment received after 48 hours",
    rejectedAt: new Date("2024-02-04T16:20:00"),
    rejectedBy: "Admin User",
    rejectionReason: "Payment not found in bank records",
  },
];

const AdminPaymentVerification = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPendingPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [verificationNote, setVerificationNote] = useState("");
  const { toast } = useToast();

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.cleanerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const underReviewCount = payments.filter((p) => p.status === "under_review").length;
  const verifiedCount = payments.filter((p) => p.status === "verified").length;
  const rejectedCount = payments.filter((p) => p.status === "rejected").length;
  const pendingAmount = payments
    .filter((p) => p.status === "pending" || p.status === "under_review")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "under_review":
        return (
          <Badge variant="outline" className="gap-1 border-accent text-accent-foreground">
            <AlertTriangle className="h-3 w-3" />
            Under Review
          </Badge>
        );
      case "verified":
        return (
          <Badge variant="default" className="gap-1 bg-primary">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
    }
  };

  const sendPaymentNotification = async (
    payment: Payment,
    type: "verified" | "rejected",
    reason?: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-payment-notification", {
        body: {
          type,
          customerEmail: payment.customerEmail,
          customerName: payment.customerName,
          paymentId: payment.id,
          bookingId: payment.bookingId,
          amount: payment.totalAmount,
          cleanerName: payment.cleanerName,
          bookingDate: format(payment.bookingDate, "EEEE, MMMM d, yyyy"),
          bookingTime: payment.bookingTime,
          serviceType: payment.serviceType,
          customerAddress: payment.customerAddress,
          rejectionReason: reason,
        },
      });

      if (error) {
        console.error("Error sending customer notification:", error);
        return false;
      }

      console.log("Customer notification sent:", data);
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  };

  const sendCleanerNotification = async (payment: Payment) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-payment-notification", {
        body: {
          type: "cleaner_confirmed",
          customerEmail: payment.customerEmail,
          customerName: payment.customerName,
          paymentId: payment.id,
          bookingId: payment.bookingId,
          amount: payment.totalAmount,
          cleanerName: payment.cleanerName,
          cleanerEmail: payment.cleanerEmail,
          bookingDate: format(payment.bookingDate, "EEEE, MMMM d, yyyy"),
          bookingTime: payment.bookingTime,
          serviceType: payment.serviceType,
          customerAddress: payment.customerAddress,
        },
      });

      if (error) {
        console.error("Error sending cleaner notification:", error);
        return false;
      }

      console.log("Cleaner notification sent:", data);
      return true;
    } catch (error) {
      console.error("Error sending cleaner notification:", error);
      return false;
    }
  };

  const handleVerify = async () => {
    if (!selectedPayment) return;

    // Update local state
    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment.id
          ? {
              ...p,
              status: "verified" as PaymentStatus,
              verifiedAt: new Date(),
              verifiedBy: "Admin User",
              notes: verificationNote || p.notes,
            }
          : p
      )
    );

    // Send email notifications to both customer and cleaner
    const [customerEmailSent, cleanerEmailSent] = await Promise.all([
      sendPaymentNotification(selectedPayment, "verified"),
      sendCleanerNotification(selectedPayment),
    ]);

    if (customerEmailSent && cleanerEmailSent) {
      toast({
        title: "Payment Verified",
        description: `Payment ${selectedPayment.id} verified. Both customer and cleaner have been notified.`,
      });
    } else if (customerEmailSent || cleanerEmailSent) {
      toast({
        title: "Payment Verified",
        description: `Payment ${selectedPayment.id} verified. Some notifications failed to send.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Verified",
        description: `Payment ${selectedPayment.id} verified. Email notifications failed.`,
        variant: "destructive",
      });
    }

    setVerifyDialogOpen(false);
    setSelectedPayment(null);
    setVerificationNote("");
  };

  const handleReject = async () => {
    if (!selectedPayment || !rejectionReason) return;

    // Update local state
    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment.id
          ? {
              ...p,
              status: "rejected" as PaymentStatus,
              rejectedAt: new Date(),
              rejectedBy: "Admin User",
              rejectionReason,
            }
          : p
      )
    );

    // Send email notification
    const emailSent = await sendPaymentNotification(selectedPayment, "rejected", rejectionReason);

    toast({
      variant: "destructive",
      title: "Payment Rejected",
      description: emailSent
        ? `Payment ${selectedPayment.id} rejected. Customer has been notified.`
        : `Payment ${selectedPayment.id} rejected. Email notification failed.`,
    });

    setRejectDialogOpen(false);
    setSelectedPayment(null);
    setRejectionReason("");
  };

  const handleMarkUnderReview = (payment: Payment) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === payment.id ? { ...p, status: "under_review" as PaymentStatus } : p
      )
    );

    toast({
      title: "Status Updated",
      description: `Payment ${payment.id} marked as under review.`,
    });
  };

  const exportPayments = () => {
    toast({
      title: "Export Started",
      description: "Preparing CSV export of payment records...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Verification</h1>
          <p className="text-muted-foreground">
            Review and verify pending bank transfer payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPayments}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-secondary/10">
                <Clock className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-accent/10">
                <AlertTriangle className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{underReviewCount}</p>
                <p className="text-xs text-muted-foreground">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verifiedCount}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedCount}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">${pendingAmount.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Pending Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, booking ID, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            Bank Transfer Payments
          </CardTitle>
          <CardDescription>
            {filteredPayments.length} payment{filteredPayments.length !== 1 && "s"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Cleaner</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Landmark className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">No payments found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.id}</p>
                        <p className="text-xs text-muted-foreground">{payment.bookingId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.customerName}</p>
                        <p className="text-xs text-muted-foreground">{payment.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{payment.cleanerName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">${payment.totalAmount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          Fee: ${payment.serviceFee.toFixed(2)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.referenceNumber || (
                        <span className="text-muted-foreground italic">Not provided</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{format(payment.submittedAt, "MMM d, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(payment.submittedAt, "h:mm a")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPayment(payment);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {(payment.status === "pending" || payment.status === "under_review") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setVerifyDialogOpen(true);
                                }}
                                className="text-primary"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Verify Payment
                              </DropdownMenuItem>
                              {payment.status === "pending" && (
                                <DropdownMenuItem
                                  onClick={() => handleMarkUnderReview(payment)}
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Mark Under Review
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setRejectDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject Payment
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Payment Details
            </DialogTitle>
            <DialogDescription>
              Review payment information for {selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedPayment.status)}
                <span className="text-2xl font-bold text-primary">
                  ${selectedPayment.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Customer</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{selectedPayment.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPayment.customerEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Cleaner</Label>
                    <p className="font-medium mt-1">{selectedPayment.cleanerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Booking Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p>{format(selectedPayment.bookingDate, "EEEE, MMMM d, yyyy")}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Amount Breakdown</Label>
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Service Amount</span>
                        <span>${selectedPayment.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Platform Fee</span>
                        <span>${selectedPayment.serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total</span>
                        <span>${selectedPayment.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Reference Number</Label>
                    <p className="font-mono mt-1">
                      {selectedPayment.referenceNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Submitted</Label>
                    <p className="mt-1">
                      {format(selectedPayment.submittedAt, "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>

              {selectedPayment.notes && (
                <div>
                  <Label className="text-muted-foreground">Notes</Label>
                  <p className="mt-1 p-3 bg-muted rounded-lg text-sm">
                    {selectedPayment.notes}
                  </p>
                </div>
              )}

              {selectedPayment.status === "verified" && selectedPayment.verifiedAt && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Verified by:</strong> {selectedPayment.verifiedBy}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedPayment.verifiedAt, "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              )}

              {selectedPayment.status === "rejected" && selectedPayment.rejectedAt && (
                <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Rejected by:</strong> {selectedPayment.rejectedBy}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedPayment.rejectedAt, "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Reason:</strong> {selectedPayment.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedPayment &&
              (selectedPayment.status === "pending" ||
                selectedPayment.status === "under_review") && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setViewDialogOpen(false);
                      setRejectDialogOpen(true);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setViewDialogOpen(false);
                      setVerifyDialogOpen(true);
                    }}
                  >
                    Verify Payment
                  </Button>
                </>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Verify Payment
            </DialogTitle>
            <DialogDescription>
              Confirm that you have verified this bank transfer payment.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-medium">{selectedPayment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    ${selectedPayment.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="font-mono">
                    {selectedPayment.referenceNumber || "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Verification Note (Optional)</Label>
                <Textarea
                  placeholder="Add any notes about the verification..."
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
                <p>
                  <strong>What happens next:</strong>
                </p>
                <ul className="list-disc list-inside mt-1 text-muted-foreground space-y-1">
                  <li>Booking status will be updated to "Confirmed"</li>
                  <li>Customer will receive a confirmation email</li>
                  <li>Cleaner will be notified of the upcoming job</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Reject Payment
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment.
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <span className="font-medium">{selectedPayment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{selectedPayment.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    ${selectedPayment.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rejection Reason *</Label>
                <Textarea
                  placeholder="Explain why this payment is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg text-sm">
                <p>
                  <strong>Warning:</strong> Rejecting this payment will:
                </p>
                <ul className="list-disc list-inside mt-1 text-muted-foreground space-y-1">
                  <li>Cancel the associated booking</li>
                  <li>Notify the customer via email</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPaymentVerification;
