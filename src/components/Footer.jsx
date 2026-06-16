export default function Footer() {
  let currentYear = new Date().getFullYear();

  return (
    <footer>
      <h5>
        <a
          href="https://github.com/tim-maastricht"
          rel="noopener noreferrer"
          style={{ color: "#7ED957" }}
          target="_blank"
        >
          WhiteHotThrash
        </a>
        <a style={{ color: "#8C52FF" }}> | </a>
        <a
          href="https://github.com/BeeGeeEss"
          rel="noopener noreferrer"
          style={{ color: "#7ED957" }}
          target="_blank"
        >
          ✨BeeGeeEss✨
        </a>
        <a style={{ color: "#8C52FF" }}>| &copy; {currentYear}</a>
      </h5>
    </footer>
  );
}
