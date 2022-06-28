import { Provider } from "./src/Helper/context";
import Navigation from "./src/navigation";


export default function App() {
  return (
    <Provider>
      <Navigation />
    </Provider>
  );
}
