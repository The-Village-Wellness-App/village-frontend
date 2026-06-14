export default function Footer() {

	let currentYear = new Date().getFullYear();


	return(
		<footer>
		  <h5>
		  <a
		    href="https://github.com/tim-maastricht"
			target="_blank">WhiteHotThrash 
		  </a>
		  <a>| </a>
		  <a
		    href="https://github.com/BeeGeeEss"
			target="_blank">✨BeeGeeEss✨
		  </a>
		  <a>| &copy; {currentYear}</a>
		  </h5>
		</footer>
		
	);
};