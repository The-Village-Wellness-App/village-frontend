export default function Footer() {

	let currentYear = new Date(Date.now()).getFullYear();


	return(
		<footer>
			
			[WhiteHotThrash](https://github.com/tim-maastricht) & [✨BeeGeeEss✨](https://github.com/BeeGeeEss) | &copy; | {currentYear}
		</footer>
	);
}