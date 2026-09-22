import "./HomePerformance.css";

const stats = [
  { value: "50K+", label: "Clients satisfaits" },
  { value: "100%", label: "Matières techniques" },
  { value: "48H", label: "Livraison express" },
  { value: "2 ANS", label: "Garantie qualité" },
];

function HomePerformance() {
  return (
    <section
      className="home-performance"
      aria-labelledby="home-performance-title"
    >
      <div className="home-performance-stats">
        {stats.map((stat) => (
          <div className="home-performance-stat" key={stat.label}>
            <div className="home-performance-value">{stat.value}</div>
            <span className="home-performance-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <div
        className="home-performance-visual"
        aria-label="Performance et esthétique"
      >
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=80"
          alt="Athlète en tenue technique"
        />
        <div className="home-performance-overlay" aria-hidden="true" />
        <h2 id="home-performance-title" className="home-performance-title">
          PERFORMANCE IS AN
          <span>AESTHETIC.</span>
        </h2>
      </div>
    </section>
  );
}

export default HomePerformance;
