# Events Ticketing Solution - Open Questions

Status: implementation working notes

The final platform event requirements live in `specs/platform/spec-events.md`. This file tracks unresolved questions for choosing and integrating an external ticketing or event-registration provider.

## Known Context

- Ticketing is expected to be handled by an external provider.
- The platform must support external registration/ticket links on event records.
- Public event pages may show a registration, ticket, or entry link.
- Event admin must support entry, registration, and ticket-link fields.
- Full ticket sales, payment processing, ticket inventory, and attendee-management workflows are not implemented in the prototype.
- A MAG-NETic platform profile should be created during ticket purchase only if the selected ticketing provider supports this easily, out of the box.
- The reasoning is that ticket purchase already requires the visitor to enter personal data and accept terms of service and privacy conditions, so most profile-registration steps may already be complete.
- If creating or syncing the MAG-NETic profile from the provider checkout requires special integration work, the first implementation should keep ticketing-provider accounts/data separate from MAG-NETic platform accounts.

## Open Questions

- Which external event or ticketing provider should be used?
- Does DOM need reserved seating or only general admission?
- Must the provider support both free and paid tickets?
- Must the provider support registrations without payment?
- Are promo codes required?
- Are guest lists, press tickets, VIP tickets, or complimentary tickets required?
- Does ticket availability need to sync with room capacity or manually configured event capacity?
- Who owns event capacity: the platform, the ticketing provider, or the booking/space-management system?
- Are refunds required?
- Are cancellations and postponements handled inside the provider, the platform, or both?
- Does DOM need attendee check-in at the door?
- Should check-in work offline?
- What attendee data may DOM store locally?
- What GDPR/data-processing agreement requirements apply to the provider?
- Does the provider need Slovenian and English checkout pages?
- Does the provider need custom DOM branding or embedded checkout?
- Is an external checkout link enough for the first launch?
- Does the platform need API integration or are manually entered external ticket links enough?
- Are webhooks required for ticket sales, cancellations, refunds, or attendance updates?
- What reports must come back to DOM after an event?
- Does DOM need exports for attendee lists, revenue, VAT, check-in, and post-event reporting?
- Who receives payouts and how are provider fees handled?
- Does the provider need to support fiscalisation, VAT, or Slovenian accounting requirements?
- Does the selected provider support optional MAG-NETic profile creation or account sync during ticket purchase without custom integration?
- How are ticketed events represented in signage and public event listings?
- Should newsletter campaigns be able to link directly to the provider checkout?
- Who can create ticket links or configure ticketed events in admin?
- What audit trail is required for ticket configuration changes?
- What happens when the external provider is down or a ticket link fails?
- How should archived ticketed events behave after sales close?
- Are event registrations part of MVP, or only ticket links for selected events?
