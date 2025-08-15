import { createRoot } from "react-dom/client";
import "./index.css";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Dashboard from "./components/Dashboard.jsx"

import { WalletProvider } from "./stores/wallet.jsx";
import { MailboxProvider } from "./stores/mailboxes.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div style={{ marginLeft: "2em", marginRight: "2em", marginTop: "2em", marginBottom: "2em" }}>
                <Header/>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("root")).render(
    <>
        <WalletProvider>
            <MailboxProvider>
                <App />
            </MailboxProvider>
        </WalletProvider>
        <Footer/>
    </>
);
