import "./CollectionHero.css";

function CollectionHero() {
  return (
    <section className="collection-hero" aria-labelledby="collection-title">
      <img
        src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1800&h=900&fit=crop&auto=format"
        alt="Sélection de vêtements de la collection Korn"
      />
      <div className="collection-hero-content">
        <span className="collection-hero-eyebrow">La sélection Korn</span>
        <h1 id="collection-title">COLLECTION</h1>
      </div>
    </section>
  );
}

export default CollectionHero;
