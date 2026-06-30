import cron from "node-cron";
import Member from "../models/Member.js";

// Recomputes membership status for all members daily at 1 AM,
// and logs members who are expiring soon / just expired so the
// (optional) email/SMS layer can pick them up.
export const startReminderCron = () => {
  cron.schedule("0 1 * * *", async () => {
    console.log("[cron] Running daily membership status refresh...");
    try {
      const members = await Member.find({ membershipEndDate: { $exists: true } });
      let updated = 0;

      for (const member of members) {
        const newStatus = member.computeStatus();
        if (newStatus !== member.membershipStatus) {
          member.membershipStatus = newStatus;
          await member.save();
          updated += 1;
        }
      }

      console.log(`[cron] Membership status refresh complete. ${updated} member(s) updated.`);
      // TODO: integrate utils/sendReminderEmail.js here to notify
      // members whose status changed to "Expiring Soon" or "Expired".
    } catch (error) {
      console.error("[cron] Reminder job failed:", error.message);
    }
  });
};
