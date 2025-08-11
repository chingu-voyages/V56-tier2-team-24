import clsx from "clsx";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Search from "../components/Search";
import API from "../config/apiClient";
import { getPatients } from "../lib/api";
import type { Patient } from "../types/Patient";
import type { Role } from "../types/Role";

interface PatientInfoProps {
  role: Role | undefined;
  isLoggedIn: boolean;
}

export default function PatientInfo({ role, isLoggedIn }: PatientInfoProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | "Before" | "During" | "After"
  >("All");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const result = await getPatients();
        const patients = result.data.patients as Patient[];
        setPatients(patients);
      } catch (error) {
        console.log("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

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

  const deletePatient = async (patientID: string) => {
    console.log("deleting user attempt: " + patientID);
    const token = localStorage.getItem("accessToken");

    try {
      await API.delete("/patient/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id: patientID },
      });
      setPatients((prev) => prev.filter((p) => p.patientID !== patientID));
    } catch {
      console.log("error deleting patient");
    }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col px-[50px] py-[26px]">
      <div className="mb-10 flex flex-row justify-between">
        <div className="min-w flex max-w-[660px] flex-col gap-[26px]">
          <h1 className="font-kaisei text-2xl font-bold md:text-4xl">
            Patient Information Dashboard
          </h1>
          <p className="text-text mt-3 md:text-lg">
            View and manage essential patient details before, during, and after
            surgery. Please ensure all updates are accurate and respectful of
            patient privacy.
          </p>
        </div>

        <div className="flex items-end">
          <button className="bg-primary text-background inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-8 py-5 whitespace-nowrap">
            Add a New Patient
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-row items-center justify-between">
        <div className="flex flex-row gap-8">
          <button
            className={clsx(
              "h-12 rounded-2xl px-10",
              selectedStatus === "All" && "outline-primary outline-2",
            )}
            onClick={() => setSelectedStatus("All")}
          >
            All
          </button>
          <button
            className={clsx(
              "h-12 rounded-2xl px-4",
              selectedStatus === "Before" && "outline-primary outline-2",
            )}
            onClick={() => setSelectedStatus("Before")}
          >
            Before Procedure
          </button>
          <button
            className={clsx(
              "h-12 rounded-2xl px-4",
              selectedStatus === "During" && "outline-primary outline-2",
            )}
            onClick={() => setSelectedStatus("During")}
          >
            During Procedure
          </button>
          <button
            className={clsx(
              "h-12 rounded-2xl px-4",
              selectedStatus === "After" && "outline-primary outline-2",
            )}
            onClick={() => setSelectedStatus("After")}
          >
            After Procedure
          </button>
        </div>
        <Search />
      </div>

      <div className="mt-6 flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-gray-50/30 p-6">
        {patients.length === 0 ? (
          <p>There are no patients yet</p>
        ) : (
          <div className="h-full w-full overflow-auto">
            <table className="min-w-full rounded-2xl text-lg outline-2 outline-gray-100">
              <thead className="bg-accent font-nunito-bold h-12 text-left">
                <tr>
                  <th className="pl-5" scope="col">
                    Patient
                  </th>
                  <th scope="col">Street Address</th>
                  <th scope="col">Country</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">Medical Status</th>
                  <th scope="col">Delete Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr className="border-b-1 border-gray-200" key={patient._id}>
                    <td className="px-5 py-3 pr-50">
                      <div className="flex flex-col">
                        <div className="font-nunito-bold">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-md text-gray-500">
                          Patient No: {patient.patientID}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{patient.streetAddress}</td>
                    <td className="py-3 pr-15">{patient.country}</td>
                    <td className="py-3">{patient.phoneNumber}</td>
                    <td className="py-3">{patient.email}</td>
                    <td className="py-3">{patient.medicalStatus}</td>
                    <td className="py-3">
                      <button onClick={() => deletePatient(patient.patientID)}>
                        ...
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
