# ER Diagram — Appointment Booking System


## Entities

1. USERS


2. DOCTORS


3. AVAILABILITY


4. APPOINTMENTS


5. RESCHEDULE_REQUESTS


6. NOTIFICATIONS


## Relationships

### DOCTORS → AVAILABILITY
**A doctor sets their availability slots.**
One doctor can define many availability slots. Each availability slot belongs to exactly one doctor.

---

### DOCTORS → APPOINTMENTS
**A doctor receives appointments from users.**
One doctor can have many appointments booked against them. Every appointment must be linked to exactly one doctor.

---

### USERS → APPOINTMENTS
**A user books appointments.**
One user can book many appointments over time. Every appointment must belong to exactly one user.

---

### AVAILABILITY → APPOINTMENTS
**An availability slot is filled by at most one appointment.**
One availability slot can either be empty (not yet booked) or filled by exactly one appointment. A slot can never be double-booked.

---

### APPOINTMENTS → RESCHEDULE_REQUESTS
**An appointment can trigger reschedule requests.**
One appointment can have zero or many reschedule requests (e.g. doctor asks → user declines → doctor asks again). Every reschedule request belongs to exactly one appointment.

---

### APPOINTMENTS → NOTIFICATIONS
**An appointment generates notifications.**
One appointment can produce many notifications (booking confirmation, reminder alerts, reschedule alerts). Every notification must be tied to exactly one appointment.

---

### USERS → NOTIFICATIONS
**A user receives notifications.**
One user can receive zero or many notifications across all their appointments.

---

### DOCTORS → NOTIFICATIONS
**A doctor receives notifications.**
One doctor can receive zero or many notifications (e.g. new booking alerts, cancellations).

---

## Cardinality Summary


- DOCTORS → AVAILABILITY  | One to Many ,One doctor, many slots
- DOCTORS → APPOINTMENTS | One to Many , One doctor, many appointments 
- USERS → APPOINTMENTS | One to Many, One user, many appointments 
- AVAILABILITY → APPOINTMENTS | One to Zero-or-One , One slot, max one appointment (no double  booking) 
- APPOINTMENTS → RESCHEDULE_REQUESTS | One to Many , One appointment, many reschedule attempts 
- APPOINTMENTS → NOTIFICATIONS | One to Many, One appointment, many notifications 
- USERS → NOTIFICATIONS | One to Many , One user, many notifications 
- DOCTORS → NOTIFICATIONS | One to Many , One doctor, many notifications 



