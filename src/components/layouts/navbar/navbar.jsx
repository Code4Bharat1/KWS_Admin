"use client";
import React, { useState, useEffect,useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// Import MUI Icons
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
  const [activeDropdown, setActiveDropdown] = useState(""); // Track the currently open dropdown
  const [staffRoles, setStaffRoles] = useState(null);
  const dropdownRef = useRef(null);

  // Check if staff roles are available from localStorage
  useEffect(() => {
    const roles = localStorage.getItem("staffRoles");
    if (roles) {
      setStaffRoles(JSON.parse(roles)); // Parse and set the staff roles
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(""); // Close any active dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);






  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setActiveDropdown(""); // Close any open dropdowns when closing mobile menu
    }
  };

  // Toggle the dropdown for menu items
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? "" : dropdownName);
  };

  // Close mobile menu and dropdowns when a link is clicked
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      setActiveDropdown("");
    }
  };

  // Check if roles are available and conditionally render the menu
  if (!staffRoles) return null; // Wait until staffRoles are loaded

  const showAllMenus = staffRoles.All === true; // Check if "All" role is true
  const showRegistrarMenus = staffRoles.Registrar === true;
  const showSandouqchaMenus = staffRoles.Sandouqcha === true;
  const showAuditorMenus = staffRoles.Auditor === true;
  const showTreasurerMenus = staffRoles.Treasurer === true;

  // Check if any of the zones are selected (like Fahaheel, Farwaniya, etc.)
  const showZoneMenus =
    staffRoles.Fahaheel ||
    staffRoles.Farwaniya ||
    staffRoles.Jleeb ||
    staffRoles.Hawally ||
    staffRoles.Salmiya;

  return (
    <nav className="bg-[#DDFFBC] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Main Logo Section */}
          <Link href="/welcome" className="flex items-center space-x-4" onClick={handleLinkClick}>
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
          <div className={`hidden md:flex space-x-16 justify-center flex-1`}
           ref={dropdownRef}>
            {/* Assign Staff (Always visible if `All` role is true) */}
            {showAllMenus && (
              <Link
                href="/assign-staff"
                className="flex flex-col items-center text-black text-sm font-medium hover:text-pink-400"
                onClick={handleLinkClick}
              >
                <PersonAddIcon style={{ fontSize: 40 }} />
                <span>Assign Staff</span>
              </Link>
            )}

            {/* Members Dropdown (Visible for Registrar role and zones) */}
            {(showAllMenus || showRegistrarMenus || showZoneMenus) && (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("members")}
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
                    {showZoneMenus ? (
                      <>
                        <Link href="/members/overview" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Overview
                        </Link>
                        <Link href="/members/search" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Search
                        </Link>
                        <Link href="/members/transactions" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Member Transactions
                        </Link>
                      </>
                    ) : (
                      <>
                        {/* Show all submenus for other roles */}
                        <Link href="/members/overview" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Overview
                        </Link>
                        <Link href="/members/search" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Search
                        </Link>
                        <Link href="/members/transactions" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Member Transactions
                        </Link>
                        <Link href="/members/review" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Membership Review
                        </Link>
                        <Link href="/members/info-update" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Info Update Request
                        </Link>
                        <Link href="/members/non-kws" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Non-KWS Account
                        </Link>
                        {/* <Link href="/members/failed-emails" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Failed Emails
                        </Link> */}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sandouqcha Dropdown (Visible for Sandouqcha and Auditor roles) */}
            {(showAllMenus || showSandouqchaMenus || showAuditorMenus) && (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("sandouqcha")}
                  className="flex flex-col items-center text-black text-sm font-medium cursor-pointer hover:text-pink-400"
                >
                  <GiOpenTreasureChest size={40} />
                  <span className="flex items-center">
                    Sandouqcha <ArrowDropDownIcon />
                  </span>
                </button>
                {activeDropdown === "sandouqcha" && (
                  <div className="absolute top-full mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20">
                    {/* <Link href="/sandouqcha" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                      Overview
                    </Link> */}
                    <Link href="/sandouqcha/boxes" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                      Boxes
                    </Link>
                    <Link href="/sandouqcha/transactions" className="block px-4 py-2 hover:bg-gray-100" onClick={handleLinkClick}>
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
                onClick={handleLinkClick}
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
                onClick={handleLinkClick}
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
              onClick={handleLinkClick}
            >
              <AccountCircleIcon style={{ fontSize: 40 }} />
              <span>Profile</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#DDFFBC] text-black p-4 space-y-4">
            {showAllMenus && (
              <Link
                href="/assign-staff"
                className="flex items-center py-2 text-sm font-medium hover:text-pink-400"
                onClick={handleLinkClick}
              >
                <PersonAddIcon className="mr-2" />
                Assign Staff
              </Link>
            )}

            {/* Members Dropdown in Mobile */}
            {(showAllMenus || showRegistrarMenus || showZoneMenus) && (
              <div>
                <button
                  onClick={() => toggleDropdown("members-mobile")}
                  className="w-full text-left py-2 text-sm font-medium hover:text-pink-400 flex justify-between items-center"
                >
                  Members <ArrowDropDownIcon />
                </button>
                {activeDropdown === "members-mobile" && (
                  <div className="bg-white text-black p-2 rounded-lg shadow-lg">
                    {showZoneMenus ? (
                      <>
                        <Link href="/members/overview" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Overview
                        </Link>
                        <Link href="/members/search" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Search
                        </Link>
                        <Link href="/members/transactions" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Member Transactions
                        </Link>
                      </>
                    ) : (
                      <>
                        {/* Show all submenus for other roles */}
                        <Link href="/members/overview" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Overview
                        </Link>
                        <Link href="/members/search" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Search
                        </Link>
                        <Link href="/members/transactions" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Member Transactions
                        </Link>
                        <Link href="/members/review" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Membership Review
                        </Link>
                        <Link href="/members/info-update" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Info Update Request
                        </Link>
                        <Link href="/members/non-kws" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Non-KWS Account
                        </Link>
                        {/* <Link href="/members/failed-emails" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                          Failed Emails
                        </Link> */}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sandouqcha Dropdown in Mobile */}
            {(showAllMenus || showSandouqchaMenus || showAuditorMenus) && (
              <div>
                <button
                  onClick={() => toggleDropdown("sandouqcha-mobile")}
                  className="w-full text-left py-2 text-sm font-medium hover:text-pink-400 flex justify-between items-center"
                >
                  Sandouqcha <ArrowDropDownIcon />
                </button>
                {activeDropdown === "sandouqcha-mobile" && (
                  <div className="bg-white text-black p-2 rounded-lg shadow-lg">
                    {/* <Link href="/sandouqcha" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                      Overview
                    </Link> */}
                    <Link href="/sandouqcha/boxes" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
                      Boxes
                    </Link>
                    <Link href="/sandouqcha/transactions" className="block py-2 hover:bg-gray-100" onClick={handleLinkClick}>
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
                onClick={handleLinkClick}
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
                onClick={handleLinkClick}
              >
                <EventIcon className="mr-2" />
                Event Management
              </Link>
            )}

            {/* Profile Section */}
            <Link
              href="/profile"
              className="flex items-center py-2 text-sm font-medium hover:text-blue-600"
              onClick={handleLinkClick}
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
