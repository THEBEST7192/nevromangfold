import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import logo from "../assets/logo.png";
import loginIcon from "../assets/login.svg";
import menuIcon from "../../src/assets/UI/menu.svg";
import closeIcon from "../../src/assets/UI/close.svg";
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import { Link } from 'react-router-dom';

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Hjem', href: '/' },
  { name: 'Om Oss', href: '/about' },
  { name: 'Bli Frivillig', href: '/volunteer' },
  { name: 'Arrangementer', href: '/events' },
  { name: 'Donasjon', href: '/donate' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(NAV_ITEMS);
  const [hiddenItems, setHiddenItems] = useState<NavItem[]>([]);
  const [showBurger, setShowBurger] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const headerContentRef = useRef<HTMLDivElement>(null);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const logoSectionRef = useRef<HTMLDivElement>(null);
  const userSectionRef = useRef<HTMLDivElement>(null);
  const itemWidths = useRef<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debounce = (func: () => void, delay: number) => {
    let timer: number | null = null;
    return () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  };

  const updateVisibleItems = () => {
    if (!headerContentRef.current || itemWidths.current.length === 0) return;

    const headerWidth = headerContentRef.current.clientWidth;
    const logoWidth = logoSectionRef.current ? logoSectionRef.current.clientWidth : 0;
    const userWidth = userSectionRef.current ? userSectionRef.current.clientWidth : 0;
    const margins = 40; 

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      setVisibleItems([]);
      setHiddenItems(NAV_ITEMS);
      setShowBurger(true);
      return;
    }

    let available = headerWidth - logoWidth - userWidth - margins;

    let cumulative = 0;
    let maxCount = 0;

    for (let i = 0; i < NAV_ITEMS.length; i++) {
      const itemWidth = itemWidths.current[i] + 20; 
      if (cumulative + itemWidth <= available) {
        cumulative += itemWidth;
        maxCount++;
      } else {
        break;
      }
    }

    if (maxCount === NAV_ITEMS.length) {
      setVisibleItems(NAV_ITEMS);
      setHiddenItems([]);
      setShowBurger(false);
    } else {
      const burgerWidth = 50; 
      available = headerWidth - logoWidth - userWidth - burgerWidth - margins;

      cumulative = 0;
      maxCount = 0;

      for (let i = 0; i < NAV_ITEMS.length; i++) {
        const itemWidth = itemWidths.current[i] + 20;
        if (cumulative + itemWidth <= available) {
          cumulative += itemWidth;
          maxCount++;
        } else {
          break;
        }
      }

      setVisibleItems(NAV_ITEMS.slice(0, maxCount));
      setHiddenItems(NAV_ITEMS.slice(maxCount));
      setShowBurger(true);
    }
  };

  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.className = 'navigation';
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    const widths = NAV_ITEMS.map((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.name;
      li.appendChild(a);
      tempDiv.appendChild(li);
      const width = li.clientWidth;
      tempDiv.removeChild(li);
      return width;
    });

    itemWidths.current = widths;
    document.body.removeChild(tempDiv);

    updateVisibleItems(); // initial call
  }, []);

  useEffect(() => {
    const debouncedUpdate = debounce(updateVisibleItems, 200);
    window.addEventListener('resize', debouncedUpdate);
    return () => window.removeEventListener('resize', debouncedUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !burgerMenuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header-desktop">
      <div className="header-content" ref={headerContentRef}>
        <div className="logo-section" ref={logoSectionRef}>
          <Link to="/">
            <img src={logo} className="logo" alt="Nevromangfold logo" />
            <span className="logo-text">Nevromangfold</span>
          </Link>
        </div>
        <nav className="navigation">
          <ul className={`main-nav ${isOpen ? 'open' : ''}`} ref={navRef}>
            {visibleItems.map((item, index) => (
              <li key={index}><Link to={item.href}>{item.name}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="user-section" ref={userSectionRef}>
          <div className="login-button">
            <img src={loginIcon} alt="Login" className="login-icon" />
            <span>Logg Inn</span>
          </div>
          <LanguageSwitcher />
          <div className="burger-menu" style={{display: showBurger ? 'flex' : 'none'}} onClick={toggleMenu} ref={burgerMenuRef}>
            <img src={isOpen ? closeIcon : menuIcon} alt="Menu" className="burger-icon" />
          </div>
          {hiddenItems.length > 0 && (
            <div className={`burger-dropdown-menu ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
              {hiddenItems.map((item, index) => (
                <Link key={index} to={item.href} className="dropdown-item">
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;