export function Sidebar() {
  return (
    <aside className="w-80 h-full overflow-y-auto bg-tile border-r border-border-ui p-4">
      <h2 className="text-lg font-bold text-foreground">Available Biomass</h2>
      <p className="text-muted text-sm mt-2">
        Filters and batch cards will go here.
      </p>
    </aside>
  );
}