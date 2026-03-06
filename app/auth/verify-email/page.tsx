import { VerifyEmailForm } from "@/app/auth/_components/verify-email-form";

export default async function VerifyEmailPage() {
	return (
		<div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
			<VerifyEmailForm />
		</div>
	);
}
