import { X, MapPin, Clock, Star, User, Phone, Droplet } from "lucide-react";
import { useActiveBeach } from "../context/ActiveBeachContext";
import { timeAgo } from "../lib/timeAgo";

export function BeachDetailSidebar() {
  const { activeBeach, setActiveBeach } = useActiveBeach();
  const isOpen = activeBeach !== null;

  return (
    <>
      {/* Backdrop — closes panel when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1001] lg:hidden"
          onClick={() => setActiveBeach(null)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] max-w-[85vw] bg-tile border-l border-border-ui shadow-2xl z-[1002]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {activeBeach && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-ui">
              <h2 className="font-bold text-lg truncate">{activeBeach.locationName}</h2>
              <button
                type="button"
                onClick={() => setActiveBeach(null)}
                className="text-muted hover:text-foreground transition-colors shrink-0"
                aria-label="Close panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {/* Quantity */}
              <div className="text-center py-4 bg-input rounded-xl border border-border-ui">
                <p className="text-3xl font-bold text-primary">
                  {activeBeach.quantityKg.toLocaleString()} kg
                </p>
                <p className="text-xs text-muted mt-1">Available Biomass</p>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3 text-sm">
                {activeBeach.latitude != null && activeBeach.longitude != null && (
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-primary shrink-0" />
                    <span className="text-muted">
                      {activeBeach.latitude.toFixed(4)}, {activeBeach.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-primary shrink-0" />
                  <span className="text-muted">
                    Posted {timeAgo(activeBeach.collectedAt ?? activeBeach.createdAt)}
                  </span>
                </div>
                {activeBeach.qualityRating != null && (
                  <div className="flex items-center gap-3">
                    <Star size={16} className="text-primary shrink-0" />
                    <span className="text-muted">{activeBeach.qualityRating}/5 Certified</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Droplet size={16} className="text-primary shrink-0" />
                  <span className="text-muted capitalize">{activeBeach.status}</span>
                </div>
                {activeBeach.harvesterName && (
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-primary shrink-0" />
                    <span className="text-muted">{activeBeach.harvesterName}</span>
                  </div>
                )}
                {activeBeach.harvesterPhone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-primary shrink-0" />
                    <span className="text-muted">{activeBeach.harvesterPhone}</span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-pill bg-input border border-border-ui w-fit">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    activeBeach.status === "available"
                      ? "bg-primary"
                      : activeBeach.status === "claimed"
                      ? "bg-gray-400"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-xs font-medium capitalize">
                  {activeBeach.status === "claimed" ? "Dispatched" : activeBeach.status}
                </span>
              </div>
            </div>

            {/* Footer button */}
            <div className="px-5 py-4 border-t border-border-ui">
              <button
                type="button"
                onClick={() => setActiveBeach(null)}
                className="w-full py-2.5 rounded-pill bg-primary text-background font-semibold text-sm hover:bg-primary-hover transition-colors"
              >
                Reserve Batch
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}