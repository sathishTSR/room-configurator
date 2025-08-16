import styles from "./Sidebar.module.scss";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const assets = [
  { name: "Bed", src: "/bed.png", type: "bed" },
  { name: "Chair", src: "/chair.png", type: "chair" },
  // Add more assets as needed
];

const types = ["all", "bed", "chair"];

export default function Sidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        showFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showFilter]);

  const filteredAssets = assets.filter(
    (asset) =>
      (filter === "all" || asset.type === filter) &&
      asset.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!sidebarOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.heading}>Assets</h2>
      <div className={styles.searchRow} style={{ position: "relative", marginBottom: 8 }}>
        <input
          ref={searchInputRef}
          className={styles.search}
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingRight: 44 }}
        />
        <button
          className={styles.filterIcon}
          aria-label="Show filter"
          onClick={() => setShowFilter((v) => !v)}
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            padding: 4,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            borderRadius: 8,
            transition: "background 0.2s",
            zIndex: 2,
          }}
        >
          {/* Filter SVG icon */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H17M6 10H14M9 15H11" stroke="#f3f3f3" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {showFilter && (
          <div
            ref={filterRef}
            style={{
              position: "absolute",
              top: 48,
              left: 0,
              width: "100%",
              zIndex: 10,
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              borderRadius: 10,
              background: "rgba(35,36,43,0.98)",
            }}
          >
            <select
              className={styles.filter}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: "100%", margin: 0 }}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className={styles.grid}>
        {filteredAssets.map((asset) => (
          <div key={asset.name} className={styles.asset} title={asset.name}>
            <div className={styles.assetImage}>
              <Image src={asset.src} alt={asset.name} width={48} height={48} style={{ objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).src = "/fallback.png"; }} />
            </div>
            <span className={styles.label}>{asset.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
