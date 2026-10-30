# Platform brainstorming notes

## Raw notes (verbatim)

```text
we will use Olaiii for ticketing software, thisi s decided

- billing, davčna blagajna

  connection to event needs to be integrated

  analytics is part of the platform, not integrated

  ticket scanning is part of their offer, not part of the system

  guest management is obviously part of this system

  Olaii will probably not be able to integrate into platform users, members
-

spaces and bookings will probably need to be custom developed, but tightly integrated into the platgform.

Prima access control is fixed, they have some room booking capabilities, for now unknown
Platfofm will connect bookings to spaces.
Spaces is mostly a hardcoded content
UX in the admin shall be defined in the project and usability will be required in spec
Oprema is part of room booking solution, it is connected to a room reservation
Oprema doesn't need to be very cophisticated, one technical owner will need to get a basic overview of gear needed.

- prima will make a copy of spaces, copy of bookings so that they have access control
- open: is there added value of connecting users (members) to prima access control

room bookings need to basically be synced to prima, access control connects users and rooms, which is effectively booking.

Reservations system, the process of booking a room as a user, is custom. It is connected. It is probably not possible in prima.
Our platform iis the source of truth about spaces, users, bookings.

Users will need to see room bookings in their profile.
We don't see added value of integrating prima back to the platform: to see what accesses a user has.

newsletter module is very easy: we integrate users into something like mailchimp.
on frontend sub to newsletter
module users and members module is integrated so that members and users data is synched

program is not very well defined.
we have static content for each program
next week we will go through user journeys and define functional requirements tighter

form module is a nice to have.
form connects static content to interactions with users
this replaces google forms which is much customizable, but the problem is that this is then not integrated, users are not fed back to the system

ticket purchasing on site will be supported thru Olaii
we need to define a new admin user group "receptor" which will be able to sell tickets in the bar
in the cafe the purchase of tickets will not be possible thru cafe sale point, but thru dedicated system
we don't know if olaii enables ticket reservations by admin if user purchases the ticket with cash in the cafe

is it possible to integrate google analytics as a basic widghet into the platform
we already have members and users anaalytics
What else do we need in reporting

do we need a higher granularity of access control to events content?
For example, can we give rights to content, to just one event to a user?

for events a nice-to-have is to have a multi-user publishing process:
event owner adds content
admin confirms publish
as part of this role this person can also make a reservation themselves -- if this is set
it is possible right now to add a reservation thru reservation system

room booking might need to add bookable services (cleaning, stewardese, dj, food)
```

## Organized notes by topic

### Ticketing and events

- Olaiii is the decided ticketing software.
- Billing / fiscal cash register (`davčna blagajna`) must be integrated with events.
- Ticket scanning is provided by Olaiii and is not part of the platform.
- Guest management is part of the platform.
- On-site ticket purchasing is supported through Olaiii.
- Define a new admin user group, `receptor`, able to sell tickets in the bar.
- Tickets cannot be purchased through the café sales point; a dedicated system is used.
- Olaiii may not be able to integrate with platform users and members.

#### Open points

- Confirm whether Olaiii enables an admin to reserve tickets when a user purchases a ticket with cash in the café.

### Spaces, reservations, equipment, and access control

- Spaces and bookings will probably be custom-developed and tightly integrated into the platform.
- The platform is the source of truth for spaces, users, and bookings.
- The reservation system—the process of a user booking a room—is custom and connected to the platform. It is probably not possible in Prima.
- The platform connects bookings to spaces.
- Prima access control is fixed. Its room-booking capabilities are currently unknown.
- Room bookings need to be synced to Prima. Prima will receive a copy of spaces and bookings for access control.
- Access control connects users and rooms, which is effectively booking.
- Users need to see room bookings in their profile.
- There is no identified added value in integrating Prima back to the platform to see what access a user has.
- Spaces are mostly hardcoded content.
- Equipment (`oprema`) is part of the room-booking solution and is connected to a room reservation.
- Equipment does not need to be sophisticated; one technical owner needs a basic overview of gear needed.
- Room bookings might need to add bookable services: cleaning, stewardese, DJ, and food.

#### Open points

- Is there added value in connecting users (members) to Prima access control?

### Users, members, and permissions

- Users and members are integrated with the newsletter module so their data is synced.
- Consider whether higher-granularity access control is needed for event content.
- Example: can a user receive rights to content for only one event?

### Newsletter

- The newsletter module is simple: integrate users into a service such as Mailchimp.
- The frontend includes newsletter subscription.

### Programmes

- The programme area is not yet well defined.
- Each programme currently has static content.
- Next week, user journeys will be reviewed to define functional requirements more tightly.

### Forms

- A forms module is a nice-to-have.
- Forms connect static content to interactions with users.
- This could replace Google Forms, which is more customizable but not integrated; users are not fed back into the system.

### Reporting and analytics

- Analytics is part of the platform and is not integrated through ticketing.
- Members and users analytics already exist.
- Consider whether Google Analytics can be integrated as a basic platform widget.

#### Open points

- What else is needed in reporting?

### Event publishing and reservations

- Nice-to-have: a multi-user event publishing process.
- Event owner adds content.
- Admin confirms publication.
- As part of this role, a person can also make a reservation themselves, if this is enabled.
- It is currently possible to add a reservation through the reservation system.

### Admin UX and specification

- Admin UX must be defined in the project.
- Usability is required in the specification.
