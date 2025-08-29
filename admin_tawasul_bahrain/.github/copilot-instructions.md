<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Islamic Memorial Website - Copilot Instructions

This is a full-stack Islamic memorial website built with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React with Arabic RTL support and Islamic design
- **Purpose**: Collecting and displaying information about deceased individuals in a respectful Islamic manner

## Project Structure
- `/server.js` - Main Express server
- `/models/Memorial.js` - MongoDB schema for memorial data
- `/routes/memorial.js` - API routes for form submission
- `/client/` - React frontend application
- `/client/src/components/` - React components with Islamic design

## Key Features
1. **Public Form**: Collects memorial information with Arabic RTL interface
2. **Islamic Design**: Uses Arabic fonts (Amiri, Cairo), Islamic colors (gold, green, beige)
3. **RTL Support**: Proper right-to-left layout for Arabic text
4. **Hadith & Quran Integration**: Displays Islamic quotes and verses

## Design Guidelines
- Use Arabic fonts: 'Amiri' for titles, 'Cairo' for body text
- Color scheme: Islamic gold (#D4AF37), green (#2D5016), beige (#F5F5DC)
- All text should be in Arabic and right-aligned
- Include Islamic patterns and decorative elements
- Respectful and spiritual tone throughout

## Database Schema
The Memorial model includes:
- Basic info (name, description, age)
- Death dates (both Hijri and Gregorian calendars)
- Burial information (location, time)
- Contact numbers with relationships
- Photo upload support

## API Endpoints
- `POST /api/memorial/submit` - Submit new memorial
- `GET /api/memorial/calendar-options` - Get date options

## Styling
- Uses Tailwind CSS with custom Islamic theme
- Custom CSS classes for hadith/quran styling
- Responsive design for mobile and desktop
- Islamic patterns and decorative elements
