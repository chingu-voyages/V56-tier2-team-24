import bcrypt from "bcrypt";
import "dotenv/config";
import mongoose from "mongoose";
import PatientModel from "../models/patient.model";
import UserModel from "../models/user.model";

async function main() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is required");

  await mongoose.connect(mongoUri);
  console.log("Connected to DB");

  // Clear entire database
  await mongoose.connection.dropDatabase();
  console.log("Database cleared");

  // Users
  const users = [
    { email: "test@example.com", password: "password123", role: "surgeon" as const },
    { email: "admin@example.com", password: "admin123", role: "admin" as const },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await UserModel.create({ email: u.email, password: hashed, role: u.role });
  }
  console.log("Seeded users");

  // Patients (7 with distinct statuses)
  const statuses = ["Checked-In", "Pre Procedure", "In Progress", "Closing", "Recovery", "Complete", "Dismissal"];

  const patients = Array.from({ length: 7 }).map((_, idx) => ({
    firstName: `John${idx + 1}`,
    lastName: `Doe${idx + 1}`,
    patientID: `P-${1000 + idx}`,
    streetAddress: `${100 + idx} Example St`,
    country: "USA",
    phoneNumber: `+1 212 555-00${(idx + 1).toString().padStart(2, "0")}`,
    email: `patient${idx + 1}@example.com`,
    medicalStatus: statuses[idx],
  }));

  await PatientModel.insertMany(patients);
  console.log("Seeded patients");

  await mongoose.connection.close();
  console.log("Done.");
}

main().catch(async e => {
  console.error(e);
  await mongoose.connection.close();
  process.exit(1);
});
