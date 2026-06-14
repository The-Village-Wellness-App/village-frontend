export default function Footer() {

	let currentYear = new Date().getFullYear();


	return(
		<footer>
			
		  <a
		    href="https://github.com/tim-maastricht"
			target="_blank">WhiteHotThrash |
		  </a>
		  <a
		    href="https://github.com/BeeGeeEss"
			target="_blank"> ✨BeeGeeEss✨
		  </a>
		  <a>| &copy; {currentYear}</a>
		</footer>
	);
};