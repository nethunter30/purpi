"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X, Folder, Layers, Sparkles, Loader2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory: {
    _id: string;
    name: string;
    slug: string;
  };
}

type SearchResultItem =
  | (Category & { searchType: "category" })
  | (Subcategory & { searchType: "subcategory" })
  | (Product & { searchType: "product" });

export default function ServiceSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Raw data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect mobile vs desktop and track mount for portal
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch all services data once when search is activated/focused
  const fetchData = async () => {
    if (hasLoaded || loading) return;
    setLoading(true);
    try {
      const [resCats, resSubs, resProds] = await Promise.all([
        fetch("/api/services/categories"),
        fetch("/api/services/subcategories"),
        fetch("/api/services/products"),
      ]);

      const [dataCats, dataSubs, dataProds] = await Promise.all([
        resCats.json(),
        resSubs.json(),
        resProds.json(),
      ]);

      if (dataCats.success) setCategories(dataCats.data || []);
      if (dataSubs.success) setSubcategories(dataSubs.data || []);
      if (dataProds.success) setProducts(dataProds.data || []);
      setHasLoaded(true);
    } catch (err) {
      console.error("Failed to fetch services search data", err);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    fetchData();
  };

  // Filtered results memoized
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return { categories: [], subcategories: [], products: [], flat: [] as SearchResultItem[] };
    }

    const q = query.toLowerCase().trim();

    const filteredCats = categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );

    const filteredSubs = subcategories.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category?.name?.toLowerCase().includes(q)
    );

    const filteredProds = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        p.subcategory?.name?.toLowerCase().includes(q)
    );

    // Flatten for simple keyboard navigation mapping
    const flat: SearchResultItem[] = [
      ...filteredProds.map((p) => ({ ...p, searchType: "product" as const })),
      ...filteredSubs.map((s) => ({ ...s, searchType: "subcategory" as const })),
      ...filteredCats.map((c) => ({ ...c, searchType: "category" as const })),
    ];

    return {
      categories: filteredCats,
      subcategories: filteredSubs,
      products: filteredProds,
      flat,
    };
  }, [query, categories, subcategories, products]);

  // Navigate to target item
  const handleNavigate = (item: SearchResultItem) => {
    let url = "";
    if (item.searchType === "category") {
      url = `/services/${item.slug}`;
    } else if (item.searchType === "subcategory") {
      const catSlug = item.category?.slug || "unknown";
      url = `/services/${catSlug}/${item.slug}`;
    } else if (item.searchType === "product") {
      const catSlug = item.category?.slug || "unknown";
      const subSlug = item.subcategory?.slug || "unknown";
      url = `/services/${catSlug}/${subSlug}/${item.slug}`;
    }

    if (url) {
      router.push(url);
      setIsFocused(false);
      setQuery("");
      setSelectedIndex(-1);
    }
  };

  // Keyboard navigation handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { flat } = searchResults;
    if (flat.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 >= flat.length ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 < 0 ? flat.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < flat.length) {
        handleNavigate(flat[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Helper for matching text highlights
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === search.toLowerCase().trim() ? (
            <mark key={index} className="bg-purple-500/40 text-purple-100 rounded-[2px] px-0.5 font-medium">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const showDropdown = isFocused && (query.trim().length > 0 || loading);

  return (
    <div ref={containerRef} className="relative z-50 flex items-center">
      {/* --- UNIFIED RESPONSIVE SEARCH BAR --- */}
      <div className="relative flex items-center">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border bg-purple-900/10 backdrop-blur-md transition-all duration-300 ${
            isFocused
              ? "border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.35)] w-[140px] xs:w-[180px] sm:w-[240px] md:w-[300px]"
              : "border-purple-500/20 hover:border-purple-500/40 w-[110px] xs:w-[140px] sm:w-[180px] md:w-[220px]"
          }`}
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 text-xs sm:text-sm font-medium"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedIndex(-1);
              }}
              className="p-0.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>

        {/* ── DESKTOP DROPDOWN (sm and up) ──────────────────────────── */}
        {showDropdown && !isMobile && (
          <div className="absolute right-0 top-full mt-2 w-[340px] md:w-[450px] max-h-[480px] overflow-y-auto rounded-2xl border border-purple-500/20 bg-[#12051d]/95 backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col gap-4 z-[999] animate-[fadeIn_0.2s_ease-out]">
            {loading && (
              <div className="flex items-center justify-center py-6 gap-2 text-purple-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading index...</span>
              </div>
            )}

            {!loading && searchResults.flat.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No matching categories or services found.
              </div>
            )}

            {!loading && searchResults.flat.length > 0 && (
              <>
                {/* Services Section */}
                {searchResults.products.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-2 px-1">
                      Services ({searchResults.products.length})
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {searchResults.products.map((p) => {
                        const globalIdx = searchResults.flat.findIndex((f) => f._id === p._id && f.searchType === "product");
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <div
                            key={p._id}
                            onClick={() => handleNavigate({ ...p, searchType: "product" as const })}
                            className={`group flex items-start gap-3 p-2 rounded-xl border border-transparent cursor-pointer transition-all ${
                              isSelected
                                ? "bg-purple-900/30 border-purple-500/30 text-white"
                                : "hover:bg-purple-950/20 hover:border-purple-500/10 text-gray-200"
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-purple-950/50 text-purple-400 group-hover:text-purple-300 border border-purple-500/10 shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-xs md:text-sm truncate">
                                  {highlightText(p.name, query)}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-900/40 text-purple-300 font-semibold border border-purple-500/20 shrink-0">
                                  Service
                                </span>
                              </div>
                              <p className="text-[10px] md:text-xs text-gray-400 line-clamp-1 mt-0.5">
                                {highlightText(p.description, query)}
                              </p>
                              {p.category && (
                                <div className="flex items-center gap-1 mt-1 text-[9px] text-purple-400 font-medium">
                                  <span>{p.category.name}</span>
                                  {p.subcategory && (
                                    <>
                                      <span>&bull;</span>
                                      <span>{p.subcategory.name}</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subcategories Section */}
                {searchResults.subcategories.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-2 px-1">
                      Subcategories ({searchResults.subcategories.length})
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {searchResults.subcategories.map((s) => {
                        const globalIdx = searchResults.flat.findIndex((f) => f._id === s._id && f.searchType === "subcategory");
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <div
                            key={s._id}
                            onClick={() => handleNavigate({ ...s, searchType: "subcategory" as const })}
                            className={`group flex items-start gap-3 p-2 rounded-xl border border-transparent cursor-pointer transition-all ${
                              isSelected
                                ? "bg-purple-900/30 border-purple-500/30 text-white"
                                : "hover:bg-purple-950/20 hover:border-purple-500/10 text-gray-200"
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-indigo-950/50 text-indigo-400 group-hover:text-indigo-300 border border-indigo-500/10 shrink-0">
                              <Folder className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-xs md:text-sm truncate">
                                  {highlightText(s.name, query)}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300 font-semibold border border-indigo-500/20 shrink-0">
                                  Subcategory
                                </span>
                              </div>
                              <p className="text-[10px] md:text-xs text-gray-400 line-clamp-1 mt-0.5">
                                {highlightText(s.description, query)}
                              </p>
                              {s.category && (
                                <span className="text-[9px] text-indigo-400 font-medium mt-1 inline-block">
                                  Category: {s.category.name}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Categories Section */}
                {searchResults.categories.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest text-fuchsia-400 uppercase mb-2 px-1">
                      Categories ({searchResults.categories.length})
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      {searchResults.categories.map((c) => {
                        const globalIdx = searchResults.flat.findIndex((f) => f._id === c._id && f.searchType === "category");
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <div
                            key={c._id}
                            onClick={() => handleNavigate({ ...c, searchType: "category" as const })}
                            className={`group flex items-start gap-3 p-2 rounded-xl border border-transparent cursor-pointer transition-all ${
                              isSelected
                                ? "bg-purple-900/30 border-purple-500/30 text-white"
                                : "hover:bg-purple-950/20 hover:border-purple-500/10 text-gray-200"
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-fuchsia-950/50 text-fuchsia-400 group-hover:text-fuchsia-300 border border-fuchsia-500/10 shrink-0">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-xs md:text-sm truncate">
                                  {highlightText(c.name, query)}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-fuchsia-900/40 text-fuchsia-300 font-semibold border border-fuchsia-500/20 shrink-0">
                                  Category
                                </span>
                              </div>
                              <p className="text-[10px] md:text-xs text-gray-400 line-clamp-1 mt-0.5">
                                {highlightText(c.description, query)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── MOBILE BOTTOM SHEET MODAL (via portal, independent of header position) ── */}
      {mounted && showDropdown && isMobile && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFocused(false)}
          />
          {/* Sheet */}
          <div className="relative w-full max-h-[80vh] rounded-t-2xl border-t border-x border-purple-500/20 bg-[#12051d] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease-out]">
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5 shrink-0">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Search Results</span>
              <button
                onClick={() => { setIsFocused(false); setQuery(""); }}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-4">
              {loading && (
                <div className="flex items-center justify-center py-6 gap-2 text-purple-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading index...</span>
                </div>
              )}

              {!loading && searchResults.flat.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No matching categories or services found.
                </div>
              )}

              {!loading && searchResults.flat.length > 0 && (
                <>
                  {/* Services */}
                  {searchResults.products.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-2 px-1">
                        Services ({searchResults.products.length})
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {searchResults.products.map((p) => {
                          const globalIdx = searchResults.flat.findIndex((f) => f._id === p._id && f.searchType === "product");
                          const isSelected = globalIdx === selectedIndex;
                          return (
                            <div
                              key={p._id}
                              onClick={() => handleNavigate({ ...p, searchType: "product" as const })}
                              className={`group flex items-start gap-3 p-3 rounded-xl border border-transparent cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-purple-900/30 border-purple-500/30 text-white"
                                  : "hover:bg-purple-950/20 hover:border-purple-500/10 text-gray-200"
                              }`}
                            >
                              <div className="p-2 rounded-lg bg-purple-950/50 text-purple-400 border border-purple-500/10 shrink-0">
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-sm truncate">{highlightText(p.name, query)}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-900/40 text-purple-300 font-semibold border border-purple-500/20 shrink-0">Service</span>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{highlightText(p.description, query)}</p>
                                {p.category && (
                                  <div className="flex items-center gap-1 mt-1 text-[9px] text-purple-400 font-medium">
                                    <span>{p.category.name}</span>
                                    {p.subcategory && (<><span>&bull;</span><span>{p.subcategory.name}</span></>)}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Subcategories */}
                  {searchResults.subcategories.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-2 px-1">
                        Subcategories ({searchResults.subcategories.length})
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {searchResults.subcategories.map((s) => {
                          const globalIdx = searchResults.flat.findIndex((f) => f._id === s._id && f.searchType === "subcategory");
                          const isSelected = globalIdx === selectedIndex;
                          return (
                            <div
                              key={s._id}
                              onClick={() => handleNavigate({ ...s, searchType: "subcategory" as const })}
                              className={`group flex items-start gap-3 p-3 rounded-xl border border-transparent cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-purple-900/30 border-purple-500/30 text-white"
                                  : "hover:bg-purple-950/20 hover:border-purple-500/10 text-gray-200"
                              }`}
                            >
                              <div className="p-2 rounded-lg bg-indigo-950/50 text-indigo-400 border border-indigo-500/10 shrink-0">
                                <Folder className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-sm truncate">{highlightText(s.name, query)}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300 font-semibold border border-indigo-500/20 shrink-0">Subcategory</span>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{highlightText(s.description, query)}</p>
                                {s.category && (
                                  <span className="text-[9px] text-indigo-400 font-medium mt-1 inline-block">Category: {s.category.name}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {searchResults.categories.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold tracking-widest text-fuchsia-400 uppercase mb-2 px-1">
                        Categories ({searchResults.categories.length})
                      </h4>
                      <div className="flex flex-col gap-1.5">
                        {searchResults.categories.map((c) => {
                          const globalIdx = searchResults.flat.findIndex((f) => f._id === c._id && f.searchType === "category");
                          const isSelected = globalIdx === selectedIndex;
                          return (
                            <div
                              key={c._id}
                              onClick={() => handleNavigate({ ...c, searchType: "category" as const })}
                              className={`group flex items-start gap-3 p-3 rounded-xl border border-transparent cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-purple-900/30 border-purple-500/30 text-white"
                                  : "hover:bg-purple-950/20 hover:border-purple-500/10 text-gray-200"
                              }`}
                            >
                              <div className="p-2 rounded-lg bg-fuchsia-950/50 text-fuchsia-400 border border-fuchsia-500/10 shrink-0">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-sm truncate">{highlightText(c.name, query)}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-fuchsia-900/40 text-fuchsia-300 font-semibold border border-fuchsia-500/20 shrink-0">Category</span>
                                </div>
                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{highlightText(c.description, query)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
