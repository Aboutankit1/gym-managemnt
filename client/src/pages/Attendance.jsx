import { useEffect, useState } from "react";
import { Camera, CheckCircle2, XCircle, LogIn, LogOut, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import QRScanner from "@/components/attendance/QRScanner";
import { attendanceApi } from "@/api/endpoints";

export default function Attendance() {
  const [scannerOn, setScannerOn] = useState(false);
  const [mode, setMode] = useState("in"); // "in" | "out"
  const [manualCode, setManualCode] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: "success"|"error", message }
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState([]);
  const [loadingLog, setLoadingLog] = useState(true);

  const fetchLog = () => {
    setLoadingLog(true);
    attendanceApi
      .today()
      .then((r) => setLog(r.data.data))
      .finally(() => setLoadingLog(false));
  };

  useEffect(() => {
    fetchLog();
  }, []);

  const handleResult = async (code) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = mode === "in" ? await attendanceApi.checkIn(code) : await attendanceApi.checkOut(code);
      setFeedback({
        type: "success",
        message:
          mode === "in"
            ? `${res.data.data.member.name} checked in ✓`
            : "Checked out ✓",
      });
      fetchLog();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || "Something went wrong" });
    } finally {
      setBusy(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleResult(manualCode.trim());
    setManualCode("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">Attendance</h2>
        <p className="text-sm text-ink-soft">Scan a member's QR card or check them in manually.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Scanner panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Scan QR</CardTitle>
            <div className="flex rounded-lg border border-line p-0.5 text-xs">
              <button
                onClick={() => setMode("in")}
                className={`rounded-md px-2.5 py-1 font-medium ${
                  mode === "in" ? "bg-volt text-volt-ink" : "text-ink-soft"
                }`}
              >
                Check-in
              </button>
              <button
                onClick={() => setMode("out")}
                className={`rounded-md px-2.5 py-1 font-medium ${
                  mode === "out" ? "bg-ink text-white" : "text-ink-soft"
                }`}
              >
                Check-out
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {scannerOn ? (
              <>
                <QRScanner
                  active={scannerOn}
                  onScan={handleResult}
                  onError={(msg) => setFeedback({ type: "error", message: msg })}
                />
                <Button variant="outline" className="w-full" onClick={() => setScannerOn(false)}>
                  Stop Camera
                </Button>
              </>
            ) : (
              <button
                onClick={() => setScannerOn(true)}
                className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-bg text-ink-faint hover:border-violet hover:text-violet"
              >
                <Camera className="h-8 w-8" />
                <span className="text-sm font-medium">Start Camera</span>
              </button>
            )}

            {feedback && (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  feedback.type === "success" ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0" />
                )}
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="border-t border-line pt-4">
              <p className="mb-2 text-xs font-medium text-ink-soft">Or enter member ID / phone manually</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                  <Input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="GYM-0001 or phone"
                    className="pl-9"
                  />
                </div>
                <Button type="submit" variant={mode === "in" ? "volt" : "primary"} disabled={busy}>
                  {mode === "in" ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Today's log */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle>Today's Log</CardTitle>
            <span className="text-xs text-ink-faint">{log.length} check-ins</span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line text-xs uppercase text-ink-faint">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Member</th>
                    <th className="py-2 pr-4 font-medium">Check-in</th>
                    <th className="py-2 pr-4 font-medium">Check-out</th>
                    <th className="py-2 font-medium">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {loadingLog ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-ink-faint">
                        Loading...
                      </td>
                    </tr>
                  ) : log.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-ink-faint">
                        No check-ins yet today.
                      </td>
                    </tr>
                  ) : (
                    log.map((r) => (
                      <tr key={r._id}>
                        <td className="py-2.5 pr-4">
                          <p className="font-medium text-ink">{r.member?.name}</p>
                          <p className="font-mono text-xs text-ink-faint">{r.member?.memberId}</p>
                        </td>
                        <td className="py-2.5 pr-4 text-ink-soft">
                          {new Date(r.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="py-2.5 pr-4 text-ink-soft">
                          {r.checkOutTime
                            ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </td>
                        <td className="py-2.5 text-ink-soft">{r.method}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
