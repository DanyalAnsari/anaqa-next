"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Ban,
	UserCheck,
	Shield,
	KeyRound,
	UserX,
	LogOut,
	Trash2,
	Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { CustomerDetail } from "../../_lib/data";

export function CustomerActions({ customer }: { customer: CustomerDetail }) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [showBan, setShowBan] = useState(false);
	const [showRole, setShowRole] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	const [banReason, setBanReason] = useState("");
	const [banDuration, setBanDuration] = useState("permanent");
	const [newRole, setNewRole] = useState(customer.role);
	const [newPassword, setNewPassword] = useState("");

	async function run(action: () => Promise<void>, msg: string) {
		setLoading(true);
		try {
			await action();
			toast.success(msg);
			router.refresh();
		} catch (e: any) {
			toast.error(e?.message || "Action failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Actions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={() => setShowRole(true)}
						disabled={loading}
					>
						<Shield className="h-4 w-4 mr-3" /> Change Role
					</Button>

					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={() => setShowPassword(true)}
						disabled={loading}
					>
						<KeyRound className="h-4 w-4 mr-3" /> Set Password
					</Button>

					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={() =>
							run(async () => {
								await authClient.admin.impersonateUser({ userId: customer.id });
								router.push("/");
							}, "Now impersonating user")
						}
						disabled={loading}
					>
						<UserX className="h-4 w-4 mr-3" /> Impersonate
					</Button>

					<Button
						variant="outline"
						className="w-full justify-start"
						onClick={() =>
							run(async () => {
								await authClient.admin.revokeUserSessions({
									userId: customer.id,
								});
							}, "All sessions revoked")
						}
						disabled={loading}
					>
						<LogOut className="h-4 w-4 mr-3" /> Revoke Sessions
					</Button>

					{customer.banned ?
						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={() =>
								run(async () => {
									await authClient.admin.unbanUser({ userId: customer.id });
								}, "User unbanned")
							}
							disabled={loading}
						>
							<UserCheck className="h-4 w-4 mr-3" /> Unban User
						</Button>
					:	<Button
							variant="outline"
							className="w-full justify-start text-destructive hover:text-destructive"
							onClick={() => setShowBan(true)}
							disabled={loading}
						>
							<Ban className="h-4 w-4 mr-3" /> Ban User
						</Button>
					}

					<Button
						variant="outline"
						className="w-full justify-start text-destructive hover:text-destructive"
						onClick={() => setShowDelete(true)}
						disabled={loading}
					>
						<Trash2 className="h-4 w-4 mr-3" /> Delete User
					</Button>
				</CardContent>
			</Card>

			{/* Ban Dialog */}
			<Dialog open={showBan} onOpenChange={setShowBan}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Ban User</DialogTitle>
						<DialogDescription>
							Ban <strong>{customer.name || customer.email}</strong>. All
							sessions will be revoked.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Reason (optional)</Label>
							<Textarea
								placeholder="Ban reason..."
								value={banReason}
								onChange={(e) => setBanReason(e.target.value)}
								rows={3}
							/>
						</div>
						<div className="space-y-2">
							<Label>Duration</Label>
							<Select value={banDuration} onValueChange={setBanDuration}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="permanent">Permanent</SelectItem>
									<SelectItem value="3600">1 Hour</SelectItem>
									<SelectItem value="86400">1 Day</SelectItem>
									<SelectItem value="604800">1 Week</SelectItem>
									<SelectItem value="2592000">30 Days</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowBan(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							disabled={loading}
							onClick={() =>
								run(async () => {
									await authClient.admin.banUser({
										userId: customer.id,
										banReason: banReason || undefined,
										banExpiresIn:
											banDuration === "permanent" ? undefined : (
												parseInt(banDuration)
											),
									});
									setShowBan(false);
									setBanReason("");
									setBanDuration("permanent");
								}, "User banned")
							}
						>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Ban User
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Role Dialog */}
			<Dialog open={showRole} onOpenChange={setShowRole}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change Role</DialogTitle>
						<DialogDescription>
							Update role for <strong>{customer.name || customer.email}</strong>
							.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Label>Role</Label>
						<Select value={newRole} onValueChange={setNewRole}>
							<SelectTrigger className="mt-2">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="customer">Customer</SelectItem>
								<SelectItem value="admin">Admin</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowRole(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							disabled={loading || newRole === customer.role}
							onClick={() =>
								run(async () => {
									await authClient.admin.setRole({
										userId: customer.id,
										role: newRole,
									});
									setShowRole(false);
								}, "Role updated")
							}
						>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Password Dialog */}
			<Dialog open={showPassword} onOpenChange={setShowPassword}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Set Password</DialogTitle>
						<DialogDescription>
							Set new password for{" "}
							<strong>{customer.name || customer.email}</strong>.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<Label>New Password</Label>
						<Input
							type="password"
							placeholder="Minimum 8 characters"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="mt-2"
						/>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowPassword(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							disabled={loading || newPassword.length < 8}
							onClick={() =>
								run(async () => {
									await authClient.admin.setUserPassword({
										userId: customer.id,
										newPassword,
									});
									setShowPassword(false);
									setNewPassword("");
								}, "Password updated")
							}
						>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Set Password
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<AlertDialog open={showDelete} onOpenChange={setShowDelete}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete User</AlertDialogTitle>
						<AlertDialogDescription>
							Permanently delete{" "}
							<strong>{customer.name || customer.email}</strong> and all
							associated data? This cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowDelete(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							disabled={loading}
							onClick={() =>
								run(async () => {
									await authClient.admin.removeUser({ userId: customer.id });
									setShowDelete(false);
									router.push("/admin/customers");
								}, "User deleted")
							}
						>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
