import Hero from "../../components/Hero/Hero";
import HomeBestSeller from "../../components/HomeBestSeller/HomeBestSeller";
import HomeNews from "../../components/HomeNews/HomeNews";
import HomePerformance from "../../components/HomePerformance/HomePerformance";
import HomeStory from "../../components/HomeStory/HomeStory";

function Home() {
  return (
    <main>
      <Hero />
      <HomeNews />
      <HomeStory />
      <HomeBestSeller />
      <HomePerformance />
    </main>
  );
}

export default Home;
