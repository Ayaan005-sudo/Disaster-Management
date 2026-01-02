# Disaster-Management


## Description
A full-stack web application for disaster management and relief coordination.  
The platform provides live disaster updates, tracks disaster information, enables fund donations, and allows NGOs to request aid.  

Key highlights:
- Real-time disaster updates using satellite data
- Interactive map showing disaster locations by country
- Separate dashboards for users and NGOs
- Fund donation and request system
- Emergency SOS functionality

## Tech Stack
- Backend: Node.js, Express.js, EJS, Passport.js, Session & Cookies
- Frontend: EJS, Bootstrap, HTML/CSS, JavaScript
- Database: MongoDB
- Payment Gateway: Razorpay (Test mode)
- Email: Nodemailer (for NGO registration & notifications)
- Maps: Leaflet.js

## Features Implemented

### Live Updates
- Page showing real-time disaster information fetched via satellite data
- Search option for specific disasters

### Dashboard
- Country-wise disaster counts
- Map view highlighting affected countries

### Disaster Info Page
- Detailed disaster information page for each disaster

### User & NGO Authentication
- Separate sign-in for users and NGOs
- Implemented using Passport.js with session cookies

### Fund Donation & Tracking
- Users can donate to NGOs
- Donation history visible to each user
- NGOs can request funds (approval via admin email notifications)
- Admin receives fund requests via email

### Emergency SOS
- User clicks SOS button → triggers phone call/SMS if on mobile or email if on desktop

## Upcoming Features / Planned Improvements
- Convert entire project to MVC architecture
- Admin panel for fund approvals (currently via email)
- File upload for NGOs using Cloudinary
- UI fixes and enhancements
- Additional features for NGO and user interaction

## How to Run Locally
1. Clone the repository:
