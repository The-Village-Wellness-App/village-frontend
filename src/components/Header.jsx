import bannerLight from '../assets/banner-light.png'

export default function Header() {
    
    return (
        <header>
            <img src={bannerLight} 
            alt="The Village Logo"
            width="1200"
            height="600" 
            />
        </header>
    );
};

