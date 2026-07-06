import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Trash2, Crown, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
  const { buyer, logout, deleteAccount, subscribeToPremium, cancelPremium } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState<"logout" | "delete" | "premium" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowConfirm(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    setShowConfirm(null);
    navigate("/");
  }

  function handleDeleteAccount() {
    deleteAccount();
    setOpen(false);
    setShowConfirm(null);
    navigate("/");
  }

  function handleSubscribe() {
    subscribeToPremium();
    setShowConfirm(null);
  }

  function handleCancelPremium() {
    cancelPremium();
    setShowConfirm(null);
  }

  if (!buyer) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="hidden md:inline">{buyer.name}</span>
      </button>

      {open && !showConfirm && (
        <div className="absolute right-0 top-12 w-56 bg-tile border border-border-ui rounded-xl shadow-xl z-50 py-2">
          <div className="px-4 py-2 border-b border-border-ui">
            <p className="text-sm font-medium truncate">{buyer.email}</p>
            {buyer.isPremium && (
              <span className="text-xs text-primary font-semibold flex items-center gap-1 mt-0.5">
                <Crown size={10} /> Premium
              </span>
            )}
          </div>

          {buyer.isPremium ? (
            <button
              type="button"
              onClick={() => setShowConfirm("premium")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:bg-input hover:text-foreground transition-colors"
            >
              <XCircle size={16} className="text-amber-400" />
              Cancel Premium
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirm("premium")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:bg-input hover:text-foreground transition-colors"
            >
              <Crown size={16} className="text-primary" />
              Subscribe to Premium
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowConfirm("logout")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:bg-input hover:text-foreground transition-colors"
          >
            <LogOut size={16} />
            Log Out
          </button>

          <button
            type="button"
            onClick={() => setShowConfirm("delete")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      )}

      {/* Logout confirmation */}
      {showConfirm === "logout" && (
        <div className="absolute right-0 top-12 w-64 bg-tile border border-border-ui rounded-xl shadow-xl z-50 p-4">
          <p className="text-sm font-medium">Log out of your account?</p>
          <p className="text-xs text-muted mt-1">You can sign back in anytime.</p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowConfirm(null)}
              className="flex-1 py-2 rounded-pill border border-border-ui text-sm text-muted hover:bg-input transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 py-2 rounded-pill bg-primary text-background text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {showConfirm === "delete" && (
        <div className="absolute right-0 top-12 w-64 bg-tile border border-border-ui rounded-xl shadow-xl z-50 p-4">
          <p className="text-sm font-medium text-danger">Delete your account?</p>
          <p className="text-xs text-muted mt-1">
            This permanently deletes your account and all associated data. This action cannot be undone.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowConfirm(null)}
              className="flex-1 py-2 rounded-pill border border-border-ui text-sm text-muted hover:bg-input transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex-1 py-2 rounded-pill bg-danger text-white text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Premium confirmation */}
      {showConfirm === "premium" && (
        <div className="absolute right-0 top-12 w-72 bg-tile border border-border-ui rounded-xl shadow-xl z-50 p-4">
          {buyer.isPremium ? (
            <>
              <p className="text-sm font-medium">Cancel Premium?</p>
              <p className="text-xs text-muted mt-1">
                You'll lose access to premium features at the end of your billing cycle.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 py-2 rounded-pill border border-border-ui text-sm text-muted hover:bg-input transition-colors"
                >
                  Keep Premium
                </button>
                <button
                  type="button"
                  onClick={handleCancelPremium}
                  className="flex-1 py-2 rounded-pill bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Crown size={20} className="text-primary" />
                <p className="text-sm font-bold">ZiwaClear Premium</p>
              </div>
              <div className="text-sm space-y-2 mb-1">
                <p>✓ Priority batch matching</p>
                <p>✓ Advanced analytics & charts</p>
                <p>✓ Unlimited transaction history</p>
                <p>✓ Dedicated support</p>
              </div>
              <p className="text-2xl font-bold mt-3">
                KES 250<span className="text-sm text-muted font-normal">/month</span>
              </p>
              <p className="text-xs text-muted mt-2">
                Billed monthly. Cancel anytime.
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 py-2 rounded-pill border border-border-ui text-sm text-muted hover:bg-input transition-colors"
                >
                  Not Now
                </button>
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="flex-1 py-2 rounded-pill bg-primary text-background text-sm font-semibold hover:bg-primary-hover transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}