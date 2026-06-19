import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border-ui">
        <h1 className="text-xl font-bold">ZiwaClear</h1>
        <ThemeToggle />
      </header>
    </div>
  );
}

export default App;