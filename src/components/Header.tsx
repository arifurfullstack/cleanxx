import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Briefcase, CalendarDays, Star, User, LogOut, LayoutDashboard, Shield, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/logo-new.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading, role } = useAuth();

  const navLinks = [
    { label: "Find Cleaners", href: "/search", icon: Search },
    { label: "Services", href: "/services", icon: ShoppingBag },
    { label: "Post a Job", href: "/jobs", icon: Briefcase },
    { label: "My Bookings", href: "/dashboard/upcoming", icon: CalendarDays },
    { label: "Reviews", href: "/reviews", icon: Star },
  ];

  const getInitials = (email: string) => email.charAt(0).toUpperCase();

  const getUserName = () => {
    if (!user) return "";
    const name = user.user_metadata?.full_name;
    if (name) {
      const parts = name.split(" ");
      return parts.length > 1 ? `${parts[0]} ${parts[1].charAt(0)}.` : parts[0];
    }
    const emailName = user.email?.split("@")[0] || "User";
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-sky-50 via-white to-sky-50 border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-between lg:h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="The Cleaning Network" className="h-9 w-auto lg:h-11" />
          </Link>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-primary hover:text-primary-dark transition-colors"
              >
                <link.icon className="h-3.5 w-3.5 text-secondary group-hover:text-secondary-dark transition-colors" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-1.5">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted transition-colors outline-none">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">
                              {getInitials(user.email || "U")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[13px] font-medium text-foreground">{getUserName()}</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="flex items-center gap-2 text-sm">
                            <LayoutDashboard className="h-3.5 w-3.5" />
                            My Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {role === "cleaner" && (
                          <DropdownMenuItem asChild>
                            <Link to="/cleaner/dashboard" className="flex items-center gap-2 text-sm">
                              <Briefcase className="h-3.5 w-3.5" />
                              Cleaner Portal
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/profile" className="flex items-center gap-2 text-sm">
                            <User className="h-3.5 w-3.5" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-sm text-destructive">
                          <LogOut className="h-3.5 w-3.5" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Link
                      to="/auth"
                      className="px-2.5 py-1 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Log in
                    </Link>
                    <span className="text-border mx-0.5">·</span>
                    <Link
                      to="/auth"
                      className="px-2.5 py-1 text-[13px] font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-1.5 text-foreground rounded-md hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-3 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4 text-secondary" />
                  {link.label}
                </Link>
              ))}

              {!loading && (
                <div className="flex flex-col gap-2 mt-3 px-3 pt-3 border-t border-border/50">
                  {user ? (
                    <>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                      </Button>
                      <Button variant="secondary" size="sm" className="w-full" asChild>
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
