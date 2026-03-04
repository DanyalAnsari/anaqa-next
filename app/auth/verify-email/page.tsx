import { Suspense } from "react";
import { VerifyEmailForm } from "../_components/verify-email-form";

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={<div className="text-center p-8">Loading...</div>}>
			<VerifyEmailForm />
		</Suspense>
	);
}
