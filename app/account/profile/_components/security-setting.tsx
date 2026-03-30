// app/account/profile/_components/security-settings.tsx
"use client";

import Link from "next/link";
import { Mail, Key, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { ChangePasswordDialog } from "./change-password-dialog";

interface SecuritySettingsProps {
  user: {
    email: string;
    emailVerified: boolean;
  };
}

interface SecurityItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action: React.ReactNode;
  status?: "verified" | "warning" | "info";
}

function SecurityItem({ icon: Icon, title, description, action, status }: SecurityItemProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-xl border transition-colors",
      status === "verified" && "border-green-500/20 bg-green-500/5",
      status === "warning" && "border-yellow-500/20 bg-yellow-500/5",
      !status && "border-border/50 hover:bg-accent/30"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          status === "verified" && "bg-green-500/10",
          status === "warning" && "bg-yellow-500/10",
          !status && "bg-primary/10"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            status === "verified" && "text-green-600",
            status === "warning" && "text-yellow-600",
            !status && "text-primary"
          )} />
        </div>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  return (
    <div className="space-y-3 max-w-2xl">
      {/* Email Verification */}
      <SecurityItem
        icon={user.emailVerified ? CheckCircle : AlertCircle}
        title="Email Verification"
        description={user.emailVerified ? "Your email is verified" : "Please verify your email"}
        status={user.emailVerified ? "verified" : "warning"}
        action={
          user.emailVerified ? (
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
              Verified
            </Badge>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/verify-email">Verify Now</Link>
            </Button>
          )
        }
      />

      {/* Change Password */}
      <SecurityItem
        icon={Key}
        title="Password"
        description="Change your account password"
        action={<ChangePasswordDialog />}
      />

      {/* 2FA */}
      <SecurityItem
        icon={Shield}
        title="Two-Factor Authentication"
        description="Add an extra layer of security"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Two-factor authentication coming soon!")}
          >
            Enable
          </Button>
        }
      />
    </div>
  );
}