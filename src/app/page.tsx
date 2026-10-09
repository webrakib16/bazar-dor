
import Hero from "./components/Hero";
import RisingProducts from "./components/RisingProductsCard";
import FallingProducts from "./components/FallingProductsCard";
import AllProducts from "./components/AllProductsCard";

export default function Home() {
  return (
    <div >
     
      <Hero />
      <RisingProducts />
      <FallingProducts />
      <AllProducts />
    </div>
  );
}
