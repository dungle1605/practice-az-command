import { useState } from "react";
import Terminal from "./components/Terminal";
import Cheatsheet from "./components/Cheatsheet";
import PythonSnippets from "./components/PythonSnippets"; // MỚI

function App() {
    const [activeTab, setActiveTab] = useState("terminal");

    return (
        <div className="app">
            <nav className="tabs">
                <button onClick={() => setActiveTab("terminal")}>Terminal</button>
                <button onClick={() => setActiveTab("cheatsheet")}>Cheatsheet</button>
                <button onClick={() => setActiveTab("python")}>Python Snippets</button> {/* MỚI */}
            </nav>
            {activeTab === "terminal" && <Terminal />}
            {activeTab === "cheatsheet" && <Cheatsheet />}
            {activeTab === "python" && <PythonSnippets />} {/* MỚI */}
        </div>
    );
}

export default App;