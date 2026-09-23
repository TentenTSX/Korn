import Hero from "../../components/home/Hero/Hero";
import HomeBestSeller from "../../components/home/HomeBestSeller/HomeBestSeller";
import HomeNews from "../../components/home/HomeNews/HomeNews";
import HomePerformance from "../../components/home/HomePerformance/HomePerformance";
import HomeStory from "../../components/home/HomeStory/HomeStory";

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
