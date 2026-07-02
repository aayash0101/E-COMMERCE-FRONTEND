import { useEffect, useState } from "react";
import { adminApi, type AdminStats, type RevenueByMonth } from "@/api/admin";
import Spinner from "@/components/ui/Spinner";

const StatCard = ({
  label,
  value,
  accent = "text-gray-900",
}: {
  label: string;
  value: string;
  accent?: string;
}) => (
  <div className="rounded-xl border border-gray-200 p-5">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</p>
  </div>
);

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenue, setRevenue] = useState<RevenueByMonth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getRevenueByMonth()])
      .then(([s, r]) => {
        setStats(s);
        setRevenue(r);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  const maxRevenue = Math.max(...revenue.map((r) => r.revenue), 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Admin Dashboard
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Customers" value={String(stats.totalUsers)} />
        <StatCard label="Vendors" value={String(stats.totalVendors)} />
        <StatCard label="Products" value={String(stats.totalProducts)} />
        <StatCard label="Orders" value={String(stats.totalOrders)} />
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          accent="text-green-600"
        />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900">
          Revenue — Last 6 Months
        </h2>
        {revenue.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No paid orders in this period.
          </p>
        ) : (
          <div className="mt-5 flex items-end gap-3">
            {revenue.map((r) => (
              <div
                key={`${r._id.year}-${r._id.month}`}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <span className="text-xs font-medium text-gray-600">
                  ${r.revenue.toFixed(0)}
                </span>
                <div
                  className="w-full rounded-t-md bg-primary-500"
                  style={{
                    height: `${Math.max((r.revenue / maxRevenue) * 140, 4)}px`,
                  }}
                />
                <span className="text-xs text-gray-400">
                  {monthNames[r._id.month - 1]} {r._id.year}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;