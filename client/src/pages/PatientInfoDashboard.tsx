import { Navigate } from "react-router-dom";
import type { Role } from "../types/Role";

interface PatientInfoDashboardProps {
  role: Role | undefined;
  isLoggedIn: boolean;
}

export default function PatientInfoDashboard({
  role,
  isLoggedIn,
}: PatientInfoDashboardProps) {
  // Don't redirect until we have a role (meaning auth check is complete)
  if (role === undefined) {
    // TODO: Add a loading state
    return null;
  }

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" replace />;
  }

  if (!["admin", "surgeon"].includes(role)) {
    // Redirect to login page if not admin or surgeon
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col px-4 py-8 md:px-8">
      <h1 className="font-kaisei text-2xl font-bold md:text-4xl">
        Patient Information Dashboard
      </h1>
      <p className="text-text mt-3 md:text-lg">
        View and manage essential patient details before, during, and after
        surgery. Please ensure all updates are accurate and respectful of
        patient privacy.
      </p>

      <div className="mt-6 flex flex-1 items-center justify-center rounded-xl border border-gray-200 p-6">
        <p>There are no patients yet</p>
      </div>
    </section>
  );
}
