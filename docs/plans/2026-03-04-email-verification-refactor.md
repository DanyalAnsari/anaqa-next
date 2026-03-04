# Email Verification Form Refactoring Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the email verification form to use Next.js patterns and better-auth client

**Architecture:** Replace react-router/RTK Query with Next.js navigation and better-auth client. Token-based verification flow with resend capability using authClient.sendVerificationEmail().

**Tech Stack:** Next.js 16, React 19, better-auth, react-hook-form, zod, shadcn/ui

---

### Task 1: Create VerifyEmailForm client component

**Files:**
- Create: `app/auth/_components/verify-email-form.tsx`

**Step 1: Write the VerifyEmailForm component**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, Link } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { authClient } from "@/lib/auth-client";
import { z } from "zod";

const resendVerificationSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

type VerifyState = "waiting" | "verifying" | "success" | "error";

interface VerifyEmailFormProps {
	initialEmail?: string;
	token?: string | null;
}

export function VerifyEmailForm({ initialEmail = "", token: initialToken }: VerifyEmailFormProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = initialToken ?? searchParams.get("token");

	const [verifyState, setVerifyState] = useState<VerifyState>(
		token ? "verifying" : "waiting",
	);
	const [verifyErrorMsg, setVerifyErrorMsg] = useState("");

	const form = useForm<ResendVerificationInput>({
		resolver: zodResolver(resendVerificationSchema),
		defaultValues: { email: initialEmail },
	});

	// Auto-verify when token is in URL
	useEffect(() => {
		if (!token) return;

		async function verify() {
			try {
				await authClient.verifyEmail({
					query: {
						token: token,
					},
					fetchOptions: {
						onSuccess: () => {
							setVerifyState("success");
							toast.success("Email verified!");
						},
						onError: ({ error }) => {
							setVerifyState("error");
							setVerifyErrorMsg(error.message ?? "Verification failed");
						},
					},
				});
			} catch (err) {
				setVerifyState("error");
				setVerifyErrorMsg("An unexpected error occurred");
			}
		}

		verify();
	}, [token]);

	async function handleResend(data: ResendVerificationInput) {
		try {
			await authClient.sendVerificationEmail({
				email: data.email,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Verification email sent!", {
							description: "Please check your inbox.",
						});
					},
					onError: ({ error }) => {
						toast.error(error.message ?? "Failed to send email");
					},
				},
			});
		} catch {
			toast.error("Failed to send email. Please try again.");
		}
	}

	// ... rest of component with states (verifying, success, error, waiting)
	// See full implementation below
}
```

**Step 2: Add all UI states to the component**

Copy the full implementation with all states from the design.

**Step 3: Commit**

```bash
git add app/auth/_components/verify-email-form.tsx
git commit -m "refactor(auth): create VerifyEmailForm client component"
```

---

### Task 2: Update verify-email page to use server component pattern

**Files:**
- Modify: `app/auth/verify-email/page.tsx`

**Step 1: Update the page component**

```tsx
import { Suspense } from "react";
import { VerifyEmailForm } from "../_components/verify-email-form";

export default function VerifyEmailPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string; email?: string }>;
}) {
	return (
		<div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
			<Suspense fallback={
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto" />
				</div>
			}>
				<VerifyEmailPageContent searchParams={searchParams} />
			</Suspense>
		</div>
	);
}

async function VerifyEmailPageContent({
	searchParams,
}: {
	searchParams: Promise<{ token?: string; email?: string }>;
}) {
	const { token, email } = await searchParams;

	return (
		<VerifyEmailForm
			token={token}
			initialEmail={email}
		/>
	);
}
```

**Step 2: Commit**

```bash
git add app/auth/verify-email/page.tsx
git commit -m "refactor(auth): update verify-email page to server component"
```

---

### Task 3: Update sign-up form to redirect to verify-email with email

**Files:**
- Modify: `app/auth/_components/sign-up-form.tsx`

**Step 1: Update onSuccess redirect**

Change the onSuccess callback to redirect to verify-email with email:

```tsx
fetchOptions: {
	onSuccess: () => {
		toast.success("Account created!", {
			description: "Please check your email to verify your account.",
		});
		router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
	},
	onError: ({ error }) => {
		toast.error(error?.message);
	},
},
```

**Step 2: Commit**

```bash
git add app/auth/_components/sign-up-form.tsx
git commit -m "refactor(auth): redirect to verify-email after signup"
```

---

### Task 4: Test the verification flow

**Step 1: Run the development server**

```bash
npm run dev
```

**Step 2: Test signup flow**
1. Navigate to /auth/sign-up
2. Fill in the form and submit
3. Verify redirect to /auth/verify-email?email=xxx

**Step 3: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git commit -m "test(auth): verify email flow works correctly"
```
