# vitest-tdd Specification

## Purpose

Lets users add comprehensive vitest test-driven development (TDD) coverage to the auth, session, and word APIs. It ensures these critical components are thoroughly tested with proper mocking of the MongoDB layer, validating behavior for authentication, session management, and word operations.

## Requirements

### Requirement: Auth login functionality

The system SHALL authenticate users via email and password, validating credentials against stored data and establishing user sessions.

#### Scenario: Successful login
- **WHEN** user provides valid email and password
- **THEN** system creates a session, encrypts it, and returns an HTTP 302 redirect to the dashboard

#### Scenario: Invalid password
- **WHEN** user provides correct email but incorrect password
- **THEN** system returns HTTP 401 status with error message "Invalid credentials"

#### Scenario: User not found
- **WHEN** user provides an email address not in the system
- **THEN** system returns HTTP 401 status with error message "User not found"

#### Scenario: Login form validation failure
- **WHEN** user submits the login form with missing or malformed data
- **THEN** system returns HTTP 400 status with validation error messages

### Requirement: User signup functionality

The system SHALL create new user accounts with proper validation including invite code verification.

#### Scenario: Successful signup
- **WHEN** user submits valid signup information with a valid invite code
- **THEN** system creates a new user record, sends welcome email, and returns HTTP 302 redirect to login

#### Scenario: Invalid invite code
- **WHEN** user submits valid signup information but provides an invalid or expired invite code
- **THEN** system returns HTTP 400 status with error message "Invalid invite code"

### Requirement: User logout functionality

The system SHALL terminate user sessions and clear authentication cookies securely.

#### Scenario: Successful logout
- **WHEN** authenticated user accesses logout endpoint
- **THEN** system deletes session cookie, invalidates server-side session, and returns HTTP 302 redirect to homepage

### Requirement: Current user retrieval

The system SHALL return the currently authenticated user's profile when requested.

#### Scenario: User is logged in
- **WHEN** authenticated user accesses getCurrentUser endpoint
- **THEN** system returns user profile object with HTTP 200 status

#### Scenario: No active session
- **WHEN** unauthenticated user accesses getCurrentUser endpoint
- **THEN** system returns HTTP 401 status with empty response

### Requirement: Session encryption/decryption

The system SHALL securely encrypt and decrypt session tokens using established cryptographic methods.

#### Scenario: Valid token decryption
- **WHEN** system decrypts a valid session token
- **THEN** returns the original session data with HTTP 200 status

#### Scenario: Invalid token decryption
- **WHEN** system attempts to decrypt an invalid or tampered token
- **THEN** returns undefined without throwing an error

#### Scenario: Empty token decryption
- **WHEN** system attempts to decrypt an empty or null token
- **THEN** returns undefined

### Requirement: Session cookie creation

The system SHALL create secure HTTP-only cookies for user sessions with appropriate security attributes.

#### Scenario: Session cookie set correctly
- **WHEN** new session is created
- **THEN** system sets cookie with httpOnly=true, secure=true, and correct userId

### Requirement: Word API authorization

The system SHALL enforce authorization rules on word operations, ensuring users can only access their own words.

#### Scenario: Unauthorized word access
- **WHEN** unauthenticated user attempts to access word endpoints
- **THEN** system returns HTTP 401 status

### Requirement: Word creation

The system SHALL allow authenticated users to create new word entries.

#### Scenario: Successful word creation
- **WHEN** authenticated user creates a new word
- **THEN** system stores the word and returns HTTP 201 status; subsequent GET retrieves the word

### Requirement: Word retrieval

The system SHALL return only the words belonging to the authenticated user.

#### Scenario: Retrieve own words
- **WHEN** authenticated user requests their words
- **THEN** system returns only words belonging to that user, excluding others

### Requirement: Word deletion

The system SHALL allow users to delete their own words only.

#### Scenario: Delete own word
- **WHEN** authenticated user deletes one of their own words
- **THEN** system removes the word and returns HTTP 204 status

#### Scenario: Attempt to delete others' words
- **WHEN** authenticated user attempts to delete another user's word
- **THEN** system returns HTTP 403 status with error message "Forbidden"