# Admin Role Specifications

## Overview
The admin role has been successfully implemented with government agency-specific fields and ID verification requirements.

## Admin-Specific Fields

### 1. Government Agency (Dropdown - Required)
Select from the following government organizations:
- National Centre for Coastal Research (NCCR)
- Forest Survey of India (FSI)
- State Coastal Zone Management Authority
- Ministry of Environment, Forest & Climate Change
- Other Government Agency

### 2. Official Employee ID (Text Input - Required)
- Format: 8-12 digit numeric ID
- Validation: Must be exactly 8-12 digits
- Example: `12345678` or `123456789012`

### 3. ID Proof Upload (File Upload - Required)
- Accepted formats: JPG, JPEG, PNG
- Maximum file size: 5MB
- Purpose: Government-issued ID verification
- Storage: Securely stored in `backend/uploads/id-proofs/`

## Database Schema

### User Model - Admin Details
```javascript
adminDetails: {
  governmentAgency: {
    type: String,
    enum: [
      'National Centre for Coastal Research (NCCR)',
      'Forest Survey of India (FSI)',
      'State Coastal Zone Management Authority',
      'Ministry of Environment, Forest & Climate Change',
      'Other Government Agency',
    ],
  },
  employeeId: {
    type: String,
    minlength: 8,
    maxlength: 12,
    match: /^[0-9]{8,12}$/,
  },
  idProof: {
    filename: String,
    path: String,
    uploadedAt: Date,
  },
}
```

## API Endpoints

### POST /api/auth/register
**For Admin Registration:**
- Content-Type: `multipart/form-data`
- Required fields:
  - `name`, `email`, `password` (standard)
  - `role`: "admin"
  - `governmentAgency`: Selected agency
  - `employeeId`: 8-12 digit ID
  - `idProof`: File upload (JPG/PNG, max 5MB)

**Example Request:**
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@nccr.gov.in');
formData.append('password', 'securepass123');
formData.append('role', 'admin');
formData.append('governmentAgency', 'National Centre for Coastal Research (NCCR)');
formData.append('employeeId', '12345678');
formData.append('idProof', fileObject);
```

## Frontend Implementation

### Registration Flow
1. User selects "Admin" role in step 2 of registration
2. Admin-specific fields appear dynamically:
   - Government Agency dropdown
   - Employee ID input with validation
   - File upload for ID proof
3. Client-side validation before submission:
   - Employee ID format check (8-12 digits)
   - File type validation (JPG/PNG only)
   - File size check (max 5MB)
4. Form submitted as `multipart/form-data`

### UI Components
- **Dropdown**: Custom styled select with government agencies
- **Employee ID Input**: Numeric input with pattern validation
- **File Upload**: Drag-and-drop style file input with visual feedback

## Security Features

1. **File Validation**:
   - Server-side file type checking
   - File size limits enforced
   - Unique filename generation to prevent conflicts

2. **Data Validation**:
   - Employee ID format validation (regex)
   - Required field enforcement
   - Government agency enum validation

3. **File Storage**:
   - Secure directory structure
   - Files stored outside public web root
   - Access controlled through API

## Testing the Admin Role

### Manual Testing Steps:
1. Navigate to registration page
2. Complete Step 1 (basic details)
3. In Step 2, select "Admin" role
4. Fill in government agency, employee ID
5. Upload a valid ID proof (JPG/PNG, <5MB)
6. Submit registration
7. Verify user created with admin role and files stored

### Test Data:
```javascript
{
  name: "Test Admin",
  email: "admin@test.gov.in",
  password: "test123",
  role: "admin",
  governmentAgency: "National Centre for Coastal Research (NCCR)",
  employeeId: "12345678",
  idProof: [test-id.jpg]
}
```

## File Structure
```
backend/
├── models/
│   └── User.js (updated with adminDetails)
├── routes/
│   └── auth.js (updated with multer and admin validation)
├── uploads/
│   └── id-proofs/ (created automatically)
└── server.js (static file serving configured)

frontend/
├── src/
│   ├── components/
│   │   └── Auth/
│   │       ├── Register.jsx (admin fields added)
│   │       └── Auth.css (admin field styling)
│   └── services/
│       └── api.js (FormData handling)
```

## Notes
- Admin users require manual verification before activation
- ID proofs are stored securely and not publicly accessible
- The system supports all three existing roles (community, ngo, panchayat) plus the new admin role
- File uploads are handled via multer middleware
- All validations are enforced both client-side and server-side
