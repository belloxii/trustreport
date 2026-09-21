import { Link } from "@tanstack/react-router";
import { FloodGuardLogo } from "./FloodGuardLogo";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <FloodGuardLogo size={36} />
            <span className="font-display text-lg font-extrabold text-gradient">
              FloodGuard Ilorin
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm font-semibold text-muted-foreground">
            FloodGuard Ilorin is a student technology project exploring how coding, AI, community
            reporting and data can be used to help communities understand and respond to flooding.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--grape)]/15 px-3 py-1 text-xs font-extrabold text-[var(--grape)]">
            🎓 Student Prototype
          </span>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
            Explore
          </h3>
          <ul className="mt-3 grid gap-2 text-sm font-bold">
            <li>
              <Link to="/map" className="hover:text-primary">
                🗺️ Ilorin Flood Map
              </Link>
            </li>
            <li>
              <Link to="/report" className="hover:text-primary">
                🚨 Report a Flood
              </Link>
            </li>
            <li>
              <Link to="/ai" className="hover:text-primary">
                🤖 FloodGuard AI
              </Link>
            </li>
            <li>
              <Link to="/safety" className="hover:text-primary">
                🛟 Flood Safety Center
              </Link>
            </li>
            <li>
              <Link to="/heroes" className="hover:text-primary">
                🏆 Flood Heroes
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-primary">
                📊 Community Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--sun)]/60 bg-[var(--sun)]/15 p-5">
          <h3 className="font-display text-base font-extrabold">Important</h3>
          <p className="mt-2 text-sm font-semibold text-foreground/80">
            This is a prototype. Every report, marker, statistic and leaderboard entry shown here is{" "}
            <strong>demo data</strong>, not live or verified flood information.
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground/80">
            FloodGuard AI provides general educational and safety guidance. For emergencies, contact
            appropriate official emergency services.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs font-bold text-muted-foreground">
        Built with curiosity in Ilorin, Kwara State 🇳🇬 · Spot it. Report it. Stay Safe.
      </div>
    </footer>
  );
}
