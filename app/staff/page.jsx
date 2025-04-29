export default function StaffDashboard() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
        <div className="space-y-4">
          <a href="/staff/products" className="block text-blue-600 underline">
            Manage Products
          </a>
        </div>
      </div>
    );
  }
  