import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Banknote,
  ChevronDown,
  Home,
  Instagram,
  MapPin,
  Play,
  Search,
  type LucideIcon,
} from "lucide-react";

import houseImage from "@/assets/house.png";
import type { Stay } from "@/lib/data/types";
import { HERO_DEFAULT_OPTIONS, type HeroSearch } from "@/lib/hero-search";
import { waNumberFromHref } from "@/lib/site";
import { useSite } from "@/lib/site-context";
import { cn } from "@/lib/utils";

type MenuKey = "Location" | "Stay Type" | "Guests";
type OpenMenu = MenuKey | null;

const DEFAULT_AVAILABILITY_MESSAGE = [
  "Hi Brij Stays, I am looking for a stay with the following details:",
  "",
];

export function Hero({
  stays = [],
  options = HERO_DEFAULT_OPTIONS,
}: {
  stays?: Stay[];
  /** Dropdown options for the search bar, fetched from the Hero Search CMS. */
  options?: HeroSearch;
}) {
  const site = useSite();
  const guestOptions = options.heroGuestOptions;

  const [selectedLocation, setSelectedLocation] = useState(
    options.heroLocations[0] ?? "Vrindavan, Uttar Pradesh",
  );
  const [stayType, setStayType] = useState(options.heroStayTypes[0] ?? "All Stays");
  const [guests, setGuests] = useState(guestOptions[0] ?? "2 – 3 Guests");
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const locationOptions = options.heroLocations;

  const categories = [...new Set(stays.map((s) => s.category).filter(Boolean))];
  // Show the CMS stay types first; fall back to categories derived from the
  // actual inventory so the list always has real options.
  const stayTypeOptions = [
    "All Stays",
    ...Array.from(
      new Set([...options.heroStayTypes.filter((t) => t !== "All Stays"), ...categories]),
    ),
  ];

  const instagram = site.socials.find(
    (s) => s.label.toLowerCase() === "instagram" || s.icon.toLowerCase() === "instagram",
  )?.href;

  const whatsappNumber = waNumberFromHref(site.whatsapp);

  const searchHref = useMemo(() => {
    if (!whatsappNumber) return "/stays";
    const message = [
      ...DEFAULT_AVAILABILITY_MESSAGE,
      `Location: ${selectedLocation}`,
      `Stay Type: ${stayType}`,
      `Guests: ${guests}`,
      "",
      "Please share availability, pricing, and booking details.",
    ].join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [stayType, guests, whatsappNumber, selectedLocation]);

  const availabilityHref = useMemo(() => {
    if (!whatsappNumber) return "#enquire";
    const message = [
      "Hi Brij Stays, I would like to check availability for a stay in Vrindavan.",
      "",
      "Please share availability, pricing, and booking details.",
    ].join("\n");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [whatsappNumber]);

  function handleSelect(key: MenuKey, value: string) {
    if (key === "Location") setSelectedLocation(value);
    else if (key === "Stay Type") setStayType(value);
    else if (key === "Guests") setGuests(value);
    setOpenMenu(null);
  }

  const searchFields: {
    key: MenuKey;
    label: string;
    icon: LucideIcon;
    value: string;
    options: string[];
  }[] = [
    {
      key: "Location",
      label: "Location",
      icon: MapPin,
      value: selectedLocation,
      options: locationOptions,
    },
    {
      key: "Stay Type",
      label: "Stay Type",
      icon: Home,
      value: stayType,
      options: stayTypeOptions,
    },
    { key: "Guests", label: "Guests", icon: Banknote, value: guests, options: guestOptions },
  ];

  return (
    <section className="overflow-x-clip bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-6 md:px-10 xl:px-24">
        <div className="pt-[62px] pb-[50px]">
          <div className="relative mt-[15px] min-[1001px]:h-[650px]">
            {/* Hero copy */}
            <div
              className={cn(
                "relative z-10 w-full pt-[70px]",
                "max-[600px]:pt-[50px]",
                "min-[1001px]:absolute min-[1001px]:top-[126px] min-[1001px]:left-0 min-[1001px]:w-[520px] min-[1001px]:pt-0",
              )}
            >
              <h1 className="font-baloo text-[44px] leading-[1.02] tracking-[-1px] text-[#111] min-[600px]:text-[54px] min-[1001px]:text-[68px] min-[1001px]:tracking-[-1.4px]">
                <span className="block font-normal">Gateway to</span>
                <span className="block font-bold">Dream Homes</span>
              </h1>

              <p className="mt-[25px] max-w-[445px] font-poppins text-[14px] leading-[1.55] font-normal text-[#686868] min-[600px]:text-base max-[600px]:mt-5">
                Curated boutique stays near ISKCON, Prem Mandir and Banke Bihari — warm, comfortable
                and thoughtfully hosted.
              </p>

              <div className="mt-10 flex items-center gap-[34px] max-[600px]:mt-7 max-[600px]:gap-5">
                <Link
                  to="/stays"
                  className="inline-flex h-[54px] cursor-pointer items-center justify-center rounded-full bg-[#111] px-9 font-baloo text-base font-semibold text-white transition-opacity duration-200 hover:opacity-80 max-[600px]:h-12 max-[600px]:px-[25px] max-[600px]:text-sm"
                >
                  Discover Stays
                </Link>

                <a
                  href={availabilityHref}
                  target={availabilityHref.startsWith("http") ? "_blank" : undefined}
                  rel={availabilityHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex cursor-pointer items-center gap-[13px] border-0 bg-transparent p-0 text-[#111]"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#111] max-[600px]:h-10 max-[600px]:w-10">
                    <Play className="ml-0.5 h-[13px] w-[13px] fill-[#111] text-[#111]" />
                  </span>
                  <span className="font-poppins text-[15px] font-semibold max-[600px]:text-[13px]">
                    Check Availability
                  </span>
                </a>
              </div>

              {instagram ? (
                <div className="mt-11 flex items-center gap-3 max-[600px]:mt-[26px] max-[600px]:gap-[10px]">
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="flex h-7 w-7 items-center justify-center text-[#111] transition duration-200 hover:-translate-y-px hover:opacity-55 max-[600px]:h-[22px] max-[600px]:w-[22px]"
                  >
                    <Instagram
                      className="block h-6 w-6 max-[600px]:h-[19px] max-[600px]:w-[19px]"
                      strokeWidth={1.6}
                    />
                  </a>
                </div>
              ) : null}
            </div>

            {/* House image */}
            <div
              className={cn(
                "pointer-events-none relative z-[5] mt-[-10px] w-[110%] -ml-[5%]",
                "max-[600px]:mt-0 max-[600px]:w-[125%] max-[600px]:-ml-[12%]",
                "min-[1001px]:absolute min-[1001px]:top-5 min-[1001px]:right-[-100px] min-[1001px]:mt-0 min-[1001px]:ml-0 min-[1001px]:w-[70%]",
              )}
            >
              <img
                src={houseImage}
                alt="Brij Stays — premium stays in Vrindavan"
                width={1600}
                height={900}
                className="block h-auto w-full object-contain"
              />
            </div>
          </div>

          {/* Property search bar */}
          <div
            className={cn(
              "mx-auto",
              "max-[1000px]:mt-4",
              "min-[1001px]:relative min-[1001px]:z-[15] min-[1001px]:mt-[-92px] min-[1001px]:w-[81%]",
            )}
          >
            <div
              className={cn(
                "flex min-h-[98px] items-center rounded-[30px] border border-[#e7e7e7] bg-white px-[18px] py-[14px] pl-[27px] shadow-[0_18px_45px_rgba(0,0,0,.075)]",
                "max-[1000px]:min-h-0 max-[1000px]:flex-wrap max-[1000px]:gap-[15px] max-[1000px]:rounded-[24px] max-[1000px]:p-5",
                "max-[600px]:grid max-[600px]:grid-cols-1 max-[600px]:gap-[18px]",
              )}
            >
              {openMenu ? (
                <div
                  className="fixed inset-0 z-20 cursor-default"
                  aria-hidden
                  onClick={() => setOpenMenu(null)}
                />
              ) : null}

              {searchFields.map((field, i) => (
                <div key={field.key} className="contents">
                  {i > 0 ? (
                    <div className="h-[45px] w-px shrink-0 bg-[#e5e5e5] max-[1000px]:hidden" />
                  ) : null}
                  <div
                    className={cn(
                      "relative flex min-w-0 flex-1 flex-col justify-center gap-[5px] px-7 font-poppins",
                      "first:pl-0",
                      "max-[1000px]:w-[45%] max-[1000px]:flex-none max-[1000px]:p-0",
                      "max-[600px]:w-full",
                    )}
                  >
                    {field.options ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === field.key ? null : field.key)}
                          aria-haspopup="listbox"
                          aria-expanded={openMenu === field.key}
                          className="flex cursor-pointer flex-col justify-center gap-[5px] text-left"
                        >
                          <div className="flex items-center gap-[7px] text-xs leading-none font-normal text-[#777]">
                            <field.icon className="h-[14px] w-[14px] shrink-0" strokeWidth={1.8} />
                            {field.label}
                          </div>
                          <div className="flex items-center justify-between gap-2.5">
                            <span className="text-sm leading-[1.2] font-semibold whitespace-nowrap text-[#111]">
                              {field.value}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-[15px] w-[15px] shrink-0 text-[#111] transition-transform duration-200",
                                openMenu === field.key && "rotate-180",
                              )}
                              strokeWidth={2}
                            />
                          </div>
                        </button>
                        {openMenu === field.key ? (
                          <div
                            role="listbox"
                            aria-label={field.label}
                            className="absolute top-full right-0 left-0 z-30 mt-2 min-w-[190px] rounded-2xl border border-[#e7e7e7] bg-white p-2 shadow-[0_18px_45px_rgba(0,0,0,.12)] max-[1000px]:left-auto max-[1000px]:right-0"
                          >
                            {field.options.map((option) => (
                              <button
                                key={option}
                                type="button"
                                role="option"
                                aria-selected={option === field.value}
                                onClick={() => handleSelect(field.key, option)}
                                className={cn(
                                  "block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm text-[#111] transition-colors duration-150 hover:bg-[#f5f5f5]",
                                  option === field.value && "font-semibold text-[#111]",
                                )}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              ))}

              <a
                href={searchHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Search stays on WhatsApp"
                className="ml-3 grid h-14 w-14 shrink-0 cursor-pointer place-items-center rounded-full bg-[#111] text-white transition-opacity duration-200 hover:opacity-80 max-[1000px]:ml-auto max-[600px]:ml-0 max-[600px]:h-[52px] max-[600px]:w-[52px]"
              >
                <Search className="h-5 w-5" strokeWidth={2.2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
