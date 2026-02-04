import './header.css'; // keep it separate for clarity
import Image from 'next/image';

export default function Header() {
  return (<>

   <header className="header">
            
    
            <nav className="navbar">
              <div className='logo'>
              <a href="#" className="logo-link">
              <Image className="logo-symbol" src='/Logos/DarkLogosText.png' alt="Kyfaru Symbol"
              width={40} height={40} />
              <Image className="logo-text" src='/Logos/DarkLogosText.png' alt="Kyfaru Text"
               width={130} height={30} />
            </a>
          </div>
          <div className='nav-links'>
            <ul>
              <li  className='nav-item'><a href="#">Home</a></li>
              <li  className='nav-item'><a href="#">About</a></li>
              <li className='nav-item' ><a href="#">Solutions<i className="ti ti-chevron-down"></i></a></li>
              <li className='nav-item'><a href="#">Portfolio</a></li>
              <li className="nav-item dropdown"><a href="#">Ecosystem<i className="ti ti-chevron-down"></i></a>
              <div className="dropdown-menu">
    <div className="dropdown-grid">

      {/* Left column */}
      <a href="#" className="dropdown-item">
        <span className="icon"></span>
        <div className="text">
          <strong>Mwamba AI</strong>
          <small>Kyfaru Artificial intelligence</small>
        </div>
      </a>

      <a href="#" className="dropdown-item">
        <span className="icon">🎓</span>
        <div className="text">
          <strong>Stackable Academy</strong>
          <small>Industry-ready Tech skills</small>
        </div>
      </a>

      {/* Right column */}
      <a href="#" className="dropdown-item">
        <span className="icon"></span>
        <div className="text">
          <strong>Kyfaru Labs</strong>
          <h5>Research and Development</h5>
        </div>
      </a>

    </div>
  </div></li>

              <li className='nav-item'><a href="#">Contact</a></li>
              <li className="nav-item dropdown">
  <a href="#" className="nav-link">
    Resources <i className="ti ti-chevron-down chevron"></i>
  </a>

  <div className=" dropdown-resource">
    

      {/* Blog */}
      <a href="#" className="dropdown-item">
        <span className="icon">
          <i className="ti ti-news"></i>
        </span>
        <div className="text">
          <strong>Blog</strong>
          <small>Insights on AI & tech</small>
        </div>
      </a>

      {/* Newsroom */}
      <a href="#" className="dropdown-item">
        <span className="icon"><i className="ti ti-radio"></i></span>
        <div className="text">
          <strong>Newsroom</strong>
          <small>Company updates & stories</small>
        </div>
      </a>

      {/* Case Studies */}
      <a href="#" className="dropdown-item">
        <span className="icon">
         <i className="ti ti-vocabulary"></i>
        </span>
        <div className="text">
          <strong>Case Studies</strong>
          <small>Real-world solutions</small>
        </div>
      </a>
  </div>
</li>

            </ul>
            </div>
            </nav>
          </header>
          
          </>)};