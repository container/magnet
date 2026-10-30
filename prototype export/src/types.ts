
export type SpaceType =
  | "hall"
  | "gallery"
  | "practice-room"
  | "meeting-room"
  | "classroom"
  | "office"
  | "coworking"
  | "residence"
  | "atelier"
  | "other";

export type SpaceAccessCategory = "public" | "tenant" | "operator" | "mixed";

export type EventStatus = "draft" | "in coordination" | "offer" | "confirmed" | "published" | "cancelled" | "completed" | "archived";

export interface Space {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  name: string;
  roomNumber?: string;
  floor: string;
  spaceType: SpaceType;
  accessCategory: SpaceAccessCategory;
  category: string;
  shortDescription: string;
  imageSrc?: string;
  imageAlt?: string;
  floorPlanImageSrc?: string;
  floorPlanImageAlt?: string;
  floorPlanDownloadUrl?: string;
  primaryUse: string;
  otherUses: string[];
  capacityLabel: string;
  areaLabel?: string;
  equipment: string[];
  connectedSpacesNote?: string;
  importantInfo?: string;
  rulesNote?: string;
  accessibilityNote?: string;
  availabilityStatus: "available-for-inquiry" | "limited" | "coming-soon";
}

export interface Programme {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  audience: string;
  status: "v pripravi" | "aktiven" | "pilot";
  published: boolean;
}

export type ProgrammeApplicationStatus = "novo" | "v pregledu" | "aktivno" | "zaključeno" | "arhivirano";

export interface ProgrammeApplication {
  id: string;
  programmeId: string;
  participantName: string;
  email: string;
  organisationName?: string;
  role: string;
  status: ProgrammeApplicationStatus;
  submittedAt: string;
  owner: string;
  mentor?: string;
  nextStep: string;
  submittedData: string;
  internalNotes: string[];
}

export interface ShopProductVariant {
  id: string;
  label: string;
  optionLabel?: string;
  available: boolean;
}

export interface ShopProduct {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  title: string;
  shortDescription: string;
  description: string;
  priceCents: number;
  category: "oblacila" | "dodatki" | "papir" | "seti";
  imageLabels: string[];
  variants: ShopProductVariant[];
  tags: string[];
  fulfillmentNote: string;
  externalModuleRef?: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  /** Last calendar day for a continuous multi-day event. */
  endDate?: string;
  startTime: string;
  endTime?: string;
  type: string;
  audience: string[];
  tags?: string[];
  publicNotice?: string;
  spaceId?: string;
  locationName: string;
  organiser: string;
  organiserContact?: string;
  coOrganisers?: string[];
  partners?: string[];
  domOwner?: string;
  domTeam?: string[];
  shortDescription: string;
  description: string;
  headline?: string;
  publicDescription?: string[];
  publicFiles?: { label: string; url: string }[];
  livestreamUrl?: string;
  registrationType: "brez prijave" | "prijava priporočena" | "prijava obvezna";
  ticketUrl?: string;
  ticketCtaLabel?: string;
  priceNote?: string;
  ticketAvailability?: string;
  ticketIntegrationStatus?: string;
  entryMode?: EventEntryMode;
  ticketSalesStatus?: TicketSalesStatus;
  ticketCapacity?: number;
  ticketPriceFrom?: number;
  ticketPriceTo?: number;
  ticketProvider?: TicketProvider;
  /** Inventory records required for the event's production. */
  equipmentIds?: string[];
  requiredServices?: string[];
  productionNotes?: string;
  internalFiles?: { label: string; status: string }[];
  signageStatus?: string;
  reportStatus?: string;
  taskRefs?: string[];
  financeRefs?: string[];
  status: EventStatus;
  featured?: boolean;
  relatedProgrammeId?: string;
  occurrences?: EventOccurrence[];
}

export interface EventOccurrence {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  spaceId: string;
  locationName: string;
}

export type EventEntryMode = "brez prijave" | "prijava" | "karte";
export type TicketSalesStatus = "ni nastavljeno" | "v pripravi" | "v prodaji" | "razprodano" | "zaključeno";
export type TicketProvider = "lastni modul" | "Eventim" | "Olaii";

