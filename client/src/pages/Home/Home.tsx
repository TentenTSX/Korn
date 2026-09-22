import Hero from "../../components/Hero/Hero";
import HomeBestSeller from "../../components/HomeBestSeller/HomeBestSeller";
import HomeNews from "../../components/HomeNews/HomeNews";
import HomePerformance from "../../components/HomePerformance/HomePerformance";
import HomeStory from "../../components/HomeStory/HomeStory";

function Home() {
  return (
    <>
      <Hero />
      <HomeNews />
      <HomeStory />
      <HomeBestSeller />
      <HomePerformance />
    </>
  );
}

export default Home;
