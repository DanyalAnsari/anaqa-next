"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	MoreHorizontal,
	Ban,
	UserCheck,
	Shield,
	Trash2,
	KeyRound,
	UserX,
	Loader2,
	Eye,
	ShoppingBag,
	LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { Customer } from "../_lib/data";

interface UserActionsProps {
	customer: Customer;
}

export function UserActions({ customer }: UserActionsProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [showBanDialog, setShowBanDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showRoleDialog, setShowRoleDialog] = useState(false);
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);

	const [banReason, setBanReason] = useState("");
	const [banDuration, setBanDuration] = useState("permanent");
	const [newRole, setNewRole] = useState(customer.role);
	const [newPassword, setNewPassword] = useState("");

	async function handleAction(action: () => Promise<void>, successMsg: string) {
		setLoading(true);
		try {
			await action();
			toast.success(successMsg);
			router.refresh();
		} catch (error: any) {
			toast.error(error?.message || "Action failed");
		} finally {
			setLoading(false);
		}
	}

	async function handleBan() {
		await handleAction(async () => {
			await authClient.admin.banUser({
				userId: customer.id,
				banReason: banReason || undefined,
				banExpiresIn:
					banDuration === "permanent" ? undefined : parseInt(banDuration),
			});
			setShowBanDialog(false);
			setBanReason("");
			setBanDuration("permanent");
		}, "User banned successfully");
	}

	async function handleUnban() {
		await handleAction(async () => {
			await authClient.admin.unbanUser({ userId: customer.id });
		}, "User unbanned successfully");
	}

	async function handleSetRole() {
		await handleAction(async () => {
			await authClient.admin.setRole({ userId: customer.id, role: newRole });
			setShowRoleDialog(false);
		}, "Role updated successfully");
	}

	async function handleSetPassword() {
		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		await handleAction(async () => {
			await authClient.admin.setUserPassword({
				userId: customer.id,
				newPassword,
			});
			setShowPasswordDialog(false);
			setNewPassword("");
		}, "Password updated successfully");
	}

	async function handleDelete() {
		await handleAction(async () => {
			await authClient.admin.removeUser({ userId: customer.id });
			setShowDeleteDialog(false);
		}, "User deleted successfully");
	}

	async function handleImpersonate() {
		await handleAction(async () => {
			await authClient.admin.impersonateUser({ userId: customer.id });
			router.push("/");
		}, "Now impersonating user");
	}

	async function handleRevokeSessions() {
		await handleAction(async () => {
			await authClient.admin.revokeUserSessions({ userId: customer.id });
		}, "All sessions revoked");
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						disabled={loading}
					>
						{loading ?
							<Loader2 className="h-4 w-4 animate-spin" />
						:	<MoreHorizontal className="h-4 w-4" />}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={() => router.push(`/admin/customers/${customer.id}`)}
					>
						<Eye className="h-4 w-4 mr-2" />
						View Details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => router.push(`/admin/orders?userId=${customer.id}`)}
					>
						<ShoppingBag className="h-4 w-4 mr-2" />
						View Orders
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setShowRoleDialog(true)}>
						<Shield className="h-4 w-4 mr-2" />
						Change Role
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
						<KeyRound className="h-4 w-4 mr-2" />
						Set Password
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleImpersonate}>
						<UserX className="h-4 w-4 mr-2" />
						Impersonate
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleRevokeSessions}>
						<LogOut className="h-4 w-4 mr-2" />
						Revoke Sessions
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					{customer.banned ?
						<DropdownMenuItem onClick={handleUnban}>
							<UserCheck className="h-4 w-4 mr-2" />
							Unban User
						</DropdownMenuItem>
					:	<DropdownMenuItem onClick={() => setShowBanDialog(true)}>
							<Ban className="h-4 w-4 mr-2" />
							Ban User
						</DropdownMenuItem>
					}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setShowDeleteDialog(true)}
						className="text-destructive focus:text-destructive"
					>
						<Trash2 className="h-4 w-4 mr-2" />
						Delete User
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Ban Dialog */}
			<Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Ban User</DialogTitle>
						<DialogDescription>
							Ban <strong>{customer.name || customer.email}</strong>. This will
							revoke all their sessions.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Reason (optional)</Label>
							<Textarea
								placeholder="Enter ban reason..."
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
							onClick={() => setShowBanDialog(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleBan}
							disabled={loading}
						>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Ban User
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Role Dialog */}
			<Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
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
							onClick={() => setShowRoleDialog(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSetRole}
							disabled={loading || newRole === customer.role}
						>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Password Dialog */}
			<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
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
							onClick={() => setShowPasswordDialog(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSetPassword}
							disabled={loading || newPassword.length < 8}
						>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Set Password
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete User</AlertDialogTitle>
						<AlertDialogDescription>
							Permanently delete{" "}
							<strong>{customer.name || customer.email}</strong>? This cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowDeleteDialog(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
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
