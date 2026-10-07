import "./CollectionHero.css";

function CollectionHero() {
  return (
    <section className="collection-hero" aria-labelledby="collection-title">
      <img
        src="/images/hero/man-black-tee-white-pants.jpg"
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
