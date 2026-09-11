import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "./Logo";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header>
      <Logo />
      <nav className={open ? "open" : ""}>
        <NavLink to="/" onClick={close}>
          Home
        </NavLink>
        <NavLink to="/archive" onClick={close}>
          Archive
        </NavLink>
        <NavLink to="/research" onClick={close}>
          Research Papers
        </NavLink>
      </nav>
      <Link className="nav-cta" to="/archive">
        Explore archive <ArrowUpRight size={16} />
      </Link>
      <button
        className="menu"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
