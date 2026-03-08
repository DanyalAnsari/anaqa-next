import "server-only";

// Types
export interface Order {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	status:
		| "pending"
		| "confirmed"
		| "processing"
		| "shipped"
		| "delivered"
		| "cancelled";
	paymentStatus: "pending" | "paid" | "failed" | "refunded";
	total: number;
	itemsCount: number;
	createdAt: string;
}

export interface DashboardStats {
	totalRevenue: number;
	totalOrders: number;
	totalCustomers: number;
	totalProducts: number;
	revenueChange: number;
	ordersChange: number;
	customersChange: number;
	productsChange: number;
}

// Dummy Data
const orders: Order[] = [
	{
		id: "1",
		orderNumber: "ORD-001",
		customerName: "John Doe",
		customerEmail: "john@example.com",
		status: "delivered",
		paymentStatus: "paid",
		total: 299.99,
		itemsCount: 3,
		createdAt: "2024-01-15T10:30:00Z",
	},
	{
		id: "2",
		orderNumber: "ORD-002",
		customerName: "Jane Smith",
		customerEmail: "jane@example.com",
		status: "shipped",
		paymentStatus: "paid",
		total: 149.5,
		itemsCount: 2,
		createdAt: "2024-01-14T14:20:00Z",
	},
	{
		id: "3",
		orderNumber: "ORD-003",
		customerName: "Bob Wilson",
		customerEmail: "bob@example.com",
		status: "processing",
		paymentStatus: "paid",
		total: 89.99,
		itemsCount: 1,
		createdAt: "2024-01-14T09:15:00Z",
	},
	{
		id: "4",
		orderNumber: "ORD-004",
		customerName: "Alice Brown",
		customerEmail: "alice@example.com",
		status: "pending",
		paymentStatus: "pending",
		total: 459.0,
		itemsCount: 4,
		createdAt: "2024-01-13T16:45:00Z",
	},
	{
		id: "5",
		orderNumber: "ORD-005",
		customerName: "Charlie Davis",
		customerEmail: "charlie@example.com",
		status: "confirmed",
		paymentStatus: "paid",
		total: 199.99,
		itemsCount: 2,
		createdAt: "2024-01-13T11:30:00Z",
	},
	{
		id: "6",
		orderNumber: "ORD-006",
		customerName: "Eva Martinez",
		customerEmail: "eva@example.com",
		status: "cancelled",
		paymentStatus: "refunded",
		total: 75.0,
		itemsCount: 1,
		createdAt: "2024-01-12T08:00:00Z",
	},
];

// Data fetching functions
export async function getDashboardStats(): Promise<DashboardStats> {
	// Simulate DB query delay
	await new Promise((r) => setTimeout(r, 100));

	const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
	const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

	return {
		totalRevenue,
		totalOrders: orders.length,
		totalCustomers: 128,
		totalProducts: 45,
		revenueChange: 12.5,
		ordersChange: 8.2,
		customersChange: 15.3,
		productsChange: -2.1,
	};
}

export async function getRecentOrders(limit = 10): Promise<Order[]> {
	await new Promise((r) => setTimeout(r, 100));

	return [...orders]
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)
		.slice(0, limit);
}
