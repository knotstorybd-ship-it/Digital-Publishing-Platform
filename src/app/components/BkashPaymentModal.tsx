import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type PaymentStatus = "completed" | "failed";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  userId: string;
  gateway?: string;
  onSuccess?: (transactionId: string) => void;
}

const DEMO_OTP = "123456";

const getStoredTransactions = () => {
  try {
    return JSON.parse(localStorage.getItem("dp_payment_transactions") || "[]");
  } catch {
    return [];
  }
};

const saveLocalTransaction = (transaction: Record<string, unknown>) => {
  const existing = getStoredTransactions();
  localStorage.setItem("dp_payment_transactions", JSON.stringify([transaction, ...existing].slice(0, 50)));
};

export function BkashPaymentModal({
  isOpen,
  onClose,
  amount,
  orderId,
  userId,
  gateway = "DP Pay Sandbox",
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  const reference = useMemo(() => {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `DPAY-${Date.now().toString().slice(-6)}-${suffix}`;
  }, [isOpen]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setName("");
    setPhone("");
    setOtp("");
    setLoading(false);
    setDone(false);
    setError("");
    setTransactionId("");
    onClose();
  };

  const persistTransaction = async (status: PaymentStatus, txId: string) => {
    const payload = {
      order_id: orderId,
      user_id: userId,
      gateway,
      transaction_id: txId,
      payer_name: name.trim(),
      payer_phone: phone.trim(),
      amount,
      currency: "BDT",
      status,
      metadata: {
        mode: "sandbox",
        reference,
      },
    };

    const { error: dbError } = await supabase.from("payment_transactions").insert(payload);

    if (dbError) {
      saveLocalTransaction({
        ...payload,
        created_at: new Date().toISOString(),
        storage: "local_fallback",
        supabase_error: dbError.message,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setError("Enter the payer name.");
      return;
    }
    if (!/^01\d{9}$/.test(cleanPhone)) {
      setError("Enter a valid Bangladeshi mobile number, for example 01XXXXXXXXX.");
      return;
    }
    if (otp !== DEMO_OTP) {
      setError(`Use sandbox OTP ${DEMO_OTP} to complete this test payment.`);
      return;
    }

    setLoading(true);
    const txId = `${reference}-${cleanPhone.slice(-4)}`;

    try {
      await persistTransaction("completed", txId);
      setTransactionId(txId);
      setDone(true);
      onSuccess?.(txId);
    } catch (err) {
      console.error(err);
      await persistTransaction("failed", txId);
      setError("Payment could not be completed. No subscription was activated.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.button
          type="button"
          aria-label="Close payment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={resetAndClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          aria-label="Close payment"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-emerald-700 p-8 text-white">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-xl">
              <CreditCard className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100">
                Free sandbox gateway
              </p>
              <h2 className="text-2xl font-black">{gateway}</h2>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">Payable amount</p>
              <div className="mt-1 text-4xl font-black">BDT {amount.toLocaleString()}</div>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Reference</p>
              <p className="font-mono text-sm font-black">{reference}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {!done ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-black text-emerald-950">Sandbox payment verification</p>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-emerald-900/70">
                      This flow is free to run and does not charge real money. Use OTP {DEMO_OTP}; the app records the
                      transaction before activating the subscription or purchase.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Payer name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 font-bold outline-none transition focus:border-emerald-500"
                    placeholder="Customer name"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Mobile wallet number
                  </span>
                  <div className="relative">
                    <Smartphone className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-14 pr-5 font-bold outline-none transition focus:border-emerald-500"
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Sandbox OTP
                  </span>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-14 pr-5 font-mono text-lg font-black tracking-[0.3em] outline-none transition focus:border-emerald-500"
                      placeholder={DEMO_OTP}
                      required
                    />
                  </div>
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-600">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="flex-1 rounded-2xl bg-slate-100 py-4 font-black text-slate-500 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] rounded-2xl bg-emerald-600 py-4 font-black text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                    Complete payment
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-11 w-11" />
              </div>
              <h3 className="mb-2 text-2xl font-black text-emerald-950">Payment completed</h3>
              <p className="mx-auto mb-6 max-w-sm text-sm font-medium leading-relaxed text-slate-500">
                Transaction {transactionId} was accepted. Your subscription or purchase is being activated now.
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full rounded-2xl border-2 border-emerald-600 py-4 font-black text-emerald-600 transition hover:bg-emerald-50"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default BkashPaymentModal;
