import "./HomeStory.css";

function HomeStory() {
  return (
    <section className="home-story" aria-labelledby="home-story-title">
      <div className="home-story-content">
        <span className="home-story-eyebrow">Notre philosophie</span>
        <h2 id="home-story-title" className="home-story-title">
          Pensé pour
          <br />
          durer.
        </h2>
        <p className="home-story-description">
          Du coton biologique doux au nylon recyclé haute performance, chaque
          matière est choisie pour sa résistance, son confort et son impact
          réduit. Des textures techniques et des coupes pensées pour le
          mouvement, sans compromis sur le style.
        </p>
        <a className="home-story-link" href="/notre-histoire">
          Notre histoire
        </a>
      </div>

      <div className="home-story-media">
        <img
          src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1200&h=1600&fit=crop&auto=format"
          alt="Femme portant une tenue de sport dans un stade"
        />
        <span className="home-story-preview">Aperçu</span>
      </div>
    </section>
  );
}

export default HomeStory;
