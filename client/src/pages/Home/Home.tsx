import Hero from "../../components/home/Hero/Hero";
import HomeBestSeller from "../../components/home/HomeBestSeller/HomeBestSeller";
import HomeNews from "../../components/home/HomeNews/HomeNews";
import HomePerformance from "../../components/home/HomePerformance/HomePerformance";
import HomeStory from "../../components/home/HomeStory/HomeStory";
import { useDocumentHead } from "../../hooks/useDocumentHead";

function Home() {
  useDocumentHead({
    title: "Vêtements de sport & streetwear",
    description:
      "Korn conçoit des vêtements de sport et streetwear techniques, pensés pour la performance et le style au quotidien.",
  });

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
