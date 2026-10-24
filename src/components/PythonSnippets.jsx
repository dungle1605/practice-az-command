import { useState } from "react";
import { pythonSnippets } from "../data/pythonSnippets";

export default function PythonSnippets() {
    const [selected, setSelected] = useState(pythonSnippets[0]);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(selected.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="python-snippets">
            <aside className="sidebar">
                {pythonSnippets.map((snippet) => (
                    <button
                        key={snippet.id}
                        onClick={() => setSelected(snippet)}
                        className={selected.id === snippet.id ? "active" : ""}
                    >
                        {snippet.title}
                    </button>
                ))}
            </aside>
            <main className="content">
                <h2>{selected.title}</h2>
                <p>{selected.description}</p>
                <span className="badge">{selected.category}</span>
                <div className="code-block">
                    <pre><code>{selected.code}</code></pre>
                    <button onClick={handleCopy}>
                        {copied ? "Đã copy!" : "Copy"}
                    </button>
                </div>
            </main>
        </div>
    );
}