export interface IssuedTicket {
  id: string;
  code: string;
  eventId: string;
  occurrenceId?: string;
  orderId: string;
  holderName: string;
  holderEmail: string;
  ticketType: string;
  price: number;
  currency: "EUR";
  status: "veljavna" | "uporabljena" | "preklicana" | "povrnjena";
  paymentStatus: "plačano" | "čaka plačilo" | "brezplačno" | "povrnjeno";
  issuedAt: string;
  checkedInAt?: string;
  provider: TicketProvider;
  providerReference?: string;
}

export type NewsCategory = "projektna novica" | "zgodba" | "obvestilo" | "poziv" | "pr-obvestilo";

export type NewsStatus = "draft" | "published" | "archived";

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
  body: string;
  status: NewsStatus;
  tags?: string[];
  authorName?: string;
  callDeadline?: string;
  photoLabels?: string[];
  addedLinks?: { label: string; url: string }[];
  attachedFormFlowId?: string;
  relatedEventIds?: string[];
  relatedSpaceIds?: string[];
  relatedProgrammeIds?: string[];
}

export interface Booking {
  id: string;
  spaceId: string;
  title: string;
  requester: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "povpraševanje" | "začasno" | "potrjeno" | "zavrnjeno" | "preklicano" | "blokirano";
  source: "manual" | "inquiry" | "event" | "internal";
  relatedEventId?: string;
  relatedProgrammeId?: string;
  note?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  status: "na voljo" | "v uporabi" | "servis" | "ni na voljo";
  updatedAt: string;
  spaceId: string;
  rentalNote?: "po dogovoru";
}

export interface RoomUseRequest {
  id: string;
  requester: string;
  email: string;
  organisationName: string;
  relatedSpaceId?: string;
  requestedUse: string;
  recurrence: "enkratno" | "redno";
  requestedPattern: string;
  expectedParticipants: number;
  technicalNeeds: string;
  hasPrimaCard: boolean;
  primaCardNumber?: string;
  attachments: string[];
  approvalStatus: "novo" | "v pregledu" | "čaka uporabnika" | "odobreno za koledar" | "zavrnjeno" | "arhivirano";
  owner: string;
  nextStep: string;
  calendarHandoffStatus: "ni pripravljeno" | "pripravljeno za vnos" | "poslano v koledar" | "vpisano v zunanji koledar";
  externalCalendarRef?: string;
  internalNotes?: RoomUseRequestNote[];
}

export interface RoomUseRequestNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface MemberAccess {
  memberName: string;
  allowedSpaceIds: string[];
}

export interface FormFlow {
  id: string;
  title: string;
  publicRoute: string;
  owner: string;
  steps: string[];
  fields: string[];
}

export interface Submission {
  id: string;
  flowId: string;
  topic: string;
  requester: string;
  email: string;
  relatedSpaceId?: string;
  relatedProgrammeId?: string;
  status: "novo" | "v obdelavi" | "čaka odgovor" | "zaključeno" | "arhivirano";
  message: string;
}

export interface Integration {
  id: string;
  title: string;
  type: string;
  status: "ni izbrano" | "mock" | "povezano" | "kasneje";
  owner: string;
  dataIn: string[];
  dataOut: string[];
}

export type UserGroup = "registriran uporabnik" | "sodelavec" | "administrator";

export type UserStatus = "aktiven" | "neaktiven" | "član";

export type MembershipType = "brez" | "posameznik" | "organizacija" | "podporni član";

export type AdminModuleAccess =
  | "Novice"
  | "Dogodki"
  | "Obrazci"
  | "Prostori in rezervacije"
  | "Programi"
  | "Statična vsebina"
  | "Info ekrani"
  | "Uporabniki in člani";

export interface MembershipPayment {
  id: string;
  period: string;
  paidAt: string;
  amount: string;
  invoiceNumber: string;
  invoiceStatus: "izdan" | "plačan" | "storno";
}

export interface User {
  id: string;
  name: string;
  email: string;
  group: UserGroup;
  status: UserStatus;
  organisation?: string;
  functionTitle?: string;
  registeredAt?: string;
  membershipType?: MembershipType;
  membershipAppliedAt?: string;
  membershipStartAt?: string;
  membershipEndAt?: string;
  membershipNote?: string;
  membershipPayments?: MembershipPayment[];
  primaCardId?: string;
  modules: AdminModuleAccess[];
  history: string[];
}
