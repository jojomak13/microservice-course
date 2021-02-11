import Link from 'next/link';

const Header = ({ user }) => {
  let links = [
    !user && { label: 'Login', href: '/auth/login' },
    !user && { label: 'Signup', href: '/auth/signup' },
    user && { label: 'Sell Ticket', href: '/tickets/new' },
    user && { label: 'My Orders', href: '/orders' },
    user && { label: 'logout', href: '/auth/logout' },
  ]
    .filter((link) => link)
    .map((link) => {
      return (
        <li key={link.label} className="nav-item">
          <Link href={link.href}>
            <a className="nav-link">{link.label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">GitTix</a>
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto">{links}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
