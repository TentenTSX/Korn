import { Link } from "react-router";

type FooterLink = {
  label: string;
  to: string;
};

type FooterLinkColumnProps = {
  title: string;
  links: FooterLink[];
};

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterLinkColumn;
