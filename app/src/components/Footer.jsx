export default function Footer() {

  const styles = {
    footer: {
      position: "fixed",
      bottom: "0",
      width: "100%",
      textAlign: "center",
    }
  }

  return (
      <footer style={styles.footer}>
        3mail © {new Date().getFullYear()}  | <a href='https://github.com/robertjmapes/3mail'>Support</a>
      </footer>
  );
}
