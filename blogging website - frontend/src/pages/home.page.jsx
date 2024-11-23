import Animationwapper from "../common/page-animation";
import InpageNavgation from "../components/inpage-navigation.component";

const HomePage = () => {
    return (
      <Animationwapper>
        <section className="h-cover felx justify-center gap-10">
            <div className="w-full">
            <InpageNavgation routes={["home", "ternding blogs"]}> 

            </InpageNavgation>
            </div>

            <div>

            </div>
        </section>
      </Animationwapper>
    );
}

export default HomePage;