"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";


import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EventIcon from "@mui/icons-material/Event";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { GiOpenTreasureChest } from "react-icons/gi";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(""); // For desktop
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(""); // For mobile
  const [staffRoles, setStaffRoles] = useState(null);
  
  // Separate refs for desktop and mobile dropdowns
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  // Retrieve staff roles from localStorage
  useEffect(() => {
    const roles = localStorage.getItem("staffRoles");
    if (roles) {
      setStaffRoles(JSON.parse(roles)); // Parse and set the staff roles
    }
  }, []);

  // Handle clicks outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close desktop dropdown if click is outside
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown("");
      }

      // Close mobile dropdown if click is outside
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target) &&
        isMobileMenuOpen
      ) {
        setActiveMobileDropdown("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setActiveMobileDropdown(""); // Close any open mobile dropdowns when closing mobile menu
    }
  };

  // Toggle the dropdown for menu items with context
  const toggleDropdown = (dropdownName, context) => {
    if (context === "desktop") {
      setActiveDropdown(activeDropdown === dropdownName ? "" : dropdownName);
    } else if (context === "mobile") {
      setActiveMobileDropdown(
        activeMobileDropdown === dropdownName ? "" : dropdownName
      );
    }
  };

  // Separate link click handlers for desktop and mobile
  const handleDesktopLinkClick = () => {
    setActiveDropdown(""); // Close desktop dropdown
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileDropdown("");
  };

  // Close mobile menu and desktop dropdowns when resizing from mobile to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Assuming 'md' breakpoint at 768px
        setIsMobileMenuOpen(false);
        setActiveMobileDropdown("");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent rendering until staffRoles are loaded
  if (!staffRoles) return null;

  // Determine which menus to show based on roles
  const showAllMenus = staffRoles.All === true;
  const showRegistrarMenus = staffRoles.Registrar === true;
  const showSandouqchaMenus = staffRoles.Sandouqcha === true;
  const showAuditorMenus = staffRoles.Auditor === true;
  const showTreasurerMenus = staffRoles.Treasurer === true;

  // Determine if any zone-specific menus should be shown
  const showZoneMenus =
    staffRoles.Fahaheel ||
    staffRoles.Farwaniya ||
    staffRoles.Jleeb ||
    staffRoles.Hawally ||
    staffRoles.Salmiya ;

  return (
    <nav className="bg-[#DDFFBC] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Main Logo Section */}
          <Link href="/welcome" className="flex items-center space-x-4" onClick={handleMobileLinkClick}>
            <Image
              src="/kws.png" // Replace with your logo path
              alt="KWS Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
            <span className="text-black text-3xl font-montserrat font-bold">
              <span className="text-black font-syne font-bold">KWS</span> Staff Portal
            </span>
          </Link>

          {/* Hamburger Icon for Mobile */}
          <button
            className="md:hidden text-black" // Changed to text-black for better visibility
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
          </button>

          {/* Desktop Menu */}
          <div
            className={`hidden md:flex space-x-16 justify-center flex-1`}
            ref={desktopDropdownRef}
          >
            {/* Assign Staff (Always visible if `All` role is true) */}
            {showAllMenus && (
              <Link
                href="/assign-staff"
                className="flex flex-col items-center text-black text-sm font-medium hover:text-pink-400"
                onClick={handleDesktopLinkClick}
              >
                <PersonAddIcon style={{ fontSize: 40 }} />
                <span>Assign Staff</span>
              </Link>
            )}

            {/* Members Dropdown (Visible for Registrar role and zones) */}
            {(showAllMenus || showRegistrarMenus || showTreasurerMenus ||showZoneMenus) && (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("members", "desktop")}
                  className="flex flex-col items-center text-black text-sm font-medium cursor-pointer hover:text-pink-400"
                >
                  <GroupIcon style={{ fontSize: 40 }} />
                  <span className="flex items-center">
                    Members <ArrowDropDownIcon />
                  </span>
                </button>
                {activeDropdown === "members" && (
                  <div className="absolute top-full mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-30">
                    {/* Show submenus based on roles */}
                    {(showZoneMenus || showTreasurerMenus) ? (
                      <>
                        <Link href="/members/overview" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Overview
                        </Link>
                        <Link href="/members/search" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Search
                        </Link>
                        <Link href="/members/transactions" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Member Transactions
                        </Link>
                      </>
                    ) : (
                      <>
                        {/* Show all submenus for other roles */}
                        <Link href="/members/overview" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Overview
                        </Link>
                        <Link href="/members/search" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Search
                        </Link>
                        <Link href="/members/transactions" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Member Transactions
                        </Link>
                        <Link href="/members/review" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Membership Review
                        </Link>
                        <Link href="/members/info-update" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Info Update Request
                        </Link>
                        <Link href="/members/non-kws" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Non-KWS Account
                        </Link>
                        {/* <Link href="/members/failed-emails" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                          Failed Emails
                        </Link> */}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sandouqcha Dropdown (Visible for Sandouqcha and Auditor roles) */}
            {(showAllMenus || showSandouqchaMenus || showAuditorMenus || showRegistrarMenus ||showZoneMenus || showTreasurerMenus) && (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("sandouqcha", "desktop")}
                  className="flex flex-col items-center text-black text-sm font-medium cursor-pointer hover:text-pink-400"
                >
                  <GiOpenTreasureChest size={40} />
                  <span className="flex items-center">
                    Sandouqcha <ArrowDropDownIcon />
                  </span>
                </button>
                {activeDropdown === "sandouqcha" && (
                  <div className="absolute top-full mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20">
                    <Link href="/sandouqcha" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                      Overview
                    </Link>
                    <Link href="/sandouqcha/boxes" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                      Boxes
                    </Link>
                    <Link href="/sandouqcha/transactions" className="block px-4 py-2 hover:bg-gray-100" onClick={handleDesktopLinkClick}>
                      Transactions
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Accounting (Visible for Treasurer role) */}
            {(showAllMenus || showTreasurerMenus) && (
              <Link
                href="/accounting"
                className="flex flex-col items-center text-black text-sm font-medium hover:text-pink-400"
                onClick={handleDesktopLinkClick}
              >
                <AccountBalanceIcon style={{ fontSize: 40 }} />
                <span>Accounting</span>
              </Link>
            )}

            {/* Event Management (Visible for All, Registrar role, or zones) */}
            {(showAllMenus || showRegistrarMenus || showZoneMenus) && (
              <Link
                href="/event-management"
                className="flex flex-col items-center text-black text-sm font-medium hover:text-pink-400"
                onClick={handleDesktopLinkClick}
              >
                <EventIcon style={{ fontSize: 40 }} />
                <span>Event Management</span>
              </Link>
            )}
          </div>

          {/* Profile and Logout Section */}
          <div className={`hidden md:flex items-center space-x-6`}>
            <Link
              href="/profile"
              className="flex flex-col items-center text-black text-sm font-medium hover:text-blue-600"
              onClick={handleDesktopLinkClick}
            >
              <AccountCircleIcon style={{ fontSize: 40 }} />
              <span>Profile</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden bg-[#DDFFBC] text-black p-4 space-y-4"
            ref={mobileDropdownRef}
          >
            {showAllMenus && (
              <Link
                href="/assign-staff"
                className="flex items-center py-2 text-sm font-medium hover:text-pink-400"
                onClick={handleMobileLinkClick}
              >
                <PersonAddIcon className="mr-2" />
                Assign Staff
              </Link>
            )}

            {/* Members Dropdown in Mobile */}
            {(showAllMenus || showRegistrarMenus|| showTreasurerMenus ||showZoneMenus ) && (
              <div>
                <button
                  onClick={() => toggleDropdown("members-mobile", "mobile")}
                  className="w-full text-left py-2 text-sm font-medium hover:text-pink-400 flex justify-between items-center"
                >
                  Members <ArrowDropDownIcon />
                </button>
                {activeMobileDropdown === "members-mobile" && (
                  <div className="bg-white text-black p-2 rounded-lg shadow-lg">
                    {(showZoneMenus || showTreasurerMenus) ? (
                      <>
                        <Link href="/members/overview" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Overview
                        </Link>
                        <Link href="/members/search" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Search
                        </Link>
                        <Link href="/members/transactions" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Member Transactions
                        </Link>
                      </>
                    ) : (
                      <>
                        {/* Show all submenus for other roles */}
                        <Link href="/members/overview" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Overview
                        </Link>
                        <Link href="/members/search" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Search
                        </Link>
                        <Link href="/members/transactions" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Member Transactions
                        </Link>
                        <Link href="/members/review" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Membership Review
                        </Link>
                        <Link href="/members/info-update" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Info Update Request
                        </Link>
                        <Link href="/members/non-kws" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Non-KWS Account
                        </Link>
                        {/* <Link href="/members/failed-emails" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                          Failed Emails
                        </Link> */}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sandouqcha Dropdown in Mobile */}
            {(showAllMenus || showSandouqchaMenus || showAuditorMenus || showRegistrarMenus || showZoneMenus || showTreasurerMenus ) && (
              <div>
                <button
                  onClick={() => toggleDropdown("sandouqcha-mobile", "mobile")}
                  className="w-full text-left py-2 text-sm font-medium hover:text-pink-400 flex justify-between items-center"
                >
                  Sandouqcha <ArrowDropDownIcon />
                </button>
                {activeMobileDropdown === "sandouqcha-mobile" && (
                  <div className="bg-white text-black p-2 rounded-lg shadow-lg">
                    <Link href="/sandouqcha" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                      Overview
                    </Link>
                    <Link href="/sandouqcha/boxes" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                      Boxes
                    </Link>
                    <Link href="/sandouqcha/transactions" className="block py-2 hover:bg-gray-100" onClick={handleMobileLinkClick}>
                      Transactions
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Accounting (Visible for Treasurer role) */}
            {(showAllMenus || showTreasurerMenus) && (
              <Link
                href="/accounting"
                className="flex items-center py-2 text-sm font-medium hover:text-pink-400"
                onClick={handleMobileLinkClick}
              >
                <AccountBalanceIcon className="mr-2" />
                Accounting
              </Link>
            )}

            {/* Event Management (Visible for All, Registrar role, or zones) */}
            {(showAllMenus || showRegistrarMenus || showZoneMenus) && (
              <Link
                href="/event-management"
                className="flex items-center py-2 text-sm font-medium hover:text-pink-400"
                onClick={handleMobileLinkClick}
              >
                <EventIcon className="mr-2" />
                Event Management
              </Link>
            )}

            {/* Profile Section */}
            <Link
              href="/profile"
              className="flex items-center py-2 text-sm font-medium hover:text-blue-600"
              onClick={handleMobileLinkClick}
            >
              <AccountCircleIcon className="mr-2" />
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
