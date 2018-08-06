import React from "react";
import ReactDOM from "react-dom";
import Upload from "./upload";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <Upload />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
