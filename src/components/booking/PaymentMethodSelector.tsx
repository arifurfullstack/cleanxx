import { useState } from "react";
import { CreditCard, Banknote, Landmark, Check, Copy, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePaymentSettings, PaymentMethod, PaymentMethodOption } from "@/hooks/usePaymentSettings";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

const iconMap = {
  "credit-card": CreditCard,
  "banknote": Banknote,
  "landmark": Landmark,
};

const PaymentMethodSelector = ({
  selectedMethod,
  onMethodChange,
  disabled = false,
}: PaymentMethodSelectorProps) => {
  const { getAvailablePaymentMethods, getBankDetails, loading, hasPaymentMethods } = usePaymentSettings();
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const paymentMethods = getAvailablePaymentMethods();
  const bankDetails = getBankDetails();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Payment Method</Label>
        <div className="animate-pulse space-y-2">
          <div className="h-16 bg-muted rounded-lg" />
          <div className="h-16 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!hasPaymentMethods) {
    return (
      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">
              No payment methods are currently available. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label>Payment Method</Label>
      <RadioGroup
        value={selectedMethod || ""}
        onValueChange={(value) => onMethodChange(value as PaymentMethod)}
        disabled={disabled}
        className="space-y-2"
      >
        {paymentMethods.map((method) => {
          const Icon = iconMap[method.icon as keyof typeof iconMap] || CreditCard;
          const isSelected = selectedMethod === method.id;

          return (
            <div key={method.id}>
              <label
                htmlFor={method.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full",
                    isSelected ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{method.name}</span>
                    {method.id === "stripe" && (
                      <Badge variant="secondary" className="text-xs">Secure</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                {isSelected && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </label>

              {/* Show instructions for selected non-Stripe methods */}
              {isSelected && method.id === "cash" && method.instructions && (
                <Card className="mt-2 border-muted bg-muted/30">
                  <CardContent className="py-3 px-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> {method.instructions}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Show bank details for bank transfer */}
              {isSelected && method.id === "bank" && bankDetails && (
                <Card className="mt-2 border-muted bg-muted/30">
                  <CardContent className="py-3 px-4 space-y-3">
                    {bankDetails.instructions && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Instructions:</strong> {bankDetails.instructions}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      {bankDetails.bankName && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Bank Name:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{bankDetails.bankName}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(bankDetails.bankName, "Bank Name")}
                            >
                              {copiedField === "Bank Name" ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {bankDetails.accountName && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Account Name:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{bankDetails.accountName}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(bankDetails.accountName, "Account Name")}
                            >
                              {copiedField === "Account Name" ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {bankDetails.routingNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Routing #:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium font-mono">{bankDetails.routingNumber}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(bankDetails.routingNumber, "Routing Number")}
                            >
                              {copiedField === "Routing Number" ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {bankDetails.accountNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Account #:</span>
                          <span className="font-medium font-mono">{bankDetails.accountNumber}</span>
                        </div>
                      )}

                      {bankDetails.swiftCode && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">SWIFT/BIC:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium font-mono">{bankDetails.swiftCode}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(bankDetails.swiftCode, "SWIFT Code")}
                            >
                              {copiedField === "SWIFT Code" ? (
                                <Check className="h-3 w-3 text-primary" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                      Your booking will be confirmed once payment is verified by our team.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
