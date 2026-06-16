export default function Footer() {

	let currentYear = new Date().getFullYear();


	return(
		<footer>
		  <h5>
		  <a
		    href="https://github.com/tim-maastricht"
			rel="noopener noreferrer"
  			style={{ color: "#7ED957" }}
			target="_blank">WhiteHotThrash 
		  </a>
		  <a>| </a>
		  <a
		    href="https://github.com/BeeGeeEss"
			rel="noopener noreferrer"
  			style={{ color: "#7ED957" }}
			target="_blank">✨BeeGeeEss✨
		  </a>
		  <a>| &copy; {currentYear}</a>
		  </h5>
		</footer>
		
	);
};