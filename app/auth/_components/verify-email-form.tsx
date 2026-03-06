"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// ─── Types ──────────────────────────────────────────────────────────────────

type VerifyState = "waiting" | "verifying" | "success" | "error";

// ─── Component ──────────────────────────────────────────────────────────────

export function VerifyEmailForm() {
	const [pendingEmail, setPendingEmail] = useState(() => {
		if (typeof window === "undefined") {
			return null;
		}
		return sessionStorage.getItem("pendingVerificationEmail");
	});
	const router = useRouter();
	const hasSentRef = useRef(false);

	const [otp, setOtp] = useState("");
	const [verifyState, setVerifyState] = useState<VerifyState>("waiting");
	const [verifyErrorMsg, setVerifyErrorMsg] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);

	// Resend cooldown: 60 seconds
	const [cooldown, setCooldown] = useState(0);
	const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

	function startCooldown() {
		setCooldown(60);
		cooldownRef.current = setInterval(() => {
			setCooldown((prev) => {
				if (prev <= 1) {
					clearInterval(cooldownRef.current!);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}

	// Auto-send OTP when the page mounts (if we have an email)
	useEffect(() => {
		if (!pendingEmail || hasSentRef.current) return;
		hasSentRef.current = true;

		authClient.emailOtp
			.sendVerificationOtp({ email: pendingEmail, type: "email-verification" })
			.then(({ error }) => {
				if (error) toast.error(error.message ?? "Failed to send code");
				else startCooldown();
			});
	}, [pendingEmail]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (cooldownRef.current) clearInterval(cooldownRef.current);
		};
	}, []);

	// Verify OTP when all 6 digits are entered
	async function handleVerify(value: string) {
		if (value.length < 6 || !pendingEmail) return;
		setIsVerifying(true);
		try {
			const { error } = await authClient.emailOtp.verifyEmail({
				email: pendingEmail,
				otp: value,
			});
			if (error) {
				setVerifyState("error");
				setVerifyErrorMsg(error.message ?? "Invalid or expired code");
				setOtp("");
			} else {
				setVerifyState("success");
			}
		} catch {
			setVerifyState("error");
			setVerifyErrorMsg("An unexpected error occurred");
			setOtp("");
		} finally {
			setIsVerifying(false);
		}
	}

	// Manual resend
	async function handleResend() {
		if (!pendingEmail || cooldown > 0 || isResending) return;
		setIsResending(true);
		setOtp("");
		setVerifyState("waiting");
		setVerifyErrorMsg("");
		try {
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				email: pendingEmail,
				type: "email-verification",
			});
			if (error) {
				toast.error(error.message ?? "Failed to resend code");
			} else {
				toast.success("New code sent!", { description: "Check your inbox." });
				startCooldown();
			}
		} catch {
			toast.error("Failed to send code. Please try again.");
		} finally {
			setIsResending(false);
		}
	}

	// ─── Success State ───────────────────────────────────────────────────────

	if (verifyState === "success") {
		return (
			<div className="fade-in text-center">
				<Card className="border-none shadow-none bg-transparent">
					<CardContent className="pt-8">
						<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
							<CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
						</div>
						<h1 className="text-2xl font-medium mb-2">Email Verified!</h1>
						<p className="text-muted-foreground mb-6">
							Your account is now fully activated.
						</p>
						<Button className="w-full" onClick={() => router.push("/")}>
							Continue to Anāqa
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// ─── Waiting / Error State ───────────────────────────────────────────────

	return (
		<div className="fade-in">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader className="text-center px-0">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
						<Mail className="h-8 w-8 text-muted-foreground" />
					</div>
					<CardTitle className="text-2xl font-medium">
						Check Your Email
					</CardTitle>
					<CardDescription>
						{pendingEmail ?
							<>
								We sent a 6-digit code to{" "}
								<span className="font-medium text-foreground">
									{pendingEmail}
								</span>
							</>
						:	"We sent a 6-digit verification code to your email address"}
					</CardDescription>
				</CardHeader>

				<CardContent className="px-0 space-y-6">
					<Alert>
						<AlertDescription className="text-sm">
							Enter the code below to verify your account. It expires in{" "}
							<strong>5 minutes</strong>.
						</AlertDescription>
					</Alert>

					{/* OTP Error */}
					{verifyState === "error" && (
						<div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
							<AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
							<p>{verifyErrorMsg}</p>
						</div>
					)}

					{/* OTP Input */}
					<div className="flex flex-col items-center gap-4">
						<InputOTP
							maxLength={6}
							value={otp}
							onChange={(value) => {
								setOtp(value);
								if (verifyState === "error") {
									setVerifyState("waiting");
									setVerifyErrorMsg("");
								}
								if (value.length === 6) handleVerify(value);
							}}
							disabled={isVerifying}
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>

						{isVerifying && (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" />
								Verifying…
							</div>
						)}
					</div>

					{/* Resend */}
					<div className="flex flex-col items-center gap-2">
						<p className="text-sm text-muted-foreground">
							Didn&apos;t receive the code?
						</p>
						<Button
							variant="outline"
							size="sm"
							onClick={handleResend}
							disabled={cooldown > 0 || isResending || isVerifying}
						>
							{isResending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
							{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
						</Button>
					</div>

					<Button variant="ghost" className="w-full" asChild>
						<Link href="/auth/sign-in">Back to Sign In</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
