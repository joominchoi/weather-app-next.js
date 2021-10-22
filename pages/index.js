import Head from "next/head"
import SearchBox from "../components/SearchBox";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Weather App - Next.js</title>
      </Head>

      <div className="home">
        <div className="container">
          <SearchBox placeholder="Search for a city..."/>
        </div>
      </div>
    </div>
  );
}
