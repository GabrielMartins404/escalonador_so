import { useState } from "react";
import Escalonador from "./tela/escalonador.jsx";
import Homepage from "./tela/homePage.jsx";

function App() {
  const [showScheduler, setShowScheduler] = useState(false);

  // Função para alternar para o escalonador
  const handleStartScheduler = () => {
    setShowScheduler(true);
  };

  return (
    <div className="App">
      {showScheduler ? (
        <Escalonador />
      ) : (
        <Homepage onStart={handleStartScheduler} />
      )}
    </div>
  );
}

export default App;
