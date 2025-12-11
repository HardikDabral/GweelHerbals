"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">TalentBuzz</h3>
            <p className="text-sm text-muted-foreground">
              Connecting talent with opportunities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/artists" className="text-muted-foreground hover:text-foreground">Artists</Link></li>
              <li><Link href="/classes" className="text-muted-foreground hover:text-foreground">Classes</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-foreground">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/apply" className="text-muted-foreground hover:text-foreground">Apply</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-muted-foreground hover:text-foreground">Login</Link></li>
              <li><Link href="/signup" className="text-muted-foreground hover:text-foreground">Sign Up</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TalentBuzz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

