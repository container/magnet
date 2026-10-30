import { Fragment, useEffect, useState } from "react";
import type { ComponentProps, FormEvent, ReactNode } from "react";
import { Link as RouterLink, NavLink as RouterNavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  bookings,
  equipmentItems,
  events,
  formFlows,
  getEvent,
  getEventById,
  getIssuedTicket,
  getNewsItem,
  getProgramme,
  getProgrammeById,
  getSpace,
  getSpaceEvents,
  integrations,
  issuedTickets,
  memberAccess,
  news,
  programmes,
  programmeApplications,
  roomUseRequests,
  shopProducts,
  spaces,
  submissions,
  users
} from "./data";
import { languages, useLanguage, withLanguageFlag, type Language, type TranslationKey } from "./i18n";
import type { AdminModuleAccess, Booking, CartItem, EquipmentItem, EventItem, EventOccurrence, FormFlow, Integration, IssuedTicket, MembershipType, NewsItem, Programme, ProgrammeApplication, ProgrammeApplicationStatus, RoomUseRequest, ShopProduct, ShopProductVariant, Space, User, UserGroup, UserStatus } from "./types";

const websiteNav: { labelKey: TranslationKey; to: string }[] = [
  { labelKey: "nav.presentation", to: "/predstavitev" },
  { labelKey: "nav.spaces", to: "/prostori" },
  { labelKey: "nav.events", to: "/dogodki" },
  { labelKey: "nav.community", to: "/skupnost" },
  { labelKey: "nav.news", to: "/novice" }
];

const adminMainNav = [
  { label: "Nadzorna plošča", to: "/admin" },
  { label: "Novice", to: "/admin/novice" },
  { label: "Dogodki", to: "/admin/dogodki" },
  { label: "Obrazci", to: "/admin/obrazci" },
  { label: "Prostori in rezervacije", to: "/admin/prostori" },
  { label: "Programi", to: "/admin/programi" },
  { label: "Statična vsebina", to: "/admin/staticna-vsebina" },
  { label: "Mediji", to: "/admin/mediji" },
  { label: "Info ekrani", to: "/admin/signage" }
];

const adminAuxNav = [
  { label: "Integracije", to: "/admin/integracije" },
  { label: "Uporabniki in člani", to: "/admin/uporabniki" },
  { label: "Sodelavci", to: "/admin/sodelavci" },
  { label: "Nastavitve", to: "/admin/nastavitve" }
];

const adminFormSubNav = [
  { label: "Kontakt", to: "/admin/obrazci/kontakt" },
  { label: "Oglaševanje", to: "/admin/obrazci/oglasevanje" },
  { label: "Partnerstvo", to: "/admin/obrazci/partnerstvo" },
  { label: "Nov obrazec", to: "/admin/obrazci/nov", isCreate: true }
];

const adminEventsSubNav = [
  { label: "Seznam dogodkov", to: "/admin/dogodki" },
  { label: "Izdane karte", to: "/admin/dogodki/karte" }
];

const adminUsersSubNav = [
  { label: "Seznam", to: "/admin/uporabniki" },
  { label: "Novi člani", to: "/admin/uporabniki/novi-clani" }
];

const adminSpacesSubNav = [
  { label: "Koledar rezervacij", to: "/admin/prostori" },
  { label: "Vse rezervacije", to: "/admin/prostori/rezervacije" },
  { label: "Seznam prostorov", to: "/admin/prostori/sobe" },
  { label: "Povpraševanja", to: "/admin/prostori/zahteve" },
  { label: "Oprema", to: "/admin/prostori/oprema" }
];

const adminProgrammesSubNav = [
  { label: "Seznam", to: "/admin/programi" },
  { label: "Prijave na programe", to: "/admin/programi/prijave" }
];

const mojDomNav = [
  { label: "Pregled", to: "/moj-dom" },
  { label: "Rezervacije prostorov", to: "/moj-dom/rezervacije" },
  { label: "Prijave na programe", to: "/moj-dom/programi" },
  { label: "Komunikacija", to: "/moj-dom/komunikacija" },
  { label: "Članstvo", to: "/moj-dom/clanstvo" },
  { label: "Profil", to: "/moj-dom/profil" },
  { label: "Karte za dogodke", to: "/moj-dom/karte" }
];

const roomUseApprovalStatuses: RoomUseRequest["approvalStatus"][] = ["novo", "v pregledu", "čaka uporabnika", "odobreno za koledar", "zavrnjeno", "arhivirano"];
const programmeApplicationStatuses: ProgrammeApplicationStatus[] = ["novo", "v pregledu", "aktivno", "zaključeno", "arhivirano"];
const prototypeRoomUseRequestsStorageKey = "magnetic.prototype.roomUseRequests";
const prototypeRoomUseRequestsChangedEvent = "magnetic:room-use-requests-changed";
const prototypeShopCartStorageKey = "magnetic.prototype.shopCart";
const prototypeShopCartChangedEvent = "magnetic:shop-cart-changed";
const prototypeSignedInStorageKey = "magnetic.prototype.signedIn";
const prototypeSignedInChangedEvent = "magnetic:signed-in-changed";
const prototypeProgrammeApplicationsStorageKey = "magnetic.prototype.programmeApplications";
const prototypeProgrammeApplicationsChangedEvent = "magnetic:programme-applications-changed";
const prototypeEventsStorageKey = "magnetic.prototype.events";
const prototypeEventsChangedEvent = "magnetic:events-changed";
const prototypeProgrammesStorageKey = "magnetic.prototype.programmes";
const prototypeProgrammesChangedEvent = "magnetic:programmes-changed";
const prototypeUsersStorageKey = "magnetic.prototype.users";
const prototypeUsersChangedEvent = "magnetic:users-changed";
const prototypeBookingsStorageKey = "magnetic.prototype.bookings";
const prototypeBookingsChangedEvent = "magnetic:bookings-changed";
const adminSidebarCollapsedGroupsStorageKey = "magnetic.prototype.adminSidebarCollapsedGroups";
const mojDomTicketArchiveCutoff = "2027-02-01";
/** Shared simulated current date for all prototype views. */
const prototypeTodayKey = "2027-01-20";
const prototypeNowIso = "2027-01-20T10:00:00.000Z";

const assignableAdminModules: AdminModuleAccess[] = ["Novice", "Dogodki", "Obrazci", "Prostori in rezervacije", "Programi", "Statična vsebina", "Info ekrani", "Uporabniki in člani"];

type SpaceVisualTag = "Prireditve" | "Vadba" | "Delo" | "Sodelo" | "Pisarna" | "Ustvarjanje" | "Razstave";
type SpacePresentationUnit = "Prireditve in vadba" | "Skupnost in sodelo" | "Ustvarjanje in razstave";
type EventDiscoveryFilter = "all" | SpacePresentationUnit;

const spaceTagClass: Record<SpaceVisualTag, string> = {
  Prireditve: "events",
  Vadba: "practice",
  Delo: "work",
  Sodelo: "cowork",
  Pisarna: "office",
  Ustvarjanje: "making",
  Razstave: "exhibit"
};

const spaceVisualMeta: Record<string, { tag: SpaceVisualTag; order: number; featured?: boolean; wide?: boolean }> = {
  "velika-dvorana": { tag: "Prireditve", order: 10, featured: true },
  "mala-dvorana": { tag: "Prireditve", order: 20, wide: true },
  "vadbena-orkester": { tag: "Vadba", order: 30 },
  "vadbena-ples": { tag: "Vadba", order: 40 },
  "mala-vadbena-dvorana": { tag: "Vadba", order: 50 },
  sestankovalnica: { tag: "Delo", order: 70 },
  "zbornica-1": { tag: "Sodelo", order: 110, wide: true },
  "zbornica-2": { tag: "Sodelo", order: 120, wide: true },
  "hub-ucilnica-1": { tag: "Delo", order: 130, wide: true },
  "hub-ucilnica-2": { tag: "Delo", order: 140, wide: true },
  "pisarna-1": { tag: "Pisarna", order: 150 },
  "pisarna-2": { tag: "Pisarna", order: 160 },
  laboratorij: { tag: "Sodelo", order: 170, wide: true },
  atelje: { tag: "Ustvarjanje", order: 180, featured: true },
  "rezidenca-1": { tag: "Ustvarjanje", order: 190 },
  "rezidenca-2": { tag: "Ustvarjanje", order: 200 },
  "ulicna-galerija": { tag: "Razstave", order: 210 },
  "galerija-stopnisce": { tag: "Razstave", order: 220 }
};

const eventDiscoveryFilters: { label: string; value: EventDiscoveryFilter }[] = [
  { label: "Vsi dogodki", value: "all" },
  { label: "Prireditve in vadba", value: "Prireditve in vadba" },
  { label: "Skupnost in sodelo", value: "Skupnost in sodelo" },
  { label: "Ustvarjanje in razstave", value: "Ustvarjanje in razstave" }
];

type EditorialContentKind = "news" | "call" | "notice" | "press_release";

const editorialContentTabs: { label: string; value: EditorialContentKind }[] = [
  { label: "Novice", value: "news" },
  { label: "Pozivi", value: "call" },
  { label: "Obvestila", value: "notice" },
  { label: "PR obvestila", value: "press_release" }
];

type LinkTo = ComponentProps<typeof RouterLink>["to"];

function Link({ to, ...props }: ComponentProps<typeof RouterLink>) {
  const { language } = useLanguage();
  return <RouterLink {...props} to={withLanguageTo(to, language)} />;
}

function NavLink({ to, ...props }: ComponentProps<typeof RouterNavLink>) {
  const { language } = useLanguage();
  return <RouterNavLink {...props} to={withLanguageTo(to, language)} />;
}

function withLanguageTo(to: LinkTo, language: Language): LinkTo {
  if (typeof to === "string") return withLanguageFlag(to, language);

  const params = new URLSearchParams(to.search?.replace(/^\?/, ""));
  params.set("lang", language);
  return {
    ...to,
    search: `?${params.toString()}`
  };
}

function usePrototypeRoomUseRequests() {
  const [requests, setRequests] = useState<RoomUseRequest[]>(readPrototypeRoomUseRequests);

  useEffect(() => {
    const syncStoredRequests = () => setRequests(readPrototypeRoomUseRequests());
    window.addEventListener("storage", syncStoredRequests);
    window.addEventListener(prototypeRoomUseRequestsChangedEvent, syncStoredRequests);
    return () => {
      window.removeEventListener("storage", syncStoredRequests);
      window.removeEventListener(prototypeRoomUseRequestsChangedEvent, syncStoredRequests);
    };
  }, []);

  const addRequest = (request: RoomUseRequest) => {
    const nextRequests = [request, ...readPrototypeRoomUseRequests()];
    writePrototypeRoomUseRequests(nextRequests);
    setRequests(nextRequests);
    window.dispatchEvent(new Event(prototypeRoomUseRequestsChangedEvent));
  };

  const updateRequest = (requestId: string, changes: Partial<RoomUseRequest>) => {
    const nextRequests = readPrototypeRoomUseRequests().map((request) => (request.id === requestId ? { ...request, ...changes } : request));
    writePrototypeRoomUseRequests(nextRequests);
    setRequests(nextRequests);
    window.dispatchEvent(new Event(prototypeRoomUseRequestsChangedEvent));
  };

  return { requests, addRequest, updateRequest };
}

function usePrototypeUsers() {
  const [prototypeUsers, setPrototypeUsers] = useState<User[]>(readPrototypeUsers);

  useEffect(() => {
    const sync = () => setPrototypeUsers(readPrototypeUsers());
    window.addEventListener("storage", sync);
    window.addEventListener(prototypeUsersChangedEvent, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(prototypeUsersChangedEvent, sync);
    };
  }, []);

  const commit = (nextUsers: User[]) => {
    writePrototypeUsers(nextUsers);
    setPrototypeUsers(nextUsers);
    window.dispatchEvent(new Event(prototypeUsersChangedEvent));
  };

  const addUser = (user: User) => commit([user, ...readPrototypeUsers()]);
  const updateUser = (userId: string, changes: Partial<User>) => commit(readPrototypeUsers().map((user) => user.id === userId ? { ...user, ...changes } : user));

  return { users: prototypeUsers, addUser, updateUser };
}

function usePrototypeProgrammeApplications() {
  const [applications, setApplications] = useState<ProgrammeApplication[]>(readPrototypeProgrammeApplications);

  useEffect(() => {
    const sync = () => setApplications(readPrototypeProgrammeApplications());
    window.addEventListener("storage", sync);
    window.addEventListener(prototypeProgrammeApplicationsChangedEvent, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(prototypeProgrammeApplicationsChangedEvent, sync);
    };
  }, []);

  const updateApplication = (applicationId: string, changes: Partial<ProgrammeApplication>) => {
    const nextApplications = readPrototypeProgrammeApplications().map((application) => application.id === applicationId ? { ...application, ...changes } : application);
    writePrototypeProgrammeApplications(nextApplications);
    setApplications(nextApplications);
    window.dispatchEvent(new Event(prototypeProgrammeApplicationsChangedEvent));
  };

  return { applications, updateApplication };
}

function readPrototypeProgrammeApplications(): ProgrammeApplication[] {
  const stored = readStoredProgrammeApplications();
  const storedIds = new Set(stored.map((application) => application.id));
  return [...stored, ...programmeApplications.filter((application) => !storedIds.has(application.id))];
}

function readStoredProgrammeApplications(): ProgrammeApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(prototypeProgrammeApplicationsStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is ProgrammeApplication => Boolean(item && typeof item.id === "string")) : [];
  } catch {
    return [];
  }
}

function writePrototypeProgrammeApplications(applications: ProgrammeApplication[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(prototypeProgrammeApplicationsStorageKey, JSON.stringify(applications));
}

function usePrototypeEvents() {
  const [prototypeEvents, setPrototypeEvents] = useState<EventItem[]>(readPrototypeEvents);

  useEffect(() => {
    const sync = () => setPrototypeEvents(readPrototypeEvents());
    window.addEventListener("storage", sync);
    window.addEventListener(prototypeEventsChangedEvent, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(prototypeEventsChangedEvent, sync);
    };
  }, []);

  const addEvent = (event: EventItem) => {
    const nextEvents = [event, ...readPrototypeEvents()];
    writePrototypeEvents(nextEvents);
    setPrototypeEvents(nextEvents);
    window.dispatchEvent(new Event(prototypeEventsChangedEvent));
  };

  return { prototypeEvents, addEvent };
}

function usePrototypeBookings() {
  const [prototypeBookings, setPrototypeBookings] = useState<Booking[]>(readPrototypeBookings);
  useEffect(() => {
    const sync = () => setPrototypeBookings(readPrototypeBookings());
    window.addEventListener("storage", sync);
    window.addEventListener(prototypeBookingsChangedEvent, sync);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(prototypeBookingsChangedEvent, sync); };
  }, []);
  const addBooking = (booking: Booking) => {
    const nextBookings = [booking, ...readPrototypeBookings()];
    writePrototypeBookings(nextBookings);
    setPrototypeBookings(nextBookings);
    window.dispatchEvent(new Event(prototypeBookingsChangedEvent));
  };
  const updateBooking = (bookingId: string, changes: Partial<Booking>) => {
    const nextBookings = readPrototypeBookings().map((booking) => booking.id === bookingId ? { ...booking, ...changes } : booking);
    writePrototypeBookings(nextBookings);
    setPrototypeBookings(nextBookings);
    window.dispatchEvent(new Event(prototypeBookingsChangedEvent));
  };
  return { prototypeBookings, addBooking, updateBooking };
}

function readPrototypeBookings(): Booking[] {
  const stored = readStoredBookings();
  const storedIds = new Set(stored.map((booking) => booking.id));
  return [...stored, ...bookings.filter((booking) => !storedIds.has(booking.id))];
}

function readStoredBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(prototypeBookingsStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is Booking => Boolean(item && typeof item.id === "string" && typeof item.spaceId === "string" && typeof item.title === "string" && typeof item.date === "string")) : [];
  } catch { return []; }
}

function writePrototypeBookings(items: Booking[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(prototypeBookingsStorageKey, JSON.stringify(items));
}

function usePrototypeProgrammes() {
  const [prototypeProgrammes, setPrototypeProgrammes] = useState<Programme[]>(readPrototypeProgrammes);

  useEffect(() => {
    const sync = () => setPrototypeProgrammes(readPrototypeProgrammes());
    window.addEventListener("storage", sync);
    window.addEventListener(prototypeProgrammesChangedEvent, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(prototypeProgrammesChangedEvent, sync);
    };
  }, []);

  const addProgramme = (programme: Programme) => {
    const nextProgrammes = [programme, ...readPrototypeProgrammes()];
    writePrototypeProgrammes(nextProgrammes);
    setPrototypeProgrammes(nextProgrammes);
    window.dispatchEvent(new Event(prototypeProgrammesChangedEvent));
  };

  return { prototypeProgrammes, addProgramme };
}

function readPrototypeProgrammes(): Programme[] {
  const stored = readStoredProgrammes();
  const storedIds = new Set(stored.map((programme) => programme.id));
  return [...stored, ...programmes.filter((programme) => !storedIds.has(programme.id))];
}

function readStoredProgrammes(): Programme[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(prototypeProgrammesStorageKey) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((item): item is Programme => Boolean(item && typeof item.id === "string" && typeof item.slug === "string" && typeof item.title === "string"))
      : [];
  } catch {
    return [];
  }
}

function writePrototypeProgrammes(items: Programme[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(prototypeProgrammesStorageKey, JSON.stringify(items));
}

function readPrototypeEvents(): EventItem[] {
  const stored = readStoredEvents();
  const storedIds = new Set(stored.map((event) => event.id));
  return [...stored, ...events.filter((event) => !storedIds.has(event.id))];
}

function readStoredEvents(): EventItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(prototypeEventsStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is EventItem => Boolean(item && typeof item.id === "string" && typeof item.slug === "string" && typeof item.title === "string")) : [];
  } catch {
    return [];
  }
}

function writePrototypeEvents(items: EventItem[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(prototypeEventsStorageKey, JSON.stringify(items));
}

function readPrototypeRoomUseRequests(): RoomUseRequest[] {
  const storedRequests = readStoredRoomUseRequests();
  const storedIds = new Set(storedRequests.map((request) => request.id));
  return [...storedRequests, ...roomUseRequests.filter((request) => !storedIds.has(request.id))];
}

function readPrototypeUsers(): User[] {
  const storedUsers = readStoredUsers();
  const storedIds = new Set(storedUsers.map((user) => user.id));
  return [...storedUsers, ...users.filter((user) => !storedIds.has(user.id))]
    .map((user) => ({ ...user, modules: user.modules.filter((module) => assignableAdminModules.includes(module)) }));
}

function readStoredUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(prototypeUsersStorageKey) || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((user): user is User => Boolean(user && typeof user.id === "string" && typeof user.name === "string" && typeof user.email === "string" && Array.isArray(user.modules) && Array.isArray(user.history)))
      : [];
  } catch {
    return [];
  }
}

function writePrototypeUsers(items: User[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(prototypeUsersStorageKey, JSON.stringify(items));
}

function readStoredRoomUseRequests(): RoomUseRequest[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(prototypeRoomUseRequestsStorageKey);
    if (!storedValue) return [];
    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed.filter(isRoomUseRequestLike) : [];
  } catch {
    return [];
  }
}

function writePrototypeRoomUseRequests(requests: RoomUseRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(prototypeRoomUseRequestsStorageKey, JSON.stringify(requests));
}

function usePrototypeShopCart() {
  const [items, setItems] = useState<CartItem[]>(readPrototypeShopCart);

  useEffect(() => {
    const syncStoredCart = () => setItems(readPrototypeShopCart());
    window.addEventListener("storage", syncStoredCart);
    window.addEventListener(prototypeShopCartChangedEvent, syncStoredCart);
    return () => {
      window.removeEventListener("storage", syncStoredCart);
      window.removeEventListener(prototypeShopCartChangedEvent, syncStoredCart);
    };
  }, []);

  const commitItems = (nextItems: CartItem[]) => {
    writePrototypeShopCart(nextItems);
    setItems(nextItems);
    window.dispatchEvent(new Event(prototypeShopCartChangedEvent));
  };

  const addItem = (productId: string, variantId: string, quantity: number) => {
    const normalizedQuantity = Math.max(1, Math.min(20, Math.floor(quantity) || 1));
    const currentItems = readPrototypeShopCart();
    const existingItem = currentItems.find((item) => item.productId === productId && item.variantId === variantId);
    const nextItems = existingItem
      ? currentItems.map((item) => (item === existingItem ? { ...item, quantity: Math.min(20, item.quantity + normalizedQuantity) } : item))
      : [...currentItems, { productId, variantId, quantity: normalizedQuantity }];
    commitItems(nextItems);
  };

  const updateItem = (productId: string, variantId: string, quantity: number) => {
    const normalizedQuantity = Math.max(0, Math.min(20, Math.floor(quantity) || 0));
    const nextItems = readPrototypeShopCart()
      .map((item) => (item.productId === productId && item.variantId === variantId ? { ...item, quantity: normalizedQuantity } : item))
      .filter((item) => item.quantity > 0);
    commitItems(nextItems);
  };

  const removeItem = (productId: string, variantId: string) => {
    commitItems(readPrototypeShopCart().filter((item) => item.productId !== productId || item.variantId !== variantId));
  };

  const clearCart = () => commitItems([]);

  return { items, addItem, updateItem, removeItem, clearCart };
}

function readPrototypeShopCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(prototypeShopCartStorageKey);
    if (!storedValue) return [];
    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed.filter(isCartItemLike).filter((item) => getShopProduct(item.productId)?.variants.some((variant) => variant.id === item.variantId)) : [];
  } catch {
    return [];
  }
}

function writePrototypeShopCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(prototypeShopCartStorageKey, JSON.stringify(items));
}

function usePrototypeSignedInState(): [boolean, (nextSignedIn: boolean) => void] {
  const [isSignedIn, setIsSignedIn] = useState(readPrototypeSignedIn);

  useEffect(() => {
    const syncSignedIn = () => setIsSignedIn(readPrototypeSignedIn());
    window.addEventListener("storage", syncSignedIn);
    window.addEventListener(prototypeSignedInChangedEvent, syncSignedIn);
    return () => {
      window.removeEventListener("storage", syncSignedIn);
      window.removeEventListener(prototypeSignedInChangedEvent, syncSignedIn);
    };
  }, []);

  const updateSignedIn = (nextSignedIn: boolean) => {
    writePrototypeSignedIn(nextSignedIn);
    setIsSignedIn(nextSignedIn);
    window.dispatchEvent(new Event(prototypeSignedInChangedEvent));
  };

  return [isSignedIn, updateSignedIn];
}

function readPrototypeSignedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(prototypeSignedInStorageKey) === "true";
}

function writePrototypeSignedIn(isSignedIn: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(prototypeSignedInStorageKey, String(isSignedIn));
}

function readAdminSidebarCollapsedGroups(): Record<string, boolean> {
  if (typeof window === "undefined") return {};

  try {
    const storedValue = window.localStorage.getItem(adminSidebarCollapsedGroupsStorageKey);
    if (!storedValue) return {};
    const parsed = JSON.parse(storedValue);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeAdminSidebarCollapsedGroups(groups: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(adminSidebarCollapsedGroupsStorageKey, JSON.stringify(groups));
}

function isRoomUseRequestLike(value: unknown): value is RoomUseRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RoomUseRequest>;
  return typeof candidate.id === "string" && typeof candidate.requester === "string" && typeof candidate.organisationName === "string" && typeof candidate.approvalStatus === "string";
}

function isCartItemLike(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CartItem>;
  return typeof candidate.productId === "string" && typeof candidate.variantId === "string" && typeof candidate.quantity === "number" && Number.isFinite(candidate.quantity);
}

function createRoomUseRequestFromForm(form: HTMLFormElement, recurrence: RoomUseRequest["recurrence"]): RoomUseRequest {
  const formData = new FormData(form);
  const selectedSpaceId = formValue(formData, "space");
  const activityType = formValue(formData, "activityType");
  const message = formValue(formData, "message");
  const duration = formValue(formData, "duration") || "60";
  const attachments = Array.from(formData.getAll("attachments"))
    .filter((value): value is File => value instanceof File && Boolean(value.name))
    .slice(0, 5)
    .map((file) => file.name);
  const requestedUse = message || activityTypeLabel(activityType) || "Uporaba prostora";
  const requestedPattern =
    recurrence === "enkratno"
      ? `${formValue(formData, "requestedDate") || "datum po dogovoru"}, ${formValue(formData, "startTime") || "ura po dogovoru"}, ${durationLabel(duration)}`
      : `${formValue(formData, "requestedWeekday") || "dan po dogovoru"}, ${formValue(formData, "recurringStartTime") || "ura po dogovoru"}, ${durationLabel(duration)}; ${formValue(formData, "recurrencePattern") || "obdobje po dogovoru"}`;

  return {
    id: `RUR-WEB-${Date.now().toString(36).toUpperCase()}`,
    requester: formValue(formData, "contactName") || "Neznan kontakt",
    email: formValue(formData, "email") || "brez emaila",
    organisationName: formValue(formData, "organisation") || formValue(formData, "contactName") || "Brez organizacije",
    relatedSpaceId: selectedSpaceId && selectedSpaceId !== "not-sure" ? selectedSpaceId : undefined,
    requestedUse,
    recurrence,
    requestedPattern,
    expectedParticipants: Number.parseInt(formValue(formData, "participants"), 10) || 0,
    technicalNeeds: formValue(formData, "technicalNeeds") || "ni navedeno",
    hasPrimaCard: false,
    attachments,
    approvalStatus: "novo",
    owner: "Rezervacije",
    nextStep: "Nova zahteva iz javnega obrazca. Preveri vsebino, prostor, termin in ali potrebujemo dodatne informacije.",
    calendarHandoffStatus: "ni pripravljeno",
    internalNotes: [
      {
        id: `NOTE-${Date.now().toString(36).toUpperCase()}`,
        author: "Sistem",
        date: prototypeNowIso,
        text: "Zahteva je bila oddana prek javnega obrazca."
      }
    ]
  };
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function activityTypeLabel(value: string) {
  const labels: Record<string, string> = {
    vaja: "Vaja",
    delavnica: "Delavnica",
    srecanje: "Srečanje",
    predstavitev: "Predstavitev",
    dogodek: "Dogodek",
    drugo: "Drugo"
  };
  return labels[value] || "";
}

function durationLabel(value: string) {
  const minutes = Number.parseInt(value, 10);
  if (!Number.isFinite(minutes)) return "trajanje po dogovoru";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} h ${remainder} min` : `${hours} h`;
}

function LegacyRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate replace to={{ pathname: to, search, hash }} />;
}

function LegacyProgrammeRedirect() {
  const { slug = "" } = useParams();
  return getProgramme(slug)
    ? <LegacyRedirect to={`/skupnost/programi/${slug}`} />
    : <NotFound backTo="/skupnost" />;
}

function App() {
  return (
    <Routes>
      <Route path="/prototype/*" element={<PrototypeDashboard />} />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/*" element={<WebsiteLayout />} />
    </Routes>
  );
}

function WebsiteLayout() {
  const { t } = useLanguage();
  const [isSignedIn] = usePrototypeSignedInState();

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand">
            DOM
            <span>{t("site.brandSubtitle")}</span>
          </Link>
          <nav className="nav-row" aria-label="Glavna navigacija">
            {websiteNav.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="inline-actions header-actions">
            {isSignedIn ? (
              <Link className="button primary" to="/moj-dom">
                Moj DOM
              </Link>
            ) : (
              <Link className="button" to="/moj-dom/prijava">
                {t("nav.memberLogin")}
              </Link>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="predstavitev" element={<PresentationPage />} />
          <Route path="predstavitev/kontakt" element={<ContactPage />} />
          <Route path="predstavitev/prenova" element={<RenovationPage />} />
          <Route path="predstavitev/kavarna" element={<CafePage />} />
          <Route path="predstavitev/partnerji" element={<PartnersPage />} />
          <Route path="predstavitev/mediji" element={<MediaPage />} />
          <Route path="predstavitev/dostop" element={<AccessPage />} />
          <Route path="prostori" element={<SpacesPage />} />
          <Route path="prostori/najem" element={<RentalPage />} />
          <Route path="prostori/najem/obrazec" element={<RentalFormPage />} />
          <Route path="prostori/najem/poslano" element={<RentalSuccessPage />} />
          <Route path="prostori/:slug" element={<SpaceDetailPage />} />
          <Route path="dogodki" element={<EventsPage />} />
          <Route path="dogodki/arhiv" element={<EventArchivePage />} />
          <Route path="dogodki/:slug/karte" element={<TicketCheckoutPage />} />
          <Route path="dogodki/:slug" element={<EventDetailPage />} />
          <Route path="trgovina" element={<ShopPage />} />
          <Route path="trgovina/kosarica" element={<CartPage />} />
          <Route path="trgovina/nakup" element={<CheckoutPage />} />
          <Route path="trgovina/nakup/potrjeno" element={<CheckoutSuccessPage />} />
          <Route path="trgovina/:slug" element={<ProductDetailPage />} />
          <Route path="clani" element={<LegacyRedirect to="/skupnost/clanstvo" />} />
          <Route path="skupnost/pridruzi-se" element={<MembershipSignupPage />} />
          <Route path="moj-dom/prijava" element={<MemberLoginPage />} />
          <Route path="clani/koledar" element={<LegacyRedirect to="/moj-dom/rezervacije" />} />
          <Route path="clani/prijava" element={<LegacyRedirect to="/moj-dom/prijava" />} />
          <Route path="clani/pridruzi-se" element={<LegacyRedirect to="/skupnost/pridruzi-se" />} />
          <Route path="predstavitev/media" element={<LegacyRedirect to="/predstavitev/mediji" />} />
          <Route path="skupnost/:slug" element={<LegacyProgrammeRedirect />} />
          <Route path="moj-dom" element={<MojDomOverviewPage />} />
          <Route path="moj-dom/rezervacije" element={<MojDomReservationsPage />} />
          <Route path="moj-dom/programi" element={<MojDomProgrammesPage />} />
          <Route path="moj-dom/programi/:applicationId" element={<MojDomProgrammeApplicationDetailPage />} />
          <Route path="moj-dom/karte" element={<MojDomTicketsPage />} />
          <Route path="moj-dom/karte/:ticketId" element={<MojDomTicketDetailPage />} />
          <Route path="moj-dom/komunikacija" element={<MojDomCommunicationPage />} />
          <Route path="moj-dom/komunikacija/:requestId" element={<MojDomCommunicationDetailPage />} />
          <Route path="moj-dom/clanstvo" element={<MojDomMembershipPage />} />
          <Route path="moj-dom/profil" element={<MojDomProfilePage />} />
          <Route path="skupnost" element={<CommunityPresentationPage />} />
          <Route path="skupnost/predstavitev" element={<CommunityPresentationPage />} />
          <Route path="skupnost/programi" element={<ProgrammesPage />} />
          <Route path="skupnost/zgodovina-doma" element={<CommunityHistoryPage />} />
          <Route path="skupnost/ljudje" element={<CommunityPeoplePage />} />
          <Route path="skupnost/clanstvo" element={<CommunityMembershipPage />} />
          <Route path="skupnost/trgovina" element={<CommunityShopPage />} />
          <Route path="skupnost/organizacije" element={<ConnectedOrganisationsPage />} />
          <Route path="skupnost/programi/:slug" element={<ProgrammeDetailPage />} />
          <Route path="novice" element={<NewsPage />} />
          <Route path="novice/:slug" element={<NewsDetailPage />} />
          <Route path="pogoji-uporabe" element={<TermsPage />} />
          <Route path="zasebnost" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound backTo="/" />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="footer-section">
          <h2>{t("footer.visitTitle")}</h2>
          <Link to="/predstavitev/kontakt">{t("footer.contact")}</Link>
          <Link to="/predstavitev">{t("footer.location")}</Link>
        </div>
        <div className="footer-section">
          <h2>{t("footer.hoursTitle")}</h2>
          <p>{t("footer.hoursText")}</p>
        </div>
        <NewsletterSignup />
        <div className="footer-section">
          <h2>{t("footer.socialTitle")}</h2>
          <div className="footer-links">
            <a href="#instagram">Instagram</a>
            <a href="#facebook">Facebook</a>
            <a href="#linkedin">LinkedIn</a>
          </div>
        </div>
        <div className="footer-section footer-funding">
          <h2>{t("footer.fundingTitle")}</h2>
          <div className="logo-row" aria-label={t("footer.fundingTitle")}>
            <span>EU</span>
            <span>MOC</span>
            <span>MAG-NET</span>
          </div>
          <p>{t("footer.fundingText")}</p>
        </div>
        <div className="footer-section">
          <h2>{t("footer.legalTitle")}</h2>
          <Link to="/pogoji-uporabe">{t("footer.terms")}</Link>
          <Link to="/zasebnost">{t("footer.privacy")}</Link>
        </div>
      </footer>
    </div>
  );
}

function NewsletterSignup() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form className="footer-section footer-newsletter" onSubmit={onSubmit}>
      <h2>{t("footer.newsletterTitle")}</h2>
      <p>{t("footer.newsletterText")}</p>
      <label>
        <span>{t("footer.newsletterEmail")}</span>
        <input type="email" required placeholder="ime@example.test" />
      </label>
      <p className="footer-consent">{t("footer.newsletterConsent")}</p>
      <button type="submit">{t("footer.newsletterSubmit")}</button>
      {submitted && <p className="save-state">{t("footer.newsletterSaved")}</p>}
    </form>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="language-switcher" aria-label={t("language.label")}>
      {languages.map((item) => (
        <button
          key={item}
          type="button"
          className={language === item ? "selected" : ""}
          aria-pressed={language === item}
          aria-label={`${t("language.switchTo")} ${item.toUpperCase()}`}
          onClick={() => setLanguage(item)}
        >
          {t(`language.${item}`)}
        </button>
      ))}
    </div>
  );
}

function HomePage() {
  const { t } = useLanguage();
  const featuredEvents = events.filter((event) => event.status === "published").slice(0, 3);
  const featuredSpaces = spaces.filter(isPublicSpace).slice(0, 4);
  const featuredProgrammes = programmes.filter(isPublicProgramme).slice(0, 3);
  return (
    <>
      <Hero
        eyebrow={t("home.heroEyebrow")}
        title={t("home.heroTitle")}
        text={t("home.heroText")}
        actions={[
          { label: t("cta.viewEvents"), to: "/dogodki" },
          { label: t("cta.rentSpace"), to: "/prostori/najem" }
        ]}
      />
      <HomeAboutDomSection />
      <Section title={t("home.eventsTitle")} action={<Link to="/dogodki">{t("home.allEvents")}</Link>}>
        <CardGrid>
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </CardGrid>
      </Section>
      <Section title={t("home.spacesTitle")} action={<Link to="/prostori">{t("home.spacesOverview")}</Link>}>
        <CardGrid>
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </CardGrid>
      </Section>
      <HomeCommunitySection />
      <HomeShopSection />
      <Section title={t("home.programmesTitle")} action={<Link to="/skupnost">{t("home.allProgrammes")}</Link>}>
        <CardGrid>
          {featuredProgrammes.map((programme) => (
            <ProgrammeCard key={programme.id} programme={programme} />
          ))}
        </CardGrid>
      </Section>
      <Section title={t("home.newsTitle")} action={<Link to="/novice">{t("home.allNews")}</Link>}>
        <CardGrid>
          {news.slice(0, 3).map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </CardGrid>
      </Section>
      <HomeNewsletterSection />
    </>
  );
}

function HomeAboutDomSection() {
  return (
    <section className="home-about-dom" aria-labelledby="home-about-dom-title">
      <div>
        <p className="eyebrow">O nas</p>
        <h2 id="home-about-dom-title">Kaj je DOM?</h2>
        <p>DOM je odprt prostor za kulturo, ustvarjalnost, izobraževanje in inovativnost. Večnamenski kulturno-ustvarjalni prostor je namenjen vajam, nastopom, produkciji in povezovanju. Je prostor, kjer lahko spijete kavo, dobite podporo pri razvoju ideje in se vključite v skupnost.</p>
        <Link className="button" to="/predstavitev">
          Izvej več
        </Link>
      </div>
      <div className="home-activities-card">
        <h3>Dejavnosti</h3>
        <ul>
          <li>
            <strong>Brezplačne delavnice</strong>
            <span>Znanje delimo naprej - od praktičnih veščin do ustvarjalnih in digitalnih vsebin.</span>
          </li>
          <li>
            <strong>Ateljeji in prostori</strong>
            <span>Dostopni prostori za lokalne ustvarjalce, društva, skupine in organizacije.</span>
          </li>
          <li>
            <strong>Kulturni dogodki</strong>
            <span>Koncerti, projekcije, pogovori, literarni večeri, razstave in skupnostna srečanja.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

function HomeNewsletterSection() {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="home-newsletter-band" aria-labelledby="home-newsletter-title">
      <div>
        <p className="eyebrow">E-obveščanje</p>
        <h2 id="home-newsletter-title">Bodi na tekočem</h2>
        <p>Naroči se na novice DOM in prejmi obvestila o dogodkih, programih, delavnicah, odprtih pozivih in možnostih sodelovanja.</p>
      </div>
      <form className="home-newsletter-form" onSubmit={onSubmit}>
        <label>
          E-mail
          <input name="email" type="email" placeholder="Vpiši svoj e-poštni naslov" />
        </label>
        <button className="button primary" type="submit">
          Prijavi se
        </button>
        {submitted && <div className="save-state">Hvala. V pravem sistemu bi prijavo obdelal izbrani newsletter ponudnik.</div>}
      </form>
    </section>
  );
}

function HomeShopSection() {
  const featuredProduct = shopProducts.find((product) => product.id === "dom-majica") || getPublicShopProducts()[0];
  if (!featuredProduct) return null;

  return (
    <section className="home-shop-band" aria-labelledby="home-shop-title">
      <div className="home-shop-copy">
        <p className="eyebrow">DOM merch</p>
        <h2 id="home-shop-title">Vzemi DOM s sabo</h2>
        <p>Majice, kape, torbe in mali uporabni izdelki za obiskovalce, člane, prostovoljce in vse, ki DOM nosijo tudi izven hiše.</p>
        <Link className="button primary" to="/trgovina">
          Kupi merch
        </Link>
      </div>
      <div className="home-shop-product">
        <ProductPlaceholderImage label={featuredProduct.imageLabels[0] || featuredProduct.title} />
        <div>
          <span>{featuredProduct.title}</span>
          <strong>{formatPrice(featuredProduct.priceCents)}</strong>
        </div>
      </div>
    </section>
  );
}

function HomeCommunitySection() {
  return (
    <section className="home-community-band" aria-labelledby="home-community-title">
      <div className="home-community-copy">
        <p className="eyebrow">Skupnost</p>
        <h2 id="home-community-title">Vključevanje v skupnost</h2>
        <p>DOM povezuje ljudi, društva, kolektive, mentorje in organizacije, ki želijo skupaj razvijati programe, deliti znanje, uporabljati prostore in soustvarjati javno življenje hiše.</p>
        <Link className="button primary" to="/skupnost/clanstvo">
          Postani član
        </Link>
      </div>
      <div className="home-community-actions" aria-label="Možnosti vključevanja">
        <div>
          <span className="small-label">Programi</span>
          <strong>Udeleži se delavnic in srečanj</strong>
        </div>
        <div>
          <span className="small-label">Kolektiv</span>
          <strong>Predlagaj aktivnost ali sodelovanje</strong>
        </div>
        <div>
          <span className="small-label">Mentorstvo</span>
          <strong>Poveži se z mentorji in partnerji</strong>
        </div>
      </div>
    </section>
  );
}

function PresentationPage() {
  const heroSpace = spaces.find((space) => space.id === "velika-dvorana");

  return (
    <>
      <header className="presentation-hero" style={heroSpace?.imageSrc ? { backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 10%), rgb(0 0 0 / 72%)), url(${heroSpace.imageSrc})` } : undefined}>
        <div>
          <h1>Predstavitev</h1>
          <p>DOM je prostor za ustvarjalne skupnosti, javne dogodke, učenje, sodelovanje in kulturni program v Celju.</p>
        </div>
      </header>
      <Section title="Kaj je DOM">
        <div className="intro-panel">
          <p>DOM povezuje prostore, programe in ljudi, ki ustvarjajo javno kulturno in skupnostno življenje v mestu. Namenjen je obiskovalcem, ustvarjalcem, društvom, organizacijam in partnerjem, ki potrebujejo prostor za srečanje, izvedbo programa ali razvoj ideje.</p>
          <div className="intro-list">
            <strong>Komu je namenjen</strong>
            <Checklist items={["obiskovalcem dogodkov in razstav", "ustvarjalcem in kulturnim društvom", "organizacijam, ki iščejo prostor za program", "mladim, mentorjem in skupnostim učenja", "partnerjem in institucijam"]} />
          </div>
        </div>
      </Section>
      <Section title="Prenova in razvoj">
        <div className="callout">
          <p>DOM povezuje prostore za dogodke, delo, učenje in ustvarjanje ter rezidenčni program.</p>
          <Link className="button" to="/predstavitev/prenova">
            Več o prenovi
          </Link>
        </div>
      </Section>
      <Section title="Kaj najdete v DOMU">
        <div className="presentation-feature-grid">
          <PresentationFeatureCard title="Dogodki" text="Javni dogodki, pogovori, predstavitve, delavnice, koncerti in srečanja skupnosti." to="/dogodki" linkLabel="Poglej dogodke" />
          <PresentationFeatureCard title="Programi" text="Programi povezujejo učenje, srečevanja skupnosti, razvoj dogodkov, razstavne formate in prihodnje rezidenčne vsebine." to="/skupnost" linkLabel="Poglej programe" />
          <PresentationFeatureCard title="Prostori in najem" text="Hiša vključuje dvorane, sestankovalnico in vadbene prostore za dogodke, delavnice, vaje, predavanja, srečanja in javne predstavitve." to="/prostori" linkLabel="Poglej prostore" />
          <PresentationFeatureCard title="Kavarna" text="Kavarna je del predstavitve hiše in lahko vključuje ponudbo, meni, fotografije ter informacije za obiskovalce." to="/predstavitev/kavarna" linkLabel="Več o kavarni" />
        </div>
      </Section>
      <Section title="Partnerji in mediji">
        <TwoColumn>
          <PresentationFeatureCard title="Partnerji" text="DOM deluje v mreži ustvarjalcev, kulturnih organizacij, javnih institucij in programskih partnerjev." to="/predstavitev/partnerji" linkLabel="Partnerstva" />
          <PresentationFeatureCard title="Media / press" text="Za medije bodo zbrane osnovne informacije, opisi projekta, vizualno gradivo in kontakt za vprašanja." to="/predstavitev/mediji" linkLabel="Za medije" />
        </TwoColumn>
      </Section>
      <Section title="Ekipa">
        <CardGrid>
          <TeamCard name="Tadej Perčič" role="Direktor MCC" text="Institucionalno vodenje, partnerstva in razvoj pogojev za delovanje hiše." />
          <TeamCard name="Samo Seničar" role="Vodja doma" text="Vodenje DOM, povezovanje programa, uporabnikov, prostorov in vsakodnevnega delovanja." />
          <TeamCard name="Maja Kranjc" role="Pomočnik vodje" text="Podpora pri koordinaciji programa, objavah, obrazcih, uporabnikih in komunikaciji z ekipo." />
          <TeamCard name="Matej Žagar" role="Tehnični vodja" text="Tehnična priprava prostorov, oprema, rezervacije in izvedbena podpora dogodkom." />
        </CardGrid>
      </Section>
      <Section title="Dostop">
        <div className="access-panel">
          <div className="access-details">
            <div>
              <span className="small-label">Lokacija</span>
              <strong>Celje</strong>
              <p>Natančen naslov bo objavljen po potrditvi lokacijskih podatkov.</p>
            </div>
            <div>
              <span className="small-label">Kontakt</span>
              <strong>Kontaktni obrazec DOM</strong>
              <p>Za vprašanja o poti, dostopnosti ali obisku uporabite kontaktno stran.</p>
            </div>
            <div>
              <span className="small-label">Odpiralni čas</span>
              <strong>Pon-pet: 9:00-20:00</strong>
              <p>Sobota: 10:00-14:00. Končni urnik se potrdi pred odprtjem.</p>
            </div>
            <div>
              <span className="small-label">Dostopnost</span>
              <strong>Podatki v potrditvi</strong>
              <p>Informacije o vhodu, etažah, dvigalu in dostopnih poteh bodo dodane skupaj s potrjenimi podatki.</p>
            </div>
          </div>
          <div className="map-placeholder" aria-label="Zemljevid lokacije DOM">
            <span>Zemljevid</span>
            <p>Lokacija bo dodana po potrditvi naslova.</p>
          </div>
          <Link className="button" to="/predstavitev/dostop">
            Več o dostopu
          </Link>
        </div>
      </Section>
      <Section title="Kontakt za program">
        <div className="callout">
          <p>Za vprašanja o programu, sodelovanju, partnerstvih ali uporabi prostorov uporabite kontaktni obrazec.</p>
          <Link className="button" to="/predstavitev/kontakt">
            Odpri kontakt
          </Link>
        </div>
      </Section>
    </>
  );
}

function PresentationFeatureCard({ title, text, to, linkLabel }: { title: string; text: string; to: string; linkLabel: string }) {
  return (
    <section className="wire-panel linked-panel">
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button" to={to}>
        {linkLabel}
      </Link>
    </section>
  );
}

function TeamCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <article className="team-card">
      <div className="team-photo" aria-label={`Fotografija: ${name}`}>
        <span>Slika</span>
      </div>
      <p className="eyebrow">{role}</p>
      <h3>{name}</h3>
      <p>{text}</p>
    </article>
  );
}

function RenovationPage() {
  return (
    <>
      <PageHeader title="Prenova in razvoj" text="Prenova prostorov DOM za javni program, delo in ustvarjanje." />
      <ThreeColumns>
        <WirePanel title="Prostori in javni program">
          <p>V ospredju so prostori v stavbi DOM, javni program, najem prostorov, članstvo in osnovni digitalni tokovi za dogodke ter rezervacije.</p>
        </WirePanel>
        <WirePanel title="Delo in sodelo">
          <p>Prostori za sodelo, učenje, pisarne, laboratorij in skupnostne programe.</p>
        </WirePanel>
        <WirePanel title="Rezidence">
          <p>Rezidenčni program in ateljeji se navezujejo na ustvarjanje, razstave, produkcijo in daljše oblike sodelovanja.</p>
        </WirePanel>
      </ThreeColumns>
    </>
  );
}

function CafePage() {
  return (
    <>
      <PageHeader title="Kavarna" text="Kavarna je obiskovalcem prijazen del hiše: prostor za srečanja, postanek pred dogodkom in neformalno povezovanje skupnosti." />
      <Section title="Kaj obiskovalec najde">
        <ThreeColumns>
          <WirePanel title="Ponudba">
            <p>Stran lahko predstavi osnovno ponudbo, sezonske poudarke, meni in posebne ponudbe ob dogodkih.</p>
          </WirePanel>
          <WirePanel title="Prostor srečevanja">
            <p>Kavarna podpira vsakodnevni obisk DOM-a, srečanja pred programom in manjše neformalne pogovore.</p>
          </WirePanel>
          <WirePanel title="Programske povezave">
            <p>Kjer je relevantno, lahko stran poveže kavarno z dogodki, razstavami, delavnicami ali skupnostnimi srečanji.</p>
          </WirePanel>
        </ThreeColumns>
      </Section>
      <Section title="Vsebina strani">
        <TwoColumn>
          <WirePanel title="Meni in informacije">
            <Checklist items={["opis ponudbe", "meni ali cenik", "odpiralni čas, ko je potrjen", "kontakt ali opomba za skupine"]} />
          </WirePanel>
          <WirePanel title="Fotografije">
            <p>Fotografije prostora, ponudbe in vzdušja se dodajo kot javni media elementi, ko so potrjene.</p>
          </WirePanel>
        </TwoColumn>
      </Section>
    </>
  );
}

function PartnersPage() {
  return (
    <>
      <PageHeader title="Partnerji" text="DOM deluje v mreži kulturnih organizacij, ustvarjalcev, javnih institucij, društev in programskih partnerjev." />
      <Section title="Partnerska mreža">
        <div className="presentation-feature-grid">
          <WirePanel title="Institucionalni partnerji">
            <p>Partnerji, ki omogočajo razvoj hiše, financiranje, upravljanje, strokovno podporo ali dolgoročno sodelovanje.</p>
          </WirePanel>
          <WirePanel title="Programski partnerji">
            <p>Organizacije, društva, ustvarjalci in pobude, ki z DOM razvijajo dogodke, delavnice, srečanja in javni program.</p>
          </WirePanel>
          <WirePanel title="Skupnostni partnerji">
            <p>Lokalne pobude, mentorji, društva in neformalne skupine, ki uporabljajo DOM kot prostor srečevanja in sodelovanja.</p>
          </WirePanel>
          <WirePanel title="Postani partner">
            <p>Za nova partnerstva je vstopna točka kontaktni obrazec s temo partnerstvo.</p>
            <Link className="button" to="/predstavitev/kontakt">
              Kontakt za partnerstvo
            </Link>
          </WirePanel>
        </div>
      </Section>
    </>
  );
}

function MediaPage() {
  const pressItems = news.filter((item) => item.category === "pr-obvestilo" && item.status === "published").slice(0, 3);

  return (
    <>
      <PageHeader title="Media / press" text="Stran za medije zbira osnovne opise projekta, vizualno gradivo, kontakte in povezave na relevantne objave." />
      <Section title="Za medije">
        <ThreeColumns>
          <WirePanel title="Osnovni opis">
            <p>Kratek javni opis DOM, namena hiše, programskih sklopov in skupnosti, ki jih platforma povezuje.</p>
          </WirePanel>
          <WirePanel title="Vizualno gradivo">
            <p>Press fotografije, logotipi, podpisi fotografij in navodila za uporabo gradiv se dodajo kot media elementi.</p>
          </WirePanel>
          <WirePanel title="Kontakt">
            <p>Vprašanja za medije se usmerijo prek kontaktnega obrazca z izbrano temo media/press.</p>
            <Link className="button" to="/predstavitev/kontakt">
              Kontakt za medije
            </Link>
          </WirePanel>
        </ThreeColumns>
      </Section>
      {pressItems.length > 0 && (
        <Section title="PR obvestila">
          <div className="three-columns">
            {pressItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function AccessPage() {
  return (
    <>
      <PageHeader title="Dostop" text="Informacije o lokaciji, prihodu, odpiralnih časih in dostopnosti bodo objavljene, ko so potrjene." />
      <Section title="Načrt obiska">
        <div className="access-panel">
          <div className="access-details">
            <div>
              <span className="small-label">Lokacija</span>
              <strong>Celje</strong>
              <p>Natančen naslov in navodila za prihod se dodajo po potrditvi lokacijskih podatkov.</p>
            </div>
            <div>
              <span className="small-label">Prihod</span>
              <strong>Peš, kolo, javni prevoz, avto</strong>
              <p>Stran bo lahko prikazala priporočene poti, najbližja postajališča in parkiranje.</p>
            </div>
            <div>
              <span className="small-label">Dostopnost</span>
              <strong>Podatki v potrditvi</strong>
              <p>Informacije o vhodu, etažah, dvigalu in dostopnih poteh se dodajo po potrditvi.</p>
            </div>
            <div>
              <span className="small-label">Vprašanja</span>
              <strong>Kontaktni obrazec</strong>
              <p>Za vprašanja pred obiskom uporabite kontaktno stran in izberite temo splošno ali dostop.</p>
            </div>
          </div>
          <div className="map-placeholder" aria-label="Zemljevid lokacije DOM">
            <span>Zemljevid</span>
            <p>Mapa in navodila za prihod bodo dodani po potrditvi naslova.</p>
          </div>
          <Link className="button" to="/predstavitev/kontakt">
            Vprašaj ekipo
          </Link>
        </div>
      </Section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHeader title="Kontakt" text="Pošljite vprašanje ekipi DOM ali izberite temo, ki vas zanima." />
      <ContactInquiryForm />
    </>
  );
}

function ContactInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form className="mock-form" onSubmit={onSubmit}>
      <h2>Kontaktni obrazec</h2>
      <div className="form-grid">
        <label>
          Tema
          <select name="topic" defaultValue="general">
            <option value="general">Splošno vprašanje</option>
            <option value="event">Dogodek</option>
            <option value="space-use">Uporaba prostora</option>
            <option value="service">Storitev ali podpora</option>
            <option value="organisation-profile">Organizacija ali profil</option>
            <option value="partnership">Partnerstvo</option>
            <option value="press">Media / press</option>
            <option value="other">Drugo</option>
          </select>
        </label>
        <label>
          Ime
          <input name="name" placeholder="Ime in priimek" />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="ime@example.test" />
        </label>
        <label>
          Telefon
          <input name="phone" placeholder="+386 ..." />
        </label>
        <label>
          Organizacija
          <input name="organisation" placeholder="Organizacija, društvo ali pobuda" />
        </label>
        <label className="full-field">
          Sporočilo
          <textarea name="message" placeholder="Kaj vas zanima?" />
        </label>
      </div>
      <button className="button primary" type="submit">
        Pošlji vprašanje
      </button>
      {submitted && <p className="save-state">Hvala. V pravem sistemu bi bila oddaja poslana ekipi DOM.</p>}
    </form>
  );
}

function SpacesPage() {
  const heroSpace = spaces.find((space) => space.id === "velika-dvorana");
  const visibleSpaces = spaces
    .filter(isPublicSpace)
    .map((space) => ({ space, meta: getSpaceVisualMeta(space) }))
    .sort((a, b) => a.meta.order - b.meta.order);
  const eventPracticeSpaces = visibleSpaces.filter((item) => getSpacePresentationUnit(item.space) === "Prireditve in vadba");
  const communityCoworkingSpaces = visibleSpaces.filter((item) => getSpacePresentationUnit(item.space) === "Skupnost in sodelo");
  const creationExhibitionSpaces = visibleSpaces.filter((item) => getSpacePresentationUnit(item.space) === "Ustvarjanje in razstave");

  return (
    <>
      <header className="spaces-hero" style={heroSpace?.imageSrc ? { backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 12%), rgb(0 0 0 / 70%)), url(${heroSpace.imageSrc})` } : undefined}>
        <div>
          <h1>Sodobni prostori za ustvarjanje</h1>
          <p>Prostori DOMa so namenjeni souporabi.</p>
          <p>Na voljo so društvom, nevladnim organizacijam, samostojnim ustvarjalcem, neformalnim skupinam, javnim ustanovam in drugim uporabnikom za vaje, kulturno in ustvarjalno produkcijo, delo na projektih, izobraževanja, srečevanja ter izvedbo dogodkov.</p>
        </div>
      </header>

      <SpaceListSection title="Prireditve in vadba" meta="dvorane in vadbeni prostori" items={eventPracticeSpaces} />
      <SpaceListSection title="Skupnost in sodelo" meta="prostori za delo in sodelo" items={communityCoworkingSpaces} />
      <SpaceListSection title="Ustvarjanje in razstave" meta="atelje, rezidence in razstave" items={creationExhibitionSpaces} />

      <Section title="Najem prostorov">
        <div className="callout">
          <p>Za dogodek, delavnico, vajo ali srečanje najprej pošljite povpraševanje. Ekipa DOM preveri termin, pogoje in tehnične potrebe.</p>
          <p>Noben prostor ni zamišljen kot zaprta soba enega uporabnika. Raba se usklajuje glede na namen, opremo, kapaciteto in razpoložljive termine. Tako lahko isti prostor čez dan služi delu ali učenju, popoldne vajam, zvečer pa javnemu programu.</p>
          <Link className="button primary" to="/prostori/najem">
            Več o najemu prostorov.
          </Link>
        </div>
      </Section>
    </>
  );
}

function getSpaceVisualMeta(space: Space) {
  return spaceVisualMeta[space.id] || { tag: "Delo" as SpaceVisualTag, order: 999 };
}

function isPublicSpace(space: Space) {
  return space.status === "published";
}

function isPublicProgramme(programme: Programme) {
  return programme.published;
}

function getSpacePresentationUnit(space: Space): SpacePresentationUnit {
  if (["atelje", "rezidenca-1", "rezidenca-2", "ulicna-galerija", "galerija-stopnisce"].includes(space.id)) return "Ustvarjanje in razstave";
  if (!["hall", "practice-room"].includes(space.spaceType)) return "Skupnost in sodelo";
  return "Prireditve in vadba";
}

function getSpaceCalendarColorClass(space?: Space) {
  return space ? `space-room-${space.id}` : "space-room-unassigned";
}

function SpaceListSection({ title, meta, items }: { title: string; meta: string; items: { space: Space; meta: ReturnType<typeof getSpaceVisualMeta> }[] }) {
  if (!items.length) return null;

  return (
    <section className="space-list-section">
      <div className="space-list-head">
        <h2>{title}</h2>
        <span>{meta}</span>
      </div>
      <div className="space-visual-grid">
        {items.map((item) => (
          <SpaceCard key={item.space.id} space={item.space} visualMeta={item.meta} />
        ))}
      </div>
    </section>
  );
}

function SpaceDetailPage() {
  const { slug = "" } = useParams();
  const space = getSpace(slug);
  if (!space || !isPublicSpace(space)) return <NotFound backTo="/prostori" />;
  const relatedEvents = getSpaceEvents(space.id);
  const spaceEquipment = equipmentItems.filter((item) => item.spaceId === space.id);
  return (
    <>
      <PageHeader title={space.name} text={space.shortDescription} eyebrow={`${space.floor} · ${space.category}`} />
      <TwoColumn>
        <WirePanel title="Ključni podatki">
          <FactList
            items={[
              ["Primarna namembnost", space.primaryUse],
              ["Kapaciteta", space.capacityLabel],
              ["Površina", space.areaLabel || "po dogovoru"],
              ["Povezani prostori", space.connectedSpacesNote || "samostojen prostor"]
            ]}
          />
        </WirePanel>
        <WirePanel title="Fotografija / render">
          <SpaceImage space={space} />
        </WirePanel>
      </TwoColumn>
      <Section title="Tloris prostora">
        <WirePanel title="Tloris">
          <FloorPlanImage space={space} />
          {space.floorPlanDownloadUrl && (
            <Link className="button" to={space.floorPlanDownloadUrl}>
              Prenesi tloris
            </Link>
          )}
        </WirePanel>
      </Section>
      <Section title="Načini uporabe">
        <TagRow tags={space.otherUses} />
      </Section>
      <Section title="Oprema, pravila in dostopnost">
        <ThreeColumns>
          <WirePanel title="Oprema">
            {spaceEquipment.length ? (
              <ul className="public-equipment-list">
                {spaceEquipment.map((item) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    {item.rentalNote && <em>{item.rentalNote}</em>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Oprema se uskladi ob povpraševanju.</p>
            )}
            <Link className="text-link" to={`/prostori/najem?prostor=${space.id}&tema=tehnicna-podpora`}>
              Vprašajte za tehnično podporo
            </Link>
          </WirePanel>
          <WirePanel title="Pravila">
            <p>{space.rulesNote || "Pravila uporabe se uskladijo ob povpraševanju."}</p>
          </WirePanel>
          <WirePanel title="Dostopnost">
            <p>{space.accessibilityNote || "Informacije o dostopu se potrdijo ob povpraševanju."}</p>
          </WirePanel>
        </ThreeColumns>
      </Section>
      <Section title="Dogodki v tem prostoru">
        <WirePanel title="Dogodki">
          {relatedEvents.length ? relatedEvents.map((event) => <MiniLink key={event.id} to={`/dogodki/${event.slug}`} title={event.title} meta={formatDate(event.date)} />) : <EmptyState text="V tem prostoru trenutno ni objavljenih dogodkov." />}
        </WirePanel>
      </Section>
      <Section title="Naslednji korak">
        <div className="callout">
          <p>Najem ni neposredna rezervacija. Najprej razložimo proces, nato zberemo povpraševanje.</p>
          <Link className="button primary" to="/prostori/najem">
            Več o najemu prostorov.
          </Link>
        </div>
      </Section>
    </>
  );
}

function RentalPage() {
  return (
    <>
      <header className="plain-page-title">
        <h1>Najem prostorov</h1>
        <p>Prostori DOM so namenjeni različnim oblikam uporabe: javnim dogodkom, vajam, učenju, delu, srečanjem in skupnostnim programom.</p>
      </header>
      <section className="rental-process">
        <h2>Kako poteka najem</h2>
        <ol>
          <li>
            <strong>Preverite ustreznost prostora</strong>
            <span>Preglejte namen prostora, kapaciteto, opremo in morebitne omejitve uporabe.</span>
          </li>
          <li>
            <strong>Oddate obrazec za najem</strong>
            <span>V obrazcu opišete namen, prostor, enkratni ali redni termin, število ljudi in tehnične potrebe.</span>
          </li>
          <li>
            <strong>Uskladitev z ekipo DOM</strong>
            <span>Ekipa preveri razpoložljivost, pogoje uporabe, opremo, pripravo prostora in naslednje korake.</span>
          </li>
        </ol>
      </section>
      <Section title="Hišni red in pogoji uporabe">
        <ThreeColumns>
          <WirePanel title="Souporaba prostorov">
            <p>Noben prostor ni zamišljen kot zaprta soba enega uporabnika. Raba se usklajuje glede na namen, opremo, kapaciteto in razpoložljive termine.</p>
          </WirePanel>
          <WirePanel title="Odgovornost uporabnika">
            <p>Uporabnik skrbi za dogovorjeno rabo prostora, spoštovanje hišnega reda, varno uporabo opreme in vrnitev prostora v dogovorjeno stanje.</p>
          </WirePanel>
          <WirePanel title="Potrditev pogojev">
            <p>Pred potrditvijo termina se uskladijo pogoji uporabe, morebitne posebne zahteve, priprava prostora in kontaktna oseba za izvedbo.</p>
          </WirePanel>
        </ThreeColumns>
      </Section>
      <Section title="Oprema prostorov">
        <ThreeColumns>
          <WirePanel title="Osnovna oprema">
            <p>Osnovna postavitev je odvisna od prostora in programa. Mize, stoli, odprta površina, vadbena ali učilniška postavitev se uskladijo pred potrditvijo termina.</p>
          </WirePanel>
          <WirePanel title="Tehnična oprema">
            <p>Ozvočenje, projekcija, scenska ali druga tehnična podpora niso samodejno vključeni v vsak najem. Potrebe je treba opisati v obrazcu, da jih lahko ekipa pravočasno preveri.</p>
          </WirePanel>
          <WirePanel title="Deljena oprema">
            <p>Del opreme je skupen več prostorom in programom. Razpoložljivost se preverja skupaj s terminom, da ne pride do prekrivanja med dogodki, vajami ali internimi uporabami.</p>
          </WirePanel>
        </ThreeColumns>
      </Section>
      <Section title="Obrazec za najem prostorov">
        <div className="callout">
          <p>Ko imate pripravljen osnovni opis uporabe, predviden termin, število udeležencev in tehnične potrebe, nadaljujte na obrazec za najem prostorov.</p>
          <Link className="button primary" to="/prostori/najem/obrazec">
            Odpri obrazec za najem prostorov
          </Link>
        </div>
      </Section>
    </>
  );
}

function RentalFormPage() {
  return (
    <>
      <header className="plain-page-title">
        <h1>Obrazec za najem prostorov</h1>
        <p>Obrazec je namenjen oddaji povpraševanja. Oddaja še ne pomeni potrjene rezervacije termina.</p>
      </header>
      <RoomUseRequestForm />
    </>
  );
}

function RoomUseRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recurrence, setRecurrence] = useState<"enkratno" | "redno">("enkratno");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addRequest } = usePrototypeRoomUseRequests();
  const rentableSpaces = spaces.filter(isPublicSpace);
  const requestedSpaceId = searchParams.get("prostor") || "";
  const selectedSpaceId = rentableSpaces.some((space) => space.id === requestedSpaceId) ? requestedSpaceId : "";
  const isTechnicalSupportRequest = searchParams.get("tema") === "tehnicna-podpora";
  const durationOptions = [
    ["30", "30 min"],
    ["60", "1 h"],
    ["90", "1 h 30 min"],
    ["120", "2 h"],
    ["150", "2 h 30 min"],
    ["180", "3 h"]
  ];
  const hourOptions = Array.from({ length: 24 }, (_, hour) => {
    const value = `${String(hour).padStart(2, "0")}:00`;
    return [value, value];
  });
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addRequest(createRoomUseRequestFromForm(event.currentTarget, recurrence));
    event.currentTarget.reset();
    setRecurrence("enkratno");
    setIsSubmitting(true);
    window.setTimeout(() => {
      navigate("/prostori/najem/poslano");
    }, 2000);
  };

  return (
    <form className="mock-form room-request-form" onSubmit={onSubmit}>
      <h2>Zahteva za uporabo prostora</h2>
      {isTechnicalSupportRequest && selectedSpaceId && <p className="field-help">Povpraševanje za tehnično podporo za izbrani prostor. Vpišite, kaj potrebujete.</p>}
      <label className="full-field intro-field">
        Sporočilo
        <span className="field-help">Najprej na kratko opišite, kaj želite izvajati, za koga je dejavnost namenjena in ali je še kaj pomembno za razumevanje zahteve.</span>
        <textarea name="message" />
      </label>
      <section className="form-section">
        <h3>Osebni podatki</h3>
        <div className="form-grid">
          <label>
            Vaše ime
            <input name="contactName" autoComplete="name" />
          </label>
          <label>
            Organizacija / skupina
            <input name="organisation" autoComplete="organization" />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label>
            Telefon
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
        </div>
      </section>
      <section className="form-section">
        <h3>Podatki o prostoru in najemu</h3>
        <div className="form-grid">
          <label>
            Želeni prostor
            <select name="space" defaultValue={selectedSpaceId}>
              <option value="" disabled>
                Izberite prostor
              </option>
              {rentableSpaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name}
                </option>
              ))}
              <option value="not-sure">Nisem prepričan/a</option>
            </select>
          </label>
          <label>
            Tip aktivnosti
            <select name="activityType" defaultValue="">
              <option value="" disabled>
                Izberite tip
              </option>
              <option value="vaja">Vaja</option>
              <option value="delavnica">Delavnica</option>
              <option value="srecanje">Srečanje</option>
              <option value="predstavitev">Predstavitev</option>
              <option value="dogodek">Dogodek</option>
              <option value="drugo">Drugo</option>
            </select>
          </label>
          <fieldset className="form-fieldset">
            <legend>Tip najema</legend>
            <div className="radio-row">
              <label>
                <input type="radio" name="recurrence" value="enkratno" checked={recurrence === "enkratno"} onChange={() => setRecurrence("enkratno")} />
                Enkratni najem
              </label>
              <label>
                <input type="radio" name="recurrence" value="redno" checked={recurrence === "redno"} onChange={() => setRecurrence("redno")} />
                Redni najem
              </label>
            </div>
          </fieldset>
          {recurrence === "enkratno" ? (
            <>
              <label>
                Želeni datum
                <input name="requestedDate" type="date" />
              </label>
              <label>
                Čas začetka
                <select name="startTime" defaultValue="">
                  <option value="" disabled>
                    Izberite uro
                  </option>
                  {hourOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            <>
              <label>
                Želeni dan
                <select name="requestedWeekday" defaultValue="">
                  <option value="" disabled>
                    Izberite dan
                  </option>
                  <option value="ponedeljek">Ponedeljek</option>
                  <option value="torek">Torek</option>
                  <option value="sreda">Sreda</option>
                  <option value="cetrtek">Četrtek</option>
                  <option value="petek">Petek</option>
                  <option value="sobota">Sobota</option>
                  <option value="nedelja">Nedelja</option>
                </select>
              </label>
              <label>
                Želena ura začetka
                <select name="recurringStartTime" defaultValue="">
                  <option value="" disabled>
                    Izberite uro
                  </option>
                  {hourOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
          <label>
            Trajanje
            <select name="duration" defaultValue="60">
              {durationOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Število udeležencev
            <input name="participants" type="number" min="1" inputMode="numeric" />
          </label>
          {recurrence === "redno" && (
            <label className="full-field">
              Obdobje rednega najema
              <span className="field-help">Napišite, od kdaj do kdaj želite redni termin in ali obstajajo izjeme.</span>
              <textarea name="recurrencePattern" placeholder="Npr. od oktobra do decembra, brez šolskih počitnic." />
            </label>
          )}
          <label className="full-field">
            Tehnične potrebe
            <span className="field-help">Napišite, katero opremo ali tehnično podporo potrebujete, na primer projektor, ozvočenje, stole, mize ali posebno postavitev prostora.</span>
            <textarea name="technicalNeeds" />
          </label>
          <label className="full-field">
            Priloge
            <span className="field-help">Priložite lahko program, opis dejavnosti, tehnične zahteve ali dogovore. Dovoljeni so PDF, DOC, DOCX, JPG in PNG; največ 5 datotek, do 10 MB na datoteko.</span>
            <input name="attachments" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
          </label>
        </div>
      </section>
      <button className="button primary" type="submit">
        Pošlji zahtevo
      </button>
      {isSubmitting && (
        <div className="form-loader" role="status" aria-live="polite">
          <span />
          <strong>Pošiljanje zahteve</strong>
          <p>Zahtevo pošiljamo ekipi DOM.</p>
        </div>
      )}
    </form>
  );
}

function RentalSuccessPage() {
  return (
    <>
      <PageHeader title="Zahteva je poslana" text="Ekipa DOM bo pregledala podatke, preverila prostor in termin ter se javila z naslednjim korakom." />
      <WirePanel title="Kaj se zgodi zdaj">
        <Checklist items={["ekipa preveri podatke iz obrazca", "po potrebi vas kontaktira za dodatne informacije", "po uskladitvi prostora in termina prejmete naslednji korak"]} />
      </WirePanel>
    </>
  );
}

function EventsPage() {
  const [activeFilter, setActiveFilter] = useState<EventDiscoveryFilter>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const publishedEvents = events
    .filter((event) => event.status === "published")
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));
  const filteredEvents = activeFilter === "all" ? publishedEvents : publishedEvents.filter((event) => getEventDiscoveryGroup(event) === activeFilter);
  const firstEvent = filteredEvents[0] || publishedEvents[0];
  const calendarMonthOptions = getCalendarMonths(filteredEvents.flatMap(getEventDates));
  const [selectedMonth, setSelectedMonth] = useState(calendarMonthOptions[0]?.key || "");
  const activeMonth = calendarMonthOptions.some((month) => month.key === selectedMonth) ? selectedMonth : calendarMonthOptions[0]?.key || "";
  const monthDate = activeMonth ? parseLocalDate(`${activeMonth}-01`) : firstEvent ? parseLocalDate(firstEvent.date) : parseLocalDate(prototypeTodayKey);
  const monthEvents = filteredEvents.filter((event) => getEventDates(event).some((date) => isSameMonth(date, monthDate)));

  return (
    <>
      <section className="event-month-section" aria-labelledby="event-month-title">
        <div className="section-head">
          <div>
            <h1>Dogodki</h1>
            <p className="small-label">{monthEvents.length ? `${monthEvents.length} dogodkov v mesecu · ${formatMonthYear(monthDate)}` : `Ni dogodkov v mesecu · ${formatMonthYear(monthDate)}`}</p>
          </div>
          <div className="event-month-controls">
            <select aria-label="Izberi mesec dogodkov" value={activeMonth} onChange={(event) => setSelectedMonth(event.target.value)} disabled={!calendarMonthOptions.length}>
              {calendarMonthOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="button" type="button" onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}>
              {viewMode === "list" ? "Koledar" : "Seznam"}
            </button>
            <Link className="button" to="/dogodki/arhiv">
              Arhiv dogodkov
            </Link>
          </div>
        </div>

        <div className="event-filter-row" aria-label="Filtri dogodkov">
          {eventDiscoveryFilters.map((filter) => (
            <button
              key={filter.value}
              className={`${filter.value === "all" ? "" : getPresentationUnitClass(filter.value)} ${activeFilter === filter.value ? "selected" : ""}`}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {monthEvents.length ? (
          viewMode === "list" ? (
            <div className="public-event-grid">
              {monthEvents.map((event) => (
                <EventMonthCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <PublicEventMonthCalendar monthDate={monthDate} events={monthEvents} />
          )
        ) : (
          <EmptyState text="V izbranem mesecu trenutno ni objavljenih dogodkov za izbrani filter." />
        )}
      </section>
    </>
  );
}

function EventMonthCard({ event }: { event: EventItem }) {
  const imageSrc = getEventImageSrc(event);
  const category = getEventDiscoveryGroup(event);

  return (
    <Link
      className={`public-event-card ${event.featured ? "featured" : ""} ${imageSrc ? "" : "no-image"} ${category ? getPresentationUnitClass(category) : ""}`}
      style={imageSrc ? { backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 18%), rgb(0 0 0 / 72%)), url("${imageSrc}")` } : undefined}
      to={`/dogodki/${event.slug}`}
    >
      {category && <span className="event-card-category">{category}</span>}
      <span className="event-card-date">{formatEventDateLabel(event)} · {event.occurrences?.length ? "več terminov" : formatEventTime(event)}</span>
      {event.featured && <span className="event-card-featured">Izpostavljeno</span>}
      <strong>{event.title}</strong>
      <span className="event-card-description">{event.shortDescription}</span>
      <span className="event-card-space">{event.locationName}</span>
    </Link>
  );
}

function PublicEventRow({ event }: { event: EventItem }) {
  return (
    <Link className="public-event-row" to={`/dogodki/${event.slug}`}>
      <time>{formatEventDateLabel(event)} · {event.occurrences?.length ? "več terminov" : formatEventTime(event)}</time>
      <strong>{event.title}</strong>
      <span>{event.locationName}</span>
      <em>{getEventDiscoveryGroup(event) || "Brez skupine"}</em>
    </Link>
  );
}

function PublicEventMonthCalendar({ monthDate, events: list }: { monthDate: Date; events: EventItem[] }) {
  const monthDays = getMonthDays(monthDate);

  return (
    <div className="month-grid public-event-calendar" aria-label="Mesečni koledar dogodkov">
      {["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"].map((day) => (
        <strong className="weekday" key={day}>
          {day}
        </strong>
      ))}
      {monthDays.map((day) => {
        const dayEvents = day.date
          ? list.flatMap((event) => getEventOccurrences(event).filter((occurrence) => occurrence.date === day.date).map((occurrence) => ({ event, occurrence })))
          : [];
        return (
          <div className={`calendar-day ${day.inMonth ? "" : "muted"} ${dayEvents.length ? "has-events" : ""}`} key={day.key}>
            <span>{day.label}</span>
            {dayEvents.map(({ event, occurrence }) => {
              const category = getEventDiscoveryGroup(event);
              return (
                <Link className={`calendar-event ${category ? getPresentationUnitClass(category) : ""}`} key={`${event.id}-${occurrence.id}`} to={`/dogodki/${event.slug}`}>
                  <span className="calendar-event-category">{category ? getPresentationUnitShortLabel(category) : "Brez skupine"}</span>
                  <strong>{occurrence.startTime}</strong>
                  <span>{event.title}</span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function getEventDiscoveryGroup(event: EventItem): SpacePresentationUnit | undefined {
  const space = event.spaceId ? getSpace(event.spaceId) : undefined;
  return space ? getSpacePresentationUnit(space) : undefined;
}

function getPresentationUnitClass(category: SpacePresentationUnit) {
  if (category === "Skupnost in sodelo") return "event-category-community";
  if (category === "Ustvarjanje in razstave") return "event-category-creation";
  return "event-category-performance";
}

function getPresentationUnitShortLabel(category: SpacePresentationUnit) {
  if (category === "Skupnost in sodelo") return "Skupnost";
  if (category === "Ustvarjanje in razstave") return "Ustvarjanje";
  return "Prireditve";
}

function getEventImageSrc(event: EventItem) {
  return event.spaceId ? getSpace(event.spaceId)?.imageSrc : undefined;
}

function getEventPublicDescription(event: EventItem) {
  if (event.publicDescription?.length) return event.publicDescription;
  return [event.description, event.shortDescription].filter((paragraph, index, list) => paragraph && list.indexOf(paragraph) === index);
}

function EventArchivePage() {
  const archivedEvents = events
    .filter((event) => event.status === "archived")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title="Arhiv dogodkov" text="Pretekli javni dogodki in programska srečanja DOM." />
      <div className="toolbar">
        <Link className="button" to="/dogodki">
          Nazaj na dogodke
        </Link>
      </div>
      {archivedEvents.length ? (
        <div className="public-event-list">
          {archivedEvents.map((event) => (
            <PublicEventRow key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState text="Arhiv dogodkov je trenutno prazen." />
      )}
    </>
  );
}

function EventDetailPage() {
  const { slug = "" } = useParams();
  const event = getEvent(slug);
  if (!event) return <NotFound backTo="/dogodki" />;
  const space = event.spaceId ? getSpace(event.spaceId) : undefined;
  const imageSrc = getEventImageSrc(event);
  const publicDescription = getEventPublicDescription(event);
  return (
    <>
      <header className={`event-detail-hero ${imageSrc ? "" : "no-image"}`} style={imageSrc ? { backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 10%), rgb(0 0 0 / 76%)), url("${imageSrc}")` } : undefined}>
        <div>
          <p className="eyebrow">{event.type}</p>
          <h1>{event.title}</h1>
          <p>{event.headline || event.shortDescription}</p>
        </div>
      </header>

      <section className="event-detail-meta" aria-label="Čas in kraj dogodka">
        <div>
          <span>Čas</span>
          <strong>{formatEventDateLabel(event)}{event.occurrences?.length ? " · več terminov" : ` · ${formatEventTime(event)}`}</strong>
        </div>
        <div>
          <span>Kraj</span>
          {space ? <Link to={`/prostori/${space.slug}`}>{space.name}</Link> : <strong>{event.locationName}</strong>}
        </div>
        <div>
          <span>Vstop</span>
          <strong>{event.priceNote || event.registrationType}</strong>
        </div>
        <div>
          <span>Za koga</span>
          <strong>{event.audience.join(", ")}</strong>
        </div>
      </section>

      {event.occurrences?.length ? (
        <section className="event-occurrence-list" aria-label="Termini dogodka">
          <h2>Termini in prostori</h2>
          {event.occurrences.map((occurrence) => {
            const occurrenceSpace = getSpace(occurrence.spaceId);
            return (
              <div key={occurrence.id}>
                <strong>{formatDate(occurrence.date)} · {occurrence.startTime}{occurrence.endTime ? `-${occurrence.endTime}` : ""}</strong>
                {occurrenceSpace ? <Link to={`/prostori/${occurrenceSpace.slug}`}>{occurrenceSpace.name}</Link> : <span>{occurrence.locationName}</span>}
              </div>
            );
          })}
        </section>
      ) : null}

      <article className="event-detail-copy">
        {event.publicNotice && (
          <aside className="event-notice">
            <strong>Obvestilo</strong>
            <p>{event.publicNotice}</p>
          </aside>
        )}
        {event.tags?.length ? <TagRow tags={event.tags} /> : null}
        {publicDescription.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {(event.publicFiles?.length || event.livestreamUrl) && (
          <ul className="event-public-resources">
            {event.livestreamUrl && (
              <li>
                <a href={event.livestreamUrl}>Livestream</a>
              </li>
            )}
            {event.publicFiles?.map((file) => (
              <li key={file.label}>
                <a href={file.url}>{file.label}</a>
              </li>
            ))}
          </ul>
        )}
      </article>

      <section className="event-organiser-block">
        <div>
          <p className="small-label">Organizator</p>
          <h2>{event.organiser}</h2>
          <p>{event.organiserContact || "Kontakt bo objavljen ob potrditvi programa."}</p>
        </div>
        <div className="event-organiser-related">
          {event.coOrganisers?.length ? (
            <div>
              <p className="small-label">Soorganizatorji</p>
              <p>{event.coOrganisers.join(", ")}</p>
            </div>
          ) : null}
          {event.partners?.length ? (
            <div>
              <p className="small-label">Partnerji</p>
              <p>{event.partners.join(", ")}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="event-ticket-cta" id="nakup-kart">
        <div>
          <p className="small-label">{event.registrationType}</p>
          <h2>Vstopnice in prijava</h2>
          {event.ticketAvailability && <p>{event.ticketAvailability}</p>}
        </div>
        {getEventEntryMode(event) === "karte" && event.ticketSalesStatus !== "razprodano" ? (
          <Link className="button primary" to={`/dogodki/${event.slug}/karte`}>
            {event.ticketCtaLabel || "Kupi karto"}
          </Link>
        ) : (
          <button className="button primary" type="button" disabled>
            {event.ticketSalesStatus === "razprodano" ? "Razprodano" : event.ticketCtaLabel || "Prijava še ni odprta"}
          </button>
        )}
      </section>
    </>
  );
}

function TicketCheckoutPage() {
  const { slug = "" } = useParams();
  const event = getEvent(slug);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [ticketType, setTicketType] = useState("Redna karta");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("kartica");

  if (!event || getEventEntryMode(event) !== "karte") return <NotFound backTo="/dogodki" />;

  const minimumPrice = event.ticketPriceFrom ?? 0;
  const maximumPrice = event.ticketPriceTo ?? minimumPrice;
  const ticketTypes = minimumPrice === maximumPrice
    ? [{ label: "Redna karta", price: minimumPrice }]
    : [{ label: "Znižana karta", price: minimumPrice }, { label: "Redna karta", price: maximumPrice }];
  const selectedTicket = ticketTypes.find((item) => item.label === ticketType) || ticketTypes[0];
  const total = selectedTicket.price * quantity;
  const orderCode = `DOM-${event.id.slice(0, 6).toUpperCase()}-027`;

  const submitBuyer = (formEvent: FormEvent) => {
    formEvent.preventDefault();
    setStep(3);
  };

  if (event.ticketSalesStatus === "razprodano") {
    return (
      <section className="ticket-flow-shell ticket-flow-empty">
        <p className="eyebrow">Karte</p>
        <h1>{event.title}</h1>
        <h2>Dogodek je razprodan</h2>
        <p>Za ta dogodek trenutno ni prostih kart.</p>
        <Link className="button" to={`/dogodki/${event.slug}`}>Nazaj na dogodek</Link>
      </section>
    );
  }

  return (
    <section className="ticket-flow-shell">
      <header className="ticket-flow-header">
        <button className="text-link" type="button" onClick={() => step === 1 ? navigate(`/dogodki/${event.slug}`) : setStep(step - 1)}>← Nazaj</button>
        <div>
          <p className="eyebrow">Nakup kart</p>
          <h1>{event.title}</h1>
          <p>{formatEventDateLabel(event)} · {event.locationName}</p>
        </div>
        <span>Korak {step} / 3</span>
      </header>

      <ol className="ticket-flow-steps" aria-label="Koraki nakupa">
        <li className={step >= 1 ? "active" : ""}>Karte</li>
        <li className={step >= 2 ? "active" : ""}>Podatki in plačilo</li>
        <li className={step >= 3 ? "active" : ""}>Potrditev</li>
      </ol>

      {step === 1 ? (
        <div className="ticket-checkout-layout">
          <div className="ticket-flow-main">
            <h2>Izberi karte</h2>
            <div className="ticket-type-list">
              {ticketTypes.map((item) => (
                <label className={ticketType === item.label ? "selected" : ""} key={item.label}>
                  <input type="radio" name="ticketType" value={item.label} checked={ticketType === item.label} onChange={() => setTicketType(item.label)} />
                  <span><strong>{item.label}</strong><small>Vstop na dogodek</small></span>
                  <b>{formatCurrency(item.price)}</b>
                </label>
              ))}
            </div>
            <label className="ticket-quantity-field">
              Količina
              <select value={quantity} onChange={(changeEvent) => setQuantity(Number(changeEvent.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>
          <TicketOrderSummary event={event} ticketType={selectedTicket.label} quantity={quantity} total={total} action={<button className="button primary" type="button" onClick={() => setStep(2)}>Nadaljuj</button>} />
        </div>
      ) : null}

      {step === 2 ? (
        <form className="ticket-checkout-layout" onSubmit={submitBuyer}>
          <div className="ticket-flow-main">
            <h2>Podatki kupca</h2>
            <div className="ticket-buyer-fields">
              <label>Ime in priimek<input required value={buyerName} onChange={(changeEvent) => setBuyerName(changeEvent.target.value)} autoComplete="name" /></label>
              <label>E-pošta<input required type="email" value={buyerEmail} onChange={(changeEvent) => setBuyerEmail(changeEvent.target.value)} autoComplete="email" /></label>
            </div>
            <h2>Način plačila</h2>
            <div className="ticket-payment-options">
              <label className={paymentMethod === "kartica" ? "selected" : ""}><input type="radio" name="payment" value="kartica" checked={paymentMethod === "kartica"} onChange={() => setPaymentMethod("kartica")} /><span><strong>Plačilna kartica</strong><small>Simulirano plačilo v prototipu</small></span></label>
              <label className={paymentMethod === "predracun" ? "selected" : ""}><input type="radio" name="payment" value="predracun" checked={paymentMethod === "predracun"} onChange={() => setPaymentMethod("predracun")} /><span><strong>Predračun</strong><small>Navodila prejmete po e-pošti</small></span></label>
            </div>
            <label className="checkbox-field"><input required type="checkbox" /> Strinjam se s pogoji nakupa in obdelavo podatkov.</label>
          </div>
          <TicketOrderSummary event={event} ticketType={selectedTicket.label} quantity={quantity} total={total} action={<button className="button primary" type="submit">Zaključi nakup</button>} />
        </form>
      ) : null}

      {step === 3 ? (
        <div className="ticket-confirmation">
          <p className="eyebrow">Nakup uspešen</p>
          <h2>Karte so tvoje.</h2>
          <p>Potrdilo in {quantity === 1 ? "karta sta bila poslana" : "karte so bile poslane"} na <strong>{buyerEmail}</strong>.</p>
          <div className="ticket-confirmation-order"><span>Naročilo</span><strong>{orderCode}</strong><span>Skupaj</span><strong>{formatCurrency(total)}</strong></div>
          <div className="ticket-confirmation-codes">
            {Array.from({ length: quantity }, (_, index) => <TicketQrPlaceholder key={index} code={`${orderCode}-${index + 1}`} />)}
          </div>
          <div className="inline-actions">
            <Link className="button primary" to={`/dogodki/${event.slug}`}>Nazaj na dogodek</Link>
            <Link className="button" to="/dogodki">Vsi dogodki</Link>
          </div>
          <p className="meta">To je prototipni nakup. Plačilo ni bilo izvedeno in podatki niso bili poslani zunanjemu ponudniku.</p>
        </div>
      ) : null}
    </section>
  );
}

function TicketOrderSummary({ event, ticketType, quantity, total, action }: { event: EventItem; ticketType: string; quantity: number; total: number; action: ReactNode }) {
  return (
    <aside className="ticket-order-summary">
      <p className="small-label">Povzetek</p>
      <h3>{event.title}</h3>
      <p>{formatEventDateLabel(event)}<br />{event.locationName}</p>
      <div><span>{quantity} × {ticketType}</span><strong>{formatCurrency(total)}</strong></div>
      <div className="ticket-order-total"><span>Skupaj</span><strong>{formatCurrency(total)}</strong></div>
      {action}
      <small>Varno prototipno okolje · brez dejanske transakcije</small>
    </aside>
  );
}

function ShopPage() {
  const products = getPublicShopProducts();
  const { items } = usePrototypeShopCart();
  const cartQuantity = getCartQuantity(items);

  return (
    <>
      <header className="shop-hero">
        <div>
          <p className="eyebrow">DOM trgovina</p>
          <h1>Merch za obiskovalce, člane in skupnost DOM.</h1>
          <p>Izbrani izdelki podpirajo prepoznavnost hiše, dogodkov, delavnic in skupnosti. Nakupni tok je zasnovan tako, da se lahko pozneje poveže z zunanjim shop modulom.</p>
        </div>
        <div className="shop-hero-cart">
          <span className="small-label">Košarica</span>
          <strong>{cartQuantity} izdelkov</strong>
          <Link className="button" to="/trgovina/kosarica">
            Odpri košarico
          </Link>
        </div>
      </header>

      <Section title="Izdelki">
        <div className="shop-product-grid">
          {products.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section title="Nakup in prevzem">
        <ThreeColumns>
          <WirePanel title="1. Izbira izdelka">
            <p>Uporabnik pregleda izdelke, odpre detajl, izbere varianto in doda izdelek v košarico.</p>
          </WirePanel>
          <WirePanel title="2. Košarica">
            <p>Košarica zbere izdelke, količine in skupni znesek, preden uporabnik nadaljuje na nakup.</p>
          </WirePanel>
          <WirePanel title="3. Zunanji modul">
            <p>Zaključek nakupa, plačilo, dostava in davčni podatki se lahko predajo izbranemu zunanjemu shop sistemu.</p>
          </WirePanel>
        </ThreeColumns>
      </Section>
    </>
  );
}

function ShopProductCard({ product }: { product: ShopProduct }) {
  return (
    <Link className="shop-product-card" to={`/trgovina/${product.slug}`}>
      <ProductPlaceholderImage label={product.imageLabels[0] || product.title} />
      <div>
        <p className="eyebrow">{shopCategoryLabel(product.category)}</p>
        <h3>{product.title}</h3>
        <p>{product.shortDescription}</p>
        <div className="shop-product-card-footer">
          <strong>{formatPrice(product.priceCents)}</strong>
          <span>Poglej izdelek</span>
        </div>
      </div>
    </Link>
  );
}

function ProductDetailPage() {
  const { slug = "" } = useParams();
  const product = getShopProductBySlug(slug);
  if (!product || product.status !== "published") return <NotFound backTo="/trgovina" />;
  const availableVariant = product.variants.find((variant) => variant.available) || product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(availableVariant?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = usePrototypeShopCart();
  const selectedVariant = getProductVariant(product, selectedVariantId);
  const variantOptionLabel = product.variants.find((variant) => variant.optionLabel)?.optionLabel || "Varianta";

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedVariant || !selectedVariant.available) return;
    addItem(product.id, selectedVariant.id, quantity);
    setAdded(true);
  };

  return (
    <>
      <div className="shop-breadcrumb">
        <Link to="/trgovina">Trgovina</Link>
        <span>/</span>
        <span>{product.title}</span>
      </div>
      <section className="product-detail-layout">
        <div className="product-gallery" aria-label={`Slike izdelka ${product.title}`}>
          <ProductPlaceholderImage label={product.imageLabels[0] || product.title} large />
          <div className="product-thumbnail-row">
            {product.imageLabels.slice(1).map((label) => (
              <ProductPlaceholderImage key={label} label={label} compact />
            ))}
          </div>
        </div>
        <form className="product-buy-panel" onSubmit={onSubmit}>
          <p className="eyebrow">{shopCategoryLabel(product.category)}</p>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <strong className="product-price">{formatPrice(product.priceCents)}</strong>
          <label>
            {variantOptionLabel}
            <select value={selectedVariantId} onChange={(event) => setSelectedVariantId(event.target.value)}>
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={!variant.available}>
                  {variant.label}{variant.available ? "" : " - ni na voljo"}
                </option>
              ))}
            </select>
          </label>
          <label>
            Količina
            <input type="number" min="1" max="20" value={quantity} onChange={(event) => setQuantity(Number.parseInt(event.target.value, 10) || 1)} />
          </label>
          <button className="button primary" type="submit" disabled={!selectedVariant?.available}>
            Dodaj v košarico
          </button>
          {added && (
            <div className="save-state">
              Izdelek je dodan v košarico. <Link to="/trgovina/kosarica">Odpri košarico</Link>
            </div>
          )}
          <FactList
            items={[
              ["Prevzem", "DOM ali dostava prek zunanjega modula"],
              ["Plačilo", "zunanji plačilni ponudnik"],
              ["Integracija", product.externalModuleRef || "še ni izbrano"]
            ]}
          />
        </form>
      </section>
      <Section title="Podrobnosti">
        <TwoColumn>
          <WirePanel title="O izdelku">
            <p>{product.shortDescription}</p>
            <TagRow tags={product.tags} />
          </WirePanel>
          <WirePanel title="Nakupni proces">
            <p>{product.fulfillmentNote}</p>
            <p>Stran izdelka ostane javni UX vstop, zaključek naročila pa se lahko v produkciji preusmeri v izbrani shop sistem.</p>
          </WirePanel>
        </TwoColumn>
      </Section>
    </>
  );
}

function CartPage() {
  const cart = usePrototypeShopCart();
  const lines = getCartLines(cart.items);
  const subtotal = getCartSubtotal(lines);

  return (
    <>
      <PageHeader title="Košarica" text="Preglejte izbrane izdelke, količine in okvirni znesek pred nadaljevanjem na nakup." eyebrow="DOM trgovina" />
      {lines.length ? (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Izdelki v košarici">
            {lines.map((line) => (
              <article className="cart-item-row" key={`${line.product.id}-${line.variant.id}`}>
                <ProductPlaceholderImage label={line.product.title} compact />
                <div>
                  <h2>{line.product.title}</h2>
                  <p>{line.variant.optionLabel || "Varianta"}: {line.variant.label}</p>
                  <strong>{formatPrice(line.product.priceCents)}</strong>
                </div>
                <label>
                  Količina
                  <input type="number" min="1" max="20" value={line.item.quantity} onChange={(event) => cart.updateItem(line.product.id, line.variant.id, Number.parseInt(event.target.value, 10) || 0)} />
                </label>
                <strong>{formatPrice(line.product.priceCents * line.item.quantity)}</strong>
                <button type="button" onClick={() => cart.removeItem(line.product.id, line.variant.id)}>
                  Odstrani
                </button>
              </article>
            ))}
          </section>
          <CartSummary subtotal={subtotal} actionLabel="Nadaljuj na nakup" actionTo="/trgovina/nakup" />
        </div>
      ) : (
        <WirePanel title="Košarica je prazna">
          <p>Izberite izdelek v trgovini in ga dodajte v košarico.</p>
          <Link className="button primary" to="/trgovina">
            Nazaj v trgovino
          </Link>
        </WirePanel>
      )}
    </>
  );
}

function CheckoutPage() {
  const cart = usePrototypeShopCart();
  const lines = getCartLines(cart.items);
  const subtotal = getCartSubtotal(lines);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const checkoutSteps = ["Kontakt", "Prevzem", "Plačilo"];
  const isLastStep = activeStep === checkoutSteps.length - 1;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!lines.length) return;
    if (!isLastStep) {
      setActiveStep((step) => Math.min(step + 1, checkoutSteps.length - 1));
      return;
    }
    setSubmitted(true);
    cart.clearCart();
    window.setTimeout(() => {
      navigate("/trgovina/nakup/potrjeno");
    }, 700);
  };

  if (!lines.length && !submitted) {
    return (
      <>
        <PageHeader title="Nakup" text="Za nadaljevanje nakupa najprej dodajte izdelek v košarico." eyebrow="DOM trgovina" />
        <Link className="button primary" to="/trgovina">
          Nazaj v trgovino
        </Link>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Nakup" text="Zaključek nakupa je razdeljen na kontaktne podatke, prevzem oziroma dostavo in plačilni korak." eyebrow="DOM trgovina" />
      <div className="checkout-layout">
        <form className="mock-form checkout-flow" onSubmit={onSubmit}>
          <div className="membership-stepper" aria-label="Koraki nakupa">
            {checkoutSteps.map((step, index) => (
              <button className={activeStep === index ? "selected" : ""} key={step} type="button" onClick={() => setActiveStep(index)}>
                <span>{index + 1}</span>
                {step}
              </button>
            ))}
          </div>

          {activeStep === 0 && (
            <section className="signup-step-panel">
              <p className="eyebrow">1 · Kontakt</p>
              <h2>Podatki kupca</h2>
              <div className="form-grid">
                <label>
                  Ime in priimek
                  <input name="name" autoComplete="name" />
                </label>
                <label>
                  E-mail
                  <input name="email" type="email" autoComplete="email" />
                </label>
                <label>
                  Telefon
                  <input name="phone" type="tel" autoComplete="tel" />
                </label>
              </div>
            </section>
          )}

          {activeStep === 1 && (
            <section className="signup-step-panel">
              <p className="eyebrow">2 · Prevzem</p>
              <h2>Prevzem ali dostava</h2>
              <div className="form-grid">
                <label>
                  Način prevzema
                  <select name="fulfillment" defaultValue="pickup">
                    <option value="pickup">prevzem v DOM</option>
                    <option value="delivery">dostava prek zunanjega modula</option>
                  </select>
                </label>
                <label>
                  Naslov za dostavo
                  <input name="address" placeholder="Ulica, pošta, kraj" />
                </label>
                <label className="full-field">
                  Opomba
                  <textarea name="note" placeholder="Posebna navodila za prevzem ali dostavo" />
                </label>
              </div>
            </section>
          )}

          {activeStep === 2 && (
            <section className="signup-step-panel payment-step">
              <p className="eyebrow">3 · Plačilo</p>
              <h2>Plačilni korak</h2>
              <div className="payment-placeholder">
                <strong>Zunanji shop modul</strong>
                <p>V produkciji se tukaj prikaže ali odpre izbrani zunanji checkout z davčnimi podatki, plačilom, dostavo in potrditvijo naročila.</p>
              </div>
              <FactList items={[["Vmesni seštevek", formatPrice(subtotal)], ["Plačilo", "zunanji ponudnik"], ["Status", "čaka potrditev"]]} />
            </section>
          )}

          <div className="signup-step-actions">
            <div className="inline-actions">
              <button className="button" type="button" disabled={activeStep === 0} onClick={() => setActiveStep((step) => Math.max(step - 1, 0))}>
                Nazaj
              </button>
              <button className="button primary" type="submit">
                {isLastStep ? "Potrdi nakup" : "Nadaljuj"}
              </button>
            </div>
            <Link className="button" to="/trgovina/kosarica">
              Nazaj v košarico
            </Link>
          </div>
        </form>
        <CartSummary subtotal={subtotal} />
      </div>
    </>
  );
}

function CheckoutSuccessPage() {
  const [orderReference] = useState(() => `DOM-${Date.now().toString(36).toUpperCase()}`);

  return (
    <>
      <PageHeader title="Naročilo je sprejeto" text="Na e-mail bi prejeli potrditev naročila, podatke o plačilu in navodila za prevzem oziroma dostavo." eyebrow={`Naročilo ${orderReference}`} />
      <TwoColumn>
        <WirePanel title="Naslednji koraki">
          <Checklist items={["potrditev naročila na e-mail", "plačilo oziroma preusmeritev v zunanji modul", "obvestilo o prevzemu v DOM ali dostavi"]} />
        </WirePanel>
        <WirePanel title="Nadaljuj">
          <p>Po potrditvi se lahko uporabnik vrne v trgovino ali nadaljuje z raziskovanjem programa DOM.</p>
          <div className="inline-actions">
            <Link className="button primary" to="/trgovina">
              Nazaj v trgovino
            </Link>
            <Link className="button" to="/dogodki">
              Poglej dogodke
            </Link>
          </div>
        </WirePanel>
      </TwoColumn>
    </>
  );
}

type CartLine = {
  item: CartItem;
  product: ShopProduct;
  variant: ShopProductVariant;
};

function CartSummary({ subtotal, actionLabel, actionTo }: { subtotal: number; actionLabel?: string; actionTo?: string }) {
  return (
    <aside className="cart-summary">
      <h2>Povzetek</h2>
      <FactList
        items={[
          ["Izdelki", formatPrice(subtotal)],
          ["Dostava", "po izračunu zunanjega modula"],
          ["Skupaj", formatPrice(subtotal)]
        ]}
      />
      <p>Znesek ne vključuje morebitne dostave ali plačilnih stroškov, če jih določi zunanji shop modul.</p>
      {actionLabel && actionTo && (
        <Link className="button primary" to={actionTo}>
          {actionLabel}
        </Link>
      )}
    </aside>
  );
}

function ProductPlaceholderImage({ label, compact = false, large = false }: { label: string; compact?: boolean; large?: boolean }) {
  return (
    <div className={`product-placeholder-image ${compact ? "compact" : ""} ${large ? "large" : ""}`} aria-label={label}>
      <span>Slika</span>
      <strong>{label}</strong>
    </div>
  );
}

function getPublicShopProducts() {
  return shopProducts.filter((product) => product.status === "published");
}

function getShopProduct(productId: string) {
  return shopProducts.find((product) => product.id === productId);
}

function getShopProductBySlug(slug: string) {
  return shopProducts.find((product) => product.slug === slug);
}

function getProductVariant(product: ShopProduct, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId);
}

function getCartLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = getShopProduct(item.productId);
    const variant = product ? getProductVariant(product, item.variantId) : undefined;
    return product && variant ? [{ item, product, variant }] : [];
  });
}

function getCartSubtotal(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.product.priceCents * line.item.quantity, 0);
}

function getCartQuantity(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function shopCategoryLabel(category: ShopProduct["category"]) {
  const labels: Record<ShopProduct["category"], string> = {
    oblacila: "Oblačila",
    dodatki: "Dodatki",
    papir: "Papir",
    seti: "Seti"
  };
  return labels[category];
}

function MemberLoginPage() {
  const [submitted, setSubmitted] = useState(false);
  const [, setIsSignedIn] = usePrototypeSignedInState();
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsSignedIn(true);
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader title="Prijava za člane" text="Članski dostop omogoča rezervacijo prostorov, ki so dodeljeni posameznemu članu ali organizaciji." />
      <TwoColumn>
        <form className="mock-form" onSubmit={onSubmit}>
          <h2>Članski vstop</h2>
          <div className="form-grid">
            <label>
              E-mail
              <input defaultValue="info@kd-most.si" />
            </label>
            <label>
              Geslo
              <input type="password" defaultValue="geslo" />
            </label>
          </div>
          <button className="button primary" type="submit">
            Prijavi se
          </button>
          {submitted && (
            <div className="save-state">
              Prijava je potrjena za demo člana. <Link to="/moj-dom">Odpri Moj DOM</Link>
            </div>
          )}
        </form>
        <WirePanel title="Dostop člana">
          <p>Član po prijavi vidi samo prostore, za katere ima dovoljenje za rezervacijo. Javni dogodki ostanejo vidni v javnem koledarju, rezervacije prostorov pa se oddajajo iz članskega koledarja.</p>
          <Checklist items={["rezervacija dovoljenih prostorov", "pregled zasedenosti", "oddaja prošnje za termin", "brez urejanja javnih dogodkov"]} />
        </WirePanel>
      </TwoColumn>
    </>
  );
}

function MembershipPage() {
  return (
    <>
      <PageHeader title="Članstvo in skupnost" text="Članstvo je vstopna točka za ljudi in organizacije, ki želijo z DOMom sodelovati bolj redno." />
      <section className="community-content-block membership-overview">
        <div>
          <h2>Zakaj se pridružiti</h2>
          <p>Člani dobijo jasnejšo pot do informacij, programov, mentorjev, prostorov in skupnostnih aktivnosti. Članstvo lahko pomeni obiskovanje programa, sodelovanje pri kolektivu, uporabo izbranih prostorov ali povezavo z mentorji in partnerji.</p>
          <p>Ta stran je javni uvod v članstvo; dejanska prijava in članski dostop sta v prototipu prikazana ločeno.</p>
        </div>
        <div className="community-join-box">
          <h3>Si že član? Prijavi se</h3>
          <Link className="button primary" to="/moj-dom/prijava">
            Prijava za člane
          </Link>
        </div>
      </section>
      <Section title="Pridruži se nam">
        <div className="membership-join-section">
          <div>
            <p>Za novo članstvo uporabnik najprej odda osnovne podatke, izbere tip članstva, potrdi pogoje uporabe in obdelavo podatkov, plača članarino ter ustvari profil za nadaljnji dostop.</p>
            <Link className="button primary" to="/skupnost/pridruzi-se">
              Začni prijavni postopek
            </Link>
          </div>
          <div className="membership-flow-grid">
            <FlowStepCard step="1" title="Podatki" text="Osebni ali organizacijski podatki, kontakt, namen sodelovanja in interes za programe." />
            <FlowStepCard step="2" title="Pogoji" text="Strinjanje s pogoji uporabe, pravili skupnosti, zasebnostjo in komunikacijskimi obvestili." />
            <FlowStepCard step="3" title="Članarina" text="Izbira članarine in plačilo prek izbranega zunanjega plačilnega ponudnika." />
            <FlowStepCard step="4" title="Profil" text="Ustvarjanje profila, gesla in osnovnih nastavitev za članski dostop." />
          </div>
        </div>
      </Section>
      <Section title="Kaj članstvo omogoča">
        <div className="mentor-grid">
          <MentorCard name="Programi" role="Učenje in sodelovanje" text="Vključitev v delavnice, srečanja, mentorska srečanja in druge skupnostne programe." />
          <MentorCard name="Prostori" role="Dostop po pravilih" text="Možnost uporabe ali rezervacije izbranih prostorov, kadar ima član ali organizacija potrjen dostop." />
          <MentorCard name="Mentorstvo" role="Razvoj idej" text="Povezava z mentorji za program, produkcijo, tehnično pripravo, komunikacijo in skupnostno sodelovanje." />
          <MentorCard name="Kolektiv" role="Souporaba in skrb" text="Sodelovanje pri aktivnostih, ki gradijo dolgoročno skupnost in kulturo souporabe DOMa." />
        </div>
      </Section>
    </>
  );
}

function MembershipSignupPage() {
  const { addUser } = usePrototypeUsers();
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [membershipType, setMembershipType] = useState<"individual" | "organisation" | "youth" | "">("");
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const signupSteps = ["Podatki", "Pogoji", "Članarina", "Profil"];
  const isLastStep = activeStep === signupSteps.length - 1;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isLastStep) {
      setActiveStep((step) => Math.min(step + 1, signupSteps.length - 1));
      return;
    }
    if (!name || !email || !membershipType) {
      setActiveStep(0);
      return;
    }
    if (!createdUserId) {
      const today = prototypeTodayKey;
      const id = `u-local-${Date.now()}`;
      const storedMembershipType: MembershipType = membershipType === "organisation" ? "organizacija" : "posameznik";
      addUser({
        id,
        name,
        email,
        group: "registriran uporabnik",
        status: "član",
        registeredAt: today,
        membershipType: storedMembershipType,
        membershipAppliedAt: today,
        membershipStartAt: today,
        membershipEndAt: `${Number(today.slice(0, 4)) + 1}${today.slice(4)}`,
        modules: [],
        history: [`${today}: članstvo oddano prek javnega obrazca`]
      });
      setCreatedUserId(id);
    }
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader title="Pridruži se nam" text="Prototipni tok za novo članstvo: podatki, pogoji, članarina in ustvarjanje profila." />
      <form className="mock-form membership-signup-flow" onSubmit={onSubmit}>
        <div className="membership-stepper" aria-label="Koraki prijave za članstvo">
          {signupSteps.map((step, index) => (
            <button className={activeStep === index ? "selected" : ""} key={step} type="button" onClick={() => setActiveStep(index)}>
              <span>{index + 1}</span>
              {step}
            </button>
          ))}
        </div>

        {activeStep === 0 && (
          <section className="signup-step-panel">
            <p className="eyebrow">1 · Podatki</p>
            <h2>Osnovni podatki</h2>
            <div className="form-grid">
              <label>
                Ime in priimek / organizacija
                <input name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ime Priimek ali naziv organizacije" required />
              </label>
              <label>
                E-mail
                <input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ime@example.test" required />
              </label>
              <label>
                Tip članstva
                <select name="membershipType" value={membershipType} onChange={(event) => setMembershipType(event.target.value as "individual" | "organisation" | "youth" | "")} required>
                  <option value="" disabled>Izberi tip članstva</option>
                  <option value="individual">posameznik</option>
                  <option value="organisation">organizacija</option>
                  <option value="youth">mladi / študenti</option>
                </select>
              </label>
              <label>
                Interes
                <select name="interest" defaultValue="">
                  <option value="" disabled>Izberi glavni interes</option>
                  <option value="programmes">programi in delavnice</option>
                  <option value="spaces">uporaba prostorov</option>
                  <option value="collective">sodelovanje v kolektivu</option>
                  <option value="mentorship">mentorstvo</option>
                </select>
              </label>
            </div>
          </section>
        )}

        {activeStep === 1 && (
          <section className="signup-step-panel">
            <p className="eyebrow">2 · Pogoji</p>
            <h2>Soglasja</h2>
            <div className="checkbox-stack">
              <label>
                <input type="checkbox" /> Strinjam se s pogoji članstva in pravili skupnosti.
              </label>
              <label>
                <input type="checkbox" /> Strinjam se z obdelavo podatkov za namen članstva.
              </label>
              <label>
                <input type="checkbox" /> Želim prejemati obvestila o programih, dogodkih in možnostih sodelovanja.
              </label>
            </div>
          </section>
        )}

        {activeStep === 2 && (
          <section className="signup-step-panel payment-step">
            <p className="eyebrow">3 · Članarina</p>
            <h2>Plačilo članarine</h2>
            <div className="payment-placeholder">
              <strong>Plačilni ponudnik</strong>
              <p>Ta korak je ločen od oddaje podatkov in ustvarjanja profila. V dejanski platformi se tukaj potrdi izbrana članarina in izvede plačilo prek zunanjega plačilnega ponudnika.</p>
            </div>
            <div className="payment-summary-grid">
              <div>
                <span className="small-label">Tip</span>
                <strong>Osnovno članstvo</strong>
              </div>
              <div>
                <span className="small-label">Obdobje</span>
                <strong>1 leto</strong>
              </div>
              <div>
                <span className="small-label">Status</span>
                <strong>plačilo še ni izvedeno</strong>
              </div>
            </div>
          </section>
        )}

        {activeStep === 3 && (
          <section className="signup-step-panel profile-step">
            <p className="eyebrow">4 · Profil</p>
            <h2>Ustvari profil</h2>
            <p>Profil se ustvari po uspešnem plačilu članarine. Uporabnik nastavi geslo in osnovne podatke za članski dostop.</p>
            <div className="form-grid">
              <label>
                Prikazno ime
                <input name="displayName" placeholder="Ime ali naziv organizacije" />
              </label>
              <label>
                Geslo
                <input name="password" type="password" placeholder="Geslo" />
              </label>
              <label>
                Ponovi geslo
                <input name="passwordConfirm" type="password" placeholder="Ponovi geslo" />
              </label>
              <label>
                Obvestila
                <select name="notificationPreference" defaultValue="programmes">
                  <option value="programmes">programi in dogodki</option>
                  <option value="membership">samo članstvo</option>
                  <option value="none">brez e-obvestil</option>
                </select>
              </label>
            </div>
          </section>
        )}

        <div className="signup-step-actions">
          <div className="inline-actions">
            <button className="button" type="button" disabled={activeStep === 0} onClick={() => setActiveStep((step) => Math.max(step - 1, 0))}>
              Nazaj
            </button>
            <button className="button primary" type="submit">
              {isLastStep ? "Ustvari profil in zaključi" : activeStep === 2 ? "Potrdi plačilni korak" : "Nadaljuj"}
            </button>
          </div>
          <Link className="button" to="/skupnost/clanstvo">
            Nazaj na članstvo
          </Link>
        </div>
        {submitted && <div className="save-state">Prijava je oddana in član je dodan v prototip. V produkciji se profil ustvari po potrjenem plačilu.</div>}
      </form>
    </>
  );
}

function MojDomShell({ activePath, title, text, children }: { activePath: string; title: string; text: string; children: ReactNode }) {
  const [isSignedIn] = usePrototypeSignedInState();

  if (!isSignedIn) {
    return (
      <>
        <PageHeader title="Moj DOM" text="Za ogled uporabniškega profila se prijavite kot član ali registriran uporabnik." />
        <WirePanel title="Dostop do profila">
          <p>Moj DOM je zasebni uporabniški prostor za pregled rezervacij, prijav, komunikacije, članstva in osnovnih podatkov.</p>
          <Link className="button primary" to="/moj-dom/prijava">
            Prijava za člane
          </Link>
        </WirePanel>
      </>
    );
  }

  return (
    <>
      <PageHeader title={title} text={text} eyebrow="Moj DOM" />
      <div className="moj-dom-layout">
        <aside className="moj-dom-sidebar" aria-label="Moj DOM navigacija">
          {mojDomNav.map((item) => (
            <Link key={item.to} className={activePath === item.to ? "selected" : ""} to={item.to}>
              {item.label}
            </Link>
          ))}
        </aside>
        <div className="moj-dom-content">{children}</div>
      </div>
    </>
  );
}

function MojDomOverviewPage() {
  const accountUser = getMojDomUser();
  const { requests } = usePrototypeRoomUseRequests();
  const userRequests = getMojDomRequests(requests);
  const userBookings = getMojDomBookings();
  const userApplications = getMojDomProgrammeApplications();
  const userTickets = getMojDomTickets().filter((ticket) => !isMojDomTicketArchived(ticket));

  return (
    <MojDomShell activePath="/moj-dom" title="Pregled" text="Kratek pregled statusa računa, odprtih zahtev, rezervacij in prijav.">
      <div className="moj-dom-summary-grid">
        <WirePanel title="Račun">
          <FactList
            items={[
              ["Uporabnik", accountUser.name],
              ["Status", accountUser.status],
              ["Organizacija", accountUser.organisation || "brez organizacije"]
            ]}
          />
        </WirePanel>
        <WirePanel title="Članstvo">
          <FactList
            items={[
              ["Tip", accountUser.membershipType || "brez"],
              ["Velja do", accountUser.membershipEndAt ? formatDate(accountUser.membershipEndAt) : "ni določeno"],
              ["Plačilo", accountUser.membershipPayments?.[0]?.invoiceStatus || "ni zapisa"]
            ]}
          />
        </WirePanel>
      </div>
      <TwoColumn>
        <WirePanel title="Naslednje rezervacije">
          {userBookings.length ? (
            userBookings.slice(0, 3).map((booking) => <MiniItem key={booking.id} title={booking.title} meta={`${formatDate(booking.date)} · ${booking.startTime}-${booking.endTime} · ${booking.status}`} />)
          ) : (
            <EmptyState text="Ni prihodnjih rezervacij." />
          )}
          <Link className="button" to="/moj-dom/rezervacije">
            Vse rezervacije
          </Link>
        </WirePanel>
        <WirePanel title="Odprte prijave in komunikacija">
          {userApplications.slice(0, 2).map((application) => <MiniItem key={application.id} title={getProgrammeById(application.programmeId)?.title || application.programmeId} meta={`${application.status} · ${application.nextStep}`} />)}
          {userRequests.slice(0, 2).map((request) => <MiniItem key={request.id} title={request.requestedUse} meta={`${request.approvalStatus} · ${request.nextStep}`} />)}
          {!userApplications.length && !userRequests.length && <EmptyState text="Ni odprtih prijav ali komunikacije." />}
        </WirePanel>
      </TwoColumn>
      <WirePanel title="Karte za dogodke">
        {userTickets.length ? (
          userTickets.slice(0, 2).map((ticket) => <MiniLink key={ticket.id} to={`/moj-dom/karte/${ticket.id}`} title={getEventById(ticket.eventId)?.title || ticket.eventId} meta={`${formatTicketDate(ticket)} · ${getTicketUserStatus(ticket)}`} />)
        ) : (
          <EmptyState text="Ni kart za prihajajoče dogodke." />
        )}
        <Link className="button" to="/moj-dom/karte">
          Vse karte
        </Link>
      </WirePanel>
    </MojDomShell>
  );
}

function MojDomReservationsPage() {
  return (
    <MojDomShell activePath="/moj-dom/rezervacije" title="Rezervacije prostorov" text="Pregled dovoljenih prostorov, zasedenosti in mojih zahtev za termine.">
      <MemberCalendarContent />
    </MojDomShell>
  );
}

function MojDomProgrammesPage() {
  const applications = getMojDomProgrammeApplications();

  return (
    <MojDomShell activePath="/moj-dom/programi" title="Prijave na programe" text="Moje prijave, statusi in naslednji koraki pri programih DOM.">
      <WirePanel title="Moje prijave">
        {applications.length ? (
          applications.map((application) => (
            <MiniLink key={application.id} to={`/moj-dom/programi/${application.id}`} title={getProgrammeById(application.programmeId)?.title || application.programmeId} meta={`${application.status} · ${formatDateTime(application.submittedAt)} · ${application.nextStep}`} />
          ))
        ) : (
          <EmptyState text="Ni prijav na programe." />
        )}
      </WirePanel>
      <Section title="Programi za prijavo" action={<Link className="button" to="/skupnost">Vsi programi</Link>}>
        <CardGrid>
          {programmes.filter(isPublicProgramme).slice(0, 3).map((programme) => (
            <ProgrammeCard key={programme.id} programme={programme} />
          ))}
        </CardGrid>
      </Section>
    </MojDomShell>
  );
}

function MojDomProgrammeApplicationDetailPage() {
  const { applicationId = "" } = useParams();
  const application = getMojDomProgrammeApplications().find((item) => item.id === applicationId);
  if (!application) return <NotFound backTo="/moj-dom/programi" />;
  const programme = getProgrammeById(application.programmeId);

  return (
    <MojDomShell activePath="/moj-dom/programi" title={programme?.title || "Prijava na program"} text="Detajl prijave, oddani podatki in naslednji korak za uporabnika.">
      <div className="detail-actions">
        <Link className="button" to="/moj-dom/programi">
          Nazaj na prijave
        </Link>
        {programme && (
          <Link className="button primary" to={`/skupnost/programi/${programme.slug}`}>
            Odpri program
          </Link>
        )}
      </div>
      <TwoColumn>
        <WirePanel title="Status prijave">
          <FactList
            items={[
              ["Status", application.status],
              ["Oddano", formatDateTime(application.submittedAt)],
              ["Udeleženec", application.participantName],
              ["Organizacija", application.organisationName || "ni navedeno"],
              ["Vloga", application.role]
            ]}
          />
        </WirePanel>
        <WirePanel title="Naslednji korak">
          <p>{application.nextStep}</p>
          <div className="inline-actions">
            <Link className="button" to="/predstavitev/kontakt">
              Kontaktiraj ekipo
            </Link>
            <button className="button" type="button">
              Dopolni prijavo
            </button>
          </div>
        </WirePanel>
      </TwoColumn>
      <WirePanel title="Oddani podatki">
        <p>{application.submittedData}</p>
      </WirePanel>
    </MojDomShell>
  );
}

function MojDomTicketsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "archive">("upcoming");
  const tickets = getMojDomTickets();
  const visibleTickets = tickets.filter((ticket) => (activeTab === "archive" ? isMojDomTicketArchived(ticket) : !isMojDomTicketArchived(ticket)));

  return (
    <MojDomShell activePath="/moj-dom/karte" title="Karte za dogodke" text="Moje karte za prihajajoče dogodke in arhiv preteklih dogodkov.">
      <div className="segmented" aria-label="Pregled kart">
        <button className={activeTab === "upcoming" ? "selected" : ""} type="button" onClick={() => setActiveTab("upcoming")}>
          Prihajajoče
        </button>
        <button className={activeTab === "archive" ? "selected" : ""} type="button" onClick={() => setActiveTab("archive")}>
          Arhiv
        </button>
      </div>
      <WirePanel title={activeTab === "archive" ? "Arhiv kart" : "Prihajajoče karte"}>
        {visibleTickets.length ? (
          visibleTickets.map((ticket) => {
            const event = getEventById(ticket.eventId);
            return <MiniLink key={ticket.id} to={`/moj-dom/karte/${ticket.id}`} title={event?.title || ticket.eventId} meta={`${formatTicketDate(ticket)} · ${getTicketLocation(ticket)} · ${getTicketUserStatus(ticket)}`} />;
          })
        ) : (
          <EmptyState text={activeTab === "archive" ? "Ni arhivskih kart." : "Ni kart za prihajajoče dogodke."} />
        )}
      </WirePanel>
    </MojDomShell>
  );
}

function MojDomTicketDetailPage() {
  const { ticketId = "" } = useParams();
  const ticket = getMojDomTickets().find((item) => item.id === ticketId || item.code === ticketId);
  if (!ticket) return <NotFound backTo="/moj-dom/karte" />;
  const event = getEventById(ticket.eventId);
  const occurrence = getTicketOccurrence(ticket);
  const eventDate = occurrence?.date || event?.date || "";
  const eventTime = occurrence ? `${occurrence.startTime}${occurrence.endTime ? `-${occurrence.endTime}` : ""}` : event ? formatEventTime(event) : "ni podatka";

  return (
    <MojDomShell activePath="/moj-dom/karte" title={event?.title || "Karta za dogodek"} text="Detajl karte, uporabniški status in QR koda za vstop.">
      <div className="detail-actions">
        <Link className="button" to="/moj-dom/karte">
          Nazaj na karte
        </Link>
        {event && (
          <Link className="button primary" to={`/dogodki/${event.slug}`}>
            Odpri dogodek
          </Link>
        )}
      </div>
      <TwoColumn>
        <WirePanel title="Podatki o karti">
          <FactList
            items={[
              ["Status", getTicketUserStatus(ticket)],
              ["Termin", eventDate ? `${formatDate(eventDate)} · ${eventTime}` : "ni podatka"],
              ["Prostor", getTicketLocation(ticket)],
              ["Imetnik", ticket.holderName],
              ["Tip karte", ticket.ticketType],
              ["Koda", ticket.code]
            ]}
          />
        </WirePanel>
        <WirePanel title="QR koda">
          <TicketQrPlaceholder code={ticket.code} />
        </WirePanel>
      </TwoColumn>
      <WirePanel title="Referenca">
        <FactList
          items={[
            ["Ponudnik", ticket.provider],
            ["Naročilo", ticket.orderId],
            ["Referenca ponudnika", ticket.providerReference || "lastna evidenca"],
            ["Izdana", formatDateTime(ticket.issuedAt)]
          ]}
        />
      </WirePanel>
    </MojDomShell>
  );
}

function TicketQrPlaceholder({ code }: { code: string }) {
  return (
    <div className="ticket-qr" aria-label={`QR koda karte ${code}`}>
      <div>
        {Array.from({ length: 25 }, (_, index) => (
          <span key={index} className={(index + code.length) % 3 === 0 || index % 7 === 0 ? "filled" : ""} />
        ))}
      </div>
      <strong>{code}</strong>
    </div>
  );
}

function MojDomCommunicationPage() {
  const { requests } = usePrototypeRoomUseRequests();
  const userRequests = getMojDomRequests(requests);

  return (
    <MojDomShell activePath="/moj-dom/komunikacija" title="Komunikacija" text="Povpraševanja in oddane zahteve za najem, podporo, partnerstvo in druge teme.">
      <WirePanel title="Moja povpraševanja">
        {userRequests.length ? (
          userRequests.map((request) => {
            const space = request.relatedSpaceId ? getSpace(request.relatedSpaceId) : undefined;
            return <MiniLink key={request.id} to={`/moj-dom/komunikacija/${request.id}`} title={request.requestedUse} meta={`${request.approvalStatus} · ${space?.name || "prostor po dogovoru"} · ${request.nextStep}`} />;
          })
        ) : (
          <EmptyState text="Ni oddanih povpraševanj." />
        )}
      </WirePanel>
      <TwoColumn>
        <WirePanel title="Novo povpraševanje">
          <Checklist items={["najem ali uporaba prostora", "tehnična podpora", "partnerstvo", "splošno vprašanje"]} />
          <div className="inline-actions">
            <Link className="button primary" to="/prostori/najem">
              Najemi prostor
            </Link>
            <Link className="button" to="/predstavitev/kontakt">
              Kontakt
            </Link>
          </div>
        </WirePanel>
        <WirePanel title="Kaj vidi uporabnik">
          <p>Komunikacija združi različne oddane obrazce na eno mesto, brez dostopa do internih opomb ali admin modulov.</p>
        </WirePanel>
      </TwoColumn>
    </MojDomShell>
  );
}

function MojDomCommunicationDetailPage() {
  const { requestId = "" } = useParams();
  const { requests } = usePrototypeRoomUseRequests();
  const request = getMojDomRequests(requests).find((item) => item.id === requestId);
  if (!request) return <NotFound backTo="/moj-dom/komunikacija" />;
  const space = request.relatedSpaceId ? getSpace(request.relatedSpaceId) : undefined;

  return (
    <MojDomShell activePath="/moj-dom/komunikacija" title={request.requestedUse} text="Detajl povpraševanja, oddani podatki in naslednji korak za uporabnika.">
      <div className="detail-actions">
        <Link className="button" to="/moj-dom/komunikacija">
          Nazaj na komunikacijo
        </Link>
        {space && (
          <Link className="button primary" to={`/prostori/${space.slug}`}>
            Odpri prostor
          </Link>
        )}
      </div>
      <TwoColumn>
        <WirePanel title="Status povpraševanja">
          <FactList
            items={[
              ["Status", request.approvalStatus],
              ["Tema", request.requestedUse],
              ["Prostor", space?.name || "prostor po dogovoru"],
              ["Tip", request.recurrence],
              ["Termin", request.requestedPattern],
              ["Udeleženci", request.expectedParticipants]
            ]}
          />
        </WirePanel>
        <WirePanel title="Naslednji korak">
          <p>{request.nextStep}</p>
          <div className="inline-actions">
            <button className="button" type="button">
              Pošlji sporočilo
            </button>
            <button className="button" type="button">
              Dopolni podatke
            </button>
          </div>
        </WirePanel>
      </TwoColumn>
      <TwoColumn>
        <WirePanel title="Oddani kontaktni podatki">
          <FactList
            items={[
              ["Ime", request.requester],
              ["Organizacija", request.organisationName],
              ["Email", request.email],
              ["Prima kartica", request.hasPrimaCard ? "da" : "ne"]
            ]}
          />
        </WirePanel>
        <WirePanel title="Tehnične potrebe in priloge">
          <p>{request.technicalNeeds || "Ni navedenih tehničnih potreb."}</p>
          {request.attachments.length ? (
            request.attachments.map((attachment) => <MiniItem key={attachment} title={attachment} meta="priloga oddana z zahtevkom" />)
          ) : (
            <EmptyState text="Ni priloženih datotek." />
          )}
        </WirePanel>
      </TwoColumn>
      <WirePanel title="Komunikacija z DOM">
        <MiniItem title="Zahteva oddana" meta={`${request.requester} · ${request.requestedPattern}`} />
        <MiniItem title="Trenutni odgovor" meta={request.nextStep} />
      </WirePanel>
    </MojDomShell>
  );
}

function MojDomMembershipPage() {
  const accountUser = getMojDomUser();

  return (
    <MojDomShell activePath="/moj-dom/clanstvo" title="Članstvo" text="Status članstva, veljavnost in plačilni zapisi, kjer so povezani z računom.">
      <TwoColumn>
        <WirePanel title="Status članstva">
          <FactList
            items={[
              ["Status", accountUser.status],
              ["Tip članstva", accountUser.membershipType || "brez"],
              ["Začetek", accountUser.membershipStartAt ? formatDate(accountUser.membershipStartAt) : "ni določeno"],
              ["Velja do", accountUser.membershipEndAt ? formatDate(accountUser.membershipEndAt) : "ni določeno"]
            ]}
          />
        </WirePanel>
        <WirePanel title="Plačila">
          {accountUser.membershipPayments?.length ? (
            accountUser.membershipPayments.map((payment) => <MiniItem key={payment.id} title={payment.period} meta={`${payment.amount} · ${payment.invoiceNumber} · ${payment.invoiceStatus}`} />)
          ) : (
            <EmptyState text="Ni plačilnih zapisov." />
          )}
        </WirePanel>
      </TwoColumn>
      <WirePanel title="Zunanje finance">
        <p>Formalni računi in plačila ostanejo v zunanjem plačilnem ali računovodskem sistemu; Moj DOM prikazuje samo povezane statuse in reference.</p>
      </WirePanel>
    </MojDomShell>
  );
}

function MojDomProfilePage() {
  const accountUser = getMojDomUser();
  const [, setIsSignedIn] = usePrototypeSignedInState();
  const navigate = useNavigate();

  const signOut = () => {
    setIsSignedIn(false);
    navigate("/moj-dom/prijava");
  };

  return (
    <MojDomShell activePath="/moj-dom/profil" title="Profil" text="Osnovni podatki uporabnika ali organizacije in nastavitve računa.">
      <TwoColumn>
        <WirePanel title="Osnovni podatki">
          <FactList
            items={[
              ["Ime", accountUser.name],
              ["Email", accountUser.email],
              ["Organizacija", accountUser.organisation || "brez organizacije"],
              ["Skupina", accountUser.group]
            ]}
          />
        </WirePanel>
        <WirePanel title="Nastavitve">
          <Checklist items={["sprememba gesla", "kontaktni telefon", "nastavitve obvestil", "povezana organizacija"]} />
          <button className="button" type="button" onClick={signOut}>
            Odjavi se
          </button>
        </WirePanel>
      </TwoColumn>
      <MockForm title="Uredi profil" fields={["Prikazno ime", "E-mail", "Telefon", "Organizacija", "Obvestila"]} submitLabel="Shrani spremembe" />
    </MojDomShell>
  );
}

function getMojDomUser() {
  const prototypeUsers = readPrototypeUsers();
  return prototypeUsers.find((user) => user.name === memberAccess.memberName) || prototypeUsers.find((user) => user.status === "član" && user.group === "registriran uporabnik") || prototypeUsers.find((user) => user.group === "registriran uporabnik") || prototypeUsers[0];
}

function getMojDomBookings() {
  return bookings.filter((booking) => booking.requester === memberAccess.memberName);
}

function getMojDomProgrammeApplications() {
  const accountUser = getMojDomUser();
  return programmeApplications.filter((application) => application.participantName === memberAccess.memberName || application.organisationName === memberAccess.memberName || application.email === accountUser.email);
}

function getMojDomRequests(requests: RoomUseRequest[]) {
  const accountUser = getMojDomUser();
  return requests.filter((request) => request.organisationName === memberAccess.memberName || request.requester === memberAccess.memberName || request.email === accountUser.email);
}

function getMojDomTickets() {
  const accountUser = getMojDomUser();
  return issuedTickets
    .filter((ticket) => ticket.holderName === memberAccess.memberName || ticket.holderEmail === accountUser.email)
    .sort((a, b) => getTicketDate(a).localeCompare(getTicketDate(b)));
}

function isMojDomTicketArchived(ticket: IssuedTicket) {
  return getTicketDate(ticket) < mojDomTicketArchiveCutoff;
}

function getTicketUserStatus(ticket: IssuedTicket) {
  if (ticket.paymentStatus === "brezplačno") return ticket.status;
  if (ticket.paymentStatus === "čaka plačilo") return "čaka plačilo";
  if (ticket.paymentStatus === "povrnjeno") return "povrnjeno";
  return ticket.status;
}

function getTicketDate(ticket: IssuedTicket) {
  const event = getEventById(ticket.eventId);
  const occurrence = getTicketOccurrence(ticket);
  return occurrence?.date || event?.date || ticket.issuedAt.slice(0, 10);
}

function getTicketOccurrence(ticket: IssuedTicket) {
  const event = getEventById(ticket.eventId);
  return event?.occurrences?.find((occurrence) => occurrence.id === ticket.occurrenceId);
}

function formatTicketDate(ticket: IssuedTicket) {
  const occurrence = getTicketOccurrence(ticket);
  const event = getEventById(ticket.eventId);
  const date = occurrence?.date || event?.date;
  if (!date) return "datum ni vpisan";
  const time = occurrence?.startTime || event?.startTime;
  return time ? `${formatDate(date)} · ${time}` : formatDate(date);
}

function getTicketLocation(ticket: IssuedTicket) {
  const occurrence = getTicketOccurrence(ticket);
  const event = getEventById(ticket.eventId);
  return occurrence?.locationName || event?.locationName || "prostor ni vpisan";
}

function MemberCalendarPage() {
  return <MojDomReservationsPage />;
}

function MemberCalendarContent() {
  const allowedSpaces = spaces.filter((space) => isPublicSpace(space) && memberAccess.allowedSpaceIds.includes(space.id));
  const [selectedSpaceId, setSelectedSpaceId] = useState(allowedSpaces[0]?.id || "");
  const [calendarMode, setCalendarMode] = useState<"week" | "month">("week");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [memberEntry, setMemberEntry] = useState<{ date: string; space: Space } | null>(null);
  const selectedSpace = allowedSpaces.find((space) => space.id === selectedSpaceId) || allowedSpaces[0];
  const selectedBookings = selectedSpace ? bookings.filter((booking) => booking.spaceId === selectedSpace.id) : [];
  const monthOptions = getCalendarMonths(selectedBookings.map((booking) => booking.date));
  const weekOptions = getCalendarWeeks(selectedBookings.map((booking) => booking.date));
  const periodOptions = calendarMode === "month" ? monthOptions : weekOptions;
  const activePeriod = periodOptions.some((period) => period.key === selectedPeriod) ? selectedPeriod : periodOptions[0]?.key || "";

  return (
    <>
      <div className="member-calendar-layout">
        <aside className="member-room-list" aria-label="Sobe za člansko rezervacijo">
          <h2>Sobe</h2>
          {allowedSpaces.map((space) => (
            <button key={space.id} className={selectedSpaceId === space.id ? "selected" : ""} onClick={() => setSelectedSpaceId(space.id)}>
              <strong>{space.name}</strong>
              <span>{space.floor}</span>
            </button>
          ))}
        </aside>
        <WirePanel title="Razpoložljivost prostora">
          {selectedSpace ? (
            <>
              <div className="toolbar">
                <span className="small-label">Pogled</span>
                <div className="segmented" aria-label="Izbira pogleda koledarja">
                  <button className={calendarMode === "week" ? "selected" : ""} onClick={() => setCalendarMode("week")}>
                    Teden
                  </button>
                  <button className={calendarMode === "month" ? "selected" : ""} onClick={() => setCalendarMode("month")}>
                    Mesec
                  </button>
                </div>
                <span className="small-label">Obdobje</span>
                <PeriodNavigator options={periodOptions} activeKey={activePeriod} onChange={setSelectedPeriod} label="Premik po obdobjih članskega koledarja" />
              </div>
              <FactList
                items={[
                  ["Prostor", selectedSpace.name],
                  ["Nadstropje", selectedSpace.floor],
                  ["Kapaciteta", selectedSpace.capacityLabel],
                  ["Dostop", "članska rezervacija"]
                ]}
              />
              <MemberSpaceCalendar mode={calendarMode} periodKey={activePeriod} bookings={selectedBookings} onDayClick={(date) => setMemberEntry({ date, space: selectedSpace })} />
            </>
          ) : (
            <EmptyState text="Član trenutno nima dodeljenih prostorov." />
          )}
        </WirePanel>
      </div>
      <TwoColumn>
        <WirePanel title="Naslednji termini">
          {selectedSpace ? (
            selectedBookings.length ? (
              selectedBookings.map((booking) => (
                <MiniItem key={booking.id} title={booking.title} meta={`${formatDate(booking.date)} · ${booking.startTime}-${booking.endTime} · ${booking.status}`} />
              ))
            ) : (
              <EmptyState text="Za izbrani prostor trenutno ni rezervacij." />
            )
          ) : (
            <EmptyState text="Član trenutno nima dodeljenih prostorov." />
          )}
        </WirePanel>
        <WirePanel title="Kaj lahko član naredi">
          <Checklist items={["preveri zasedenost za izbrani prostor", "preklopi med tedenskim in mesečnim pogledom", "odda nov termin v potrditev", "ne vidi administrativnih opomb drugih prostorov"]} />
        </WirePanel>
      </TwoColumn>
      <MockForm title="Oddaj rezervacijo prostora" fields={["Prostor", "Datum", "Od", "Do", "Namen uporabe", "Število udeležencev", "Tehnične potrebe"]} submitLabel="Pošlji v potrditev" />
      {memberEntry && <CalendarEntryModal mode="member" date={memberEntry.date} space={memberEntry.space} onClose={() => setMemberEntry(null)} />}
    </>
  );
}

function MemberSpaceCalendar({ mode, periodKey, bookings: list, onDayClick }: { mode: "week" | "month"; periodKey: string; bookings: Booking[]; onDayClick: (date: string) => void }) {
  if (!periodKey) return <EmptyState text="Za izbrani prostor ni vpisanih terminov." />;

  if (mode === "month") {
    const monthDate = parseLocalDate(`${periodKey}-01`);
    const monthDays = getMonthDays(monthDate);
    return (
      <div className="member-month-grid" aria-label="Mesečni koledar rezervacij">
        {["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"].map((day) => (
          <strong className="weekday" key={day}>
            {day}
          </strong>
        ))}
        {monthDays.map((day) => {
          const dayBookings = list.filter((booking) => booking.date === day.date);
          return (
            <div className={`member-calendar-day ${day.inMonth ? "" : "muted"} ${day.date === prototypeTodayKey ? "is-today" : ""}`} key={day.key} onClick={() => day.inMonth && onDayClick(day.date)}>
              <span>{day.label}{day.date === prototypeTodayKey && <em className="today-marker">danes</em>}</span>
              {dayBookings.map((booking) => (
                <MemberBookingBlock key={booking.id} booking={booking} />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  const weekDays = getWeekDays(periodKey);
  return (
    <div className="member-week-grid" aria-label="Tedenski koledar rezervacij">
      {weekDays.map((date) => {
        const dayBookings = list.filter((booking) => booking.date === date);
        return (
          <div className={`member-week-day ${date === prototypeTodayKey ? "is-today" : ""}`} key={date} onClick={() => onDayClick(date)}>
            <strong>{formatShortWeekdayDate(date)}{date === prototypeTodayKey && <em className="today-marker">danes</em>}</strong>
            {dayBookings.length ? dayBookings.map((booking) => <MemberBookingBlock key={booking.id} booking={booking} />) : <span className="empty-inline">prosto</span>}
          </div>
        );
      })}
    </div>
  );
}

function MemberBookingBlock({ booking }: { booking: Booking }) {
  return (
    <div className={`calendar-chip calendar-entry-booking ${booking.status === "blokirano" ? "internal-chip" : ""}`}>
      <span className="calendar-chip-top">
        <time>{booking.startTime}-{booking.endTime}</time>
        <i>{booking.status === "blokirano" ? "blokirano" : "rezervacija"}</i>
      </span>
      <b>{booking.title}</b>
      <em>{booking.status}</em>
    </div>
  );
}

function PeriodNavigator({ options, activeKey, onChange, label }: { options: { key: string; label: string }[]; activeKey: string; onChange: (key: string) => void; label: string }) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.key === activeKey));
  const activeOption = options[activeIndex];

  return (
    <div className="period-nav" aria-label={label}>
      <button type="button" aria-label="Prejšnje obdobje" disabled={!activeOption || activeIndex === 0} onClick={() => onChange(options[activeIndex - 1].key)}>
        ‹
      </button>
      <strong>{activeOption?.label || "Ni obdobij"}</strong>
      <button type="button" aria-label="Naslednje obdobje" disabled={!activeOption || activeIndex === options.length - 1} onClick={() => onChange(options[activeIndex + 1].key)}>
        ›
      </button>
    </div>
  );
}

function CalendarEntryModal({ mode, date, space, onClose }: { mode: "admin" | "member"; date: string; space?: Space; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const title = mode === "admin" ? "Dodaj vnos v admin koledar" : "Oddaj rezervacijo prostora";
  const submitLabel = mode === "admin" ? "Prikaži shranjen vnos" : "Pošlji v potrditev";
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="calendar-entry-title">
        <div className="modal-head">
          <div>
            <p className="eyebrow">{formatDate(date)}{space ? ` · ${space.name}` : ""}</p>
            <h2 id="calendar-entry-title">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Zapri popup">
            ×
          </button>
        </div>
        <form className="mock-form compact-form" onSubmit={onSubmit}>
          <div className="form-grid">
            {mode === "admin" && (
              <label>
                Tip vnosa
                <select defaultValue="rezervacija">
                  <option value="dogodek">Javni dogodek</option>
                  <option value="rezervacija">Rezervacija prostora</option>
                  <option value="blokada">Interni blok</option>
                </select>
              </label>
            )}
            <label>
              Prostor
              <input defaultValue={space?.name || "Izberi prostor"} />
            </label>
            <label>
              Datum
              <input defaultValue={date} />
            </label>
            <label>
              Od
              <input defaultValue="10:00" />
            </label>
            <label>
              Do
              <input defaultValue="12:00" />
            </label>
            <label>
              Naziv / namen
              <input defaultValue={mode === "admin" ? "Nov vnos v koledar" : "Rezervacija prostora"} />
            </label>
            <label>
              Opomba
              <textarea placeholder={mode === "admin" ? "Interna opomba, tehnične potrebe, kontakt ..." : "Namen uporabe, število oseb, tehnične potrebe ..."} />
            </label>
          </div>
          <div className="inline-actions">
            <button className="button primary" type="submit">
              {submitLabel}
            </button>
            <button type="button" onClick={onClose}>
              Zapri
            </button>
          </div>
          {submitted && <p className="save-state">V prototipu je to samo prikaz. V pravem sistemu bi se vnos shranil in preveril konflikte.</p>}
        </form>
      </section>
    </div>
  );
}

function CalendarEventDetailModal({ item, onClose }: { item: AdminCalendarItem; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="calendar-event-detail-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="eyebrow">{calendarKindLabel(item.kind)} · {formatDate(item.date)}</p>
            <h2 id="calendar-event-detail-title">{item.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Zapri popup">
            ×
          </button>
        </div>
        <FactList
          items={[
            ["Čas", item.time],
            ["Prostor", item.spaceName],
            ["Organizator", item.organiser || "ni vpisano"],
            ["Status", item.status]
          ]}
        />
        <div className="inline-actions">
          {item.eventSlug && (
            <Link className="button primary" to={`/admin/dogodki/${item.eventSlug}`}>
              Odpri dogodek v adminu
            </Link>
          )}
          <button type="button" onClick={onClose}>
            Zapri
          </button>
        </div>
      </section>
    </div>
  );
}

const connectedOrganisations = [
  {
    name: "Studio Mestne Prakse",
    field: "urbana kultura",
    text: "Neodvisna skupina za delavnice, javne pogovore in projekte o rabi mesta."
  },
  {
    name: "Kolektiv Svetlobnica",
    field: "vizualna umetnost",
    text: "Ustvarjalni kolektiv za razstavne formate, prostorske intervencije in mentorstvo mladim avtorjem."
  },
  {
    name: "Društvo Zvokotok",
    field: "glasba in zvok",
    text: "Društvo za zvočne delavnice, poslušalnice, snemalne vaje in skupnostne glasbene dogodke."
  },
  {
    name: "Zavod Odprta Delavnica",
    field: "izobraževanje",
    text: "Partner za neformalno učenje, praktične delavnice, souporabo znanja in razvoj mentorskih formatov."
  },
  {
    name: "Mreža Mladi Kuratorji",
    field: "kuratorstvo",
    text: "Programska mreža za razstave, javne predstavitve, pogovore in podporo mladim producentom."
  }
];

function CommunitySubnav() {
  return (
    <nav className="community-subnav" aria-label="Skupnost">
      <NavLink end to="/skupnost/predstavitev">Predstavitev</NavLink>
      <NavLink to="/skupnost/programi">Programi</NavLink>
      <NavLink to="/skupnost/zgodovina-doma">Zgodovina DOMA</NavLink>
      <NavLink to="/skupnost/ljudje">Ljudje</NavLink>
      <NavLink to="/skupnost/clanstvo">Članstvo</NavLink>
      <NavLink to="/skupnost/trgovina">Trgovina</NavLink>
    </nav>
  );
}

function CommunityPresentationPage() {
  const heroSpace = spaces.find((space) => space.id === "mala-vadbena-dvorana");

  return (
    <>
      <CommunitySubnav />

      <header className="community-intro">
        <div>
          <h1>Skupnost</h1>
          <p>Skupnost DOM povezuje ljudi, skupine, mentorje, ustvarjalce, društva in organizacije, ki želijo v DOMu razvijati vsebine, deliti znanje, uporabljati prostore in soustvarjati javno kulturno življenje mesta.</p>
        </div>
        <Link className="button primary" to="/skupnost/clanstvo">
          Pridruži se nam
        </Link>
      </header>

      <section className="community-hero" style={heroSpace?.imageSrc ? { backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / 8%), rgb(0 0 0 / 70%)), url(${heroSpace.imageSrc})` } : undefined}>
        <div>
          <p className="eyebrow">DOM skupnost</p>
          <h2>Prostor za srečevanje, učenje in skupno produkcijo</h2>
        </div>
      </section>

      <section className="community-content-block">
        <div>
          <h2>Kaj pomeni skupnost DOM</h2>
          <p>Skupnost DOM ni javni direktorij članov, ampak živa programska infrastruktura. Namenjena je rednim srečanjem, izmenjavi znanja, mentorski podpori, razvoju novih dogodkov, skupnostnim formatom in povezovanju različnih uporabnikov hiše.</p>
          <p>V njej se srečujejo ustvarjalci, mladi, kulturna društva, neformalne skupine, organizacije, javne ustanove in posamezniki, ki potrebujejo prostor, sogovornike ali podporo pri razvoju ideje. DOM pri tem povezuje prostore, programe, mentorje, termine in operativno podporo.</p>
        </div>
        <div className="community-join-box">
          <h3>Sodelovanje v kolektivu</h3>
          <p>Če te zanima sodelovanje v kolektivu, redna uporaba prostorov, razvoj programa ali vključitev v skupnostne aktivnosti, se nam pridruži.</p>
          <Link className="button primary" to="/skupnost/clanstvo">
            Pridruži se skupnosti
          </Link>
        </div>
      </section>

      <Section title="Povezane organizacije" action={<Link to="/skupnost/organizacije">Vse organizacije</Link>}>
        <div className="organisation-strip">
          {connectedOrganisations.slice(0, 3).map((organisation) => (
            <OrganisationCard key={organisation.name} organisation={organisation} />
          ))}
        </div>
      </Section>

    </>
  );
}

function ProgrammesPage() {
  const publicProgrammes = programmes.filter(isPublicProgramme);

  return (
    <>
      <CommunitySubnav />
      <PageHeader title="Programi" text="Programi skupnosti povezujejo učenje, srečanja, produkcijo in javne kulturne formate v DOMu." />
      <Section title="Programi skupnosti">
        <div className="card-grid programme-grid">
          {publicProgrammes.map((programme) => (
            <ProgrammeCard key={programme.id} programme={programme} />
          ))}
        </div>
      </Section>

    </>
  );
}

function CommunityHistoryPage() {
  return (
    <>
      <CommunitySubnav />
      <section className="community-history" aria-labelledby="community-history-title">
        <p className="eyebrow">Zgodovina DOMA</p>
        <h1 id="community-history-title">Od hiše do skupnosti</h1>
        <p>DOM nastaja kot prostor, v katerem se lahko srečajo program, ustvarjanje in vsakdanje življenje skupnosti. Njegovo zgodbo soustvarjajo ljudje, skupine in organizacije, ki v hišo prinašajo svoje ideje, znanje in dejavnosti.</p>
        <Link to="/predstavitev/prenova">Več o razvoju DOMA</Link>
      </section>
    </>
  );
}

function CommunityPeoplePage() {
  return (
    <>
      <CommunitySubnav />
      <PageHeader title="Ljudje" text="Mentorji in povezovalci, ki sodelujejo pri razvoju programa, projektov in skupnosti DOM." />
      <Section title="Mentorji">
        <div className="mentor-grid">
          <MentorCard name="Mojca Adamič" role="Razvoj programa" text="Pomaga pri oblikovanju namena, publike, formata in povezave z drugimi programi DOM." portrait />
          <MentorCard name="Nina Zupan" role="Izvedba dogodkov" text="Spremlja načrt izvedbe, časovnico, komunikacijo, prijave, osnovni proračun in pripravo ekipe." portrait />
          <MentorCard name="Tomaž Kralj" role="Prostor in oprema" text="Svetuje pri izboru prostora, osnovni postavitvi, zvoku, svetlobi, projekciji in tehničnih potrebah." portrait />
          <MentorCard name="Aljaž Novak" role="Povezovanje" text="Povezuje udeležence, društva, iniciative, partnerje in uporabnike, ki lahko sodelujejo pri programu." portrait />
        </div>
      </Section>
    </>
  );
}

function CommunityMembershipPage() {
  return <><CommunitySubnav /><MembershipPage /></>;
}

function CommunityShopPage() {
  return <><CommunitySubnav /><ShopPage /></>;
}

function CommunityShopSection() {
  const featuredProduct = shopProducts.find((product) => product.id === "dom-torba") || getPublicShopProducts()[0];
  if (!featuredProduct) return null;

  return (
    <section className="community-shop-band" aria-labelledby="community-shop-title">
      <div>
        <p className="eyebrow">Trgovina</p>
        <h2 id="community-shop-title">Merch za DOM skupnost</h2>
        <p>Uporabni izdelki za delavnice, srečanja, dogodke in vsakdanjo prisotnost DOM skupnosti v mestu.</p>
        <Link className="button primary" to="/trgovina">
          Odpri trgovino
        </Link>
      </div>
      <div className="community-shop-product">
        <ProductPlaceholderImage label={featuredProduct.imageLabels[0] || featuredProduct.title} />
        <strong>{featuredProduct.title}</strong>
        <span>{formatPrice(featuredProduct.priceCents)}</span>
      </div>
    </section>
  );
}

function ConnectedOrganisationsPage() {
  return (
    <>
      <header className="community-intro">
        <div>
          <h1>Povezane organizacije</h1>
          <p>Organizacije, kolektivi in mreže, ki so povezani s programi, mentorstvom, prostori in skupnostnimi aktivnostmi DOM.</p>
        </div>
        <Link className="button" to="/skupnost">
          Nazaj na skupnost
        </Link>
      </header>
      <div className="organisation-grid">
        {connectedOrganisations.map((organisation) => (
          <OrganisationCard key={organisation.name} organisation={organisation} />
        ))}
      </div>
    </>
  );
}

function ProgrammeDetailPage() {
  const { slug = "" } = useParams();
  const programme = getProgramme(slug);
  if (!programme || !isPublicProgramme(programme)) return <NotFound backTo="/skupnost" />;
  const relatedEvents = events.filter((event) => event.relatedProgrammeId === programme.id && event.status === "published");
  return (
    <>
      <PageHeader title={programme.title} text={programme.shortDescription} eyebrow={programme.audience} />
      <WirePanel title="Opis programa">
        <p>{programme.description}</p>
      </WirePanel>
      <ProgrammeApplicationForm programme={programme} />
      <Section title="Povezani dogodki">
        {relatedEvents.length ? (
          <CardGrid>
            {relatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </CardGrid>
        ) : (
          <EmptyState text="Za ta program še ni objavljenih dogodkov." />
        )}
      </Section>
    </>
  );
}

function ProgrammeApplicationForm({ programme }: { programme: Programme }) {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form className="mock-form programme-application-form" onSubmit={onSubmit}>
      <h2>Prijavi se na program</h2>
      <p>Oddaj osnovne podatke, ekipa DOM pa te poveže s pravim naslednjim korakom v programu {programme.title}.</p>
      <div className="form-grid">
        <label>
          Ime in priimek
          <input name="name" autoComplete="name" />
        </label>
        <label>
          E-mail
          <input name="email" type="email" autoComplete="email" />
        </label>
        <label>
          Organizacija ali kolektiv
          <input name="organisation" />
        </label>
        <label>
          Vloga
          <input name="role" placeholder="udeleženec, mentor, organizator ..." />
        </label>
        <label className="full-field">
          Kaj te zanima?
          <textarea name="interest" placeholder="Kratek opis interesa, ideje, dogodka ali podpore, ki jo iščeš." />
        </label>
      </div>
      <button className="button primary" type="submit">
        Pošlji prijavo
      </button>
      {submitted && <p className="save-state">Hvala. Prijava je zabeležena za nadaljnji pregled ekipe DOM.</p>}
    </form>
  );
}

function NewsPage() {
  const publishedNews = getPublishedNews();
  const latestNews = publishedNews.filter((item) => !["obvestilo", "poziv"].includes(item.category)).slice(0, 3);
  const notices = publishedNews.filter((item) => item.category === "obvestilo").slice(0, 3);
  const calls = publishedNews.filter((item) => item.category === "poziv").slice(0, 2);

  return (
    <>
      <header className="news-hero">
        <p className="eyebrow">Novice, razpisi in aktualni dogodki</p>
        <h1>Zapisi z Vodnikove</h1>
        <p>Bodi na tekočem z novicami iz DOM-a, uspešnimi projekti naših rezidentov, pomembnimi obvestili in odprtimi pozivi za nove ustvarjalce.</p>
      </header>

      <Section title="Zadnje aktualne novice" eyebrow="Dogajanje">
        <div className="news-feature-list">
          {latestNews.map((item) => (
            <NewsFeatureCard key={item.id} item={item} />
          ))}
        </div>
      </Section>

      <section className="news-operational-grid" aria-label="Obvestila in pozivi">
        <div>
          <h2>Pomembna obvestila</h2>
          <div className="notice-list">
            {notices.map((item) => (
              <NoticeCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div>
          <h2>Aktualni pozivi</h2>
          <div className="call-list">
            {calls.map((item) => (
              <CallCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <NewsNewsletterBand />
    </>
  );
}

function NewsDetailPage() {
  const { slug = "" } = useParams();
  const item = getNewsItem(slug);
  if (!item || item.status !== "published") return <NotFound backTo="/novice" />;
  const attachedForm = item.attachedFormFlowId ? formFlows.find((flow) => flow.id === item.attachedFormFlowId) : undefined;
  const suggestedNews = getSuggestedNewsItems(item);

  return (
    <>
      <PageHeader title={item.title} text={item.excerpt} eyebrow={`${formatDate(item.date)} · ${getNewsCategoryLabel(item)}`} />
      <WirePanel title="Zapis">
        <FactList
          items={[
            ["Avtor", item.authorName || "Uredništvo DOM"],
            ...(item.category === "poziv" && item.callDeadline ? ([["Rok prijave", formatDate(item.callDeadline)]] as [string, string][]) : [])
          ]}
        />
        <p>{item.body}</p>
        {item.tags?.length ? <TagRow tags={item.tags} /> : null}
      </WirePanel>

      {item.photoLabels?.length ? (
        <WirePanel title="Fotografije">
          <Checklist items={item.photoLabels} />
        </WirePanel>
      ) : null}

      {item.addedLinks?.length ? (
        <WirePanel title="Povezave">
          <ul className="admin-bullet-links">
            {item.addedLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.url}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </WirePanel>
      ) : null}

      {attachedForm ? <MockForm title={attachedForm.title} fields={attachedForm.fields} submitLabel="Pošlji prijavo" /> : null}

      {suggestedNews.length > 0 && (
        <Section title="Morda vas zanima tudi">
          <div className="three-columns">
            {suggestedNews.map((suggestedItem) => (
              <NewsCard key={suggestedItem.id} item={suggestedItem} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function TermsPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader title={t("legal.termsTitle")} text={t("legal.termsText")} />
      <WirePanel title={t("footer.terms")}>
        <p>{t("legal.termsText")}</p>
      </WirePanel>
    </>
  );
}

function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader title={t("legal.privacyTitle")} text={t("legal.privacyText")} />
      <WirePanel title={t("footer.privacy")}>
        <p>{t("legal.privacyText")}</p>
      </WirePanel>
    </>
  );
}

function AdminLayout() {
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(readAdminSidebarCollapsedGroups);
  const toggleGroup = (groupTo: string) => {
    setCollapsedGroups((current) => {
      const next = { ...current, [groupTo]: !(current[groupTo] ?? true) };
      writeAdminSidebarCollapsedGroups(next);
      return next;
    });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          DOM
        </Link>
        <nav aria-label="Admin glavni meni">
          <p className="nav-caption">Glavni meni</p>
          {adminMainNav.map((item) => {
            const subItems =
              item.to === "/admin/uporabniki"
                ? adminUsersSubNav
                : item.to === "/admin/dogodki"
                ? adminEventsSubNav
                : item.to === "/admin/obrazci"
                ? adminFormSubNav
                : item.to === "/admin/prostori"
                  ? adminSpacesSubNav
                  : item.to === "/admin/programi"
                    ? adminProgrammesSubNav
                    : undefined;
            return (
              <Fragment key={item.to}>
                <AdminNavGroup
                  item={item}
                  subItems={subItems}
                  isCollapsed={collapsedGroups[item.to] ?? true}
                  isCurrentSection={item.to === "/admin" ? location.pathname === item.to : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)}
                  onToggle={() => toggleGroup(item.to)}
                />
                {item.to === "/admin" && <div className="admin-nav-separator" aria-hidden="true" />}
              </Fragment>
            );
          })}
          <p className="nav-caption">Pomožni meni</p>
          {adminAuxNav.map((item) => (
            <AdminNavGroup
              key={item.to}
              item={item}
              subItems={item.to === "/admin/uporabniki" ? adminUsersSubNav : undefined}
              isCollapsed={collapsedGroups[item.to] ?? true}
              isCurrentSection={location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)}
              onToggle={() => toggleGroup(item.to)}
            />
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="role-pill">Maja Admin · Admin</div>
        </header>
        <main>
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="novice" element={<AdminNews />} />
            <Route path="novice/nov" element={<AdminNewNews />} />
            <Route path="novice/:slug" element={<AdminNewsDetail />} />
            <Route path="dogodki" element={<AdminEvents />} />
            <Route path="dogodki/seznam" element={<LegacyRedirect to="/admin/dogodki" />} />
            <Route path="dogodki/rezervacije" element={<LegacyRedirect to="/admin/prostori/rezervacije" />} />
            <Route path="dogodki/nov" element={<AdminNewEvent />} />
            <Route path="dogodki/karte" element={<AdminIssuedTickets />} />
            <Route path="dogodki/karte/:ticketId" element={<AdminIssuedTicketDetail />} />
            <Route path="dogodki/:slug" element={<AdminEventDetail />} />
            <Route path="obrazci/*" element={<AdminForms />} />
            <Route path="prostori/*" element={<AdminSpacesBookings />} />
            <Route path="prostori-rezervacije/*" element={<AdminSpacesBookings />} />
            <Route path="programi/*" element={<AdminProgrammes />} />
            <Route path="staticna-vsebina" element={<AdminStaticContent />} />
            <Route path="trgovina" element={<AdminShop />} />
            <Route path="trgovina/nov" element={<AdminNewProduct />} />
            <Route path="trgovina/:slug" element={<AdminProductDetail />} />
            <Route path="mediji" element={<AdminMedia />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="signage" element={<AdminSignage />} />
            <Route path="integracije" element={<AdminIntegrations />} />
            <Route path="uporabniki" element={<AdminUsers />} />
            <Route path="uporabniki/nov" element={<AdminUserCreate />} />
            <Route path="uporabniki/novi-clani" element={<AdminNewMembers />} />
            <Route path="uporabniki/:userId" element={<AdminUserDetail />} />
            <Route path="sodelavci" element={<AdminCollaborators />} />
            <Route path="sodelavci/nov" element={<AdminCollaboratorCreate />} />
            <Route path="sodelavci/:userId" element={<AdminCollaboratorDetail />} />
            <Route path="nastavitve" element={<AdminSettings />} />
            <Route path="*" element={<NotFound backTo="/admin" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AdminNavGroup({
  item,
  subItems,
  isCollapsed,
  isCurrentSection,
  onToggle
}: {
  item: { label: string; to: string };
  subItems?: { label: string; to: string; isCreate?: boolean }[];
  isCollapsed: boolean;
  isCurrentSection: boolean;
  onToggle: () => void;
}) {
  const showSubItems = Boolean(subItems) && (isCurrentSection || !isCollapsed);
  const canToggleSubItems = Boolean(subItems) && !isCurrentSection;

  return (
    <div className="admin-nav-group">
      <div className={`admin-nav-line${canToggleSubItems ? "" : " admin-nav-line-single"}`}>
        <NavLink to={item.to} end={item.to === "/admin"}>
          {item.label}
        </NavLink>
        {canToggleSubItems && (
          <button className="admin-subnav-toggle" type="button" aria-expanded={!isCollapsed} aria-label={`${isCollapsed ? "Razširi" : "Skrči"} ${item.label}`} onClick={onToggle}>
            {isCollapsed ? "+" : "-"}
          </button>
        )}
      </div>
      {showSubItems && (
        <div className="admin-subnav" aria-label={item.label}>
          {subItems?.map((subItem) => (
            <NavLink key={subItem.to} to={subItem.to} end={subItem.to === item.to} className={subItem.isCreate ? "create-link" : undefined}>
              {subItem.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const { requests } = usePrototypeRoomUseRequests();
  const { users: prototypeUsers } = usePrototypeUsers();
  const weekItems = getAdminDashboardWeekItems();
  const latestNews = getAllNewsForAdmin().slice(0, 5);
  const latestRoomRequests = requests.slice(-5).reverse();
  const incomingItems = getAdminDashboardIncomingItems();
  const latestMembers = prototypeUsers
    .filter((user) => user.group === "registriran uporabnik" && user.registeredAt)
    .sort((first, second) => (second.registeredAt || "").localeCompare(first.registeredAt || ""))
    .slice(0, 10);

  return (
    <>
      <AdminPlainTitle title="Nadzorna plošča" />
      <TwoColumn>
        <AdminPanel title="Dogodki in rezervacije">
          <DashboardList>
            {weekItems.map((item) => (
              <MiniLink key={item.id} to={item.to} title={item.title} meta={`${item.meta} · ${item.status}`} />
            ))}
          </DashboardList>
          <AdminPanelMoreLink to="/admin/prostori" label="Več dogodkov in rezervacij" />
        </AdminPanel>
        <AdminPanel title="Novice">
          <DashboardList>
            {latestNews.map((item) => (
              <MiniLink key={item.id} to={`/admin/novice/${item.slug}`} title={item.title} meta={`${formatDate(item.date)} · ${getNewsCategoryLabel(item)} · ${item.status}`} />
            ))}
          </DashboardList>
          <div className="admin-panel-footer">
            <Link className="button primary" to="/admin/novice/nov">
              Dodaj novico
            </Link>
            <Link className="button" to={{ pathname: "/admin/novice", search: "?tab=news" }}>
              Več novic
            </Link>
          </div>
        </AdminPanel>
      </TwoColumn>

      <TwoColumn>
        <AdminPanel title="Povpraševanja za prostore">
          <DashboardList>
            {latestRoomRequests.map((request) => {
              const space = request.relatedSpaceId ? getSpace(request.relatedSpaceId) : undefined;
              return <MiniLink key={request.id} to="/admin/prostori/zahteve" title={`${request.organisationName}: ${request.requestedUse}`} meta={`${space?.name || "prostor še ni določen"} · ${request.approvalStatus}`} />;
            })}
          </DashboardList>
          <AdminPanelMoreLink to="/admin/prostori/zahteve" label="Več povpraševanj" />
        </AdminPanel>
        <AdminPanel title="Prejeto">
          <DashboardList>
            {incomingItems.map((item) => (
              <MiniLink key={item.id} to={item.to} title={item.title} meta={item.meta} />
            ))}
          </DashboardList>
          <AdminPanelMoreLink to="/admin/obrazci" label="Več vnosov" />
        </AdminPanel>
      </TwoColumn>

      <AdminPanel title="Člani">
        <DashboardList>
          {latestMembers.map((user) => (
            <MiniLink key={user.id} to={`/admin/uporabniki/${user.id}`} title={user.name} meta={`${user.email} · ${user.organisation || "brez organizacije"} · ${formatDate(user.registeredAt || "")} · ${user.status}`} />
          ))}
        </DashboardList>
        <AdminPanelMoreLink to="/admin/uporabniki" label="Več uporabnikov in članov" />
      </AdminPanel>
    </>
  );
}

function AdminNewNews() {
  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Dodaj uredniško objavo</h1>
        </div>
        <Link className="button" to={{ pathname: "/admin/novice", search: "?tab=news" }}>
          Nazaj na novice
        </Link>
      </header>

      <AdminPanel title="Osnovni vnos">
        <div className="admin-event-form-grid">
          <label>
            Naslov
            <input name="title" placeholder="Naslov novice" />
          </label>
          <label>
            Slug
            <input name="slug" placeholder="naslov-novice" />
          </label>
          <label>
            Tip vsebine
            <select name="category" defaultValue="projektna novica">
              <option value="projektna novica">projektna novica</option>
              <option value="zgodba">zgodba</option>
              <option value="obvestilo">obvestilo</option>
              <option value="poziv">poziv</option>
              <option value="pr-obvestilo">PR obvestilo</option>
            </select>
          </label>
          <label>
            Datum objave
            <input name="date" type="date" />
          </label>
          <label>
            Avtor
            <input name="authorName" placeholder="Ime avtorja" />
          </label>
          <label>
            Status
            <select name="status" defaultValue="draft">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
          <label>
            Rok prijave
            <input name="callDeadline" type="date" />
          </label>
          <label className="full-field">
            Oznake
            <textarea name="tags" placeholder="Ena oznaka na vrstico" />
          </label>
          <label className="full-field">
            Povzetek
            <textarea name="excerpt" placeholder="Kratek povzetek za seznam novic" />
          </label>
          <label className="full-field">
            Vsebina
            <textarea className="tall-textarea" name="body" placeholder="Vsebina novice" />
          </label>
          <label className="full-field">
            Dodane fotke
            <textarea name="photoLabels" placeholder="Ena fotka na vrstico" />
          </label>
          <label className="full-field">
            Dodane povezave
            <textarea name="addedLinks" placeholder="Label | URL" />
          </label>
          <label>
            Pripeta forma
            <select name="attachedFormFlowId" defaultValue="">
              <option value="">Brez pripete forme</option>
              {formFlows.map((flow) => (
                <option key={flow.id} value={flow.id}>
                  {flow.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="inline-actions">
          <button className="button primary" type="button">
            Shrani osnutek
          </button>
        </div>
      </AdminPanel>
    </>
  );
}

function DashboardList({ children }: { children: ReactNode }) {
  return <div className="dashboard-list">{children}</div>;
}

function AdminPanelMoreLink({ to, label }: { to: string; label: string }) {
  return (
    <div className="admin-panel-footer">
      <Link className="button" to={to}>
        {label}
      </Link>
    </div>
  );
}

function getAdminDashboardWeekItems() {
  const allDates = [
    ...events.flatMap((event) => getEventOccurrences(event).map((occurrence) => occurrence.date)),
    ...bookings.map((booking) => booking.date)
  ].sort();
  const todayKey = prototypeTodayKey;
  const anchorDate = allDates.find((date) => date >= todayKey) || allDates[0] || todayKey;
  const weekStart = formatDateKey(getWeekStart(parseLocalDate(anchorDate)));
  const weekEnd = formatDateKey(addDays(parseLocalDate(weekStart), 6));
  const weekBookings = bookings
    .filter((booking) => booking.date >= weekStart && booking.date <= weekEnd)
    .map((booking) => {
      const space = getSpace(booking.spaceId);
      const relatedEvent = booking.source === "event"
        ? events.find((event) => event.title === booking.title && getEventOccurrences(event).some((occurrence) => occurrence.date === booking.date && occurrence.spaceId === booking.spaceId))
        : undefined;
      return {
        id: `booking-${booking.id}`,
        date: booking.date,
        time: `${booking.startTime}-${booking.endTime}`,
        title: booking.title,
        meta: `${formatShortWeekdayDate(booking.date)} · ${booking.startTime}-${booking.endTime} · ${space?.name || booking.spaceId}`,
        status: relatedEvent?.status || booking.status,
        to: relatedEvent ? `/admin/dogodki/${relatedEvent.slug}` : "/admin/prostori"
      };
    });
  const weekEventItems = events.flatMap((event) => getEventOccurrences(event)
    .filter((occurrence) => occurrence.date >= weekStart && occurrence.date <= weekEnd)
    .filter((occurrence) => !bookings.some((booking) => booking.source === "event" && booking.title === event.title && booking.date === occurrence.date && booking.spaceId === occurrence.spaceId))
    .map((occurrence) => ({
      id: `event-${event.id}-${occurrence.id}`,
      date: occurrence.date,
      time: `${occurrence.startTime}${occurrence.endTime ? `-${occurrence.endTime}` : ""}`,
      title: event.title,
      meta: `${formatShortWeekdayDate(occurrence.date)} · ${occurrence.startTime}${occurrence.endTime ? `-${occurrence.endTime}` : ""} · ${occurrence.locationName}`,
      status: event.status,
      to: `/admin/dogodki/${event.slug}`
    })));

  return [...weekBookings, ...weekEventItems].sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`));
}

function getAdminDashboardIncomingItems() {
  const submissionItems = submissions
    .filter((submission) => submission.flowId !== "space-inquiry")
    .map((submission) => {
      const flow = formFlows.find((item) => item.id === submission.flowId);
      const to = submission.flowId === "programme-interest" ? "/admin/programi/prijave" : submission.flowId === "contact" ? "/admin/obrazci/kontakt" : "/admin/obrazci";
      return {
        id: `submission-${submission.id}`,
        title: `${flow?.title || submission.topic}: ${submission.requester}`,
        meta: `${submission.topic} · ${submission.status}`,
        to
      };
    });
  const programmeItems = programmeApplications
    .slice()
    .sort((first, second) => second.submittedAt.localeCompare(first.submittedAt))
    .slice(0, 3)
    .map((application) => {
      const programme = getProgrammeById(application.programmeId);
      return {
        id: `programme-application-${application.id}`,
        title: `${programme?.title || "Program"}: ${application.participantName}`,
        meta: `${formatDateTime(application.submittedAt)} · ${application.status}`,
        to: `/admin/programi/prijave/${application.id}`
      };
    });

  return [
    ...programmeItems,
    ...submissionItems,
    {
      id: "advertising-form",
      title: "Oglaševanje",
      meta: "promocijska povpraševanja",
      to: "/admin/obrazci/oglasevanje"
    }
  ].slice(0, 6);
}

function AdminNews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeKind = parseEditorialContentKind(searchParams.get("tab"));
  const visibleItems = getEditorialItemsByKind(activeKind);

  const setActiveKind = (kind: EditorialContentKind) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", kind);
    setSearchParams(nextParams);
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Uredniške objave</h1>
          <p>En seznam za novice, pozive, obvestila in PR obvestila.</p>
        </div>
        <Link className="button primary" to="/admin/novice/nov">
          Dodaj objavo
        </Link>
      </header>

      <AdminPanel title="Seznam">
        <div className="admin-tab-row" role="tablist" aria-label="Tip uredniške objave">
          {editorialContentTabs.map((tab) => (
            <button key={tab.value} type="button" className={activeKind === tab.value ? "selected" : ""} role="tab" aria-selected={activeKind === tab.value} onClick={() => setActiveKind(tab.value)}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="table admin-editorial-table">
          <div className="table-row table-head">
            <strong>ID</strong>
            <span>Naslov</span>
            <span>Slug</span>
            <span>Datum objave</span>
            <span>Avtor</span>
          </div>
          {visibleItems.map((item) => (
            <NewsAdminRow key={item.id} item={item} />
          ))}
        </div>
      </AdminPanel>
    </>
  );
}

function AdminNewsDetail() {
  const { slug = "" } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const item = getNewsItem(slug);
  if (!item) return <NotFound backTo="/admin/novice" />;
  const attachedForm = item.attachedFormFlowId ? formFlows.find((flow) => flow.id === item.attachedFormFlowId) : undefined;
  const kind = getEditorialContentKind(item);

  const onSubmit = (formEvent: FormEvent) => {
    formEvent.preventDefault();
    setSaved(true);
    setIsEditing(false);
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>{item.title}</h1>
          <p className="meta">{getNewsCategoryLabel(item)} · {formatDate(item.date)} · {item.authorName || "brez avtorja"}</p>
        </div>
        <Link className="button" to={{ pathname: "/admin/novice", search: `?tab=${kind}` }}>
          Nazaj na seznam
        </Link>
      </header>

      {isEditing ? (
        <form className="admin-event-detail-grid" onSubmit={onSubmit}>
          <div className="admin-event-main">
            <AdminPanel title="Uredniška vsebina">
              <div className="admin-event-form-grid">
                <label>
                  Naslov
                  <input name="title" defaultValue={item.title} />
                </label>
                <label>
                  Kratek podnaslov
                  <input name="excerpt" defaultValue={item.excerpt} />
                </label>
                <label>
                  Avtor
                  <input name="authorName" defaultValue={item.authorName || ""} />
                </label>
                <label>
                  Datum objave
                  <input name="date" type="date" defaultValue={item.date} />
                </label>
                <label>
                  Rok prijave
                  <input name="callDeadline" type="date" defaultValue={item.callDeadline || ""} />
                </label>
                <label className="full-field">
                  Oznake
                  <textarea name="tags" defaultValue={item.tags?.join("\n") || ""} placeholder="Ena oznaka na vrstico" />
                </label>
                <label className="full-field">
                  Vsebina
                  <textarea className="tall-textarea" name="body" defaultValue={item.body} />
                </label>
              </div>
            </AdminPanel>

            <AdminPanel title="Dodane fotke">
              <label>
                Fotke
                <textarea name="photoLabels" defaultValue={item.photoLabels?.join("\n") || ""} placeholder="Ena fotka na vrstico" />
              </label>
            </AdminPanel>

            <AdminPanel title="Dodane povezave">
              <label>
                Povezave
                <textarea name="addedLinks" defaultValue={item.addedLinks?.map((link) => `${link.label} | ${link.url}`).join("\n") || ""} placeholder="Label | URL" />
              </label>
            </AdminPanel>

            <AdminPanel title="Pripeta forma">
              <label>
                Obrazec
                <select name="attachedFormFlowId" defaultValue={item.attachedFormFlowId || ""}>
                  <option value="">Brez pripete forme</option>
                  {formFlows.map((flow) => (
                    <option key={flow.id} value={flow.id}>
                      {flow.title}
                    </option>
                  ))}
                </select>
              </label>
              <p className="meta">Formo mora ekipa najprej ustvariti v modulu Forms.</p>
              <Link className="button" to="/admin/obrazci/nov">
                Ustvari novo formo
              </Link>
            </AdminPanel>
          </div>

          <aside className="admin-event-sidebar">
            <AdminPanel title="Status">
              <label>
                Tip vsebine
                <select name="category" defaultValue={item.category}>
                  <option value="projektna novica">projektna novica</option>
                  <option value="zgodba">zgodba</option>
                  <option value="poziv">poziv</option>
                  <option value="obvestilo">obvestilo</option>
                  <option value="pr-obvestilo">PR obvestilo</option>
                </select>
              </label>
              <label>
                Status
                <select name="status" defaultValue={item.status}>
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </label>
              <label>
                Slug
                <input name="slug" defaultValue={item.slug} />
              </label>
              <div className="inline-actions">
                <button className="button primary" type="submit">
                  Shrani
                </button>
                <button className="button" type="button" onClick={() => setIsEditing(false)}>
                  Prekliči
                </button>
              </div>
              {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
            </AdminPanel>
          </aside>
        </form>
      ) : (
        <div className="admin-event-detail-grid">
          <div className="admin-event-main">
            <AdminPanel title="Vsebina">
              <FactList
                items={[
                  ["ID", item.id],
                  ["Naslov", item.title],
                  ["Slug", item.slug],
                  ["Kratek podnaslov", item.excerpt],
                  ["Avtor", item.authorName || "brez avtorja"],
                  ["Datum objave", formatDate(item.date)]
                ]}
              />
              <h3>Vsebina</h3>
              <p>{item.body}</p>
            </AdminPanel>
            <AdminPanel title="Dodane fotke">
              {item.photoLabels?.length ? <Checklist items={item.photoLabels} /> : <EmptyState text="Ni dodanih fotk." />}
            </AdminPanel>
            <AdminPanel title="Dodane povezave">
              {item.addedLinks?.length ? (
                <ul className="admin-bullet-links">
                  {item.addedLinks.map((link) => (
                    <li key={link.label}>
                      <a href={link.url}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState text="Ni dodanih povezav." />
              )}
            </AdminPanel>
            <AdminPanel title="Pripeta forma">
              {attachedForm ? (
                <FactList items={[["Forma", attachedForm.title], ["ID", attachedForm.id], ["Javna pot", attachedForm.publicRoute], ["Owner", attachedForm.owner]]} />
              ) : (
                <EmptyState text="Na ta element ni pripeta forma." />
              )}
            </AdminPanel>
          </div>

          <aside className="admin-event-sidebar">
            <AdminPanel title="Status">
              <FactList items={[["Tip", getNewsCategoryLabel(item)], ["Status", item.status], ["Javno", item.status === "published" ? "da" : "ne"]]} />
              <button className="button primary" type="button" onClick={() => setIsEditing(true)}>
                Uredi
              </button>
              <Link className="button" to={`/novice/${item.slug}`}>
                Predogled javne strani
              </Link>
            </AdminPanel>
          </aside>
        </div>
      )}
    </>
  );
}

function AdminEvents() {
  const { prototypeEvents } = usePrototypeEvents();
  const [query, setQuery] = useState("");
  const [ticketFilter, setTicketFilter] = useState("all");
  const filteredEvents = prototypeEvents.filter((event) => {
    const searchMatch = `${event.title} ${event.locationName}`.toLocaleLowerCase("sl").includes(query.toLocaleLowerCase("sl"));
    if (!searchMatch) return false;
    const entryMode = getEventEntryMode(event);
    if (ticketFilter === "tickets") return entryMode === "karte";
    if (ticketFilter === "free") return (event.ticketPriceFrom ?? 0) === 0 && entryMode !== "brez prijave";
    if (ticketFilter === "no-entry") return entryMode === "brez prijave";
    if (ticketFilter === "sold-out") return event.ticketSalesStatus === "razprodano";
    if (ticketFilter === "not-set") return !event.ticketSalesStatus || event.ticketSalesStatus === "ni nastavljeno";
    return true;
  });

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Dogodki</h1>
          <p className="meta">Dogodki, termini, objava in nastavitve prodaje.</p>
        </div>
        <div className="inline-actions">
          <Link className="button" to="/admin/dogodki/karte">Izdane karte</Link>
          <Link className="button primary" to="/admin/dogodki/nov">Nov dogodek</Link>
        </div>
      </header>
      <AdminPanel title="Seznam">
        <div className="admin-list-controls">
          <label>
            Iskanje
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Dogodek ali prostor" />
          </label>
          <label>
            Vstop in prodaja
            <select value={ticketFilter} onChange={(event) => setTicketFilter(event.target.value)}>
              <option value="all">Vsi dogodki</option>
              <option value="tickets">S kartami</option>
              <option value="free">Brezplačni s prijavo</option>
              <option value="no-entry">Brez prijave</option>
              <option value="sold-out">Razprodani</option>
              <option value="not-set">Prodaja ni nastavljena</option>
            </select>
          </label>
        </div>
        <div className="table admin-events-table">
          <div className="table-row table-head">
            <strong>Dogodek</strong><strong>Datum</strong><strong>Prostor</strong><strong>Rezervacije</strong><strong>Objava</strong><strong>Vstop</strong><strong>Prodaja</strong><strong>Prodano</strong>
          </div>
          {filteredEvents.map((event) => (
            <EventAdminRow key={event.id} event={event} />
          ))}
          {!filteredEvents.length ? <EmptyState text="Noben dogodek ne ustreza izbranim filtrom." /> : null}
        </div>
      </AdminPanel>
    </>
  );
}

function AdminIssuedTickets() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [eventId, setEventId] = useState(searchParams.get("event") || "all");
  const [status, setStatus] = useState("all");
  const filteredTickets = issuedTickets.filter((ticket) => {
    const event = getEventById(ticket.eventId);
    const searchMatch = `${ticket.code} ${ticket.holderName} ${ticket.holderEmail} ${ticket.orderId} ${event?.title || ""}`.toLocaleLowerCase("sl").includes(query.toLocaleLowerCase("sl"));
    return searchMatch && (eventId === "all" || ticket.eventId === eventId) && (status === "all" || ticket.status === status);
  });
  const ticketEvents = events.filter((event) => issuedTickets.some((ticket) => ticket.eventId === event.id));

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Izdane karte</h1>
          <p className="meta">Posamezne prodane, rezervirane in brezplačno izdane karte.</p>
        </div>
        <Link className="button" to="/admin/dogodki">Nazaj na dogodke</Link>
      </header>

      <div className="ticket-summary-strip">
        <div><span>Vseh kart</span><strong>{issuedTickets.length}</strong></div>
        <div><span>Veljavne</span><strong>{issuedTickets.filter((ticket) => ticket.status === "veljavna").length}</strong></div>
        <div><span>Uporabljene</span><strong>{issuedTickets.filter((ticket) => ticket.status === "uporabljena").length}</strong></div>
        <div><span>Prihodek</span><strong>{formatCurrency(issuedTickets.filter((ticket) => ticket.paymentStatus === "plačano").reduce((sum, ticket) => sum + ticket.price, 0))}</strong></div>
      </div>

      <AdminPanel title="Evidenca kart">
        <div className="admin-list-controls ticket-list-controls">
          <label>Iskanje<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Koda, imetnik, e-pošta ali naročilo" /></label>
          <label>Dogodek<select value={eventId} onChange={(event) => setEventId(event.target.value)}><option value="all">Vsi dogodki</option>{ticketEvents.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></label>
          <label>Stanje<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Vsa stanja</option><option value="veljavna">Veljavna</option><option value="uporabljena">Uporabljena</option><option value="preklicana">Preklicana</option><option value="povrnjena">Povrnjena</option></select></label>
        </div>
        <div className="table admin-ticket-table">
          <div className="table-row table-head"><strong>Koda</strong><strong>Imetnik</strong><strong>Dogodek / termin</strong><strong>Vrsta</strong><strong>Stanje</strong><strong>Plačilo</strong><strong>Vstop</strong></div>
          {filteredTickets.map((ticket) => <IssuedTicketRow key={ticket.id} ticket={ticket} />)}
          {!filteredTickets.length ? <EmptyState text="Nobena karta ne ustreza izbranim filtrom." /> : null}
        </div>
      </AdminPanel>
    </>
  );
}

function IssuedTicketRow({ ticket }: { ticket: IssuedTicket }) {
  const event = getEventById(ticket.eventId);
  const occurrence = event?.occurrences?.find((item) => item.id === ticket.occurrenceId);
  return (
    <Link className="table-row admin-ticket-row" to={`/admin/dogodki/karte/${ticket.id}`}>
      <strong>{ticket.code}</strong>
      <span>{ticket.holderName}</span>
      <span>{event?.title || ticket.eventId}{occurrence ? ` · ${formatDate(occurrence.date)}` : ""}</span>
      <span>{ticket.ticketType}</span>
      <span className={`ticket-status ticket-status-${ticket.status}`}>{ticket.status}</span>
      <span>{ticket.paymentStatus}</span>
      <span>{ticket.checkedInAt ? formatDateTime(ticket.checkedInAt) : "še ni uporabljena"}</span>
    </Link>
  );
}

function AdminIssuedTicketDetail() {
  const { ticketId = "" } = useParams();
  const ticket = getIssuedTicket(ticketId);
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<IssuedTicket["status"]>(ticket?.status || "veljavna");
  if (!ticket) return <NotFound backTo="/admin/dogodki/karte" />;
  const event = getEventById(ticket.eventId);
  const occurrence = event?.occurrences?.find((item) => item.id === ticket.occurrenceId);
  const eventDate = occurrence?.date || event?.date;
  const eventTime = occurrence ? `${occurrence.startTime}${occurrence.endTime ? `-${occurrence.endTime}` : ""}` : event ? formatEventTime(event) : "";
  const eventPlace = occurrence?.locationName || event?.locationName || "ni podatka";

  return (
    <>
      <header className="admin-list-head">
        <div><h1>{ticket.code}</h1><p className="meta">{ticket.ticketType} · {status}</p></div>
        <Link className="button" to="/admin/dogodki/karte">Nazaj na izdane karte</Link>
      </header>
      <div className="admin-event-detail-grid">
        <div className="admin-event-main">
          <AdminPanel title="Karta">
            <div className="ticket-code-preview" aria-label={`Koda karte ${ticket.code}`}><span>DOM</span><strong>{ticket.code}</strong><i aria-hidden="true" /></div>
            <FactList items={[["Imetnik", ticket.holderName], ["E-pošta", ticket.holderEmail], ["Vrsta karte", ticket.ticketType], ["Cena", ticket.price ? formatCurrency(ticket.price) : "brezplačno"], ["Naročilo", ticket.orderId]]} />
          </AdminPanel>
          <AdminPanel title="Dogodek in veljavnost">
            <FactList items={[["Dogodek", event?.title || ticket.eventId], ["Termin", eventDate ? `${formatDate(eventDate)} · ${eventTime}` : "ni podatka"], ["Prostor", eventPlace], ["Izdana", formatDateTime(ticket.issuedAt)], ["Ponudnik", ticket.provider], ["Referenca ponudnika", ticket.providerReference || "lastna evidenca"]]} />
            {event ? <Link className="button" to={`/admin/dogodki/${event.slug}`}>Odpri dogodek</Link> : null}
          </AdminPanel>
          <AdminPanel title="Zgodovina">
            <div className="admin-linked-list">
              <MiniItem title="Karta izdana" meta={formatDateTime(ticket.issuedAt)} />
              {ticket.checkedInAt ? <MiniItem title="Vstop evidentiran" meta={formatDateTime(ticket.checkedInAt)} /> : null}
              {status !== ticket.status ? <MiniItem title={`Novo stanje: ${status}`} meta="Sprememba v tej prototipni seji" /> : null}
            </div>
          </AdminPanel>
        </div>
        <aside className="admin-event-sidebar">
          <AdminPanel title="Stanje">
            <label>Stanje karte<select value={status} onChange={(event) => { setStatus(event.target.value as IssuedTicket["status"]); setSaved(false); }}><option value="veljavna">veljavna</option><option value="uporabljena">uporabljena</option><option value="preklicana">preklicana</option><option value="povrnjena">povrnjena</option></select></label>
            <FactList items={[["Plačilo", ticket.paymentStatus], ["Check-in", ticket.checkedInAt ? formatDateTime(ticket.checkedInAt) : "še ni uporabljen"]]} />
            <button className="button primary" type="button" onClick={() => setSaved(true)}>Shrani</button>
            <button className="button" type="button">Ponovno pošlji karto</button>
            {saved ? <p className="save-state">Sprememba je označena kot shranjena v prototipu.</p> : null}
          </AdminPanel>
        </aside>
      </div>
    </>
  );
}

function AdminEventDetail() {
  const { slug = "" } = useParams();
  const { prototypeEvents } = usePrototypeEvents();
  const { prototypeBookings, updateBooking } = usePrototypeBookings();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const event = prototypeEvents.find((item) => item.slug === slug);
  if (!event) return <NotFound backTo="/admin/dogodki" />;
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState(event.equipmentIds || []);
  const [savedEquipmentIds, setSavedEquipmentIds] = useState(event.equipmentIds || []);
  const [isMultiDay, setIsMultiDay] = useState(Boolean(event.endDate));
  const [savedIsMultiDay, setSavedIsMultiDay] = useState(Boolean(event.endDate));
  const [endDate, setEndDate] = useState(event.endDate || event.date);
  const [savedEndDate, setSavedEndDate] = useState(event.endDate || event.date);
  const [bookingIdToLink, setBookingIdToLink] = useState("");
  const space = event.spaceId ? getSpace(event.spaceId) : undefined;
  const programme = event.relatedProgrammeId ? programmes.find((item) => item.id === event.relatedProgrammeId) : undefined;
  const eventBookings = prototypeBookings.filter((booking) => booking.relatedEventId === event.id || (!booking.relatedEventId && booking.source === "event" && booking.title === event.title));
  const availableBookings = prototypeBookings.filter((booking) => !booking.relatedEventId && !eventBookings.some((linkedBooking) => linkedBooking.id === booking.id));
  const eventTickets = issuedTickets.filter((ticket) => ticket.eventId === event.id);
  const publicDescription = getEventPublicDescription(event);
  const selectedEquipment = equipmentItems.filter((item) => savedEquipmentIds.includes(item.id));

  const onSubmit = (formEvent: FormEvent) => {
    formEvent.preventDefault();
    setSavedEquipmentIds(selectedEquipmentIds);
    setSavedIsMultiDay(isMultiDay);
    setSavedEndDate(endDate);
    setSaved(true);
    setIsEditing(false);
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>{event.title}</h1>
          <p className="meta">{formatEventDateLabel(event)} · {event.occurrences?.length ? `${event.occurrences.length} terminov` : formatEventTime(event)} · {event.locationName}</p>
        </div>
        <Link className="button" to="/admin/dogodki">
          Nazaj na dogodke
        </Link>
      </header>

      {isEditing ? (
        <form className="admin-event-detail-grid" onSubmit={onSubmit}>
          <div className="admin-event-main">
            <AdminPanel title="Javna vsebina">
              <div className="admin-event-form-grid">
                <label>
                  Naslov
                  <input name="title" defaultValue={event.title} />
                </label>
                <label>
                  Slug
                  <input name="slug" defaultValue={event.slug} />
                </label>
                <label>
                  Tip
                  <input name="type" defaultValue={event.type} />
                </label>
                <label>
                  Povzetek
                  <textarea name="summary" defaultValue={event.shortDescription} />
                </label>
                <label className="full-field">
                  Headline
                  <textarea name="headline" defaultValue={event.headline || ""} />
                </label>
                <label className="full-field">
                  Javno obvestilo
                  <textarea name="publicNotice" defaultValue={event.publicNotice || ""} placeholder="npr. Dogodek je prestavljen ..." />
                </label>
                <label className="full-field">
                  Oznake
                  <input name="tags" defaultValue={event.tags?.join(", ") || ""} placeholder="delavnica, skupnost, mladi ..." />
                </label>
              </div>
              <h3>Opis</h3>
              <label>
                Daljši javni opis
                <textarea className="tall-textarea" name="publicDescription" defaultValue={publicDescription.join("\n\n")} />
              </label>
              <div className="inline-actions">
                <Link className="button" to={`/dogodki/${event.slug}`}>
                  Predogled javne strani
                </Link>
              </div>
            </AdminPanel>

            <AdminPanel title="Rezervacije prostora">
              <h3>Poveži obstoječo rezervacijo</h3>
              <div className="inline-actions">
                <select aria-label="Izberi rezervacijo za povezavo" value={bookingIdToLink} onChange={(changeEvent) => setBookingIdToLink(changeEvent.target.value)}>
                  <option value="">Izberi rezervacijo</option>
                  {availableBookings.map((booking) => {
                    const bookingSpace = getSpace(booking.spaceId);
                    return <option key={booking.id} value={booking.id}>{formatDate(booking.date)} · {booking.startTime}-{booking.endTime} · {bookingSpace?.name || booking.spaceId} · {booking.title}</option>;
                  })}
                </select>
                <button className="button" type="button" disabled={!bookingIdToLink} onClick={() => {
                  updateBooking(bookingIdToLink, { relatedEventId: event.id, source: "event" });
                  setBookingIdToLink("");
                  setSaved(true);
                }}>
                  Poveži rezervacijo
                </button>
              </div>
              <h3>Povezane rezervacije</h3>
              {eventBookings.length ? (
                <div className="admin-linked-list">
                  {eventBookings.map((booking) => {
                    const bookingSpace = getSpace(booking.spaceId);
                    return <MiniItem key={booking.id} title={`${bookingSpace?.name || booking.spaceId} · ${booking.startTime}-${booking.endTime}`} meta={`${formatDate(booking.date)} · ${booking.status}${booking.note ? ` · ${booking.note}` : ""}`} />;
                  })}
                </div>
              ) : (
                <EmptyState text="Dogodek še nima povezanih rezervacij prostora." />
              )}
            </AdminPanel>

            <AdminPanel title="Vstopnice in prijave">
              <div className="admin-event-form-grid">
                <label>
                  Način vstopa
                  <select name="entryMode" defaultValue={getEventEntryMode(event)}>
                    <option value="brez prijave">brez prijave</option>
                    <option value="prijava">prijava</option>
                    <option value="karte">karte</option>
                  </select>
                </label>
                <label>
                  Stanje prodaje
                  <select name="ticketSalesStatus" defaultValue={event.ticketSalesStatus || "ni nastavljeno"}>
                    <option value="ni nastavljeno">ni nastavljeno</option><option value="v pripravi">v pripravi</option><option value="v prodaji">v prodaji</option><option value="razprodano">razprodano</option><option value="zaključeno">zaključeno</option>
                  </select>
                </label>
                <label>
                  Kapaciteta
                  <input name="ticketCapacity" type="number" min="0" defaultValue={event.ticketCapacity || ""} />
                </label>
                <label>
                  Cena od
                  <input name="ticketPriceFrom" type="number" min="0" step="0.01" defaultValue={event.ticketPriceFrom ?? ""} />
                </label>
                <label>
                  Cena do
                  <input name="ticketPriceTo" type="number" min="0" step="0.01" defaultValue={event.ticketPriceTo ?? ""} />
                </label>
                <label>
                  Sistem
                  <select name="ticketProvider" defaultValue={event.ticketProvider || "lastni modul"}><option value="lastni modul">lastni modul</option><option value="Eventim">Eventim</option><option value="Olaii">Olaii</option></select>
                </label>
              </div>
              <div className="inline-actions">
                <Link className="button" to={`/admin/dogodki/karte?event=${event.id}`}>Poglej izdane karte ({eventTickets.length})</Link>
              </div>
            </AdminPanel>

            <AdminPanel title="Organizacija">
              <div className="admin-event-form-grid">
                <label>
                  Organizator
                  <input name="organiser" defaultValue={event.organiser} />
                </label>
                <label>
                  Kontakt
                  <input name="organiserContact" defaultValue={event.organiserContact || ""} />
                </label>
                <label>
                  DOM owner
                  <input name="domOwner" defaultValue={event.domOwner || ""} />
                </label>
                <label>
                  DOM ekipa
                  <input name="domTeam" defaultValue={event.domTeam?.join(", ") || ""} />
                </label>
                <label>
                  Soorganizatorji
                  <input name="coOrganisers" defaultValue={event.coOrganisers?.join(", ") || ""} />
                </label>
                <label>
                  Partnerji
                  <input name="partners" defaultValue={event.partners?.join(", ") || ""} />
                </label>
              </div>
            </AdminPanel>

            <AdminPanel title="Datoteke">
              <h3>Javne priponke</h3>
              {event.publicFiles?.length ? (
                <ul className="admin-bullet-links">
                  {event.publicFiles.map((file) => (
                    <li key={file.label}>
                      <a href={file.url}>{file.label}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState text="Ni javnih priponk." />
              )}
              <h3>Interne datoteke</h3>
              {event.internalFiles?.length ? (
                <div className="admin-linked-list">
                  {event.internalFiles.map((file) => (
                    <MiniItem key={file.label} title={file.label} meta={file.status} />
                  ))}
                </div>
              ) : (
                <EmptyState text="Ni internih datotek." />
              )}
            </AdminPanel>

            <AdminPanel title="Produkcija">
              <h3>Oprema za dogodek</h3>
              <div className="equipment-selection-table" role="table" aria-label="Oprema za dogodek">
                <div className="equipment-selection-row equipment-selection-head" role="row">
                  <strong role="columnheader">Izberi</strong><strong role="columnheader">Oprema</strong><strong role="columnheader">Prostor</strong><strong role="columnheader">Stanje</strong>
                </div>
                {equipmentItems.map((item) => {
                  const itemSpace = getSpace(item.spaceId);
                  return (
                    <label className="equipment-selection-row" role="row" key={item.id}>
                      <span role="cell"><input type="checkbox" name="equipmentIds" value={item.id} checked={selectedEquipmentIds.includes(item.id)} onChange={(changeEvent) => setSelectedEquipmentIds((current) => changeEvent.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} /></span>
                      <strong role="cell">{item.name}</strong>
                      <span role="cell">{itemSpace?.name || "brez prostora"}</span>
                      <span role="cell" className={`equipment-status equipment-status-${item.status.replaceAll(" ", "-")}`}>{item.status}</span>
                    </label>
                  );
                })}
              </div>
              <label>
                Potrebne storitve
                <input name="requiredServices" defaultValue={event.requiredServices?.join(", ") || ""} />
              </label>
              <label>
                Produkcijske opombe
                <textarea name="productionNotes" defaultValue={event.productionNotes || ""} />
              </label>
            </AdminPanel>

            <AdminPanel title="Info ekrani">
              <label>
                Status info ekranov
                <input name="signageStatus" defaultValue={event.signageStatus || ""} />
              </label>
              <p className="meta">Vir vsebine: event record. Objavljen dogodek se lahko uporabi na info ekranih.</p>
              <Link className="button" to="/admin/signage">
                Odpri info ekrane
              </Link>
            </AdminPanel>

            <AdminPanel title="Poročanje in reference">
              <div className="admin-event-form-grid">
                <label>
                  Poročilo
                  <input name="reportStatus" defaultValue={event.reportStatus || ""} />
                </label>
                <label>
                  Task reference
                  <input name="taskRefs" defaultValue={event.taskRefs?.join(", ") || ""} />
                </label>
                <label>
                  Finance reference
                  <input name="financeRefs" defaultValue={event.financeRefs?.join(", ") || ""} />
                </label>
              </div>
              <p className="meta">Poročila, taski in finance ostanejo ločeni moduli oziroma integracije.</p>
            </AdminPanel>
          </div>

          <aside className="admin-event-sidebar">
            <AdminPanel title="Objava">
              <label>
                Status
                <select name="status" defaultValue={event.status}>
                  <option value="draft">draft</option>
                  <option value="in coordination">in coordination</option>
                  <option value="offer">offer</option>
                  <option value="confirmed">confirmed</option>
                  <option value="published">published</option>
                  <option value="cancelled">cancelled</option>
                  <option value="completed">completed</option>
                  <option value="archived">archived</option>
                </select>
              </label>
              <label className="checkbox-field">
                <input name="featured" type="checkbox" defaultChecked={event.featured} />
                Izpostavljeno
              </label>
              <p className="meta">Javno viden: {event.status === "published" ? "da" : "ne"}</p>
              <div className="inline-actions">
                <button className="button primary" type="submit">
                  Shrani
                </button>
                <button className="button" type="button" onClick={() => setIsEditing(false)}>
                  Prekliči
                </button>
              </div>
              {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
            </AdminPanel>
          </aside>
        </form>
      ) : (
        <div className="admin-event-detail-grid">
          <div className="admin-event-main">
            <AdminPanel title="Javna vsebina">
              <FactList
                items={[
                  ["Status", event.status],
                  ["Naslov", event.title],
                  ["Slug", event.slug],
                  ["Tip", event.type],
                  ["Povzetek", event.shortDescription],
                  ["Headline", event.headline || "ni vpisano"]
                ]}
              />
              {event.publicNotice && (
                <div className="save-state">
                  <strong>Javno obvestilo</strong>
                  <p>{event.publicNotice}</p>
                </div>
              )}
              {event.tags?.length ? <TagRow tags={event.tags} /> : <EmptyState text="Dogodek še nima javnih oznak." />}
              <h3>Opis</h3>
              {publicDescription.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="inline-actions">
                <Link className="button" to={`/dogodki/${event.slug}`}>
                  Predogled javne strani
                </Link>
              </div>
            </AdminPanel>

            <AdminPanel title="Rezervacije prostora">
              {eventBookings.length ? (
                <div className="admin-linked-list">
                  {eventBookings.map((booking) => {
                    const bookingSpace = getSpace(booking.spaceId);
                    return <MiniItem key={booking.id} title={`${bookingSpace?.name || booking.spaceId} · ${booking.startTime}-${booking.endTime}`} meta={`${formatDate(booking.date)} · ${booking.status}${booking.note ? ` · ${booking.note}` : ""}`} />;
                  })}
                </div>
              ) : (
                <EmptyState text="Dogodek še nima povezanih rezervacij prostora." />
              )}
            </AdminPanel>

            <AdminPanel title="Vstopnice in prijave">
              <FactList
                items={[
                  ["Način vstopa", getEventEntryMode(event)],
                  ["Stanje prodaje", event.ticketSalesStatus || "ni nastavljeno"],
                  ["Kapaciteta", event.ticketCapacity?.toString() || "ni nastavljena"],
                  ["Cena", formatEventTicketPrice(event)],
                  ["Izdane karte", eventTickets.length.toString()],
                  ["Sistem", event.ticketProvider || "ni nastavljen"]
                ]}
              />
              <Link className="button" to={`/admin/dogodki/karte?event=${event.id}`}>Poglej izdane karte</Link>
            </AdminPanel>

            <AdminPanel title="Organizacija">
              <FactList
                items={[
                  ["Organizator", event.organiser],
                  ["Kontakt", event.organiserContact || "ni vpisano"],
                  ["DOM owner", event.domOwner || "ni vpisano"],
                  ["DOM ekipa", event.domTeam?.join(", ") || "ni vpisano"]
                ]}
              />
              <h3>Soorganizatorji</h3>
              {event.coOrganisers?.length ? (
                <div className="admin-linked-list">
                  {event.coOrganisers.map((item) => (
                    <MiniItem key={item} title={item} meta="soorganizator" />
                  ))}
                </div>
              ) : (
                <EmptyState text="Ni vpisanih soorganizatorjev." />
              )}
              <h3>Partnerji</h3>
              {event.partners?.length ? (
                <div className="admin-linked-list">
                  {event.partners.map((item) => (
                    <MiniItem key={item} title={item} meta="partner" />
                  ))}
                </div>
              ) : (
                <EmptyState text="Ni vpisanih partnerjev." />
              )}
            </AdminPanel>

            <AdminPanel title="Datoteke">
              <h3>Javne priponke</h3>
              {event.publicFiles?.length ? (
                <ul className="admin-bullet-links">
                  {event.publicFiles.map((file) => (
                    <li key={file.label}>
                      <a href={file.url}>{file.label}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState text="Ni javnih priponk." />
              )}
              <h3>Interne datoteke</h3>
              {event.internalFiles?.length ? (
                <div className="admin-linked-list">
                  {event.internalFiles.map((file) => (
                    <MiniItem key={file.label} title={file.label} meta={file.status} />
                  ))}
                </div>
              ) : (
                <EmptyState text="Ni internih datotek." />
              )}
            </AdminPanel>

            <AdminPanel title="Produkcija">
              <h3>Oprema za dogodek</h3>
              {selectedEquipment.length ? (
                <div className="admin-linked-list">
                  {selectedEquipment.map((item) => (
                    <MiniItem key={item.id} title={item.name} meta={`${getSpace(item.spaceId)?.name || "brez prostora"} · ${item.status}`} />
                  ))}
                </div>
              ) : (
                <EmptyState text="Za dogodek ni izbrane opreme." />
              )}
              {event.requiredServices?.length ? <TagRow tags={event.requiredServices} /> : <EmptyState text="Ni označenih potrebnih storitev." />}
              <p>{event.productionNotes || "Produkcijske opombe še niso vpisane."}</p>
            </AdminPanel>

            <AdminPanel title="Info ekrani">
              <FactList
                items={[
                  ["Status info ekranov", event.signageStatus || "ni nastavljeno"],
                  ["Vir vsebine", "event record"]
                ]}
              />
              <p className="meta">Objavljen dogodek se lahko uporabi na info ekranih.</p>
              <Link className="button" to="/admin/signage">
                Odpri info ekrane
              </Link>
            </AdminPanel>

            <AdminPanel title="Poročanje in reference">
              <FactList
                items={[
                  ["Poročilo", event.reportStatus || "ni vpisano"],
                  ["Task reference", event.taskRefs?.join(", ") || "ni povezav"],
                  ["Finance reference", event.financeRefs?.join(", ") || "ni povezav"]
                ]}
              />
              <p className="meta">Poročila, taski in finance ostanejo ločeni moduli oziroma integracije.</p>
            </AdminPanel>
          </div>

          <aside className="admin-event-sidebar">
            <AdminPanel title="Objava">
              <FactList
                items={[
                  ["Status", event.status],
                  ["Javno viden", event.status === "published" ? "da" : "ne"],
                  ["Izpostavljeno", event.featured ? "da" : "ne"]
                ]}
              />
              <button className="button primary" type="button" onClick={() => setIsEditing(true)}>
                Uredi
              </button>
              {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
            </AdminPanel>
          </aside>
        </div>
      )}
    </>
  );
}

function AdminNewEvent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addEvent } = usePrototypeEvents();
  const { applications } = usePrototypeProgrammeApplications();
  const application = applications.find((item) => item.id === searchParams.get("application"));
  const programme = application ? getProgrammeById(application.programmeId) : undefined;
  const defaultSpace = spaces[0]?.id || "";

  const onSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    const title = String(form.get("title") || "Nov dogodek").trim();
    const spaceId = String(form.get("spaceId") || "");
    const space = getSpace(spaceId);
    const id = `event-${Date.now().toString(36)}`;
    const slug = `${title.toLocaleLowerCase("sl").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${id.slice(-4)}`;
    const newEvent: EventItem = {
      id,
      slug,
      title,
      date: String(form.get("date") || ""),
      startTime: String(form.get("startTime") || ""),
      endTime: String(form.get("endTime") || "") || undefined,
      type: String(form.get("type") || "drug dogodek"),
      audience: ["javnost"],
      spaceId: space?.id,
      locationName: space?.name || "Prostor po dogovoru",
      organiser: application?.organisationName || application?.participantName || "DOM",
      shortDescription: String(form.get("shortDescription") || "Dogodek v pripravi."),
      description: String(form.get("shortDescription") || "Dogodek v pripravi."),
      registrationType: "brez prijave",
      status: "in coordination",
      relatedProgrammeId: application?.programmeId
    };
    addEvent(newEvent);
    navigate(`/admin/dogodki/${slug}`);
  };

  return (
    <>
      <header className="admin-list-head">
        <h1>Nov dogodek</h1>
        <Link className="button" to="/admin/dogodki">
          Nazaj na dogodke
        </Link>
      </header>
      <form className="admin-event-detail-grid" onSubmit={onSubmit}>
        <div className="admin-event-main">
          {application ? <AdminPanel title="Povezava s prijavo"><FactList items={[["Prijavitelj", application.participantName], ["Program", programme?.title || application.programmeId], ["Organizator", application.organisationName || application.participantName]]} /></AdminPanel> : null}
          <AdminPanel title="Osnovni vnos">
            <div className="admin-event-form-grid">
              <label>Naslov dogodka<input required name="title" defaultValue={application ? `Dogodek: ${application.participantName}` : ""} /></label>
              <label>Tip dogodka<input name="type" defaultValue="drug dogodek" /></label>
              <label>Datum<input required name="date" type="date" /></label>
              <label>Začetek<input required name="startTime" type="time" /></label>
              <label>Konec<input name="endTime" type="time" /></label>
              <label>Prostor / rezervacija<select required name="spaceId" defaultValue={defaultSpace}>{spaces.map((space) => <option key={space.id} value={space.id}>{space.name}</option>)}</select></label>
              <label className="full-field">Kratek opis<textarea name="shortDescription" defaultValue={application?.submittedData || ""} /></label>
            </div>
            <p className="meta">Izbrani prostor in termin sta začetni zapis rezervacije za ta dogodek. Nadaljnje operativne rezervacije se urejajo na detajlu dogodka.</p>
          </AdminPanel>
        </div>
        <aside className="admin-event-sidebar"><AdminPanel title="Dogodek"><p className="meta">Nov dogodek se ustvari v statusu »v usklajevanju« in se poveže s prijavo.</p><button className="button primary" type="submit">Ustvari dogodek</button></AdminPanel></aside>
      </form>
    </>
  );
}

function AdminForms() {
  return (
    <Routes>
      <Route index element={<AdminFormsOverview />} />
      <Route path="kontakt" element={<AdminFormDetail title="Kontakt" text="Urejanje kontaktnega obrazca in pregled oddaj za kontakt." />} />
      <Route path="oglasevanje" element={<AdminFormDetail title="Oglaševanje" text="Urejanje obrazca za oglaševanje in promocijske dogovore." />} />
      <Route path="partnerstvo" element={<AdminFormDetail title="Partnerstvo" text="Urejanje obrazca za partnerska povpraševanja." />} />
      <Route path="nov" element={<AdminNewForm />} />
      <Route path="*" element={<NotFound backTo="/admin/obrazci" />} />
    </Routes>
  );
}

function AdminFormsOverview() {
  return (
    <>
      <AdminHeader title="Obrazci" text="Tokovi in oddaje za kontakt, oglaševanje, partnerstva in zanimanje za programe." />
      <TwoColumn>
        <AdminPanel title="Tokovi">
          <MiniItem title="Kontakt" meta="kontaktna vprašanja · urednik" />
          <MiniItem title="Oglaševanje" meta="promocijska povpraševanja · urednik" />
          <MiniItem title="Partnerstvo" meta="partnerska povpraševanja · urednik" />
          <Link className="button" to="/admin/obrazci/nov">
            Nov obrazec
          </Link>
        </AdminPanel>
        <AdminPanel title="Oddaje">
          {submissions.map((submission) => (
            <MiniItem key={submission.id} title={`${submission.topic}: ${submission.requester}`} meta={`${submission.email} · ${submission.status}`} />
          ))}
        </AdminPanel>
      </TwoColumn>
    </>
  );
}

function AdminRoomUseFlow() {
  const { requests, updateRequest } = usePrototypeRoomUseRequests();
  return (
    <>
      <AdminHeader title="Uporaba prostora" text="Delovna stran za javni tok uporabe prostora: oddaje, odobritev in predaja potrjenih zahtev v zunanji koledar." />
      <RoomUseRequestDesk requests={requests} title="Zahteve za uporabo prostora" onUpdateRequest={updateRequest} />
    </>
  );
}

function AdminFormDetail({ title, text }: { title: string; text: string }) {
  return (
    <>
      <AdminHeader title={title} text={text} />
      <TwoColumn>
        <AdminPanel title="Nastavitve toka">
          <FactList items={[["Status", "aktiven"], ["Routing", "urednik"], ["Oddaje", "prikažejo se v inboxu obrazca"]]} />
        </AdminPanel>
        <AdminPanel title="Zadnje oddaje">
          {submissions.slice(0, 2).map((submission) => (
            <MiniItem key={submission.id} title={`${submission.topic}: ${submission.requester}`} meta={`${submission.email} · ${submission.status}`} />
          ))}
        </AdminPanel>
      </TwoColumn>
    </>
  );
}

function AdminNewForm() {
  return (
    <>
      <AdminHeader title="Nov obrazec" text="Urejevalnik za pripravo novega javnega toka. To ni seznam oddaj ali delovna stran obstoječega toka." />
      <AdminEditor title="Urejevalnik novega toka" fields={["Javni naslov", "Uvod", "Koraki", "Polja", "Routing", "Potrditveno sporočilo"]} />
    </>
  );
}

function AdminSpacesBookings() {
  return (
    <Routes>
      <Route index element={<AdminReservations />} />
      <Route path="rezervacije" element={<AdminBookingsList />} />
      <Route path="sobe" element={<AdminRoomsCatalogue />} />
      <Route path="sobe/:spaceId/uredi" element={<AdminSpaceEdit />} />
      <Route path="sobe/:spaceId" element={<AdminSpaceDetail />} />
      <Route path="oprema" element={<AdminEquipmentList />} />
      <Route path="oprema/:equipmentId" element={<AdminEquipmentDetail />} />
      <Route path="zahteve" element={<AdminSpaceUseRequests />} />
    </Routes>
  );
}

function AdminRoomsCatalogue() {
  const { requests } = usePrototypeRoomUseRequests();
  const [publicationFilter, setPublicationFilter] = useState<Space["status"] | "vse">("vse");
  const [accessFilter, setAccessFilter] = useState<Space["accessCategory"] | "vse">("vse");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSpaces = spaces.filter((space) => {
    const matchesPublication = publicationFilter === "vse" || space.status === publicationFilter;
    const matchesAccess = accessFilter === "vse" || space.accessCategory === accessFilter;
    const matchesQuery =
      !normalizedQuery ||
      [space.name, space.slug, space.floor, space.category, space.primaryUse, space.capacityLabel, space.equipment.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    return matchesPublication && matchesAccess && matchesQuery;
  });

  return (
    <>
      <AdminHeader
        title="Seznam prostorov"
        text="Admin katalog prostorov: status objave, osnovni podatki, uporaba, oprema, vidnost in povezave na dogodke, rezervacije ter zahteve."
        action={
          <button type="button" className="button primary">
            Ustvari nov prostor
          </button>
        }
      />
      <AdminPanel title="Filtri">
        <div className="room-filter-grid">
          <label>
            Iskanje
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ime, slug, namen, oprema..." />
          </label>
          <label>
            Status objave
            <select value={publicationFilter} onChange={(event) => setPublicationFilter(event.target.value as Space["status"] | "vse")}>
              <option value="vse">vse</option>
              <option value="published">objavljeno</option>
              <option value="draft">osnutek</option>
              <option value="archived">arhivirano</option>
            </select>
          </label>
          <label>
            Dostop
            <select value={accessFilter} onChange={(event) => setAccessFilter(event.target.value as Space["accessCategory"] | "vse")}>
              <option value="vse">vse</option>
              <option value="public">javno</option>
              <option value="tenant">člansko / najemno</option>
              <option value="operator">interno</option>
              <option value="mixed">mešano</option>
            </select>
          </label>
        </div>
      </AdminPanel>
      <div className="space-catalogue-layout">
        <AdminPanel title="Seznam prostorov">
          {filteredSpaces.length ? (
            <div className="table admin-space-table">
              <div className="table-row table-head">
                <span>Prostor</span>
                <span>Lokacija</span>
                <span>Tip</span>
                <span>Objava</span>
                <span>Dostop</span>
                <span>Povezave</span>
              </div>
              {filteredSpaces.map((space) => {
                const spaceEvents = events.filter((event) => event.spaceId === space.id).length;
                const spaceBookings = bookings.filter((booking) => booking.spaceId === space.id).length;
                const spaceRequests = requests.filter((request) => request.relatedSpaceId === space.id).length;
                return (
                  <Link key={space.id} className="table-row admin-space-row" to={`/admin/prostori/sobe/${space.id}`}>
                    <strong>{space.name}</strong>
                    <span>{space.floor}</span>
                    <span>{space.category}</span>
                    <span className="status-pill subtle">{spacePublicationStatusLabel(space.status)}</span>
                    <span>{space.accessCategory === "public" ? "javno" : space.accessCategory === "tenant" ? "člansko / najemno" : space.accessCategory === "operator" ? "interno" : "mešano"}</span>
                    <span>{spaceEvents} dogodki · {spaceBookings} rezervacije · {spaceRequests} zahteve</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState text="Za izbrane filtre ni prostorov." />
          )}
        </AdminPanel>
      </div>
    </>
  );
}

function AdminEquipmentList() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EquipmentItem["status"] | "vse">("vse");
  const [spaceFilter, setSpaceFilter] = useState<string>("vse");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = equipmentItems
    .filter((item) => {
      const space = getSpace(item.spaceId);
      const matchesQuery = !normalizedQuery || [item.name, space?.name, space?.floor].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery);
      return matchesQuery && (statusFilter === "vse" || item.status === statusFilter) && (spaceFilter === "vse" || item.spaceId === spaceFilter);
    })
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));

  return (
    <>
      <AdminPlainTitle title="Oprema" />
      <AdminPanel title="Seznam opreme">
        <div className="admin-table-toolbar equipment-table-toolbar">
          <label>
            Iskanje
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ime ali prostor..." />
          </label>
          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as EquipmentItem["status"] | "vse")}>
              <option value="vse">vsi statusi</option>
              <option value="na voljo">na voljo</option>
              <option value="v uporabi">v uporabi</option>
              <option value="servis">servis</option>
              <option value="ni na voljo">ni na voljo</option>
            </select>
          </label>
          <label>
            Prostor
            <select value={spaceFilter} onChange={(event) => setSpaceFilter(event.target.value)}>
              <option value="vse">vsi prostori</option>
              {spaces.map((space) => <option key={space.id} value={space.id}>{space.name}</option>)}
            </select>
          </label>
        </div>
        <div className="table admin-equipment-table">
          <div className="table-row table-head">
            <span>Ime</span>
            <span>Status</span>
            <span>Datum spremembe</span>
            <span>Prostor</span>
          </div>
          {filteredItems.map((item) => {
            const space = getSpace(item.spaceId);
            return (
              <Link className="table-row admin-equipment-row" key={item.id} to={`/admin/prostori/oprema/${item.id}`}>
                <strong>{item.name}</strong>
                <span className={`equipment-status equipment-status-${item.status.replaceAll(" ", "-")}`}>{item.status}</span>
                <span>{formatDate(item.updatedAt)}</span>
                <span>{space ? `${space.name} · ${space.floor}` : item.spaceId}</span>
              </Link>
            );
          })}
        </div>
        {!filteredItems.length && <EmptyState text="Za izbrane filtre ni opreme." />}
      </AdminPanel>
    </>
  );
}

function AdminEquipmentDetail() {
  const { equipmentId = "" } = useParams();
  const item = equipmentItems.find((equipment) => equipment.id === equipmentId);
  const space = item ? getSpace(item.spaceId) : undefined;

  if (!item) return <NotFound backTo="/admin/prostori/oprema" />;

  return (
    <>
      <AdminPlainTitle title={item.name} />
      <div className="admin-page-actions">
        <Link className="button" to="/admin/prostori/oprema">
          Nazaj na seznam
        </Link>
      </div>
      <div className="admin-event-detail-grid">
        <div className="admin-event-main">
          <AdminPanel title="Podatki opreme">
            <FactList
              items={[
                ["Ime", item.name],
                ["Status", item.status],
                ["Datum spremembe", formatDate(item.updatedAt)],
                ["Dodeljeni prostor", space ? `${space.name} · ${space.floor}` : item.spaceId]
              ]}
            />
          </AdminPanel>
        </div>
        <aside className="admin-event-sidebar">
          <AdminPanel title="Status">
            <span className={`equipment-status equipment-status-${item.status.replaceAll(" ", "-")}`}>{item.status}</span>
            <p className="meta">Zadnja sprememba: {formatDate(item.updatedAt)}</p>
          </AdminPanel>
          <AdminPanel title="Povezan prostor">
            {space ? (
              <>
                <FactList items={[["Prostor", space.name], ["Lokacija", `${space.floor}`]]} />
                <Link className="button" to={`/admin/prostori/sobe/${space.id}`}>
                  Odpri prostor
                </Link>
              </>
            ) : (
              <EmptyState text="Povezan prostor ni vpisan." />
            )}
          </AdminPanel>
          <AdminPanel title="Evidenca">
            <FactList items={[["Interna oznaka", item.id]]} />
          </AdminPanel>
        </aside>
      </div>
    </>
  );
}

function AdminSpaceDetail() {
  const { spaceId = "" } = useParams();
  const { requests } = usePrototypeRoomUseRequests();
  const activeSpace = spaces.find((space) => space.id === spaceId);

  if (!activeSpace) return <NotFound backTo="/admin/prostori/sobe" />;

  const activeEvents = events.filter((event) => event.spaceId === activeSpace.id);
  const activeBookings = bookings.filter((booking) => booking.spaceId === activeSpace.id);
  const activeRequests = requests.filter((request) => request.relatedSpaceId === activeSpace.id);
  const isPubliclyVisible = activeSpace.status === "published" && isPublicSpace(activeSpace);

  return (
    <>
      <AdminPlainTitle title={activeSpace.name} />
      <div className="admin-page-actions">
        <Link className="button" to="/admin/prostori/sobe">
          Nazaj na seznam
        </Link>
      </div>
      <div className="admin-event-detail-grid">
        <div className="admin-event-main">
          <section className="admin-panel">
            <FactList
              items={[
                ["Primarna uporaba", activeSpace.primaryUse],
                ["Druge uporabe", activeSpace.otherUses.join(", ")],
                ["Pomembno", activeSpace.importantInfo || "ni posebne opombe"],
                ["Povezani prostori", activeSpace.connectedSpacesNote || "ni vpisano"]
              ]}
            />
          </section>

          <AdminPanel title="Oprema, pravila in dostopnost">
            <h3>Oprema</h3>
            <TagRow tags={activeSpace.equipment} />
            <FactList
              items={[
                ["Pravila", activeSpace.rulesNote || "Pravila še niso vpisana."],
                ["Dostopnost", activeSpace.accessibilityNote || "Informacije o dostopu še niso vpisane."],
                ["Kapaciteta", activeSpace.capacityLabel],
                ["Površina", activeSpace.areaLabel || "ni vpisano"]
              ]}
            />
          </AdminPanel>

          <AdminPanel title="Mediji in tloris">
            <TwoColumn>
              <div>
                <h3>Fotografija / render</h3>
                <SpaceImage space={activeSpace} compact />
              </div>
              <div>
                <h3>Tloris prostora</h3>
                <FloorPlanImage space={activeSpace} />
              </div>
            </TwoColumn>
          </AdminPanel>

          <AdminPanel title="Povezani koledar">
            <div className="admin-linked-list">
              {activeEvents.slice(0, 6).map((event) => (
                <MiniItem key={event.id} title={event.title} meta={`${formatDate(event.date)} · ${formatEventTime(event)} · ${event.status}`} />
              ))}
              {!activeEvents.length && <EmptyState text="Ta prostor še nima povezanih dogodkov." />}
            </div>
          </AdminPanel>
        </div>

        <aside className="admin-event-sidebar">
          <AdminPanel title="Objava">
            <span className="status-pill status-pill-block">{spacePublicationStatusLabel(activeSpace.status)}</span>
            <FactList
              items={[
                ["Status", spacePublicationStatusLabel(activeSpace.status)],
                ["Slug", activeSpace.slug],
                ["Javna stran", isPubliclyVisible ? "vidna" : "skrita"],
                ["Najemni obrazec", isPublicSpace(activeSpace) ? "viden v izboru" : "ni v javnem izboru"]
              ]}
            />
            <div className="inline-actions">
              <Link className="button primary" to={`/admin/prostori/sobe/${activeSpace.id}/uredi`}>
                Uredi
              </Link>
              {isPubliclyVisible && (
                <Link className="button" to={`/prostori/${activeSpace.slug}`}>
                  Javna stran
                </Link>
              )}
            </div>
          </AdminPanel>

          <AdminPanel title="Ključni podatki">
            <FactList
              items={[
                ["Nadstropje", activeSpace.floor],
                ["Tip", spaceTypeLabel(activeSpace.spaceType)],
                ["Dostop", spaceAccessLabel(activeSpace.accessCategory)],
                ["Razpoložljivost", statusLabel(activeSpace.availabilityStatus)]
              ]}
            />
          </AdminPanel>

          <AdminPanel title="Povezave">
            <FactList
              items={[
                ["Dogodki", activeEvents.length],
                ["Rezervacije", activeBookings.length],
                ["Povpraševanja", activeRequests.length]
              ]}
            />
            <Link className="button" to="/admin/prostori">
              Koledar
            </Link>
          </AdminPanel>
        </aside>
      </div>
    </>
  );
}

function AdminSpaceEdit() {
  const { spaceId = "" } = useParams();
  const [saved, setSaved] = useState(false);
  const activeSpace = spaces.find((space) => space.id === spaceId);

  if (!activeSpace) return <NotFound backTo="/admin/prostori/sobe" />;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <>
      <AdminHeader
        title={`Uredi prostor: ${activeSpace.name}`}
        text="Urejanje osnovnih podatkov, javne vsebine, opreme in pravil prostora. V prototipu se spremembe ne shranjujejo trajno."
        action={
          <Link className="button" to={`/admin/prostori/sobe/${activeSpace.id}`}>
            Nazaj na detajl
          </Link>
        }
      />
      <form className="admin-event-detail-grid" onSubmit={onSubmit}>
        <div className="admin-event-main">
          <AdminPanel title="Osnovni podatki">
            <div className="admin-event-form-grid">
              <label>
                Ime
                <input name="name" defaultValue={activeSpace.name} />
              </label>
              <label>
                Slug
                <input name="slug" defaultValue={activeSpace.slug} />
              </label>
              <label>
                Nadstropje
                <input name="floor" defaultValue={activeSpace.floor} />
              </label>
              <label>
                Tip
                <select name="spaceType" defaultValue={activeSpace.spaceType}>
                  <option value="hall">dvorana</option>
                  <option value="gallery">galerija</option>
                  <option value="meeting-room">sestankovalnica</option>
                  <option value="practice-room">vadbeni prostor</option>
                  <option value="classroom">učilnica</option>
                  <option value="office">pisarna</option>
                  <option value="coworking">sodelo</option>
                  <option value="residence">rezidenca</option>
                  <option value="atelier">atelje</option>
                  <option value="other">drugo</option>
                </select>
              </label>
              <label>
                Dostop
                <select name="accessCategory" defaultValue={activeSpace.accessCategory}>
                  <option value="public">javno</option>
                  <option value="tenant">člansko / najemno</option>
                  <option value="operator">interno</option>
                  <option value="mixed">mešano</option>
                </select>
              </label>
              <label className="full-field">
                Kratek opis
                <textarea name="shortDescription" defaultValue={activeSpace.shortDescription} />
              </label>
              <label>
                Primarna uporaba
                <input name="primaryUse" defaultValue={activeSpace.primaryUse} />
              </label>
              <label>
                Kapaciteta
                <input name="capacityLabel" defaultValue={activeSpace.capacityLabel} />
              </label>
            </div>
          </AdminPanel>

          <AdminPanel title="Uporaba, oprema in pravila">
            <div className="admin-event-form-grid">
              <label className="full-field">
                Druge uporabe
                <textarea name="otherUses" defaultValue={activeSpace.otherUses.join(", ")} />
              </label>
              <label className="full-field">
                Oprema
                <textarea name="equipment" defaultValue={activeSpace.equipment.join(", ")} />
              </label>
              <label className="full-field">
                Povezani prostori
                <textarea name="connectedSpacesNote" defaultValue={activeSpace.connectedSpacesNote || ""} />
              </label>
              <label className="full-field">
                Pravila
                <textarea name="rulesNote" defaultValue={activeSpace.rulesNote || ""} />
              </label>
              <label className="full-field">
                Dostopnost
                <textarea name="accessibilityNote" defaultValue={activeSpace.accessibilityNote || ""} />
              </label>
            </div>
          </AdminPanel>

          <AdminPanel title="Mediji in tloris">
            <div className="admin-event-form-grid">
              <label>
                Opis fotografije / renderja
                <input name="imageAlt" defaultValue={activeSpace.imageAlt || ""} />
              </label>
              <label>
                Opis tlorisa
                <input name="floorPlanImageAlt" defaultValue={activeSpace.floorPlanImageAlt || ""} />
              </label>
              <label className="full-field">
                Referenca slike tlorisa
                <input name="floorPlanImageSrc" defaultValue={activeSpace.floorPlanImageSrc || ""} />
              </label>
              <label className="full-field">
                Prenos tlorisa
                <input name="floorPlanDownloadUrl" defaultValue={activeSpace.floorPlanDownloadUrl || ""} />
              </label>
            </div>
          </AdminPanel>
        </div>

        <aside className="admin-event-sidebar">
          <AdminPanel title="Objava">
            <label>
              Status objave
              <select name="status" defaultValue={activeSpace.status}>
                <option value="draft">osnutek</option>
                <option value="published">objavljeno</option>
                <option value="archived">arhivirano</option>
              </select>
            </label>
            <label>
              Razpoložljivost
              <select name="availabilityStatus" defaultValue={activeSpace.availabilityStatus}>
                <option value="available-for-inquiry">na voljo za povpraševanje</option>
                <option value="limited">omejeno</option>
                <option value="coming-soon">prihaja kasneje</option>
              </select>
            </label>
            <button className="button primary" type="submit">
              Prikaži stanje shranjeno
            </button>
            {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
          </AdminPanel>

          <AdminPanel title="Referenca">
            <FactList
              items={[
                ["ID", activeSpace.id],
                ["Javna stran", activeSpace.status === "published" && isPublicSpace(activeSpace) ? "vidna" : "skrita"],
                ["Obrazec", isPublicSpace(activeSpace) ? "viden v izboru" : "ni v javnem izboru"]
              ]}
            />
          </AdminPanel>
        </aside>
      </form>
    </>
  );
}

function AdminReservations() {
  return (
    <>
      <AdminCombinedCalendar />
    </>
  );
}

function AdminBookingsList() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Booking["status"] | "vse">("vse");
  const { prototypeBookings } = usePrototypeBookings();
  const normalizedQuery = query.trim().toLocaleLowerCase("sl");
  const filteredBookings = prototypeBookings.filter((booking) => {
    const space = getSpace(booking.spaceId);
    const matchesQuery = !normalizedQuery || `${booking.title} ${booking.requester} ${space?.name || ""}`.toLocaleLowerCase("sl").includes(normalizedQuery);
    return matchesQuery && (status === "vse" || booking.status === status);
  });

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Vse rezervacije</h1>
          <p className="meta">Rezervacije prostorov, interne blokade in termini, povezani z dogodki.</p>
        </div>
        <Link className="button primary" to="/admin/prostori">Odpri koledar</Link>
      </header>
      <AdminPanel title="Rezervacije">
        <div className="admin-list-controls">
          <label>
            Iskanje
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Naslov, naročnik ali prostor" />
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value as Booking["status"] | "vse")}>
              <option value="vse">Vsi statusi</option>
              <option value="povpraševanje">Povpraševanje</option>
              <option value="začasno">Začasno</option>
              <option value="potrjeno">Potrjeno</option>
              <option value="blokirano">Blokirano</option>
              <option value="preklicano">Preklicano</option>
              <option value="zavrnjeno">Zavrnjeno</option>
            </select>
          </label>
        </div>
        <div className="table admin-bookings-table">
          <div className="table-row table-head">
            <strong>Rezervacija</strong><strong>Datum in čas</strong><strong>Prostor</strong><strong>Naročnik</strong><strong>Vrsta</strong><strong>Status</strong><strong>Povezava</strong>
          </div>
          {filteredBookings.map((booking) => {
            const space = getSpace(booking.spaceId);
            const relatedEvent = booking.source === "event"
              ? events.find((event) => event.title === booking.title && getEventOccurrences(event).some((occurrence) => occurrence.date === booking.date && occurrence.spaceId === booking.spaceId))
              : undefined;
            return (
              <div className="table-row admin-booking-row" key={booking.id}>
                <strong>{booking.title}</strong>
                <span>{formatDate(booking.date)} · {booking.startTime}-{booking.endTime}</span>
                <span>{space?.name || "Neznan prostor"}</span>
                <span>{booking.requester}</span>
                <span>{booking.source === "event" ? "dogodek" : booking.source === "internal" ? "interno" : "rezervacija"}</span>
                <span>{booking.status}</span>
                <span>{relatedEvent ? <Link to={`/admin/dogodki/${relatedEvent.slug}`}>Odpri dogodek</Link> : "brez dogodka"}</span>
              </div>
            );
          })}
          {!filteredBookings.length ? <EmptyState text="Nobena rezervacija ne ustreza izbranim filtrom." /> : null}
        </div>
      </AdminPanel>
    </>
  );
}

type AdminCalendarItem = {
  id: string;
  title: string;
  time: string;
  meta: string;
  kind: string;
  colorClass?: string;
  eventSlug?: string;
  date: string;
  spaceName: string;
  organiser?: string;
  status: string;
};

function AdminSpaceUseRequests() {
  const { requests, updateRequest } = usePrototypeRoomUseRequests();
  return (
    <>
      <AdminHeader title="Povpraševanja za prostore" text="Odobritveni pogled za povpraševanja pred vnosom ali sinhronizacijo v koledar." />
      <RoomUseRequestDesk requests={requests} title="Vsa povpraševanja za prostore" onUpdateRequest={updateRequest} />
    </>
  );
}

function AdminCombinedCalendar() {
  const adminSpaces = spaces;
  const { prototypeBookings, addBooking } = usePrototypeBookings();
  const [calendarMode, setCalendarMode] = useState<"week" | "month" | "list">("month");
  const [selectedSpaceIds, setSelectedSpaceIds] = useState(adminSpaces.map((space) => space.id));
  const [selectedPeriod, setSelectedPeriod] = useState("2027-01");
  const [adminEntry, setAdminEntry] = useState<{ date: string; space?: Space } | null>(null);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const selectedSpaces = adminSpaces.filter((space) => selectedSpaceIds.includes(space.id));
  const allCalendarDates = getAdminVisibleDates(adminSpaces, prototypeBookings);
  const visibleDates = getAdminVisibleDates(selectedSpaces, prototypeBookings);
  const monthOptions = getCalendarMonths(allCalendarDates);
  const weekOptions = getCalendarWeeks(allCalendarDates);
  const periodOptions = calendarMode === "month" ? monthOptions : calendarMode === "week" ? weekOptions : [];
  const activePeriod = periodOptions.some((period) => period.key === selectedPeriod) ? selectedPeriod : periodOptions[0]?.key || "";
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<AdminCalendarItem | null>(null);
  const reservationDate = calendarMode === "month" && activePeriod ? `${activePeriod}-01` : calendarMode === "week" && activePeriod ? activePeriod : visibleDates[0] || prototypeTodayKey;
  const toggleSpace = (spaceId: string) => {
    setSelectedSpaceIds((current) => (current.includes(spaceId) ? current.filter((id) => id !== spaceId) : [...current, spaceId]));
  };

  if (isCreatingReservation) {
    return <AdminReservationCreateForm spaces={adminSpaces} initialDate={reservationDate} initialSpace={selectedSpaces.length === 1 ? selectedSpaces[0] : undefined} onCancel={() => setIsCreatingReservation(false)} onSave={(booking) => { addBooking(booking); setSelectedPeriod(booking.date.slice(0, 7)); setCalendarMode("month"); setIsCreatingReservation(false); }} />;
  }

  return (
    <>
      <AdminPlainTitle
        title="Koledar"
        action={
          <button type="button" className="button primary" onClick={() => setIsCreatingReservation(true)}>
            Dodaj rezervacijo
          </button>
        }
      />
      <div className="admin-view-tabs" aria-label="Izbira admin pogleda koledarja">
        <button type="button" className={calendarMode === "week" ? "selected" : ""} onClick={() => setCalendarMode("week")}>
          Teden
        </button>
        <button type="button" className={calendarMode === "month" ? "selected" : ""} onClick={() => setCalendarMode("month")}>
          Mesec
        </button>
        <button type="button" className={calendarMode === "list" ? "selected" : ""} onClick={() => setCalendarMode("list")}>
          Seznam
        </button>
      </div>
      <section className="admin-panel admin-calendar-panel">
        <div className="admin-calendar-toolbar">
          <div className="toolbar">
            {calendarMode !== "list" && (
              <>
                <span className="small-label">Obdobje</span>
                <PeriodNavigator options={periodOptions} activeKey={activePeriod} onChange={setSelectedPeriod} label="Premik po obdobjih admin koledarja" />
              </>
            )}
          </div>
          <details className="admin-space-filter">
            <summary>Prostori <span>{selectedSpaces.length}/{adminSpaces.length}</span></summary>
            <div className="admin-space-filter-menu" aria-label="Prostori v admin koledarju">
              {adminSpaces.map((space) => (
                <label className="room-check" key={space.id}>
                  <input type="checkbox" checked={selectedSpaceIds.includes(space.id)} onChange={() => toggleSpace(space.id)} />
                  <span>
                    <strong>{space.name}</strong>
                    <em>{space.floor}</em>
                  </span>
                </label>
              ))}
            </div>
          </details>
        </div>
        <div className="admin-calendar-full">
          {calendarMode === "list" ? (
            <AdminScheduleList dates={visibleDates} spaces={selectedSpaces} bookings={prototypeBookings} onDayClick={(date, space) => setAdminEntry({ date, space })} onEventClick={setSelectedCalendarEvent} />
          ) : (
            <AdminSpaceCalendar mode={calendarMode} periodKey={activePeriod} spaces={selectedSpaces} bookings={prototypeBookings} onDayClick={(date) => setAdminEntry({ date, space: selectedSpaces.length === 1 ? selectedSpaces[0] : undefined })} onEventClick={setSelectedCalendarEvent} />
          )}
          <div className="calendar-legend" aria-label="Legenda statusov rezervacij">
            {[
              ["dogodek", "Javni ali interni dogodek, vezan na prostor."],
              ["rezervacija", "Potrjena ali začasna rezervacija prostora."],
              ["blokirano", "Interna blokada termina ali prostora."]
            ].map(([label, text]) => (
              <span className={`calendar-legend-${label}`} key={label}>
                <strong>{label}</strong>
                <em>{text}</em>
              </span>
            ))}
          </div>
        </div>
        {adminEntry && <CalendarEntryModal mode="admin" date={adminEntry.date} space={adminEntry.space} onClose={() => setAdminEntry(null)} />}
        {selectedCalendarEvent && <CalendarEventDetailModal item={selectedCalendarEvent} onClose={() => setSelectedCalendarEvent(null)} />}
      </section>
    </>
  );
}

function AdminReservationCreateForm({ spaces: list, initialDate, initialSpace, onCancel, onSave }: { spaces: Space[]; initialDate: string; initialSpace?: Space; onCancel: () => void; onSave: (booking: Booking) => void }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const entryType = String(values.get("entryType"));
    onSave({
      id: `booking-${Date.now()}`,
      spaceId: String(values.get("spaceId")),
      title: String(values.get("title")).trim(),
      requester: String(values.get("requester")).trim(),
      date: String(values.get("date")),
      startTime: String(values.get("startTime")),
      endTime: String(values.get("endTime")),
      status: String(values.get("status")) as Booking["status"],
      source: entryType === "blokada" ? "internal" : String(values.get("source")) as Booking["source"],
      note: [String(values.get("description") || "").trim(), String(values.get("technicalNeeds") || "").trim(), String(values.get("internalNotes") || "").trim()].filter(Boolean).join(" · ") || undefined
    });
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Nova rezervacija</h1>
          <p className="meta">Ročni vnos termina v koledar prostora.</p>
        </div>
        <button className="button" type="button" onClick={onCancel}>
          Nazaj na koledar
        </button>
      </header>

      <form className="admin-event-detail-grid" onSubmit={onSubmit}>
        <div className="admin-event-main">
          <AdminPanel title="Termin in prostor">
            <div className="admin-event-form-grid">
              <label>
                Prostor
                <select name="spaceId" defaultValue={initialSpace?.id || ""} required>
                  <option value="">Izberi prostor</option>
                  {list.map((space) => (
                    <option key={space.id} value={space.id}>
                      {space.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Datum
                <input name="date" type="date" required defaultValue={initialDate} />
              </label>
              <label>
                Od
                <input name="startTime" type="time" required defaultValue="10:00" />
              </label>
              <label>
                Do
                <input name="endTime" type="time" required defaultValue="12:00" />
              </label>
              <label>
                Ponavljanje
                <select name="recurrence" defaultValue="single">
                  <option value="single">enkratni termin</option>
                  <option value="weekly">tedensko</option>
                  <option value="custom">po dogovoru</option>
                </select>
              </label>
              <label>
                Tip vnosa
                <select name="entryType" defaultValue="rezervacija">
                  <option value="rezervacija">Rezervacija prostora</option>
                  <option value="blokada">Interna blokada</option>
                </select>
              </label>
            </div>
          </AdminPanel>

          <AdminPanel title="Podatki rezervacije">
            <div className="admin-event-form-grid">
              <label>
                Naziv / namen
                <input name="title" required placeholder="Npr. Vaja skupine, delavnica, sestanek ..." />
              </label>
              <label>
                Naročnik / organizacija
                <input name="requester" required placeholder="Ime osebe ali organizacije" />
              </label>
              <label>
                Kontaktna oseba
                <input name="contactName" />
              </label>
              <label>
                E-mail
                <input name="email" type="email" />
              </label>
              <label>
                Telefon
                <input name="phone" type="tel" />
              </label>
              <label>
                Število oseb
                <input name="participants" type="number" min="1" inputMode="numeric" />
              </label>
              <label className="full-field">
                Opis uporabe
                <textarea name="description" placeholder="Kratek opis namena, programa ali interne uporabe prostora." />
              </label>
            </div>
          </AdminPanel>

          <AdminPanel title="Potrebe in opombe">
            <div className="admin-event-form-grid">
              <label className="full-field">
                Tehnične potrebe
                <textarea name="technicalNeeds" placeholder="Oprema, ozvočenje, projekcija, postavitev prostora ..." />
              </label>
              <label className="full-field">
                Interne opombe
                <textarea name="internalNotes" placeholder="Opombe za ekipo, dogovori, omejitve ali odprta vprašanja." />
              </label>
              <label className="full-field">
                Priponke
                <input name="attachments" type="file" multiple />
              </label>
            </div>
          </AdminPanel>
        </div>

        <aside className="admin-event-sidebar">
          <AdminPanel title="Status">
            <label>
              Stanje rezervacije
              <select name="status" defaultValue="začasno">
                <option value="začasno">začasno</option>
                <option value="potrjeno">potrjeno</option>
                <option value="blokirano">blokirano</option>
                <option value="povpraševanje">povpraševanje</option>
              </select>
            </label>
            <label>
              Vir
              <select name="source" defaultValue="manual">
                <option value="manual">ročni vnos</option>
                <option value="inquiry">povpraševanje</option>
                <option value="internal">interno</option>
              </select>
            </label>
            <label className="checkbox-field">
              <input name="conflictCheck" type="checkbox" defaultChecked />
              Preveri konflikte v koledarju
            </label>
            <button className="button primary" type="submit">
              Shrani rezervacijo
            </button>
            <button className="button" type="button" onClick={onCancel}>
              Prekliči
            </button>
          </AdminPanel>

          <AdminPanel title="Predaja">
            <FactList
              items={[
                ["Koledar", "pripravljeno za vnos"],
                ["Obvestilo naročniku", "ročno po potrditvi"],
                ["Javna vidnost", "ni javno"]
              ]}
            />
          </AdminPanel>
        </aside>
      </form>
    </>
  );
}

function AdminSpaceCalendar({ mode, periodKey, spaces: list, bookings: calendarBookings, onDayClick, onEventClick }: { mode: "week" | "month"; periodKey: string; spaces: Space[]; bookings: Booking[]; onDayClick: (date: string) => void; onEventClick: (item: AdminCalendarItem) => void }) {
  if (!list.length) return <EmptyState text="Izberite vsaj en prostor." />;
  if (!periodKey) return <EmptyState text="Za izbrane prostore ni vpisanih terminov." />;

  if (mode === "month") {
    const monthDate = parseLocalDate(`${periodKey}-01`);
    const monthDays = getMonthDays(monthDate);
    return (
      <div className="member-month-grid" aria-label="Mesečni admin koledar">
        {["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"].map((day) => (
          <strong className="weekday" key={day}>
            {day}
          </strong>
        ))}
        {monthDays.map((day) => {
          const dayItems = day.inMonth ? getAdminDayItems(day.date, list, calendarBookings) : [];
          return (
            <div className={`member-calendar-day ${day.inMonth ? "" : "muted"} ${day.date === prototypeTodayKey ? "is-today" : ""}`} key={day.key} onClick={() => day.inMonth && onDayClick(day.date)}>
              <span>{day.label}{day.date === prototypeTodayKey && <em className="today-marker">danes</em>}</span>
              {dayItems.length ? dayItems.map((item) => <AdminCalendarBlock key={item.id} item={item} onEventClick={onEventClick} />) : day.inMonth && <span className="empty-inline">prosto</span>}
            </div>
          );
        })}
      </div>
    );
  }

  const weekDays = getWeekDays(periodKey);
  return (
    <div className="member-week-grid" aria-label="Tedenski admin koledar">
      {weekDays.map((date) => {
        const dayItems = getAdminDayItems(date, list, calendarBookings);
        const dayOfWeek = parseLocalDate(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        return (
          <div className={`member-week-day ${isWeekend ? "weekend" : ""} ${date === prototypeTodayKey ? "is-today" : ""}`} key={date} onClick={() => onDayClick(date)}>
            <strong>{formatShortWeekdayDate(date)}{date === prototypeTodayKey && <em className="today-marker">danes</em>}</strong>
            {dayItems.length ? dayItems.map((item) => <AdminCalendarBlock key={item.id} item={item} onEventClick={onEventClick} />) : <span className="empty-inline">prosto</span>}
          </div>
        );
      })}
    </div>
  );
}

function AdminScheduleList({ dates, spaces: list, bookings: calendarBookings, onDayClick, onEventClick }: { dates: string[]; spaces: Space[]; bookings: Booking[]; onDayClick: (date: string, space: Space) => void; onEventClick: (item: AdminCalendarItem) => void }) {
  if (!list.length) return <EmptyState text="Izberite vsaj en prostor." />;

  return (
    <div className="schedule-sheet" role="table" aria-label="Admin seznam po prostorih">
      <div className="schedule-row schedule-head" role="row" style={{ gridTemplateColumns: `170px repeat(${list.length}, minmax(180px, 1fr))` }}>
        <div role="columnheader">Datum</div>
        {list.map((space) => (
          <div role="columnheader" key={space.id}>
            {space.name}
          </div>
        ))}
      </div>
      {dates.map((date) => (
        <div className="schedule-row" role="row" key={date} style={{ gridTemplateColumns: `170px repeat(${list.length}, minmax(180px, 1fr))` }}>
          <div className="schedule-date" role="cell">
            <strong>{formatWeekdayDate(date)}</strong>
          </div>
          {list.map((space) => {
            const cellItems = getAdminDayItems(date, [space], calendarBookings);
            return (
              <div className="schedule-cell" role="cell" key={space.id} onClick={() => onDayClick(date, space)}>
                {cellItems.length ? cellItems.map((item) => <AdminCalendarBlock key={item.id} item={item} onEventClick={onEventClick} />) : <span className="empty-inline">prosto</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function AdminCalendarBlock({ item, onEventClick }: { item: AdminCalendarItem; onEventClick: (item: AdminCalendarItem) => void }) {
  const isEvent = item.kind === "event" && item.eventSlug;
  const entryClass = item.kind === "event" ? "calendar-entry-event" : "calendar-entry-booking";
  const className = `calendar-chip ${entryClass} ${isEvent ? "is-clickable" : ""} ${item.kind === "internal" ? "internal-chip" : ""}`;
  const content = (
    <>
      <span className="calendar-chip-top">
        <time>{item.time}</time>
        <i>{calendarKindLabel(item.kind)}</i>
      </span>
      <b>{item.title}</b>
      <em>{item.meta}</em>
    </>
  );

  if (!isEvent) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        onEventClick(item);
      }}
    >
      {content}
    </button>
  );
}

function AdminProgrammes() {
  return (
    <Routes>
      <Route index element={<AdminProgrammeList />} />
      <Route path="nov" element={<AdminNewProgramme />} />
      <Route path="prijave" element={<AdminProgrammeApplications />} />
      <Route path="prijave/:applicationId" element={<AdminProgrammeApplicationDetail />} />
      <Route path=":slug" element={<AdminProgrammeDetail />} />
    </Routes>
  );
}

function AdminProgrammeList() {
  const { prototypeProgrammes } = usePrototypeProgrammes();
  const { prototypeEvents } = usePrototypeEvents();
  const publishedProgrammes = prototypeProgrammes.filter((programme) => programme.published).sort(compareProgrammesByStatus);
  const unpublishedPilotProgrammes = prototypeProgrammes.filter((programme) => programme.status === "pilot" && !programme.published).sort((first, second) => first.title.localeCompare(second.title));
  const draftProgrammes = prototypeProgrammes.filter((programme) => programme.status === "v pripravi" || (!programme.published && programme.status !== "pilot")).sort((first, second) => first.title.localeCompare(second.title));

  return (
    <>
      <AdminPlainTitle title="Programi" action={<Link className="button primary" to="/admin/programi/nov">Dodaj nov program</Link>} />
      <div className="admin-programme-overview">
        <section className="admin-programme-published-list" aria-label="Objavljeni programi">
          <div className="admin-programme-card-list">
            {publishedProgrammes.map((programme) => (
              <ProgrammeAdminCard key={programme.id} programme={programme} eventItems={prototypeEvents} />
            ))}
          </div>
        </section>

        {unpublishedPilotProgrammes.length ? (
          <AdminPanel title="Pilot">
            <div className="admin-programme-compact-list">
              {unpublishedPilotProgrammes.map((programme) => (
                <ProgrammeAdminCompactRow key={programme.id} programme={programme} eventItems={prototypeEvents} />
              ))}
            </div>
          </AdminPanel>
        ) : null}

        <AdminPanel title="V pripravi / draft">
          <div className="admin-programme-compact-list">
            {draftProgrammes.map((programme) => (
              <ProgrammeAdminCompactRow key={programme.id} programme={programme} eventItems={prototypeEvents} />
            ))}
          </div>
        </AdminPanel>
      </div>
    </>
  );
}

function AdminNewProgramme() {
  const navigate = useNavigate();
  const { addProgramme } = usePrototypeProgrammes();

  const onSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const form = new FormData(formEvent.currentTarget);
    const title = String(form.get("title") || "Nov program").trim();
    const id = `programme-${Date.now().toString(36)}`;
    const baseSlug = title.toLocaleLowerCase("sl").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "nov-program";
    const slug = `${baseSlug}-${id.slice(-4)}`;
    const programme: Programme = {
      id,
      slug,
      title,
      shortDescription: String(form.get("shortDescription") || "").trim(),
      description: String(form.get("description") || "").trim(),
      audience: String(form.get("audience") || "").trim(),
      status: String(form.get("status") || "v pripravi") as Programme["status"],
      published: form.get("published") === "on",
    };
    addProgramme(programme);
    navigate(`/admin/programi/${slug}`);
  };

  return (
    <>
      <header className="admin-list-head">
        <h1>Dodaj nov program</h1>
        <Link className="button" to="/admin/programi">Nazaj na programe</Link>
      </header>
      <form className="admin-event-detail-grid" onSubmit={onSubmit}>
        <div className="admin-event-main">
          <AdminPanel title="Javna vsebina">
            <div className="admin-event-form-grid">
              <label>Naslov programa<input required name="title" autoFocus /></label>
              <label>Publika<input required name="audience" placeholder="npr. ustvarjalci, mladi, društva" /></label>
              <label className="full-field">Kratek opis<textarea required name="shortDescription" placeholder="Kratek javni povzetek programa." /></label>
              <label className="full-field">Opis<textarea required className="tall-textarea" name="description" placeholder="Daljši javni opis programa." /></label>
            </div>
          </AdminPanel>
        </div>
        <aside className="admin-event-sidebar">
          <AdminPanel title="Objava">
            <label>Status<select name="status" defaultValue="v pripravi"><option value="v pripravi">v pripravi</option><option value="pilot">pilot</option><option value="aktiven">aktiven</option></select></label>
            <label className="checkbox-label"><input type="checkbox" name="published" /> Objavi na javni strani</label>
            <p className="meta">Program se ustvari kot ločen zapis. Povezane dogodke in prijave lahko urediš po ustvarjanju.</p>
            <button className="button primary" type="submit">Ustvari program</button>
          </AdminPanel>
        </aside>
      </form>
    </>
  );
}

function compareProgrammesByStatus(first: Programme, second: Programme) {
  const order: Record<Programme["status"], number> = {
    aktiven: 0,
    pilot: 1,
    "v pripravi": 2
  };
  return order[first.status] - order[second.status] || first.title.localeCompare(second.title);
}

function getProgrammeAdminStats(programme: Programme, eventItems = events) {
  const applications = programmeApplications.filter((application) => application.programmeId === programme.id);
  const activeApplications = applications.filter((application) => application.status === "aktivno");
  const relatedEvents = eventItems.filter((event) => event.relatedProgrammeId === programme.id);
  const relatedBookings = bookings.filter((booking) => booking.relatedProgrammeId === programme.id);

  return {
    applications,
    activeApplications,
    relatedEvents,
    relatedBookings
  };
}

function ProgrammeStatusTag({ programme }: { programme: Programme }) {
  return <span className={`admin-programme-status status-${programme.status.replace(/\s+/g, "-")}`}>{programme.status}</span>;
}

function ProgrammeAdminCard({ programme, eventItems }: { programme: Programme; eventItems: EventItem[] }) {
  const stats = getProgrammeAdminStats(programme, eventItems);
  const reviewCount = stats.applications.filter((application) => application.status === "v pregledu").length;
  const activeCount = stats.applications.filter((application) => application.status === "aktivno").length;

  return (
    <Link className="admin-programme-card" to={`/admin/programi/${programme.slug}`}>
      <div className="admin-programme-card-head">
        <div>
          <h3>{programme.title}</h3>
          <p>{programme.shortDescription}</p>
        </div>
        <ProgrammeStatusTag programme={programme} />
      </div>
      <p className="admin-programme-description">{programme.description}</p>
      <div className="admin-programme-meta-grid">
        <span>
          <strong>Publika</strong>
          {programme.audience}
        </span>
        <span>
          <strong>Prijave</strong>
          {stats.activeApplications.length}/{stats.applications.length} aktivnih
        </span>
        <span>
          <strong>Proces</strong>
          {reviewCount} v pregledu · {activeCount} aktivnih
        </span>
        <span>
          <strong>Povezave</strong>
          {stats.relatedEvents.length} dogodkov · {stats.relatedBookings.length} rezervacij
        </span>
      </div>
      <div className="admin-programme-footer">
        <span>{programme.published ? "Javna stran objavljena" : "Skrito na javni strani"}</span>
        <strong>Odpri program</strong>
      </div>
    </Link>
  );
}

function ProgrammeAdminCompactRow({ programme, eventItems }: { programme: Programme; eventItems: EventItem[] }) {
  const stats = getProgrammeAdminStats(programme, eventItems);

  return (
    <Link className="admin-programme-compact-row" to={`/admin/programi/${programme.slug}`}>
      <div>
        <h3>{programme.title}</h3>
        <p>{programme.audience}</p>
      </div>
      <ProgrammeStatusTag programme={programme} />
      <span>{programme.published ? "objavljen" : "ni objavljen"}</span>
      <span>{stats.applications.length} prijav · {stats.relatedEvents.length} dogodkov</span>
    </Link>
  );
}

function ProgrammeBookingsPanel({ bookings: programmeBookings }: { bookings: Booking[] }) {
  return (
    <AdminPanel title="Povezane rezervacije">
      {programmeBookings.length ? (
        <div className="admin-linked-list">
          {programmeBookings.map((booking) => {
            const space = getSpace(booking.spaceId);
            return <MiniItem key={booking.id} title={booking.title} meta={`${formatDate(booking.date)} · ${booking.startTime}–${booking.endTime} · ${space?.name || booking.spaceId} · ${booking.status}`} />;
          })}
        </div>
      ) : (
        <EmptyState text="Program še nima povezanih rezervacij." />
      )}
    </AdminPanel>
  );
}

function AdminProgrammeDetail() {
  const { slug = "" } = useParams();
  const { prototypeProgrammes } = usePrototypeProgrammes();
  const { prototypeEvents } = usePrototypeEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const programme = prototypeProgrammes.find((item) => item.slug === slug);
  if (!programme) return <NotFound backTo="/admin/programi" />;
  const relatedEvents = prototypeEvents.filter((event) => event.relatedProgrammeId === programme.id);
  const relatedBookings = bookings.filter((booking) => booking.relatedProgrammeId === programme.id);
  const applications = programmeApplications.filter((application) => application.programmeId === programme.id);

  const onSubmit = (formEvent: FormEvent) => {
    formEvent.preventDefault();
    setSaved(true);
    setIsEditing(false);
  };

  return (
    <>
      <header className="admin-list-head">
        <h1>{programme.title}</h1>
        <Link className="button" to="/admin/programi">
          Nazaj na seznam
        </Link>
      </header>

      {isEditing ? (
        <form className="admin-event-detail-grid" onSubmit={onSubmit}>
          <div className="admin-event-main">
            <AdminPanel title="Javna vsebina">
              <div className="admin-event-form-grid">
                <label>
                  Naslov
                  <input name="title" defaultValue={programme.title} />
                </label>
                <label>
                  Publika
                  <input name="audience" defaultValue={programme.audience} />
                </label>
                <label className="full-field">
                  Kratek opis
                  <textarea name="shortDescription" defaultValue={programme.shortDescription} />
                </label>
                <label className="full-field">
                  Opis
                  <textarea className="tall-textarea" name="description" defaultValue={programme.description} />
                </label>
              </div>
              <div className="inline-actions">
                <Link className="button" to={`/skupnost/programi/${programme.slug}`}>
                  Predogled javne strani
                </Link>
              </div>
            </AdminPanel>

            <AdminPanel title="Prijave na program">
              {applications.length ? (
                <div className="admin-linked-list">
                  {applications.map((application) => <MiniLink key={application.id} to={`/admin/programi/prijave/${application.id}`} title={application.participantName} meta={`${programmeApplicationStatusLabel(application.status)} · ${application.nextStep}`} />)}
                </div>
              ) : (
                <EmptyState text="Za ta program še ni prijav." />
              )}
            </AdminPanel>

            <AdminPanel title="Povezani dogodki">
              {relatedEvents.length ? (
                <div className="admin-linked-list">
                  {relatedEvents.map((event) => <MiniLink key={event.id} to={`/admin/dogodki/${event.slug}`} title={event.title} meta={`${formatDate(event.date)} · ${event.locationName} · ${event.status}`} />)}
                </div>
              ) : (
                <EmptyState text="Program še nima povezanih dogodkov." />
              )}
            </AdminPanel>

            <ProgrammeBookingsPanel bookings={relatedBookings} />
          </div>

          <aside className="admin-event-sidebar">
            <AdminPanel title="Program">
              <label>
                Status
                <select name="status" defaultValue={programme.status}>
                  <option value="v pripravi">v pripravi</option>
                  <option value="aktiven">aktiven</option>
                  <option value="pilot">pilot</option>
                </select>
              </label>
              <label>
                Slug
                <input name="slug" defaultValue={programme.slug} />
              </label>
              <label>
                CTA label
                <input name="ctaLabel" defaultValue="Prijavi se na program" />
              </label>
              <label>
                Workflow
                <input name="workflow" defaultValue="Prijave na programe" />
              </label>
              <div className="inline-actions">
                <button className="button primary" type="submit">
                  Shrani
                </button>
                <button className="button" type="button" onClick={() => setIsEditing(false)}>
                  Prekliči
                </button>
              </div>
              {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
            </AdminPanel>
          </aside>
        </form>
      ) : (
        <div className="admin-event-detail-grid">
          <div className="admin-event-main">
            <AdminPanel title="Javna vsebina">
              <h3>Kratek opis</h3>
              <p>{programme.shortDescription}</p>
              <h3>Opis</h3>
              <p>{programme.description}</p>
              <h3>Publika</h3>
              <p>{programme.audience}</p>
            </AdminPanel>

            <AdminPanel title="Prijave na program">
              {applications.length ? (
                <div className="admin-linked-list">
                  {applications.map((application) => <MiniLink key={application.id} to={`/admin/programi/prijave/${application.id}`} title={application.participantName} meta={`${programmeApplicationStatusLabel(application.status)} · ${application.nextStep}`} />)}
                </div>
              ) : (
                <EmptyState text="Za ta program še ni prijav." />
              )}
            </AdminPanel>

            <AdminPanel title="Povezani dogodki">
              {relatedEvents.length ? (
                <div className="admin-linked-list">
                  {relatedEvents.map((event) => <MiniLink key={event.id} to={`/admin/dogodki/${event.slug}`} title={event.title} meta={`${formatDate(event.date)} · ${event.locationName} · ${event.status}`} />)}
                </div>
              ) : (
                <EmptyState text="Program še nima povezanih dogodkov." />
              )}
            </AdminPanel>

            <ProgrammeBookingsPanel bookings={relatedBookings} />
          </div>

          <aside className="admin-event-sidebar">
            <AdminPanel title="Program">
              <FactList
                items={[
                  ["Status", programme.status],
                  ["Slug", programme.slug],
                  ["Povezani dogodki", relatedEvents.length],
                  ["Povezane rezervacije", relatedBookings.length],
                  ["Prijave", applications.length]
                ]}
              />
              <div className="inline-actions">
                <Link className="button" to={`/skupnost/programi/${programme.slug}`}>
                  Javni predogled
                </Link>
                <Link className="button" to="/admin/programi/prijave">
                  Prijave
                </Link>
                <button className="button primary" type="button" onClick={() => setIsEditing(true)}>
                  Uredi
                </button>
              </div>
              {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
            </AdminPanel>
          </aside>
        </div>
      )}
    </>
  );
}

function AdminProgrammeApplications() {
  const { applications } = usePrototypeProgrammeApplications();
  const [statusFilter, setStatusFilter] = useState<ProgrammeApplicationStatus | "vse">("vse");
  const [programmeFilter, setProgrammeFilter] = useState<string>("vsi");
  const filteredApplications = applications.filter((application) => {
    const matchesStatus = statusFilter === "vse" || application.status === statusFilter;
    const matchesProgramme = programmeFilter === "vsi" || application.programmeId === programmeFilter;
    return matchesStatus && matchesProgramme;
  });

  return (
    <>
      <AdminHeader
        title="Prijave na programe"
        text="Operativni pogled prijavljenih udeležencev po programu, statusu in mentorju."
        action={
          <Link className="button" to="/admin/programi">
            Seznam programov
          </Link>
        }
      />
      <AdminPanel title="Filtri">
        <div className="approval-status-row" aria-label="Filtri prijav po statusu">
          <button className={statusFilter === "vse" ? "selected" : ""} type="button" onClick={() => setStatusFilter("vse")}>
            vsi statusi <span>{applications.length}</span>
          </button>
          {programmeApplicationStatuses.map((status) => {
            const count = applications.filter((application) => application.status === status).length;
            return (
              <button key={status} className={statusFilter === status ? "selected" : ""} type="button" onClick={() => setStatusFilter(status)}>
                {programmeApplicationStatusLabel(status)} <span>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="toolbar">
          <label>
            Program
            <select value={programmeFilter} onChange={(event) => setProgrammeFilter(event.target.value)}>
              <option value="vsi">vsi programi</option>
              {programmes.map((programme) => (
                <option key={programme.id} value={programme.id}>
                  {programme.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </AdminPanel>
      <AdminPanel title="Seznam prijav">
        {filteredApplications.length ? (
          <div className="table admin-programme-applications-table">
            {filteredApplications.map((application) => (
              <ProgrammeApplicationRow key={application.id} application={application} />
            ))}
          </div>
        ) : (
          <EmptyState text="Za izbrane filtre ni prijav." />
        )}
      </AdminPanel>
    </>
  );
}

function AdminProgrammeApplicationDetail() {
  const { applicationId = "" } = useParams();
  const { applications, updateApplication } = usePrototypeProgrammeApplications();
  const [draftStatus, setDraftStatus] = useState<ProgrammeApplicationStatus>("novo");
  const [noteText, setNoteText] = useState("");
  const [saved, setSaved] = useState(false);
  const application = applications.find((item) => item.id === applicationId);
  if (!application) return <NotFound backTo="/admin/programi/prijave" />;
  const programme = getProgrammeById(application.programmeId);
  useEffect(() => { setDraftStatus(application.status); setNoteText(""); }, [application.id, application.status]);
  const saveStatus = () => { updateApplication(application.id, { status: draftStatus }); setSaved(true); };
  const addNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = noteText.trim();
    if (!text) return;
    updateApplication(application.id, { internalNotes: [text, ...application.internalNotes] });
    setNoteText("");
    setSaved(true);
  };

  return (
    <>
      <header className="admin-list-head">
        <h1>{application.participantName}</h1>
        <Link className="button" to="/admin/programi/prijave">
          Nazaj na prijave
        </Link>
      </header>

      <div className="admin-event-detail-grid">
          <div className="admin-event-main">
            <AdminPanel title="Prijava">
              <FactList
                items={[
                  ["Email", application.email],
                  ["Organizacija", application.organisationName || "ni navedeno"],
                  ["Vloga", application.role]
                ]}
              />
              <h3>Oddani podatki</h3>
              <p>{application.submittedData}</p>
            </AdminPanel>

            <AdminPanel title="Interne opombe">
              <form className="note-form" onSubmit={addNote}>
                <label>Nova opomba<textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Dodaj interno opombo ..." /></label>
                <button type="submit">Dodaj opombo</button>
              </form>
              {application.internalNotes.length ? (
                <div className="admin-linked-list">
                  {application.internalNotes.map((note) => (
                    <MiniItem key={note} title={note} meta={application.owner} />
                  ))}
                </div>
              ) : (
                <EmptyState text="Ni internih opomb." />
              )}
            </AdminPanel>
          </div>

          <aside className="admin-event-sidebar">
            <AdminPanel title="Status prijave">
              <FactList
                items={[
                  ["Status", programmeApplicationStatusLabel(application.status)],
                  ["Program", programme?.title || application.programmeId],
                  ["Owner", application.owner],
                  ["Mentor", application.mentor || "ni dodeljen"],
                  ["Oddano", formatDateTime(application.submittedAt)]
                ]}
              />
              <label>Spremeni status<select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as ProgrammeApplicationStatus)}>{programmeApplicationStatuses.map((status) => <option key={status} value={status}>{programmeApplicationStatusLabel(status)}</option>)}</select></label>
              <div className="approval-actions"><button className="primary" type="button" onClick={saveStatus}>Shrani status</button></div>
              <h3>Naslednji korak</h3><p>{application.nextStep}</p>
              {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
            </AdminPanel>
          </aside>
      </div>
    </>
  );
}

type StaticContentNodeKind = "editable-page" | "editable-block" | "module-owned" | "mixed-page" | "utility-page";

interface StaticContentNode {
  id: string;
  title: string;
  path: string;
  kind: StaticContentNodeKind;
  owner: string;
  status: "draft" | "published" | "mixed" | "external";
  description: string;
  fields?: string[];
  blocks?: string[];
  moduleLinks?: { label: string; to: string; note: string }[];
  children?: StaticContentNode[];
}

const staticContentTree: StaticContentNode[] = [
  {
    id: "home",
    title: "DOM",
    path: "/",
    kind: "mixed-page",
    owner: "Statična vsebina + moduli",
    status: "mixed",
    description: "Vstopna stran združuje uredniški uvod, izpostavljene dogodke, prostore, skupnost in novice.",
    fields: ["hero naslov", "uvodni tekst", "primarni CTA", "zaključni CTA"],
    moduleLinks: [
      { label: "Dogodki", to: "/admin/dogodki", note: "Izpostavljeni in prihajajoči dogodki prihajajo iz modula Dogodki." },
      { label: "Prostori", to: "/admin/prostori/sobe", note: "Kartice prostorov prihajajo iz modula Prostori." },
      { label: "Novice", to: "/admin/novice", note: "Zadnje novice prihajajo iz modula Novice." }
    ]
  },
  {
    id: "presentation",
    title: "Predstavitev",
    path: "/predstavitev",
    kind: "editable-page",
    owner: "Statična vsebina",
    status: "draft",
    description: "Osnovna predstavitev DOM, hiše, programa, partnerjev in javnega konteksta.",
    fields: ["naslov strani", "uvod", "kaj je DOM", "hiša in prenova", "partnerji", "CTA za kontakt"],
    children: [
      {
        id: "presentation-contact",
        title: "Kontakt",
        path: "/predstavitev/kontakt",
        kind: "editable-page",
        owner: "Statična vsebina",
        status: "draft",
        description: "Kontaktni podatki in javni kontaktni vstop za vprašanja, medije, partnerstva in program.",
        fields: ["javni naslov", "kontaktni emaili", "telefon", "tema povpraševanja", "potrditveno sporočilo"]
      },
      {
        id: "presentation-access",
        title: "Dostop",
        path: "/predstavitev/dostop",
        kind: "editable-page",
        owner: "Statična vsebina",
        status: "draft",
        description: "Lokacija, dostopnost, prihod do stavbe in praktične informacije za obiskovalce.",
        fields: ["naslov", "dostop z javnim prevozom", "parkiranje", "dostopnost", "zemljevid povezava"]
      },
      {
        id: "presentation-cafe",
        title: "Kavarna",
        path: "/predstavitev/kavarna",
        kind: "editable-page",
        owner: "Statična vsebina",
        status: "draft",
        description: "Javna predstavitev kavarne, ponudbe, odpiralnega časa in povezave s programom hiše.",
        fields: ["uvod", "ponudba", "odpiralni čas", "meni povezava", "fotke in opisi"]
      },
      {
        id: "presentation-partners",
        title: "Partnerji",
        path: "/predstavitev/partnerji",
        kind: "editable-block",
        owner: "Statična vsebina",
        status: "draft",
        description: "Ponovljiv blok za partnerje, funderje in evropski programski kontekst.",
        blocks: ["glavni partnerji", "funderji", "programski partnerji", "logo pas", "kratka pojasnila"]
      }
    ]
  },
  {
    id: "spaces",
    title: "Prostori",
    path: "/prostori",
    kind: "module-owned",
    owner: "Prostori in rezervacije",
    status: "external",
    description: "Pregled prostorov se sestavi iz objavljenih prostorskih zapisov in njihovih javnih nastavitev.",
    moduleLinks: [
      { label: "Odpri prostore", to: "/admin/prostori/sobe", note: "Urejanje prostorov, vidnosti, kapacitet, opreme in javnih opisov." }
    ],
    children: [
      {
        id: "spaces-rental",
        title: "Najem prostora",
        path: "/prostori/najem",
        kind: "editable-page",
        owner: "Statična vsebina",
        status: "draft",
        description: "Razlaga postopka pred obrazcem za povpraševanje po prostoru.",
        fields: ["komu je namenjeno", "kateri podatki so potrebni", "procesni koraki", "pogoji", "CTA do povpraševanja"]
      },
      {
        id: "spaces-detail",
        title: "Posamezen prostor",
        path: "/prostori/:slug",
        kind: "module-owned",
        owner: "Prostori in rezervacije",
        status: "external",
        description: "Detail stran prostora je javni prikaz posameznega prostorskega zapisa.",
        moduleLinks: [
          { label: "Uredi seznam prostorov", to: "/admin/prostori/sobe", note: "Tu se urejajo posamezni prostori in njihova javna vidnost." }
        ]
      }
    ]
  },
  {
    id: "events",
    title: "Dogodki",
    path: "/dogodki",
    kind: "module-owned",
    owner: "Dogodki",
    status: "external",
    description: "Seznam, arhiv in detail strani dogodkov izhajajo iz objavljenih dogodkov.",
    moduleLinks: [
      { label: "Odpri dogodke", to: "/admin/dogodki", note: "Urejanje dogodkov, datumov, lokacij, prijav in objave." }
    ],
    children: [
      {
        id: "events-archive",
        title: "Arhiv",
        path: "/dogodki/arhiv",
        kind: "module-owned",
        owner: "Dogodki",
        status: "external",
        description: "Arhiv prikazuje dogodke s statusom arhivirano.",
        moduleLinks: [
          { label: "Odpri dogodke", to: "/admin/dogodki", note: "Status dogodkov določa, ali so vidni v tekočem seznamu ali arhivu." }
        ]
      },
      {
        id: "events-detail",
        title: "Posamezen dogodek",
        path: "/dogodki/:slug",
        kind: "module-owned",
        owner: "Dogodki",
        status: "external",
        description: "Detail stran dogodka je javni prikaz posameznega dogodka.",
        moduleLinks: [
          { label: "Odpri dogodke", to: "/admin/dogodki", note: "Posamezen dogodek se ureja v modulu Dogodki." }
        ]
      }
    ]
  },
  {
    id: "community",
    title: "Skupnost",
    path: "/skupnost",
    kind: "mixed-page",
    owner: "Statična vsebina + Programi",
    status: "mixed",
    description: "Skupnost združuje uredniški uvod, programe, organizacije in javne profile.",
    fields: ["uvodni tekst", "manifest skupnosti", "CTA za sodelovanje"],
    moduleLinks: [
      { label: "Programi", to: "/admin/programi", note: "Programske strani in prijave so v modulu Programi." },
      { label: "Statična vsebina", to: "/admin/staticna-vsebina", note: "Uvodni in pojasnjevalni bloki ostanejo tukaj." }
    ],
    children: [
      {
        id: "community-programme",
        title: "Program",
        path: "/skupnost/programi/:slug",
        kind: "module-owned",
        owner: "Programi",
        status: "external",
        description: "Programski detail je javni prikaz programskega zapisa.",
        moduleLinks: [
          { label: "Odpri programe", to: "/admin/programi", note: "Urejanje programov, statusov, prijav in povezanih dogodkov." }
        ]
      }
    ]
  },
  {
    id: "news",
    title: "Novice",
    path: "/novice",
    kind: "module-owned",
    owner: "Novice",
    status: "external",
    description: "Seznam in detail strani novic pripadajo uredniškemu modulu Novice.",
    moduleLinks: [
      { label: "Odpri novice", to: "/admin/novice", note: "Urejanje novic, pozivov, obvestil in PR obvestil." }
    ],
    children: [
      {
        id: "news-detail",
        title: "Posamezna novica",
        path: "/novice/:slug",
        kind: "module-owned",
        owner: "Novice",
        status: "external",
        description: "Detail stran novice je javni prikaz posameznega uredniškega zapisa.",
        moduleLinks: [
          { label: "Odpri novice", to: "/admin/novice", note: "Posamezna novica se ureja v modulu Novice." }
        ]
      }
    ]
  },
  {
    id: "footer",
    title: "Footer",
    path: "globalni blok",
    kind: "editable-block",
    owner: "Statična vsebina",
    status: "draft",
    description: "Ponovljiv spodnji del javnega spletnega mesta.",
    blocks: ["kontakt", "odpiralni čas", "newsletter", "socialna omrežja", "partner/funding pas", "utility povezave"]
  },
  {
    id: "terms",
    title: "Pogoji uporabe",
    path: "/pogoji-uporabe",
    kind: "utility-page",
    owner: "Statična vsebina",
    status: "draft",
    description: "Utility stran za pogoje uporabe javnega spletnega mesta.",
    fields: ["naslov", "pravni tekst", "datum zadnje posodobitve"]
  },
  {
    id: "privacy",
    title: "Zasebnost",
    path: "/zasebnost",
    kind: "utility-page",
    owner: "Statična vsebina",
    status: "draft",
    description: "Utility stran za zasebnost in obdelavo osebnih podatkov.",
    fields: ["naslov", "pravni tekst", "kontakt za zasebnost", "datum zadnje posodobitve"]
  }
];

const staticContentNodeIndex = flattenStaticContentTree(staticContentTree);

function flattenStaticContentTree(nodes: StaticContentNode[]): StaticContentNode[] {
  return nodes.flatMap((node) => [node, ...(node.children ? flattenStaticContentTree(node.children) : [])]);
}

function AdminStaticContent() {
  const [selectedNodeId, setSelectedNodeId] = useState("home");
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(["presentation", "spaces", "events", "community", "news"]);
  const [saved, setSaved] = useState(false);
  const selectedNode = staticContentNodeIndex.find((node) => node.id === selectedNodeId) || staticContentTree[0];
  const editableCount = staticContentNodeIndex.filter((node) => node.kind === "editable-page" || node.kind === "editable-block" || node.kind === "utility-page").length;
  const moduleOwnedCount = staticContentNodeIndex.filter((node) => node.kind === "module-owned").length;

  const selectNode = (node: StaticContentNode) => {
    setSelectedNodeId(node.id);
    setSaved(false);
    if (node.children?.length && !expandedNodeIds.includes(node.id)) {
      setExpandedNodeIds((current) => [...current, node.id]);
    }
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodeIds((current) => (current.includes(nodeId) ? current.filter((id) => id !== nodeId) : [...current, nodeId]));
  };

  return (
    <>
      <AdminHeader title="Statična vsebina" text="Zemljevid javnega weba: pokaže, katere strani se urejajo tukaj in katere pripadajo specializiranim modulom." />
      <div className="static-content-layout">
        <aside className="static-content-tree-panel" aria-label="Drevo spletnih strani">
          <div className="static-content-tree-head">
            <h2>Drevo web strani</h2>
            <p>{editableCount} uredljivih vsebin · {moduleOwnedCount} bližnjic do modulov</p>
          </div>
          <StaticContentTree
            nodes={staticContentTree}
            selectedNodeId={selectedNode.id}
            expandedNodeIds={expandedNodeIds}
            onSelect={selectNode}
            onToggle={toggleNode}
          />
        </aside>
        <section className="static-content-detail" aria-live="polite">
          <StaticContentDetail node={selectedNode} saved={saved} onSave={() => setSaved(true)} />
        </section>
      </div>
    </>
  );
}

function StaticContentTree({
  nodes,
  selectedNodeId,
  expandedNodeIds,
  onSelect,
  onToggle,
  level = 0
}: {
  nodes: StaticContentNode[];
  selectedNodeId: string;
  expandedNodeIds: string[];
  onSelect: (node: StaticContentNode) => void;
  onToggle: (nodeId: string) => void;
  level?: number;
}) {
  return (
    <ul className={`static-content-tree level-${level}`}>
      {nodes.map((node) => {
        const isExpanded = expandedNodeIds.includes(node.id);
        const hasChildren = Boolean(node.children?.length);
        return (
          <li key={node.id}>
            <div className={`static-content-tree-row ${selectedNodeId === node.id ? "selected" : ""}`} style={{ paddingLeft: `${level * 14}px` }}>
              {hasChildren ? (
                <button className="static-content-expand" type="button" aria-label={isExpanded ? `Zapri ${node.title}` : `Odpri ${node.title}`} onClick={() => onToggle(node.id)}>
                  {isExpanded ? "-" : "+"}
                </button>
              ) : (
                <span className="static-content-expand-spacer" aria-hidden="true" />
              )}
              <button className="static-content-node-button" type="button" onClick={() => onSelect(node)}>
                <strong>{node.title}</strong>
                <span>{node.path}</span>
              </button>
            </div>
            {hasChildren && isExpanded ? (
              <StaticContentTree
                nodes={node.children || []}
                selectedNodeId={selectedNodeId}
                expandedNodeIds={expandedNodeIds}
                onSelect={onSelect}
                onToggle={onToggle}
                level={level + 1}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function StaticContentDetail({ node, saved, onSave }: { node: StaticContentNode; saved: boolean; onSave: () => void }) {
  const isEditable = node.kind === "editable-page" || node.kind === "editable-block" || node.kind === "utility-page" || node.kind === "mixed-page";
  return (
    <div className="static-content-detail-stack">
      <AdminPanel title={node.title}>
        <div className="static-content-detail-head">
          <div>
            <p className="eyebrow">{staticContentKindLabel(node.kind)}</p>
            <h3>{node.path}</h3>
            <p>{node.description}</p>
          </div>
          <span className={`static-content-owner-tag ${node.kind === "module-owned" ? "external" : ""}`}>{node.owner}</span>
        </div>
        <FactList
          items={[
            ["Tip", staticContentKindLabel(node.kind)],
            ["Lastnik", node.owner],
            ["Status", staticContentStatusLabel(node.status)]
          ]}
        />
      </AdminPanel>

      {node.kind === "module-owned" ? <StaticContentModuleRedirect node={node} /> : null}
      {node.kind === "mixed-page" ? <StaticContentMixedPanel node={node} onSave={onSave} /> : null}
      {isEditable && node.kind !== "module-owned" && node.kind !== "mixed-page" ? <StaticContentEditor node={node} onSave={onSave} /> : null}
      {node.moduleLinks?.length && node.kind !== "module-owned" ? <StaticContentModuleLinks links={node.moduleLinks} /> : null}
      {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
    </div>
  );
}

function StaticContentEditor({ node, onSave }: { node: StaticContentNode; onSave: () => void }) {
  return (
    <AdminPanel title={node.kind === "editable-block" ? "Urejanje bloka" : "Urejanje strani"}>
      <form className="admin-event-form-grid" onSubmit={(event) => { event.preventDefault(); onSave(); }}>
        <label>
          Naslov
          <input defaultValue={node.title} />
        </label>
        <label>
          URL / mesto prikaza
          <input defaultValue={node.path} />
        </label>
        <label>
          Status objave
          <select defaultValue={node.status === "published" ? "published" : "draft"}>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label>
          Jezik
          <select defaultValue="sl">
            <option value="sl">slovenščina</option>
            <option value="en">angleščina</option>
          </select>
        </label>
        <label className="full-field">
          Kratek opis
          <textarea defaultValue={node.description} />
        </label>
        <label className="full-field">
          Vsebinski sklopi
          <textarea className="tall-textarea" defaultValue={(node.fields || node.blocks || []).join("\n")} />
        </label>
        <label className="full-field">
          SEO opis
          <textarea defaultValue={`Kratek javni opis za ${node.title}.`} />
        </label>
        <div className="inline-actions full-field">
          <button className="button primary" type="submit">Shrani osnutek</button>
          <button className="button" type="button">Predogled</button>
        </div>
      </form>
    </AdminPanel>
  );
}

function StaticContentMixedPanel({ node, onSave }: { node: StaticContentNode; onSave: () => void }) {
  return (
    <AdminPanel title="Mešana stran">
      <p>Ta stran ima uredniške bloke tukaj, dinamični deli pa prihajajo iz drugih modulov.</p>
      <form className="admin-event-form-grid" onSubmit={(event) => { event.preventDefault(); onSave(); }}>
        <label>
          Naslov
          <input defaultValue={node.title} />
        </label>
        <label>
          URL
          <input defaultValue={node.path} />
        </label>
        <label className="full-field">
          Uredniški uvod
          <textarea defaultValue={(node.fields || []).join("\n")} />
        </label>
        <div className="inline-actions full-field">
          <button className="button primary" type="submit">Shrani uredniške bloke</button>
        </div>
      </form>
      {node.moduleLinks?.length ? <StaticContentModuleLinks links={node.moduleLinks} /> : null}
    </AdminPanel>
  );
}

function StaticContentModuleRedirect({ node }: { node: StaticContentNode }) {
  return (
    <AdminPanel title="Ta vsebina se ureja drugje">
      <p>Ta javna stran je del spletnega drevesa, vendar vsebinski zapisi in workflow pripadajo modulu {node.owner}.</p>
      {node.moduleLinks?.length ? <StaticContentModuleLinks links={node.moduleLinks} /> : null}
    </AdminPanel>
  );
}

function StaticContentModuleLinks({ links }: { links: { label: string; to: string; note: string }[] }) {
  return (
    <div className="static-content-module-links">
      {links.map((link) => (
        <div className="static-content-module-link" key={`${link.label}-${link.to}`}>
          <div>
            <strong>{link.label}</strong>
            <p>{link.note}</p>
          </div>
          <Link className="button" to={link.to}>Odpri modul</Link>
        </div>
      ))}
    </div>
  );
}

function staticContentKindLabel(kind: StaticContentNodeKind) {
  if (kind === "editable-page") return "uredljiva stran";
  if (kind === "editable-block") return "uredljiv blok";
  if (kind === "module-owned") return "modulska vsebina";
  if (kind === "mixed-page") return "mešana stran";
  return "utility stran";
}

function staticContentStatusLabel(status: StaticContentNode["status"]) {
  if (status === "mixed") return "mešano";
  if (status === "external") return "ureja modul";
  if (status === "published") return "published";
  return "draft";
}

function AdminShop() {
  const products = shopProducts.slice().sort((first, second) => first.title.localeCompare(second.title, "sl"));
  const publishedCount = products.filter((product) => product.status === "published").length;

  return (
    <>
      <AdminHeader
        title="Trgovina"
        text="Admin katalog merch izdelkov. V prototipu upravljamo javni prikaz izdelkov, variante, cene in povezavo na zunanji shop modul."
        action={<Link className="button primary" to="/admin/trgovina/nov">Dodaj izdelek</Link>}
      />
      <ThreeColumns>
        <AdminPanel title="Izdelki">
          <strong className="admin-stat-number">{products.length}</strong>
          <p>v katalogu</p>
        </AdminPanel>
        <AdminPanel title="Objavljeno">
          <strong className="admin-stat-number">{publishedCount}</strong>
          <p>vidnih na javni strani</p>
        </AdminPanel>
        <AdminPanel title="Integracija">
          <strong className="admin-stat-number">zunanji modul</strong>
          <p>checkout, plačila, dostava in naročila</p>
        </AdminPanel>
      </ThreeColumns>
      <AdminPanel title="Seznam izdelkov">
        <div className="table admin-shop-table">
          <div className="table-row table-head">
            <strong>Izdelek</strong>
            <span>Kategorija</span>
            <span>Cena</span>
            <span>Variante</span>
            <span>Status</span>
            <span>Shop ref</span>
          </div>
          {products.map((product) => (
            <AdminProductRow key={product.id} product={product} />
          ))}
        </div>
      </AdminPanel>
    </>
  );
}

function AdminNewProduct() {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Dodaj izdelek</h1>
          <p>Osnovni prototipni obrazec za nov merch izdelek.</p>
        </div>
        <Link className="button" to="/admin/trgovina">Nazaj na trgovino</Link>
      </header>
      <AdminPanel title="Nov izdelek">
        <form className="admin-event-form-grid" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
          <label>
            Naziv
            <input name="title" placeholder="DOM izdelek" />
          </label>
          <label>
            Slug
            <input name="slug" placeholder="dom-izdelek" />
          </label>
          <label>
            Kategorija
            <select name="category" defaultValue="dodatki">
              <option value="oblacila">Oblačila</option>
              <option value="dodatki">Dodatki</option>
              <option value="papir">Papir</option>
              <option value="seti">Seti</option>
            </select>
          </label>
          <label>
            Cena
            <input name="price" placeholder="24,00 EUR" />
          </label>
          <label>
            Status
            <select name="status" defaultValue="draft">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
          <label>
            Zunanji shop ref
            <input name="externalModuleRef" placeholder="shop-product-..." />
          </label>
          <label className="full-field">
            Kratek opis
            <textarea name="shortDescription" placeholder="Kratek opis za seznam izdelkov" />
          </label>
          <label className="full-field">
            Opis
            <textarea className="tall-textarea" name="description" placeholder="Opis za detail izdelka" />
          </label>
          <label className="full-field">
            Variante
            <textarea name="variants" placeholder="Velikost | S | na voljo" />
          </label>
          <label className="full-field">
            Slike
            <textarea name="images" placeholder="Ena oznaka slike na vrstico" />
          </label>
          <div className="inline-actions full-field">
            <button className="button primary" type="submit">Shrani osnutek</button>
          </div>
          {saved && <p className="save-state full-field">Izdelek je označen kot shranjen v prototipu.</p>}
        </form>
      </AdminPanel>
    </>
  );
}

function AdminProductDetail() {
  const { slug = "" } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const product = getShopProductBySlug(slug);
  if (!product) return <NotFound backTo="/admin/trgovina" />;

  const saveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    setIsEditing(false);
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>{product.title}</h1>
          <p className="meta">{shopCategoryLabel(product.category)} · {formatPrice(product.priceCents)} · {shopProductStatusLabel(product.status)}</p>
        </div>
        <Link className="button" to="/admin/trgovina">Nazaj na trgovino</Link>
      </header>

      {isEditing ? (
        <form className="admin-event-detail-grid" onSubmit={saveProduct}>
          <div className="admin-event-main">
            <AdminPanel title="Javna vsebina">
              <div className="admin-event-form-grid">
                <label>
                  Naziv
                  <input name="title" defaultValue={product.title} />
                </label>
                <label>
                  Slug
                  <input name="slug" defaultValue={product.slug} />
                </label>
                <label>
                  Kategorija
                  <select name="category" defaultValue={product.category}>
                    <option value="oblacila">Oblačila</option>
                    <option value="dodatki">Dodatki</option>
                    <option value="papir">Papir</option>
                    <option value="seti">Seti</option>
                  </select>
                </label>
                <label>
                  Cena
                  <input name="price" defaultValue={formatPrice(product.priceCents)} />
                </label>
                <label className="full-field">
                  Kratek opis
                  <textarea name="shortDescription" defaultValue={product.shortDescription} />
                </label>
                <label className="full-field">
                  Opis
                  <textarea className="tall-textarea" name="description" defaultValue={product.description} />
                </label>
                <label className="full-field">
                  Oznake
                  <textarea name="tags" defaultValue={product.tags.join("\n")} />
                </label>
              </div>
            </AdminPanel>
            <AdminPanel title="Variante">
              <textarea className="tall-textarea" name="variants" defaultValue={product.variants.map((variant) => `${variant.optionLabel || "Varianta"} | ${variant.label} | ${variant.available ? "na voljo" : "ni na voljo"}`).join("\n")} />
            </AdminPanel>
            <AdminPanel title="Slike">
              <textarea name="imageLabels" defaultValue={product.imageLabels.join("\n")} />
            </AdminPanel>
          </div>
          <aside className="admin-event-sidebar">
            <AdminPanel title="Objava in integracija">
              <label>
                Status
                <select name="status" defaultValue={product.status}>
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </label>
              <label>
                Zunanji shop ref
                <input name="externalModuleRef" defaultValue={product.externalModuleRef || ""} />
              </label>
              <label>
                Prevzem / dostava
                <textarea name="fulfillmentNote" defaultValue={product.fulfillmentNote} />
              </label>
              <div className="inline-actions">
                <button className="button primary" type="submit">Shrani</button>
                <button className="button" type="button" onClick={() => setIsEditing(false)}>Prekliči</button>
              </div>
            </AdminPanel>
          </aside>
        </form>
      ) : (
        <div className="admin-event-detail-grid">
          <div className="admin-event-main">
            <AdminPanel title="Javna vsebina">
              <FactList
                items={[
                  ["ID", product.id],
                  ["Naziv", product.title],
                  ["Slug", product.slug],
                  ["Kategorija", shopCategoryLabel(product.category)],
                  ["Cena", formatPrice(product.priceCents)]
                ]}
              />
              <p>{product.description}</p>
              <TagRow tags={product.tags} />
            </AdminPanel>
            <AdminPanel title="Variante">
              <div className="table admin-product-variants-table">
                <div className="table-row table-head">
                  <strong>Tip</strong>
                  <span>Vrednost</span>
                  <span>Status</span>
                </div>
                {product.variants.map((variant) => (
                  <div className="table-row" key={variant.id}>
                    <strong>{variant.optionLabel || "Varianta"}</strong>
                    <span>{variant.label}</span>
                    <span>{variant.available ? "na voljo" : "ni na voljo"}</span>
                  </div>
                ))}
              </div>
            </AdminPanel>
            <AdminPanel title="Mediji">
              <div className="admin-shop-media-grid">
                {product.imageLabels.map((label) => (
                  <ProductPlaceholderImage key={label} label={label} compact />
                ))}
              </div>
            </AdminPanel>
          </div>
          <aside className="admin-event-sidebar">
            <AdminPanel title="Objava in integracija">
              <FactList
                items={[
                  ["Status", shopProductStatusLabel(product.status)],
                  ["Javna stran", `/trgovina/${product.slug}`],
                  ["Zunanji ref", product.externalModuleRef || "ni nastavljen"],
                  ["Prevzem", product.fulfillmentNote]
                ]}
              />
              <button className="button primary" type="button" onClick={() => setIsEditing(true)}>Uredi</button>
              <Link className="button" to={`/trgovina/${product.slug}`}>Predogled javne strani</Link>
              {saved && <p className="save-state">Spremembe so označene kot shranjene v prototipu.</p>}
            </AdminPanel>
          </aside>
        </div>
      )}
    </>
  );
}

function AdminProductRow({ product }: { product: ShopProduct }) {
  return (
    <Link className="table-row admin-product-row" to={`/admin/trgovina/${product.slug}`}>
      <strong>{product.title}</strong>
      <span>{shopCategoryLabel(product.category)}</span>
      <span>{formatPrice(product.priceCents)}</span>
      <span>{product.variants.length}</span>
      <span>{shopProductStatusLabel(product.status)}</span>
      <span>{product.externalModuleRef || "ni nastavljen"}</span>
    </Link>
  );
}

function shopProductStatusLabel(status: ShopProduct["status"]) {
  const labels: Record<ShopProduct["status"], string> = {
    draft: "osnutek",
    published: "objavljeno",
    archived: "arhivirano"
  };
  return labels[status];
}

function AdminMedia() {
  return (
    <>
      <AdminHeader title="Mediji (integracija)" text="Mock pogled za renderje, tlorise, alt tekste in prihodnji media/DAM vir." />
      <CardGrid>
        {["Velika dvorana render", "Mala dvorana render", "Vadbena dvorana", "Hodnik", "Bar", "Tloris"].map((item) => (
          <AdminPanel key={item} title={item}>
            <PlaceholderImage label={item} />
            <p>alt, caption, credit, povezave na module</p>
          </AdminPanel>
        ))}
      </CardGrid>
    </>
  );
}

function AdminNewsletter() {
  const integration = integrations.find((item) => item.id === "newsletter")!;
  return (
    <>
      <AdminHeader title="Newsletter (integracija)" text="Placeholder za integracijo izbrane zunanje newsletter storitve." />
      <IntegrationPanel integration={integration} />
    </>
  );
}

function AdminSignage() {
  const hallBookings = bookings.filter((booking) => booking.spaceId === "velika-dvorana");
  return (
    <>
      <AdminHeader title="Info ekrani" text="Dva monitorja nad vhodom v veliko dvorano." />
      <ThreeColumns>
        <AdminPanel title="Zdaj v veliki dvorani">
          {hallBookings.slice(0, 1).map((booking) => (
            <MiniItem key={booking.id} title={booking.title} meta={`${formatDate(booking.date)} · ${booking.startTime}-${booking.endTime}`} />
          ))}
        </AdminPanel>
        <AdminPanel title="Rolling program">
          {events.slice(0, 4).map((event) => (
            <MiniItem key={event.id} title={event.title} meta={formatDate(event.date)} />
          ))}
        </AdminPanel>
        <AdminPanel title="Latest news pager">
          {news.slice(0, 3).map((item) => (
            <MiniItem key={item.id} title={item.title} meta={item.category} />
          ))}
        </AdminPanel>
      </ThreeColumns>
      <WirePanel title="Preview dveh monitorjev">
        <div className="signage-preview">
          <div>
            <strong>Monitor 1</strong>
            <p>KAJ SE DOGAJA ZDAJ</p>
            <span>Večer v Veliki dvorani · 20:00</span>
          </div>
          <div>
            <strong>Monitor 2</strong>
            <p>PROGRAM / NOVICE</p>
            <span>Rolling list + latest news pager</span>
          </div>
        </div>
      </WirePanel>
    </>
  );
}

function AdminIntegrations() {
  return (
    <>
      <AdminHeader title="Integracije" text="Aux modul za mapiranje zunanjih sistemov in zahtev." />
      <CardGrid>
        {integrations.map((integration) => (
          <IntegrationPanel key={integration.id} integration={integration} />
        ))}
      </CardGrid>
    </>
  );
}

function AdminUsers() {
  const { users: prototypeUsers } = usePrototypeUsers();
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<"registeredAt" | "name" | "status">("registeredAt");
  const [activeTab, setActiveTab] = useState<"uporabniki" | "clani" | "neaktivni">("uporabniki");
  const registeredUsers = prototypeUsers.filter((user) => user.group === "registriran uporabnik");
  const tabbedUsers = registeredUsers.filter((user) => {
    if (activeTab === "clani") return user.status === "član";
    if (activeTab === "neaktivni") return user.status === "neaktiven";
    return true;
  });
  const normalizedQuery = query.trim().toLowerCase();
  const filteredUsers = tabbedUsers
    .filter((user) => {
      if (!normalizedQuery) return true;
      return [user.name, user.email, user.organisation || "", user.status].some((value) => value.toLowerCase().includes(normalizedQuery));
    })
    .sort((a, b) => {
      if (sortMode === "status") return a.status.localeCompare(b.status, "sl") || a.name.localeCompare(b.name, "sl");
      if (sortMode === "name") return a.name.localeCompare(b.name, "sl");
      return (b.registeredAt || "").localeCompare(a.registeredAt || "") || a.name.localeCompare(b.name, "sl");
    });
  const activeMembersCount = registeredUsers.filter((user) => user.status === "član").length;
  const inactiveCount = registeredUsers.filter((user) => user.status === "neaktiven").length;

  return (
    <>
      <AdminHeader
        title="Uporabniki in člani"
        text="Enoten seznam registriranih website uporabnikov. Članstvo je stanje na uporabniku; sodelavci in admini ostanejo ločen seznam."
        action={<Link className="button primary" to="/admin/uporabniki/nov">Dodaj uporabnika</Link>}
      />
      <section className="admin-panel">
        <div className="admin-user-tabs segmented" aria-label="Pregled uporabnikov in članov">
          <button type="button" className={activeTab === "uporabniki" ? "selected" : ""} onClick={() => setActiveTab("uporabniki")}>Uporabniki ({registeredUsers.length})</button>
          <button type="button" className={activeTab === "clani" ? "selected" : ""} onClick={() => setActiveTab("clani")}>Člani ({activeMembersCount})</button>
          <button type="button" className={activeTab === "neaktivni" ? "selected" : ""} onClick={() => setActiveTab("neaktivni")}>Neaktivni ({inactiveCount})</button>
        </div>
        <div className="admin-table-toolbar">
          <label>
            Hitro iskanje
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ime, email, organizacija ali članstvo" />
          </label>
          <label>
            Razvrsti
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as "registeredAt" | "name" | "status")}>
              <option value="registeredAt">po datumu registracije</option>
              <option value="name">po imenu</option>
              <option value="status">po statusu</option>
            </select>
          </label>
        </div>
        <div className="table admin-user-table">
          <div className="table-row table-head">
            <span>Datum registracije</span>
            <strong>Ime</strong>
            <span>Email</span>
            <span>Organizacija</span>
            <span>Status</span>
          </div>
          {filteredUsers.length ? filteredUsers.map((user) => <UserTableRow key={user.id} user={user} to={`/admin/uporabniki/${user.id}`} />) : <EmptyState text="Ni uporabnikov za izbrani niz." />}
        </div>
      </section>
    </>
  );
}

function AdminNewMembers() {
  const { users: prototypeUsers } = usePrototypeUsers();
  const newMembers = prototypeUsers
    .filter((user) => user.group === "registriran uporabnik" && user.status === "član")
    .sort((a, b) => (b.membershipAppliedAt || b.registeredAt || "").localeCompare(a.membershipAppliedAt || a.registeredAt || "") || a.name.localeCompare(b.name, "sl"));

  return (
    <>
      <AdminHeader
        title="Novi člani"
        text="Seznam članov, urejen po zadnjih prijavah za članstvo."
        action={<Link className="button" to="/admin/uporabniki">Vsi uporabniki in člani</Link>}
      />
      <section className="admin-panel">
        <div className="table admin-new-members-table">
          <div className="table-row table-head">
            <span>Prijava</span>
            <strong>Ime</strong>
            <span>Email</span>
            <span>Organizacija</span>
            <span>Tip</span>
            <span>Članarina</span>
            <span>Račun</span>
          </div>
          {newMembers.length ? (
            newMembers.map((user) => {
              const payment = getMembershipPaymentSummary(user);

              return (
                <Link className="table-row admin-event-row" to={`/admin/uporabniki/${user.id}`} key={user.id}>
                  <span>{formatRegistrationDateTime(user.membershipAppliedAt || user.registeredAt || "")}</span>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span>{user.organisation || "ni navedeno"}</span>
                  <span>{user.membershipType || "brez"}</span>
                  <span className={payment.className}>{payment.label}</span>
                  <span>{payment.invoice}</span>
                </Link>
              );
            })
          ) : (
            <EmptyState text="Ni novih članov." />
          )}
        </div>
      </section>
    </>
  );
}

function AdminUserDetail() {
  const { userId } = useParams();
  const { users: prototypeUsers, updateUser } = usePrototypeUsers();
  const user = prototypeUsers.find((item) => item.id === userId && item.group === "registriran uporabnik");
  const [accessGroup, setAccessGroup] = useState<UserGroup>(user?.group || "registriran uporabnik");
  const [accountStatus, setAccountStatus] = useState<UserStatus>(user?.status || "aktiven");
  const [accessModules, setAccessModules] = useState<AdminModuleAccess[]>(user?.modules || []);
  const [draftGroup, setDraftGroup] = useState<UserGroup>(user?.group || "registriran uporabnik");
  const [draftStatus, setDraftStatus] = useState<UserStatus>(user?.status || "aktiven");
  const [draftModules, setDraftModules] = useState<AdminModuleAccess[]>(user?.modules || []);
  const [draftName, setDraftName] = useState(user?.name || "");
  const [draftEmail, setDraftEmail] = useState(user?.email || "");
  const [draftOrganisation, setDraftOrganisation] = useState(user?.organisation || "");
  const [draftRegisteredAt, setDraftRegisteredAt] = useState(user?.registeredAt || "");
  const [membershipType, setMembershipType] = useState<MembershipType>(user?.membershipType || "brez");
  const [membershipAppliedAt, setMembershipAppliedAt] = useState(user?.membershipAppliedAt || "");
  const [membershipStartAt, setMembershipStartAt] = useState(user?.membershipStartAt || "");
  const [membershipEndAt, setMembershipEndAt] = useState(user?.membershipEndAt || "");
  const [membershipNote, setMembershipNote] = useState(user?.membershipNote || "");
  const [draftMembershipType, setDraftMembershipType] = useState<MembershipType>(user?.membershipType || "brez");
  const [draftMembershipAppliedAt, setDraftMembershipAppliedAt] = useState(user?.membershipAppliedAt || "");
  const [draftMembershipStartAt, setDraftMembershipStartAt] = useState(user?.membershipStartAt || "");
  const [draftMembershipEndAt, setDraftMembershipEndAt] = useState(user?.membershipEndAt || "");
  const [draftMembershipNote, setDraftMembershipNote] = useState(user?.membershipNote || "");
  const [draftPaymentPaidAt, setDraftPaymentPaidAt] = useState(user?.membershipPayments?.[0]?.paidAt || "");
  const [draftPaymentAmount, setDraftPaymentAmount] = useState(user?.membershipPayments?.[0]?.amount || "");
  const [draftPaymentInvoiceNumber, setDraftPaymentInvoiceNumber] = useState(user?.membershipPayments?.[0]?.invoiceNumber || "");
  const [draftPaymentInvoiceStatus, setDraftPaymentInvoiceStatus] = useState<"izdan" | "plačan" | "storno">(user?.membershipPayments?.[0]?.invoiceStatus || "plačan");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return <NotFound backTo="/admin/uporabniki" />;

  const membershipPayments = user.membershipPayments || [];
  const beginProfileEdit = () => {
    setDraftGroup(accessGroup);
    setDraftStatus(accountStatus);
    setDraftModules(accessModules);
    setDraftName(user.name);
    setDraftEmail(user.email);
    setDraftOrganisation(user.organisation || "");
    setDraftRegisteredAt(user.registeredAt || "");
    setDraftMembershipType(membershipType);
    setDraftMembershipAppliedAt(membershipAppliedAt);
    setDraftMembershipStartAt(membershipStartAt);
    setDraftMembershipEndAt(membershipEndAt);
    setDraftMembershipNote(membershipNote);
    setDraftPaymentPaidAt(membershipPayments[0]?.paidAt || "");
    setDraftPaymentAmount(membershipPayments[0]?.amount || "");
    setDraftPaymentInvoiceNumber(membershipPayments[0]?.invoiceNumber || "");
    setDraftPaymentInvoiceStatus(membershipPayments[0]?.invoiceStatus || "plačan");
    setSaved(false);
    setIsEditingProfile(true);
  };
  const toggleDraftModule = (module: AdminModuleAccess) => {
    setDraftModules((current) => (current.includes(module) ? current.filter((item) => item !== module) : [...current, module]));
  };
  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccessGroup(draftGroup);
    setAccountStatus(draftStatus);
    setAccessModules(draftGroup === "sodelavec" ? draftModules : []);
    setMembershipType(draftMembershipType);
    setMembershipAppliedAt(draftMembershipAppliedAt);
    setMembershipStartAt(draftMembershipStartAt);
    setMembershipEndAt(draftMembershipEndAt);
    setMembershipNote(draftMembershipNote);
    updateUser(user.id, {
      group: draftGroup,
      name: draftName,
      email: draftEmail,
      organisation: draftOrganisation || undefined,
      registeredAt: draftRegisteredAt || undefined,
      status: draftStatus,
      modules: draftGroup === "sodelavec" ? draftModules : [],
      membershipType: draftMembershipType,
      membershipAppliedAt: draftMembershipAppliedAt,
      membershipStartAt: draftMembershipStartAt,
      membershipEndAt: draftMembershipEndAt,
      membershipNote: draftMembershipNote,
      membershipPayments: draftMembershipType !== "brez" && (draftPaymentAmount || draftPaymentInvoiceNumber) ? [{
        id: membershipPayments[0]?.id || `${user.id}-clanarina-1`,
        period: `${draftMembershipStartAt || draftRegisteredAt || "ni določeno"} - ${draftMembershipEndAt || "ni določeno"}`,
        paidAt: draftPaymentPaidAt || draftMembershipStartAt || draftRegisteredAt || prototypeTodayKey,
        amount: draftPaymentAmount || "ni določeno",
        invoiceNumber: draftPaymentInvoiceNumber || "ni določeno",
        invoiceStatus: draftPaymentInvoiceStatus
      }] : []
    });
    setSaved(true);
    setIsEditingProfile(false);
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>{user.name}</h1>
          <p>{accountStatus} · {user.email}</p>
        </div>
        <Link className="button" to="/admin/uporabniki">Nazaj na uporabnike in člane</Link>
      </header>
      <div className="admin-event-detail-grid">
        <div className="admin-event-main">
          <AdminPanel title="Identiteta">
            <FactList
              items={[
                ["Ime", user.name],
                ["Email", user.email],
                ["Organizacija", user.organisation || "ni navedeno"],
                ["Datum registracije", user.registeredAt ? formatRegistrationDateTime(user.registeredAt) : "ni navedeno"],
                ["Status", accountStatus]
              ]}
            />
          </AdminPanel>
          <AdminPanel title="Članstvo">
            <FactList
              items={[
                ["Tip članstva", membershipType],
                ["Datum prijave", formatOptionalDate(membershipAppliedAt)],
                ["Datum začetka", formatOptionalDate(membershipStartAt)],
                ["Velja do", formatOptionalDate(membershipEndAt)],
                ["Interna opomba", membershipNote || "ni opombe"]
              ]}
            />
          </AdminPanel>
          <AdminPanel title="Billing članarin">
            {membershipPayments.length ? (
              <div className="table membership-billing-table">
                <div className="table-row table-head">
                  <strong>Obdobje</strong>
                  <span>Plačano</span>
                  <span>Znesek</span>
                  <span>Račun</span>
                  <span>Status</span>
                </div>
                {membershipPayments.map((payment) => (
                  <div className="table-row" key={payment.id}>
                    <strong>{payment.period}</strong>
                    <span>{formatDate(payment.paidAt)}</span>
                    <span>{payment.amount}</span>
                    <span>{payment.invoiceNumber}</span>
                    <span>{payment.invoiceStatus}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Ni plačanih članarin." />
            )}
          </AdminPanel>
          <AdminPanel title="Zgodovina">
            <UserHistoryList user={user} />
          </AdminPanel>
        </div>
        <aside className="admin-event-sidebar">
          <AdminPanel title="Urejanje">
            {isEditingProfile ? (
              <UserMembershipEditForm
                draftGroup={draftGroup}
                draftStatus={draftStatus}
                draftModules={draftModules}
                draftName={draftName}
                draftEmail={draftEmail}
                draftOrganisation={draftOrganisation}
                draftRegisteredAt={draftRegisteredAt}
                draftMembershipType={draftMembershipType}
                draftMembershipAppliedAt={draftMembershipAppliedAt}
                draftMembershipStartAt={draftMembershipStartAt}
                draftMembershipEndAt={draftMembershipEndAt}
                draftMembershipNote={draftMembershipNote}
                draftPaymentPaidAt={draftPaymentPaidAt}
                draftPaymentAmount={draftPaymentAmount}
                draftPaymentInvoiceNumber={draftPaymentInvoiceNumber}
                draftPaymentInvoiceStatus={draftPaymentInvoiceStatus}
                groupOptions={["registriran uporabnik", "sodelavec"]}
                onGroupChange={(group) => setDraftGroup(group)}
                onNameChange={setDraftName}
                onEmailChange={setDraftEmail}
                onOrganisationChange={setDraftOrganisation}
                onRegisteredAtChange={setDraftRegisteredAt}
                onStatusChange={setDraftStatus}
                onMembershipTypeChange={setDraftMembershipType}
                onMembershipAppliedAtChange={setDraftMembershipAppliedAt}
                onMembershipStartAtChange={setDraftMembershipStartAt}
                onMembershipEndAtChange={setDraftMembershipEndAt}
                onMembershipNoteChange={setDraftMembershipNote}
                onPaymentPaidAtChange={setDraftPaymentPaidAt}
                onPaymentAmountChange={setDraftPaymentAmount}
                onPaymentInvoiceNumberChange={setDraftPaymentInvoiceNumber}
                onPaymentInvoiceStatusChange={setDraftPaymentInvoiceStatus}
                onModuleToggle={toggleDraftModule}
                onSubmit={saveProfile}
              />
            ) : (
              <>
                <FactList items={[["Skupina", accessGroup], ["Status", accountStatus], ["Admin moduli", formatAdminAccessSummary(accessGroup, accessModules)]]} />
                <button className="button primary" type="button" onClick={beginProfileEdit}>Uredi</button>
                {saved && <p className="save-state">Sprememba je označena kot shranjena v prototipu.</p>}
              </>
            )}
          </AdminPanel>
        </aside>
      </div>
    </>
  );
}

function AdminUserCreate() {
  const navigate = useNavigate();
  const { addUser } = usePrototypeUsers();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [registeredAt, setRegisteredAt] = useState("");
  const [status, setStatus] = useState<UserStatus>("aktiven");
  const [membershipType, setMembershipType] = useState<MembershipType>("brez");
  const [membershipAppliedAt, setMembershipAppliedAt] = useState("");
  const [membershipStartAt, setMembershipStartAt] = useState("");
  const [membershipEndAt, setMembershipEndAt] = useState("");
  const [membershipNote, setMembershipNote] = useState("");
  const [paymentPaidAt, setPaymentPaidAt] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentInvoiceNumber, setPaymentInvoiceNumber] = useState("");
  const [paymentInvoiceStatus, setPaymentInvoiceStatus] = useState<"izdan" | "plačan" | "storno">("plačan");

  const saveUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = `u-local-${Date.now()}`;
    addUser({
      id,
      name,
      email,
      organisation: organisation || undefined,
      registeredAt: registeredAt || prototypeTodayKey,
      group: "registriran uporabnik",
      status,
      membershipType,
      membershipAppliedAt: membershipAppliedAt || undefined,
      membershipStartAt: membershipStartAt || undefined,
      membershipEndAt: membershipEndAt || undefined,
      membershipNote: membershipNote || undefined,
      membershipPayments: membershipType !== "brez" && (paymentAmount || paymentInvoiceNumber) ? [{
        id: `${id}-clanarina-1`,
        period: `${membershipStartAt || registeredAt || "ni določeno"} - ${membershipEndAt || "ni določeno"}`,
        paidAt: paymentPaidAt || membershipStartAt || registeredAt || prototypeTodayKey,
        amount: paymentAmount || "ni določeno",
        invoiceNumber: paymentInvoiceNumber || "ni določeno",
        invoiceStatus: paymentInvoiceStatus
      }] : [],
      modules: [],
      history: [`${prototypeTodayKey}: uporabnik dodan v prototipu`]
    });
    setSaved(true);
    navigate(`/admin/uporabniki/${id}`);
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Dodaj uporabnika</h1>
          <p>Vnesite enake podatke, kot so prikazani na detajlu uporabnika.</p>
        </div>
        <Link className="button" to="/admin/uporabniki">Nazaj na uporabnike</Link>
      </header>
      <form className="admin-event-detail-grid" onSubmit={saveUser}>
        <div className="admin-event-main">
          <AdminPanel title="Identiteta">
            <div className="admin-event-form-grid">
              <label>
                Ime
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label>
                Organizacija
                <input value={organisation} onChange={(event) => setOrganisation(event.target.value)} />
              </label>
              <label>
                Datum registracije
                <input type="date" value={registeredAt} onChange={(event) => setRegisteredAt(event.target.value)} />
              </label>
            </div>
          </AdminPanel>
          <AdminPanel title="Članstvo">
            <div className="admin-event-form-grid">
              <label>
                Tip članstva
                <select value={membershipType} onChange={(event) => setMembershipType(event.target.value as MembershipType)}>
                  <option value="brez">brez</option>
                  <option value="posameznik">posameznik</option>
                  <option value="organizacija">organizacija</option>
                  <option value="podporni član">podporni član</option>
                </select>
              </label>
              <label>
                Datum prijave
                <input type="date" value={membershipAppliedAt} onChange={(event) => setMembershipAppliedAt(event.target.value)} />
              </label>
              <label>
                Datum začetka
                <input type="date" value={membershipStartAt} onChange={(event) => setMembershipStartAt(event.target.value)} />
              </label>
              <label>
                Velja do
                <input type="date" value={membershipEndAt} onChange={(event) => setMembershipEndAt(event.target.value)} />
              </label>
              <label>
                Interna opomba
                <textarea value={membershipNote} onChange={(event) => setMembershipNote(event.target.value)} rows={3} />
              </label>
            </div>
          </AdminPanel>
          <AdminPanel title="Billing članarin">
            {membershipType === "brez" ? (
              <p className="meta">Za uporabnika brez članstva ni plačilnega zapisa.</p>
            ) : (
              <div className="admin-event-form-grid">
                <label>
                  Plačano
                  <input type="date" value={paymentPaidAt} onChange={(event) => setPaymentPaidAt(event.target.value)} />
                </label>
                <label>
                  Znesek
                  <input value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} placeholder="npr. 40 EUR" />
                </label>
                <label>
                  Račun
                  <input value={paymentInvoiceNumber} onChange={(event) => setPaymentInvoiceNumber(event.target.value)} placeholder="npr. CL-2026-001" />
                </label>
                <label>
                  Status računa
                  <select value={paymentInvoiceStatus} onChange={(event) => setPaymentInvoiceStatus(event.target.value as "izdan" | "plačan" | "storno")}>
                    <option value="izdan">izdan</option>
                    <option value="plačan">plačan</option>
                    <option value="storno">storno</option>
                  </select>
                </label>
              </div>
            )}
          </AdminPanel>
        </div>
        <aside className="admin-event-sidebar">
          <AdminPanel title="Urejanje">
            <label>
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value as UserStatus)}>
                <option value="aktiven">aktiven</option>
                <option value="neaktiven">neaktiven</option>
                <option value="član">član</option>
              </select>
            </label>
            <button className="button primary" type="submit">Shrani uporabnika</button>
            <button className="button" type="button" onClick={() => navigate("/admin/uporabniki")}>Prekliči</button>
            {saved && <p className="save-state">Uporabnik je označen kot dodan v prototipu.</p>}
          </AdminPanel>
        </aside>
      </form>
    </>
  );
}

function AdminCollaborators() {
  const { users: prototypeUsers } = usePrototypeUsers();
  const collaborators = prototypeUsers
    .filter((user) => user.group === "sodelavec" || user.group === "administrator")
    .sort((a, b) => a.group.localeCompare(b.group, "sl") || a.name.localeCompare(b.name, "sl"));

  return (
    <>
      <AdminHeader
        title="Sodelavci"
        text="Interni uporabniki admina. Sodelavec dobi dostop do admina, ko ima dodeljen vsaj en modul."
        action={<Link className="button primary" to="/admin/sodelavci/nov">Dodaj sodelavca</Link>}
      />
      <AdminPanel title="Seznam sodelavcev">
        <div className="table admin-collaborator-table">
          <div className="table-row table-head">
            <strong>Ime</strong>
            <span>Skupina</span>
            <span>Funkcija</span>
            <span>Dostopi</span>
          </div>
          {collaborators.map((user) => <CollaboratorTableRow key={user.id} user={user} />)}
        </div>
      </AdminPanel>
    </>
  );
}

function AdminCollaboratorDetail() {
  const { userId } = useParams();
  const { users: prototypeUsers, updateUser } = usePrototypeUsers();
  const user = prototypeUsers.find((item) => item.id === userId && (item.group === "sodelavec" || item.group === "administrator"));
  const [accessGroup, setAccessGroup] = useState<UserGroup>(user?.group || "sodelavec");
  const [accessModules, setAccessModules] = useState<AdminModuleAccess[]>(user?.modules || []);
  const [draftGroup, setDraftGroup] = useState<UserGroup>(user?.group || "sodelavec");
  const [draftModules, setDraftModules] = useState<AdminModuleAccess[]>(user?.modules || []);
  const [isEditingAccess, setIsEditingAccess] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return <NotFound backTo="/admin/sodelavci" />;

  const beginAccessEdit = () => {
    setDraftGroup(accessGroup);
    setDraftModules(accessModules);
    setSaved(false);
    setIsEditingAccess(true);
  };
  const toggleDraftModule = (module: AdminModuleAccess) => {
    setDraftModules((current) => (current.includes(module) ? current.filter((item) => item !== module) : [...current, module]));
  };
  const saveAccess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccessGroup(draftGroup);
    setAccessModules(draftGroup === "sodelavec" ? draftModules : []);
    updateUser(user.id, { group: draftGroup, modules: draftGroup === "sodelavec" ? draftModules : [] });
    setSaved(true);
    setIsEditingAccess(false);
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>{user.name}</h1>
          <p>{user.functionTitle || "Sodelavec"} · {user.email} · {accessGroup}</p>
        </div>
        <Link className="button" to="/admin/sodelavci">Nazaj na sodelavce</Link>
      </header>
      <div className="admin-event-detail-grid">
        <div className="admin-event-main">
          <AdminPanel title="Identiteta">
            <FactList
              items={[
                ["Ime", user.name],
                ["Email", user.email],
                ["Organizacija", user.organisation || "ni navedeno"],
                ["Funkcija", user.functionTitle || "ni navedeno"],
                ["Status", user.status]
              ]}
            />
          </AdminPanel>
          <AdminPanel title="Prima dostop">
            <FactList
              items={[
                ["Status integracije", user.primaCardId ? "povezana" : "ni povezana"],
                ["ID kartice", user.primaCardId || "ni dodeljena"]
              ]}
            />
          </AdminPanel>
          <AdminPanel title="Zgodovina">
            <UserHistoryList user={user} />
          </AdminPanel>
        </div>
        <aside className="admin-event-sidebar">
          <AdminPanel title="Urejanje dostopov">
            {isEditingAccess ? (
              <UserGroupEditForm
                draftGroup={draftGroup}
                draftModules={draftModules}
                groupOptions={["registriran uporabnik", "sodelavec", "administrator"]}
                onGroupChange={(group) => setDraftGroup(group)}
                onModuleToggle={toggleDraftModule}
                onSubmit={saveAccess}
              />
            ) : (
              <>
                <FactList items={[["Funkcija", user.functionTitle || "ni navedeno"], ["Status", user.status], ["Skupina", accessGroup], ["Admin moduli", formatAdminAccessSummary(accessGroup, accessModules)]]} />
                <button className="button primary" type="button" onClick={beginAccessEdit}>Uredi</button>
                {saved && <p className="save-state">Sprememba skupine je označena kot shranjena v prototipu.</p>}
              </>
            )}
          </AdminPanel>
        </aside>
      </div>
    </>
  );
}

function formatAdminAccessSummary(group: UserGroup, modules: AdminModuleAccess[]) {
  if (group === "administrator") return "vsi moduli";
  if (group === "sodelavec") return modules.join(", ") || "nima izbranih modulov";
  return "nima dostopa";
}

function formatUserStatus(user: User) {
  return user.status;
}

function getUserStatusClass(status: UserStatus) {
  return `status-chip status-${status.replace("č", "c")}`;
}

function getMembershipPaymentSummary(user: User) {
  const latestPayment = user.membershipPayments?.[0];

  if (!latestPayment) {
    return { label: "ni plačano", invoice: "ni računa", className: "payment-chip payment-unpaid" };
  }

  const paymentClass = latestPayment.invoiceStatus === "plačan" ? "payment-paid" : "payment-open";
  return {
    label: latestPayment.invoiceStatus,
    invoice: latestPayment.invoiceNumber,
    className: `payment-chip ${paymentClass}`
  };
}

function formatOptionalDate(value?: string) {
  return value ? formatDate(value) : "ni navedeno";
}

function formatRegistrationDateTime(value: string) {
  const [datePart, timePart] = value.split("T");
  if (!datePart) return "ni navedeno";
  const [year, month, day] = datePart.split("-");
  const time = timePart?.slice(0, 5) || "15:10";
  return `${time} ${day}.${month}.${year}`;
}

function UserMembershipEditForm({
  draftGroup,
  draftStatus,
  draftModules,
  draftName,
  draftEmail,
  draftOrganisation,
  draftRegisteredAt,
  draftMembershipType,
  draftMembershipAppliedAt,
  draftMembershipStartAt,
  draftMembershipEndAt,
  draftMembershipNote,
  draftPaymentPaidAt,
  draftPaymentAmount,
  draftPaymentInvoiceNumber,
  draftPaymentInvoiceStatus,
  groupOptions,
  onGroupChange,
  onNameChange,
  onEmailChange,
  onOrganisationChange,
  onRegisteredAtChange,
  onStatusChange,
  onMembershipTypeChange,
  onMembershipAppliedAtChange,
  onMembershipStartAtChange,
  onMembershipEndAtChange,
  onMembershipNoteChange,
  onPaymentPaidAtChange,
  onPaymentAmountChange,
  onPaymentInvoiceNumberChange,
  onPaymentInvoiceStatusChange,
  onModuleToggle,
  onSubmit
}: {
  draftGroup: UserGroup;
  draftStatus: UserStatus;
  draftModules: AdminModuleAccess[];
  draftName: string;
  draftEmail: string;
  draftOrganisation: string;
  draftRegisteredAt: string;
  draftMembershipType: MembershipType;
  draftMembershipAppliedAt: string;
  draftMembershipStartAt: string;
  draftMembershipEndAt: string;
  draftMembershipNote: string;
  draftPaymentPaidAt: string;
  draftPaymentAmount: string;
  draftPaymentInvoiceNumber: string;
  draftPaymentInvoiceStatus: "izdan" | "plačan" | "storno";
  groupOptions: UserGroup[];
  onGroupChange: (group: UserGroup) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onOrganisationChange: (value: string) => void;
  onRegisteredAtChange: (value: string) => void;
  onStatusChange: (status: UserStatus) => void;
  onMembershipTypeChange: (type: MembershipType) => void;
  onMembershipAppliedAtChange: (value: string) => void;
  onMembershipStartAtChange: (value: string) => void;
  onMembershipEndAtChange: (value: string) => void;
  onMembershipNoteChange: (value: string) => void;
  onPaymentPaidAtChange: (value: string) => void;
  onPaymentAmountChange: (value: string) => void;
  onPaymentInvoiceNumberChange: (value: string) => void;
  onPaymentInvoiceStatusChange: (value: "izdan" | "plačan" | "storno") => void;
  onModuleToggle: (module: AdminModuleAccess) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="access-edit-form" onSubmit={onSubmit}>
      <label>
        Ime
        <input value={draftName} onChange={(event) => onNameChange(event.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={draftEmail} onChange={(event) => onEmailChange(event.target.value)} required />
      </label>
      <label>
        Organizacija
        <input value={draftOrganisation} onChange={(event) => onOrganisationChange(event.target.value)} />
      </label>
      <label>
        Datum registracije
        <input type="date" value={draftRegisteredAt} onChange={(event) => onRegisteredAtChange(event.target.value)} />
      </label>
      <label>
        Skupina
        <select value={draftGroup} onChange={(event) => onGroupChange(event.target.value as UserGroup)}>
          {groupOptions.map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select value={draftStatus} onChange={(event) => onStatusChange(event.target.value as UserStatus)}>
          <option value="aktiven">aktiven</option>
          <option value="neaktiven">neaktiven</option>
          <option value="član">član</option>
        </select>
      </label>
      <label>
        Tip članstva
        <select value={draftMembershipType} onChange={(event) => onMembershipTypeChange(event.target.value as MembershipType)}>
          <option value="brez">brez</option>
          <option value="posameznik">posameznik</option>
          <option value="organizacija">organizacija</option>
          <option value="podporni član">podporni član</option>
        </select>
      </label>
      <label>
        Datum prijave
        <input type="date" value={draftMembershipAppliedAt} onChange={(event) => onMembershipAppliedAtChange(event.target.value)} />
      </label>
      <label>
        Datum začetka
        <input type="date" value={draftMembershipStartAt} onChange={(event) => onMembershipStartAtChange(event.target.value)} />
      </label>
      <label>
        Velja do
        <input type="date" value={draftMembershipEndAt} onChange={(event) => onMembershipEndAtChange(event.target.value)} />
      </label>
      <label>
        Interna opomba
        <textarea value={draftMembershipNote} onChange={(event) => onMembershipNoteChange(event.target.value)} rows={3} />
      </label>
      {draftMembershipType !== "brez" && (
        <>
          <label>
            Plačano
            <input type="date" value={draftPaymentPaidAt} onChange={(event) => onPaymentPaidAtChange(event.target.value)} />
          </label>
          <label>
            Znesek članarine
            <input value={draftPaymentAmount} onChange={(event) => onPaymentAmountChange(event.target.value)} />
          </label>
          <label>
            Račun
            <input value={draftPaymentInvoiceNumber} onChange={(event) => onPaymentInvoiceNumberChange(event.target.value)} />
          </label>
          <label>
            Status računa
            <select value={draftPaymentInvoiceStatus} onChange={(event) => onPaymentInvoiceStatusChange(event.target.value as "izdan" | "plačan" | "storno")}>
              <option value="izdan">izdan</option>
              <option value="plačan">plačan</option>
              <option value="storno">storno</option>
            </select>
          </label>
        </>
      )}
      {draftGroup === "sodelavec" && (
        <div className="access-module-editor">
          <p className="small-label">Admin moduli</p>
          <div className="module-access-grid">
            {assignableAdminModules.map((module) => (
              <label className="checkbox-field" key={module}>
                <input type="checkbox" checked={draftModules.includes(module)} onChange={() => onModuleToggle(module)} />
                {module}
              </label>
            ))}
          </div>
        </div>
      )}
      <button className="button primary" type="submit">Shrani</button>
    </form>
  );
}

function UserGroupEditForm({
  draftGroup,
  draftModules,
  groupOptions,
  onGroupChange,
  onModuleToggle,
  onSubmit
}: {
  draftGroup: UserGroup;
  draftModules: AdminModuleAccess[];
  groupOptions: UserGroup[];
  onGroupChange: (group: UserGroup) => void;
  onModuleToggle: (module: AdminModuleAccess) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="access-edit-form" onSubmit={onSubmit}>
      <label>
        Skupina
        <select value={draftGroup} onChange={(event) => onGroupChange(event.target.value as UserGroup)}>
          {groupOptions.map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </label>
      {draftGroup === "sodelavec" && (
        <div className="access-module-editor">
          <p className="small-label">Admin moduli</p>
          <div className="module-access-grid">
            {assignableAdminModules.map((module) => (
              <label className="checkbox-field" key={module}>
                <input type="checkbox" checked={draftModules.includes(module)} onChange={() => onModuleToggle(module)} />
                {module}
              </label>
            ))}
          </div>
        </div>
      )}
      {draftGroup === "administrator" && <p className="warning-box">Opozorilo: administrator ima dostop do vseh admin modulov, uporabnikov, nastavitev in audita.</p>}
      {draftGroup === "registriran uporabnik" && <p className="meta">Registriran uporabnik nima dostopa do admin modulov.</p>}
      <div className="access-edit-actions">
        <button className="button primary" type="submit">Shrani</button>
      </div>
    </form>
  );
}

function AdminCollaboratorCreate() {
  const navigate = useNavigate();
  const { addUser } = usePrototypeUsers();
  const [draftGroup, setDraftGroup] = useState<UserGroup>("sodelavec");
  const [draftModules, setDraftModules] = useState<AdminModuleAccess[]>(["Dogodki"]);
  const [saved, setSaved] = useState(false);
  const isAdministrator = draftGroup === "administrator";
  const toggleModule = (module: AdminModuleAccess) => {
    setDraftModules((current) => (current.includes(module) ? current.filter((item) => item !== module) : [...current, module]));
  };

  return (
    <>
      <header className="admin-list-head">
        <div>
          <h1>Dodaj sodelavca</h1>
          <p>Mock obrazec za notranjega uporabnika admina.</p>
        </div>
        <Link className="button" to="/admin/sodelavci">Nazaj na sodelavce</Link>
      </header>
      <form className="admin-event-detail-grid" onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const id = `u-local-${Date.now()}`;
        addUser({
          id,
          name: String(formData.get("name") || "Nov sodelavec"),
          email: String(formData.get("email") || ""),
          functionTitle: String(formData.get("functionTitle") || "") || undefined,
          status: formData.get("status") as UserStatus,
          group: draftGroup,
          membershipType: "brez",
          modules: draftGroup === "administrator" ? assignableAdminModules : draftModules,
          history: [`${prototypeTodayKey}: sodelavec dodan v prototipu`]
        });
        setSaved(true);
        navigate(`/admin/sodelavci/${id}`);
      }}>
        <div className="admin-event-main">
          <AdminPanel title="Identiteta">
            <div className="admin-event-form-grid">
              <label>
                Ime
                <input name="name" defaultValue="Novo ime" required />
              </label>
              <label>
                Email
                <input name="email" type="email" defaultValue="nov.sodelavec@dom.example" required />
              </label>
              <label>
                Funkcija
                <input name="functionTitle" defaultValue="Sodelavec" />
              </label>
              <label>
                Status
                <select name="status" defaultValue="aktiven">
                  <option value="aktiven">aktiven</option>
                  <option value="neaktiven">neaktiven</option>
                </select>
              </label>
            </div>
          </AdminPanel>
          <AdminPanel title="Moduli">
            <div className="module-access-grid">
              {assignableAdminModules.map((module) => (
                <label className="checkbox-field" key={module}>
                  <input type="checkbox" checked={isAdministrator || draftModules.includes(module)} disabled={isAdministrator} onChange={() => toggleModule(module)} />
                  {module}
                </label>
              ))}
            </div>
          </AdminPanel>
        </div>
        <aside className="admin-event-sidebar">
          <AdminPanel title="Skupina">
            <label>
              Skupina
              <select value={draftGroup} onChange={(event) => setDraftGroup(event.target.value as UserGroup)}>
                <option value="sodelavec">sodelavec</option>
                <option value="administrator">administrator</option>
              </select>
            </label>
            {isAdministrator && <p className="warning-box">Opozorilo: administrator ima dostop do vseh admin modulov, uporabnikov, nastavitev in audita.</p>}
            <button className="button primary" type="submit">Prikaži shranjeno</button>
            {saved && <p className="save-state">Sodelavec je označen kot dodan v prototipu.</p>}
          </AdminPanel>
        </aside>
      </form>
    </>
  );
}

function UserTableRow({ user, to }: { user: User; to: string }) {
  return (
    <Link className="table-row admin-event-row" to={to}>
      <span>{user.registeredAt ? formatRegistrationDateTime(user.registeredAt) : "ni navedeno"}</span>
      <strong>{user.name}</strong>
      <span>{user.email}</span>
      <span>{user.organisation || "ni navedeno"}</span>
      <span className={getUserStatusClass(user.status)}>{formatUserStatus(user)}</span>
    </Link>
  );
}

function CollaboratorTableRow({ user }: { user: User }) {
  const modulesLabel = user.group === "administrator" ? "vsi moduli" : user.modules.join(", ") || "brez modulov";
  return (
    <Link className="table-row admin-event-row" to={`/admin/sodelavci/${user.id}`}>
      <strong>{user.name}</strong>
      <span>{user.group}</span>
      <span>{user.functionTitle || "ni navedeno"}</span>
      <span>{modulesLabel}</span>
    </Link>
  );
}

function UserHistoryList({ user }: { user: User }) {
  return (
    <div className="admin-linked-list">
      {user.history.map((item) => <MiniItem key={item} title={item} meta={user.name} />)}
    </div>
  );
}

function AdminSettings() {
  return (
    <>
      <AdminHeader title="Nastavitve" text="Osnovne nastavitve admin prototipa in feature flags." />
      <ThreeColumns>
        <AdminPanel title="Site">
          <FactList items={[["Header label", "DOM"], ["Header CTA signed out", "Prijava za člane"], ["Header CTA signed in", "Moj DOM"], ["Language", "sl"]]} />
        </AdminPanel>
        <AdminPanel title="Feature flags">
          <Checklist items={["public events", "space inquiry", "admin signage preview", "newsletter integration mock"]} />
        </AdminPanel>
        <AdminPanel title="Povezave prototipa">
          <p>Pregled objavljenih in neobjavljenih prostorov je na strani prototipa.</p>
          <Link className="button" to="/prototype">
            Odpri prototype dashboard
          </Link>
        </AdminPanel>
      </ThreeColumns>
    </>
  );
}

function PrototypeDashboard() {
  const publishedSpaces = spaces.filter(isPublicSpace);
  return (
    <div className="prototype-shell">
      <header className="prototype-header">
        <Link to="/prototype" className="brand">Pregled prototipa<span>DOM</span></Link>
        <nav className="nav-row" aria-label="Navigacija prototipa">
          <Link to="/">Javna stran</Link>
          <Link to="/admin">DOM admin</Link>
        </nav>
      </header>
      <main>
        <PageHeader title="Prostori" text="Na javni strani so prikazani objavljeni prostori. V administraciji je mogoče rezervirati vse prostore." />
        <StatsGrid items={[["Vsi prostori", spaces.length], ["Objavljeni", publishedSpaces.length], ["Neobjavljeni", spaces.length - publishedSpaces.length]]} />
        <WirePanel title="Vsi prostori">
          {spaces.map((space) => <MiniItem key={space.id} title={space.name} meta={`${space.floor} · ${spacePublicationStatusLabel(space.status)}`} />)}
        </WirePanel>
        <div className="inline-actions">
          <Link className="button" to="/prostori">Javni prostori</Link>
          <Link className="button" to="/admin/prostori">Koledar rezervacij</Link>
        </div>
      </main>
    </div>
  );
}

function AdminCrud<T>({ title, text, items, renderItem, fields }: { title: string; text: string; items: T[]; renderItem: (item: T) => ReactNode; fields: string[] }) {
  return (
    <>
      <AdminHeader title={title} text={text} />
      <TwoColumn>
        <AdminPanel title="Seznam">
          <div className="table">{items.map(renderItem)}</div>
        </AdminPanel>
        <AdminPanel title="Urejevalnik">
          <AdminEditor title="Izbran zapis" fields={fields} />
        </AdminPanel>
      </TwoColumn>
    </>
  );
}

function EventAdminRow({ event }: { event: EventItem }) {
  const eventTickets = issuedTickets.filter((ticket) => ticket.eventId === event.id && ticket.status !== "preklicana" && ticket.status !== "povrnjena");
  const eventBookings = bookings.filter((booking) => booking.source === "event" && booking.title === event.title);
  const soldLabel = event.ticketCapacity ? `${eventTickets.length} / ${event.ticketCapacity}` : "—";
  return (
    <Link className="table-row admin-event-row" to={`/admin/dogodki/${event.slug}`}>
      <strong>{event.title}</strong>
      <span>{formatEventDateLabel(event)}</span>
      <span>{event.locationName}</span>
      <span>{eventBookings.length || "brez"}</span>
      <span>{event.status}</span>
      <span>{getEventEntryMode(event)}</span>
      <span>{event.ticketSalesStatus || "ni nastavljeno"}</span>
      <span>{soldLabel}</span>
    </Link>
  );
}

function NewsAdminRow({ item }: { item: NewsItem }) {
  return (
    <Link className="table-row admin-editorial-row" to={`/admin/novice/${item.slug}`}>
      <strong>{item.id}</strong>
      <span>{item.title}</span>
      <span>{item.slug}</span>
      <span>{formatDate(item.date)}</span>
      <span>{item.authorName || "brez avtorja"}</span>
    </Link>
  );
}

function ProgrammeApplicationRow({ application }: { application: ProgrammeApplication }) {
  const programme = getProgrammeById(application.programmeId);

  return (
    <Link className="table-row admin-event-row" to={`/admin/programi/prijave/${application.id}`}>
      <strong>{application.participantName}</strong>
      <span>{programme?.title || application.programmeId}</span>
      <span>{programmeApplicationStatusLabel(application.status)}</span>
      <span>{application.mentor || "mentor ni dodeljen"} · {formatDate(application.submittedAt)}</span>
    </Link>
  );
}

function FlowRow({ flow }: { flow: FormFlow }) {
  return <MiniItem title={flow.title} meta={`${flow.steps.length} koraki · ${flow.fields.length} polj · ${flow.owner}`} />;
}

function RoomUseRequestDesk({ requests, title, emptyText = "Trenutno ni zahtev za uporabo prostora.", onUpdateRequest }: { requests: RoomUseRequest[]; title: string; emptyText?: string; onUpdateRequest?: (requestId: string, changes: Partial<RoomUseRequest>) => void }) {
  const [statusFilter, setStatusFilter] = useState<RoomUseRequest["approvalStatus"] | "vse">("vse");
  const [selectedRequestId, setSelectedRequestId] = useState(requests[0]?.id || "");
  const filteredRequests = statusFilter === "vse" ? requests : requests.filter((request) => request.approvalStatus === statusFilter);
  const activeRequest = filteredRequests.find((request) => request.id === selectedRequestId) || filteredRequests[0];

  return (
    <AdminPanel title={title}>
      {requests.length ? (
        <>
          <div className="approval-status-row" aria-label="Filtri po statusu odobritve">
            <button className={statusFilter === "vse" ? "selected" : ""} onClick={() => setStatusFilter("vse")}>
              Vse <span>{requests.length}</span>
            </button>
            {roomUseApprovalStatuses.map((status) => {
              const count = requests.filter((request) => request.approvalStatus === status).length;
              return (
                <button key={status} className={statusFilter === status ? "selected" : ""} onClick={() => setStatusFilter(status)}>
                  {status} <span>{count}</span>
                </button>
              );
            })}
          </div>
          {filteredRequests.length && activeRequest ? (
            <div className="approval-desk">
              <div className="approval-inbox" aria-label="Zahteve">
                {filteredRequests.map((request) => {
                  const space = request.relatedSpaceId ? getSpace(request.relatedSpaceId) : undefined;
                  return (
                    <button key={request.id} className={`approval-request-card ${activeRequest.id === request.id ? "selected" : ""}`} onClick={() => setSelectedRequestId(request.id)}>
                      <span>{request.approvalStatus} · {request.calendarHandoffStatus}</span>
                      <strong>{request.organisationName}</strong>
                      <em>{space?.name || "prostor po dogovoru"} · {request.requestedPattern}</em>
                    </button>
                  );
                })}
              </div>
              <RoomUseRequestDetail request={activeRequest} onUpdateRequest={onUpdateRequest} />
            </div>
          ) : (
            <EmptyState text="Za izbrani status ni zahtev." />
          )}
        </>
      ) : (
        <EmptyState text={emptyText} />
      )}
    </AdminPanel>
  );
}

function RoomUseRequestDetail({ request, onUpdateRequest }: { request: RoomUseRequest; onUpdateRequest?: (requestId: string, changes: Partial<RoomUseRequest>) => void }) {
  const space = request.relatedSpaceId ? getSpace(request.relatedSpaceId) : undefined;
  const [draftStatus, setDraftStatus] = useState(request.approvalStatus);
  const [draftPrimaCardNumber, setDraftPrimaCardNumber] = useState(request.primaCardNumber || "");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    setDraftStatus(request.approvalStatus);
    setDraftPrimaCardNumber(request.primaCardNumber || "");
    setNoteText("");
  }, [request.id, request.approvalStatus, request.primaCardNumber]);

  const saveStatus = () => {
    const shouldKeepPrimaCardNumber = draftStatus === "odobreno za koledar";
    onUpdateRequest?.(request.id, {
      ...statusUpdateFor(draftStatus),
      primaCardNumber: shouldKeepPrimaCardNumber ? draftPrimaCardNumber.trim() || undefined : undefined,
      hasPrimaCard: shouldKeepPrimaCardNumber && Boolean(draftPrimaCardNumber.trim())
    });
  };

  const addNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = noteText.trim();
    if (!text) return;
    const nextNotes = [
      {
        id: `NOTE-${Date.now().toString(36).toUpperCase()}`,
        author: "Maja Admin",
        date: prototypeNowIso,
        text
      },
      ...(request.internalNotes || [])
    ];
    onUpdateRequest?.(request.id, { internalNotes: nextNotes });
    setNoteText("");
  };

  const notes = [...(request.internalNotes || [])].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <article className="approval-detail">
      <div className="approval-detail-head">
        <div>
          <p className="eyebrow">{request.id}</p>
          <h3>{request.organisationName}</h3>
          <p>{request.requestedUse}</p>
        </div>
        <span className="status-pill">{request.approvalStatus}</span>
      </div>

      <div className="approval-detail-body">
        <section className="approval-form-data">
          <h4>Podatki iz obrazca</h4>
          <FactList
            items={[
              ["Ime", request.requester],
              ["Email", request.email],
              ["Organizacija", request.organisationName],
              ["Želeni prostor", space?.name || "po dogovoru"],
              ["Tip najema", request.recurrence],
              ["Termin", request.requestedPattern],
              ["Število udeležencev", request.expectedParticipants],
              ["Tehnične potrebe", request.technicalNeeds],
              ["Priloge", request.attachments.length ? request.attachments.join(", ") : "brez prilog"]
            ]}
          />
        </section>

        <section className="approval-admin-fields">
          <label>
            Status
            <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as RoomUseRequest["approvalStatus"])}>
              {roomUseApprovalStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <span className="field-help">{statusUpdateFor(draftStatus).nextStep}</span>
          </label>
          {draftStatus === "odobreno za koledar" && (
            <label>
              Številka Prima kartice
              <input value={draftPrimaCardNumber} onChange={(event) => setDraftPrimaCardNumber(event.target.value)} placeholder="Vnesi številko kartice" />
            </label>
          )}
          <FactList
            items={[
              ["Owner", request.owner],
              ["Predaja v koledar", request.calendarHandoffStatus],
              ["Zunanja ref.", request.externalCalendarRef || "še brez reference"]
            ]}
          />
          <div className="approval-actions">
            <button className="primary" onClick={saveStatus}>Shrani</button>
          </div>
        </section>
      </div>

      <section className="approval-notes">
        <h4>Opombe</h4>
        <form className="note-form" onSubmit={addNote}>
          <label>
            Nova opomba
            <textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Dodaj interno opombo..." />
          </label>
          <button type="submit">Dodaj opombo</button>
        </form>
        <div className="note-list">
          {notes.length ? (
            notes.map((note) => (
              <article key={note.id} className="note-item">
                <strong>{note.author}</strong>
                <span>{formatDateTime(note.date)}</span>
                <p>{note.text}</p>
              </article>
            ))
          ) : (
            <EmptyState text="Za to zahtevo še ni internih opomb." />
          )}
        </div>
      </section>
    </article>
  );
}

function statusUpdateFor(status: RoomUseRequest["approvalStatus"]): Partial<RoomUseRequest> {
  const updates: Record<RoomUseRequest["approvalStatus"], Partial<RoomUseRequest>> = {
    novo: {
      approvalStatus: "novo",
      calendarHandoffStatus: "ni pripravljeno",
      nextStep: "Nova zahteva. Preveri vsebino, prostor, termin in ali potrebujemo dodatne informacije."
    },
    "v pregledu": {
      approvalStatus: "v pregledu",
      calendarHandoffStatus: "ni pripravljeno",
      nextStep: "Preverjanje podatkov iz obrazca, ustreznosti prostora in razpoložljivosti termina."
    },
    "čaka uporabnika": {
      approvalStatus: "čaka uporabnika",
      calendarHandoffStatus: "ni pripravljeno",
      nextStep: "Kontaktiraj uporabnika za manjkajoče ali nejasne podatke pred odločitvijo."
    },
    "odobreno za koledar": {
      approvalStatus: "odobreno za koledar",
      calendarHandoffStatus: "pripravljeno za vnos",
      nextStep: "Vnesi ali sinhroniziraj potrjeni termin v izbrani zunanji koledar."
    },
    zavrnjeno: {
      approvalStatus: "zavrnjeno",
      calendarHandoffStatus: "ni pripravljeno",
      nextStep: "Zahteva je zavrnjena. Po potrebi pošlji obrazložitev uporabniku."
    },
    arhivirano: {
      approvalStatus: "arhivirano",
      nextStep: "Zahteva je arhivirana in ni več aktivna."
    }
  };
  return updates[status];
}

function RoomUseRequestRow({ request }: { request: RoomUseRequest }) {
  const space = request.relatedSpaceId ? getSpace(request.relatedSpaceId) : undefined;
  return (
    <article className="request-row">
      <div>
        <p className="eyebrow">{request.approvalStatus} · {request.calendarHandoffStatus}</p>
        <h3>{request.organisationName}</h3>
        <p>{request.requestedUse}</p>
      </div>
      <FactList
        items={[
          ["Prostor", space?.name || "po dogovoru"],
          ["Vzorec", `${request.recurrence}: ${request.requestedPattern}`],
          ["Udeleženci", request.expectedParticipants],
          ["Tehnika", request.technicalNeeds],
          ["Številka Prima kartice", request.primaCardNumber || "ni vpisana"],
          ["Priloge", request.attachments.length ? request.attachments.join(", ") : "brez prilog"],
          ["Odgovorna oseba", request.owner],
          ["Naslednji korak", request.nextStep],
          ["Zunanji koledar", request.externalCalendarRef || "še brez reference"]
        ]}
      />
    </article>
  );
}

function IntegrationPanel({ integration }: { integration: Integration }) {
  return (
    <AdminPanel title={integration.title}>
      <FactList items={[["Tip", integration.type], ["Status", integration.status], ["Owner", integration.owner]]} />
      <p className="small-label">Data in</p>
      <TagRow tags={integration.dataIn} />
      <p className="small-label">Data out</p>
      <TagRow tags={integration.dataOut} />
    </AdminPanel>
  );
}

function AdminEditor({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div className="fake-editor">
      <h3>{title}</h3>
      {fields.map((field) => (
        <label key={field}>
          {field}
          {field.toLowerCase().includes("opis") || field.toLowerCase().includes("sporočilo") || field.toLowerCase().includes("copy") ? <textarea defaultValue="Mock vsebina za prototip." /> : <input defaultValue="Mock vrednost" />}
        </label>
      ))}
      <button>Prikaži stanje shranjeno</button>
    </div>
  );
}

function CalendarWire({ bookings: list }: { bookings: Booking[] }) {
  const hours = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
  const dates = getCalendarDates(list.map((booking) => booking.date));
  if (!list.length) return <EmptyState text="Ni vpisanih rezervacij." />;

  return (
    <div className="calendar-wire">
      {dates.map((date) => (
        <div className="calendar-wire-day" key={date}>
          <h3>{formatDate(date)}</h3>
          {hours.map((hour) => {
            const booking = list.find((item) => item.date === date && item.startTime <= hour && item.endTime > hour);
            return (
              <div className={booking ? "busy" : ""} key={`${date}-${hour}`}>
                <span>{hour}</span>
                <strong>{booking ? booking.title : "prosto"}</strong>
                <em>{booking?.status}</em>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Hero({ eyebrow, title, text, actions }: { eyebrow: string; title: string; text: string; actions: { label: string; to: string }[] }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="inline-actions">
          {actions.map((action, index) => (
            <Link key={action.to} className={`button ${index === 0 ? "primary" : ""}`} to={action.to}>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
      <PlaceholderImage label="DOM" />
    </section>
  );
}

function PageHeader({ title, text, eyebrow }: { title: string; text: string; eyebrow?: string }) {
  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}

function AdminHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <header className={`admin-page-header ${action ? "with-action" : ""}`}>
      <div>
        <h1>{title}</h1>
        {text ? <p>{text}</p> : null}
      </div>
      {action && <div className="admin-header-action">{action}</div>}
    </header>
  );
}

function AdminPlainTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <header className={`admin-plain-title ${action ? "with-action" : ""}`}>
      <h1>{title}</h1>
      {action && <div className="admin-header-action">{action}</div>}
    </header>
  );
}

function Section({ title, children, action, eyebrow, id }: { title: string; children: ReactNode; action?: ReactNode; eyebrow?: string; id?: string }) {
  return (
    <section className="section" id={id}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div className="section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function CardGrid({ children }: { children: ReactNode }) {
  return <div className="card-grid">{children}</div>;
}

function TwoColumn({ children }: { children: ReactNode }) {
  return <div className="two-column">{children}</div>;
}

function ThreeColumns({ children }: { children: ReactNode }) {
  return <div className="three-columns">{children}</div>;
}

function WirePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="wire-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function AdminPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function SpaceCard({ space, visualMeta }: { space: Space; visualMeta?: ReturnType<typeof getSpaceVisualMeta> }) {
  const { t } = useLanguage();
  const meta = visualMeta || getSpaceVisualMeta(space);
  const tagClass = spaceTagClass[meta.tag];
  const isFeatured = Boolean(visualMeta?.featured);
  const isWide = Boolean(visualMeta?.wide);

  return (
    <Link className={`card space-card tag-${tagClass}${isFeatured ? " featured" : ""}${isWide ? " wide" : ""}`} to={`/prostori/${space.slug}`}>
      <SpaceImage space={space} compact />
      <div className="space-card-topline">
        <span className="space-purpose-tag">{meta.tag}</span>
      </div>
      <h3>{space.name}</h3>
      <p>{space.shortDescription}</p>
      <p className="meta">{space.capacityLabel}</p>
      <span className="card-link">{t("card.spaceDetail")}</span>
    </Link>
  );
}

function EventCard({ event }: { event: EventItem }) {
  const { t } = useLanguage();

  return (
    <article className="card">
      <p className="eyebrow">{formatEventDateLabel(event)} · {event.occurrences?.length ? "več terminov" : event.startTime}</p>
      <h3>{event.title}</h3>
      <p>{event.shortDescription}</p>
      <p className="meta">{event.locationName} · {event.registrationType}</p>
      <Link to={`/dogodki/${event.slug}`}>{t("card.eventDetail")}</Link>
    </article>
  );
}

function ProgrammeCard({ programme }: { programme: Programme }) {
  const { t } = useLanguage();

  return (
    <Link className="card programme-card" to={`/skupnost/programi/${programme.slug}`}>
      <h3>{programme.title}</h3>
      <p>{programme.shortDescription}</p>
      <p className="meta">{programme.audience}</p>
      <span className="card-link">{t("card.programmeDetail")}</span>
    </Link>
  );
}

function MentorCard({ name, role, text, portrait = false }: { name: string; role: string; text: string; portrait?: boolean }) {
  return (
    <article className={`mentor-card ${portrait ? "portrait" : ""}`}>
      {portrait && (
        <div className="mentor-photo" aria-label={`Portret: ${name}`}>
          <span>Foto</span>
        </div>
      )}
      <p className="eyebrow">{role}</p>
      <h3>{name}</h3>
      <p>{text}</p>
    </article>
  );
}

function FlowStepCard({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <article className="flow-step-card">
      <span>{step}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function OrganisationCard({ organisation }: { organisation: (typeof connectedOrganisations)[number] }) {
  return (
    <article className="organisation-card">
      <p className="eyebrow">{organisation.field}</p>
      <h3>{organisation.name}</h3>
      <p>{organisation.text}</p>
    </article>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const { t } = useLanguage();

  return (
    <article className="card">
      <p className="eyebrow">{formatDate(item.date)} · {item.category}</p>
      <h3>{item.title}</h3>
      <p>{item.excerpt}</p>
      <p className="meta">{item.status}</p>
      <Link to={`/novice/${item.slug}`}>{t("card.newsDetail")}</Link>
    </article>
  );
}

function NewsFeatureCard({ item }: { item: NewsItem }) {
  const imageSrc = getNewsImageSrc(item);

  return (
    <Link className={`news-feature-card ${imageSrc ? "" : "no-image"}`} to={`/novice/${item.slug}`}>
      {imageSrc ? <img src={imageSrc} alt="" /> : <PlaceholderImage label={item.title} compact />}
      <div>
        <p className="eyebrow">{formatNewsMonth(item.date)}</p>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        <span className="card-link">Preberi zapis</span>
      </div>
    </Link>
  );
}

function NoticeCard({ item }: { item: NewsItem }) {
  return (
    <Link className="notice-card" to={`/novice/${item.slug}`}>
      <div>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
      </div>
      <time dateTime={item.date}>{formatShortDayMonth(item.date)}</time>
    </Link>
  );
}

function CallCard({ item }: { item: NewsItem }) {
  return (
    <Link className="call-card" to={`/novice/${item.slug}`}>
      <p className="eyebrow">{getNewsCategoryLabel(item)}</p>
      <h3>{item.title}</h3>
      <p>{item.excerpt}</p>
      {item.callDeadline && <strong>Rok prijave: {formatDate(item.callDeadline)}</strong>}
      <span className="call-arrow" aria-hidden="true">→</span>
    </Link>
  );
}

function NewsNewsletterBand() {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="news-newsletter-band" aria-labelledby="news-newsletter-title">
      <div>
        <h2 id="news-newsletter-title">Bodi na tekočem</h2>
        <p>Naroči se na naš tedenski e-novičnik in nikoli ne zamudi delavnic, koncertov, sejmov ali novih odprtih pozivov.</p>
      </div>
      <form onSubmit={onSubmit}>
        <label>
          <span>E-poštni naslov</span>
          <input type="email" required placeholder="Vpiši svoj e-poštni naslov..." />
        </label>
        <button className="button primary" type="submit">Prijavi se</button>
        {submitted && <p className="save-state">Hvala. V pravem sistemu bi prijavo poslal izbrani newsletter ponudnik.</p>}
      </form>
    </section>
  );
}

function PlaceholderImage({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div className={`placeholder-image ${compact ? "compact" : ""}`} aria-label={label}>
      <span>{label}</span>
    </div>
  );
}

function SpaceImage({ space, compact = false }: { space: Space; compact?: boolean }) {
  if (!space.imageSrc) return <PlaceholderImage label={space.name} compact={compact} />;
  return <img className={`space-image ${compact ? "compact" : ""}`} src={space.imageSrc} alt={space.imageAlt || space.name} />;
}

function FloorPlanImage({ space }: { space: Space }) {
  if (!space.floorPlanImageSrc) return <PlaceholderImage label={`Tloris: ${space.name}`} />;
  return <img className="space-image" src={space.floorPlanImageSrc} alt={space.floorPlanImageAlt || `Tloris prostora ${space.name}`} />;
}

function FactList({ items }: { items: [string, string | number][] }) {
  return (
    <dl className="fact-list">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="checklist">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="tag-row">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}

function MockForm({ title, fields, submitLabel }: { title: string; fields: string[]; submitLabel: string }) {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };
  return (
    <form className="mock-form" onSubmit={onSubmit}>
      <h2>{title}</h2>
      <div className="form-grid">
        {fields.map((field) => (
          <label key={field}>
            {field}
            {isLongFormField(field) ? <textarea placeholder="Vnos" /> : <input placeholder="Vnos" />}
          </label>
        ))}
      </div>
      <button className="button primary" type="submit">
        {submitLabel}
      </button>
      {submitted && <p className="save-state">Hvala. V pravem sistemu bi bila oddaja poslana ekipi DOM.</p>}
    </form>
  );
}

function isLongFormField(field: string) {
  return ["sporočilo", "tehnične potrebe", "opis", "motivacija", "izkušnje", "predlog"].some((keyword) => field.toLowerCase().includes(keyword));
}

function MiniLink({ to, title, meta }: { to: string; title: string; meta: string }) {
  return (
    <Link className="mini-item" to={to}>
      <strong>{title}</strong>
      <span>{meta}</span>
    </Link>
  );
}

function MiniItem({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="mini-item">
      <strong>{title}</strong>
      <span>{meta}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}

function StatsGrid({ items }: { items: [string, number][] }) {
  return (
    <div className="stats-grid">
      {items.map(([label, value]) => (
        <div className="stat" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function NotFound({ backTo }: { backTo: string }) {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader title={t("notFound.title")} text={t("notFound.text")} eyebrow="404" />
      <Link className="button" to={backTo}>
        {t("notFound.back")}
      </Link>
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sl-SI", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function formatNewsMonth(value: string) {
  return new Intl.DateTimeFormat("sl-SI", { month: "long", year: "numeric" }).format(new Date(value));
}

function formatShortDayMonth(value: string) {
  return new Intl.DateTimeFormat("sl-SI", { day: "2-digit", month: "short" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("sl-SI", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(value);
}

function formatMonthYear(value: Date) {
  return new Intl.DateTimeFormat("sl-SI", { month: "long", year: "numeric" }).format(value);
}

function formatEventTime(event: EventItem) {
  return event.endTime ? `${event.startTime}-${event.endTime}` : event.startTime;
}

function getEventEntryMode(event: EventItem) {
  if (event.entryMode) return event.entryMode;
  if (event.registrationType === "brez prijave") return "brez prijave";
  return "prijava";
}

function formatEventTicketPrice(event: EventItem) {
  if (event.ticketPriceFrom === undefined) return event.priceNote || "ni nastavljena";
  if (event.ticketPriceFrom === 0 && (event.ticketPriceTo === undefined || event.ticketPriceTo === 0)) return "brezplačno";
  if (event.ticketPriceTo !== undefined && event.ticketPriceTo !== event.ticketPriceFrom) return `${formatCurrency(event.ticketPriceFrom)}–${formatCurrency(event.ticketPriceTo)}`;
  return formatCurrency(event.ticketPriceFrom);
}

function getPublishedNews() {
  return news.filter((item) => item.status === "published").sort((first, second) => second.date.localeCompare(first.date));
}

function getSuggestedNewsItems(item: NewsItem) {
  const itemTags = new Set(item.tags || []);
  return getPublishedNews()
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => {
      const sharedTagCount = (candidate.tags || []).filter((tag) => itemTags.has(tag)).length;
      const categoryMatch = candidate.category === item.category ? 1 : 0;
      return { candidate, score: sharedTagCount * 2 + categoryMatch };
    })
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score || second.candidate.date.localeCompare(first.candidate.date))
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

function getNewsImageSrc(item: NewsItem) {
  const relatedSpace = item.relatedSpaceIds?.map((spaceId) => getSpace(spaceId)).find((space): space is Space => Boolean(space?.imageSrc));
  return relatedSpace?.imageSrc;
}

function parseEditorialContentKind(value: string | null): EditorialContentKind {
  return editorialContentTabs.some((tab) => tab.value === value) ? (value as EditorialContentKind) : "news";
}

function getEditorialContentKind(item: NewsItem): EditorialContentKind {
  if (item.category === "poziv") return "call";
  if (item.category === "obvestilo") return "notice";
  if (item.category === "pr-obvestilo") return "press_release";
  return "news";
}

function getEditorialItemsByKind(kind: EditorialContentKind) {
  return getAllNewsForAdmin().filter((item) => getEditorialContentKind(item) === kind);
}

function getAllNewsForAdmin() {
  return [...news].sort((first, second) => second.date.localeCompare(first.date));
}

function getNewsCategoryLabel(item: NewsItem) {
  const labels: Record<string, string> = {
    "projektna novica": "Projektna novica",
    obvestilo: "Obvestilo",
    poziv: "Poziv",
    "pr-obvestilo": "PR obvestilo",
    zgodba: "Zgodba"
  };
  return labels[item.category] || item.category;
}

function getEventOccurrences(event: EventItem): EventOccurrence[] {
  if (event.occurrences?.length) return event.occurrences;
  return [{
    id: `${event.id}-primary`,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    spaceId: event.spaceId || "",
    locationName: event.locationName
  }];
}

function getEventDates(event: EventItem) {
  return getEventOccurrences(event).map((occurrence) => occurrence.date);
}

function formatEventDateLabel(event: EventItem) {
  const dates = getEventDates(event).sort();
  if (dates.length < 2) return formatDate(dates[0]);
  const first = parseLocalDate(dates[0]);
  const last = parseLocalDate(dates[dates.length - 1]);
  if (first.getFullYear() === last.getFullYear() && first.getMonth() === last.getMonth()) {
    const monthYear = new Intl.DateTimeFormat("sl-SI", { month: "short", year: "numeric" }).format(last);
    return `${first.getDate()}.–${last.getDate()}. ${monthYear}`;
  }
  return `${formatDate(dates[0])}–${formatDate(dates[dates.length - 1])}`;
}

function formatWeekdayDate(value: string) {
  return new Intl.DateTimeFormat("sl-SI", { weekday: "long", day: "numeric", month: "numeric", year: "numeric" }).format(parseLocalDate(value));
}

function formatShortWeekdayDate(value: string) {
  return new Intl.DateTimeFormat("sl-SI", { weekday: "short", day: "numeric", month: "numeric" }).format(parseLocalDate(value));
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameMonth(value: string, monthDate: Date) {
  const date = parseLocalDate(value);
  return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth();
}

function getCalendarMonths(dates: string[]) {
  const keys = Array.from(new Set(dates.map((date) => date.slice(0, 7)))).sort();
  return keys.map((key) => ({
    key,
    label: formatMonthYear(parseLocalDate(`${key}-01`))
  }));
}

function getCalendarDates(dates: string[]) {
  return Array.from(new Set(dates)).filter(Boolean).sort();
}

function getAdminVisibleDates(selectedSpaces: Space[], calendarBookings = bookings) {
  const selectedIds = selectedSpaces.map((space) => space.id);
  return getCalendarDates([
    ...events.flatMap((event) => getEventOccurrences(event).filter((occurrence) => selectedIds.includes(occurrence.spaceId)).map((occurrence) => occurrence.date)),
    ...calendarBookings.filter((booking) => selectedIds.includes(booking.spaceId)).map((booking) => booking.date)
  ]);
}

function getAdminDayItems(date: string, selectedSpaces: Space[], calendarBookings = bookings) {
  const selectedIds = selectedSpaces.map((space) => space.id);
  const dayBookings = calendarBookings.filter((booking) => booking.date === date && selectedIds.includes(booking.spaceId));
  const bookingItems = dayBookings.map((booking) => {
    const space = getSpace(booking.spaceId);
    const relatedEvent = booking.source === "event" ? events.find((event) => event.title === booking.title && getEventOccurrences(event).some((occurrence) => occurrence.date === booking.date && occurrence.spaceId === booking.spaceId)) : undefined;
    return {
      id: `booking-${booking.id}`,
      title: booking.title,
      time: `${booking.startTime}-${booking.endTime}`,
      meta: `${space?.name || booking.spaceId} · ${booking.requester} · ${booking.status}`,
      kind: booking.source === "event" ? "event" : booking.status === "blokirano" ? "internal" : "booking",
      colorClass: getSpaceCalendarColorClass(space),
      eventSlug: relatedEvent?.slug,
      date: booking.date,
      spaceName: space?.name || booking.spaceId,
      organiser: relatedEvent?.organiser || booking.requester,
      status: relatedEvent?.status || booking.status
    };
  });
  const eventItems = events.flatMap((event) => getEventOccurrences(event)
    .filter((occurrence) => occurrence.date === date && selectedIds.includes(occurrence.spaceId) && !dayBookings.some((booking) => booking.title === event.title && booking.spaceId === occurrence.spaceId))
    .map((occurrence) => {
      const space = getSpace(occurrence.spaceId);
      return {
        id: `event-${event.id}-${occurrence.id}`,
        title: event.title,
        time: `${occurrence.startTime}${occurrence.endTime ? `-${occurrence.endTime}` : ""}`,
        meta: `${occurrence.locationName} · ${event.organiser} · ${event.status}`,
        kind: "event",
        colorClass: getSpaceCalendarColorClass(space),
        eventSlug: event.slug,
        date: occurrence.date,
        spaceName: space?.name || occurrence.locationName,
        organiser: event.organiser,
        status: event.status
      };
    }));

  return [...bookingItems, ...eventItems].sort((a, b) => a.time.localeCompare(b.time));
}

function calendarKindLabel(kind: string) {
  if (kind === "event") return "dogodek";
  if (kind === "internal") return "blokirano";
  return "rezervacija";
}

function getCalendarWeeks(dates: string[]) {
  const keys = Array.from(new Set(dates.map((date) => formatDateKey(getWeekStart(parseLocalDate(date)))))).sort();
  return keys.map((key) => {
    const start = parseLocalDate(key);
    const end = addDays(start, 6);
    return {
      key,
      label: `${formatShortDate(start)}-${formatShortDate(end)}`
    };
  });
}

function getWeekDays(weekStart: string) {
  const start = parseLocalDate(weekStart);
  return Array.from({ length: 7 }, (_, index) => formatDateKey(addDays(start, index)));
}

function getMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - mondayOffset + 1;
    const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
    const monthNumber = String(month + 1).padStart(2, "0");
    const paddedDay = String(dayNumber).padStart(2, "0");
    return {
      key: `${year}-${month}-${index}`,
      label: inMonth ? String(dayNumber) : "",
      date: inMonth ? `${year}-${monthNumber}-${paddedDay}` : "",
      inMonth
    };
  });
}

function getWeekStart(date: Date) {
  const start = new Date(date);
  start.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return start;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("sl-SI", { day: "numeric", month: "numeric" }).format(date);
}

function statusLabel(status: Space["availabilityStatus"]) {
  const labels: Record<Space["availabilityStatus"], string> = {
    "available-for-inquiry": "na voljo za povpraševanje",
    limited: "omejeno",
    "coming-soon": "prihaja kasneje"
  };
  return labels[status];
}

function spacePublicationStatusLabel(status: Space["status"]) {
  const labels: Record<Space["status"], string> = {
    draft: "osnutek",
    published: "objavljeno",
    archived: "arhivirano"
  };
  return labels[status];
}

function programmeApplicationStatusLabel(status: ProgrammeApplicationStatus) {
  const labels: Record<ProgrammeApplicationStatus, string> = {
    novo: "novo",
    "v pregledu": "v pregledu",
    aktivno: "aktivno",
    zaključeno: "zaključeno",
    arhivirano: "arhivirano"
  };
  return labels[status];
}

function spaceAccessLabel(access: Space["accessCategory"]) {
  const labels: Record<Space["accessCategory"], string> = {
    public: "javno",
    tenant: "člansko / najemno",
    operator: "interno",
    mixed: "mešano"
  };
  return labels[access];
}

function spaceTypeLabel(type: Space["spaceType"]) {
  const labels: Record<Space["spaceType"], string> = {
    hall: "dvorana",
    gallery: "galerija",
    "practice-room": "vadbeni prostor",
    "meeting-room": "sestankovalnica",
    classroom: "učilnica",
    office: "pisarna",
    coworking: "coworking",
    residence: "rezidenca",
    atelier: "atelje",
    other: "drugo"
  };
  return labels[type];
}

export default App;
