"use client";
import { useEffect } from 'react';
import { checkStaff } from '@/lib/checkAuth';

export default function StaffDashboard() {
  useEffect(() => { checkStaff(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, Staff</h1>
    </div>
  );
}
