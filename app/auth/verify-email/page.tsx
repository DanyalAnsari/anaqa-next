import { Suspense } from "react";
import { VerifyEmailForm } from "../_components/verify-email-form";
import { Loader2 } from "lucide-react";

export default async function VerifyEmailPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string; email?: string }>;
}) {
	const { token, email } = await searchParams;

	return (
		<div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
			<Suspense
				fallback={
					<div className="text-center">
						<Loader2 className="h-8 w-8 animate-spin mx-auto" />
					</div>
				}
			>
				<VerifyEmailForm token={token} initialEmail={email} />
			</Suspense>
		</div>
	);
}
