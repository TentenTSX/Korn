import { Link } from "react-router";
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
        <Link className="home-story-link" to="/pages/notre-histoire">
          Notre histoire
        </Link>
      </div>

      <div className="home-story-media">
        <img
          src="/images/hero/woman-black-set-side.jpg"
          alt="Femme portant une tenue de sport dans un stade"
        />
      </div>
    </section>
  );
}

export default HomeStory;
