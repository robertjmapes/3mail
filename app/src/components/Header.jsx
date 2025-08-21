import { useWallet } from "../wallet.jsx"

export default function Header() {
    const { provider, signer, connect, disconnect } = useWallet();
    const isConnected = !!signer;

    const styles = {
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        title: {
            marginLeft: ".5em",
            textDecoration: "underline dotted",
        },
        button: {
            padding: "1em"
        }
    };

    return (
        <header style={styles.header}>
            <h1 style={styles.title}>
                3mail
            </h1>
            <button style={styles.button} onClick={isConnected ? disconnect : connect} >
                {isConnected ? "Disconnect" : "Connect"}
            </button>
        </header>
    );
}
