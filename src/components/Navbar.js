"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar({ logo, title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <nav
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          position: "fixed",
          width: "100%",
          backgroundColor:
            isMenuOpen || isDropdownOpen ? "#2D2D2D" : "rgba(0, 0, 0, 0.25)",
          zIndex: 10,
          color: "white",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo || "/images/default-logo.png"}
            alt={title || "Logo"}
            style={{ height: "40px" }}
          />
        </Link>

        {/* Hamburger-knapp for mobil */}
        <button
          onClick={toggleMenu}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "none",
            fontSize: "1.5rem",
          }}
          className="hamburger-menu"
        >
          ☰
        </button>

        {/* Meny-elementer for mobil */}
        <ul
          style={{
            listStyle: "none",
            display: isMenuOpen ? "flex" : "none",
            flexDirection: "column",
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "#2D2D2D",
            width: "100%",
            padding: "1rem",
            gap: 12,
          }}
          className="navbar-links"
        >
          <li style={{ margin: "0.5rem 0", position: "relative" }}>
            <button
              onClick={toggleDropdown}
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "1rem",
                color: "#fff",
              }}
              className="flex flex-row gap-4"
            >
              <p>Solceller</p>
              <img
                src="/chevron.png"
                className="h-2 self-center"
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "",
                  transition: "transform 300ms ease",
                }}
              />
            </button>
            {/* Dropdown-meny */}
            {isDropdownOpen && (
              <ul
                style={{
                  listStyle: "none",
                  padding: "0.5rem",
                  zIndex: 10,
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <li style={{ margin: "0.5rem 0" }}>
                  <Link
                    className="flex flex-row justify-between"
                    href="/slide/landbruk"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="font-medium text-lg">Landbruk</p>
                    <img src="/orangeArrow.png" className="h-6" />
                  </Link>
                </li>
                <li style={{ margin: "0.5rem 0" }}>
                  <Link
                    className="flex flex-row justify-between"
                    href="/slide/bedrift"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="font-medium text-lg">Bedrift</p>
                    <img src="/orangeArrow.png" className="h-6" />
                  </Link>
                </li>
                <li style={{ margin: "0.5rem 0" }}>
                  <Link
                    className="flex flex-row justify-between"
                    href="/slide/enebolig-hytte"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="font-medium text-lg">Enebolig/Hytte</p>
                    <img src="/orangeArrow.png" className="h-6" />
                  </Link>
                </li>
                <li style={{ margin: "0.5rem 0" }}>
                  <Link
                    className="flex flex-row justify-between"
                    href="/slide/borettslag"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="font-medium text-lg">Borettslag</p>
                    <img src="/orangeArrow.png" className="h-6" />
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li style={{ margin: "0.5rem 0" }}>
            <Link href="/about" style={{ textDecoration: "none" }}>
              Om oss
            </Link>
          </li>
          <li style={{ margin: "0.5rem 0" }}>
            <Link href="/blog" style={{ textDecoration: "none" }}>
              Blogg
            </Link>
          </li>

          <li style={{ margin: "0.5rem 0" }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                textDecorationLine: "underline",
              }}
            >
              Kontakt oss →
            </Link>
          </li>
        </ul>

        {/* Standard meny på PC */}
        <ul
          style={{
            display: "flex",
            gap: "1.5rem",
            listStyle: "none",
          }}
          className="navbar-desktop"
        >
          <li style={{ position: "relative" }}>
            <button
              onClick={toggleDropdown}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Solceller ▾
            </button>
            {/* Dropdown-meny */}
            {isDropdownOpen && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "#2D2D2D",
                  padding: "0.5rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  zIndex: 10,
                  listStyle: "none",
                  color: "#FFF",
                  minWidth: "240px",
                  gap: 12,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <li style={{ margin: "0.5rem 0" }}>
                  <Link
                    className="flex flex-row justify-between"
                    href="/slide/landbruk"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="font-medium text-lg">Landbruk</p>
                    <img src="/orangeArrow.png" className="h-6" />
                  </Link>
                </li>
                <li style={{ margin: "0.5rem 0" }}>
                  <Link
                    className="flex flex-row justify-between"
                    href="/slide/bedrift"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="font-medium text-lg">Bedrift</p>
                    <img src="/orangeArrow.png" className="h-6" />
                  </Link>
                </li>
                <li style={{ margin: "0.5rem 0" }}>
                  <Link
                    className="flex flex-row justify-between"
                    href="/slide/enebolig-hytte"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="font-medium text-lg">Enebolig/Hytte</p>
                    <img src="/orangeArrow.png" className="h-6" />
                  </Link>
                </li>
                <li style={{ margin: "0.5rem 0" }}>
                  <Link
                    className="flex flex-row justify-between"
                    href="/slide/borettslag"
                    style={{ textDecoration: "none" }}
                  >
                    <p className="font-medium text-lg">Borettslag</p>
                    <img src="/orangeArrow.png" className="h-6" />
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/about" style={{ textDecoration: "none" }}>
              Om oss
            </Link>
          </li>
          <li>
            <Link href="/blog" style={{ textDecoration: "none" }}>
              Blogg
            </Link>
          </li>
          <li>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                textDecorationLine: "underline",
              }}
            >
              Kontakt oss →
            </Link>
          </li>
        </ul>
      </nav>
      {/* <div className="h-16"></div> */}
    </>
  );
}
