import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import MembershipPlan from "../models/MembershipPlan.js";

dotenv.config();

const run = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: "admin@gym.com" });
  if (!adminExists) {
    await User.create({
      name: "Admin",
      email: "admin@gym.com",
      password: "admin123",
      role: "admin",
    });
    console.log("✔ Admin user created: admin@gym.com / admin123");
  } else {
    console.log("• Admin user already exists, skipping.");
  }

  const planCount = await MembershipPlan.countDocuments();
  if (planCount === 0) {
    await MembershipPlan.insertMany([
      { name: "Day Pass", type: "Daily", durationInDays: 1, price: 10, benefits: ["Gym floor access"] },
      { name: "Weekly Starter", type: "Weekly", durationInDays: 7, price: 40, benefits: ["Gym floor access", "Locker"] },
      { name: "Monthly Basic", type: "Monthly", durationInDays: 30, price: 120, benefits: ["Gym floor access", "Locker", "1 group class/week"] },
      { name: "Quarterly Plus", type: "Quarterly", durationInDays: 90, price: 320, benefits: ["All Basic features", "2 PT sessions"] },
      { name: "Half-Yearly Pro", type: "Half-Yearly", durationInDays: 182, price: 580, benefits: ["All Plus features", "Diet consultation"] },
      { name: "Annual Elite", type: "Annual", durationInDays: 365, price: 1080, benefits: ["All Pro features", "Free merchandise"], isFeatured: true },
      { name: "Premium", type: "Premium", durationInDays: 30, price: 199, benefits: ["Unlimited classes", "Sauna access", "Priority booking"] },
      { name: "VIP Black", type: "VIP", durationInDays: 30, price: 349, benefits: ["Personal locker", "Dedicated trainer", "Nutrition plan", "24/7 access"], isFeatured: true },
    ]);
    console.log("✔ Default membership plans seeded.");
  } else {
    console.log("• Membership plans already exist, skipping.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
