;; StacksBio Profile Contract
;; Manages user profiles on the Stacks blockchain

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_PROFILE_NOT_FOUND (err u101))
(define-constant ERR_PROFILE_EXISTS (err u102))
(define-constant ERR_INVALID_USERNAME (err u103))
(define-constant ERR_INVALID_INPUT (err u104))

;; Data Variables
(define-data-var next-profile-id uint u1)

;; Data Maps
(define-map profiles
  { profile-id: uint }
  {
    owner: principal,
    username: (string-ascii 50),
    display-name: (string-utf8 100),
    bio: (optional (string-utf8 500)),
    avatar-url: (optional (string-ascii 200)),
    is-verified: bool,
    theme-primary: (string-ascii 7),
    theme-secondary: (string-ascii 7),
    theme-background: (string-ascii 7),
    theme-text: (string-ascii 7),
    theme-button-style: (string-ascii 20),
    theme-layout: (string-ascii 20),
    created-at: uint,
    updated-at: uint
  }
)

(define-map username-to-profile-id
  { username: (string-ascii 50) }
  { profile-id: uint }
)

(define-map owner-to-profile-id
  { owner: principal }
  { profile-id: uint }
)

;; Private Functions
(define-private (is-valid-username (username (string-ascii 50)))
  (and 
    (>= (len username) u3)
    (<= (len username) u50)
  )
)

;; Public Functions

;; Create a new profile
(define-public (create-profile 
  (username (string-ascii 50))
  (display-name (string-utf8 100))
  (bio (optional (string-utf8 500)))
  (avatar-url (optional (string-ascii 200)))
)
  (let 
    (
      (profile-id (var-get next-profile-id))
      (current-block-height block-height)
    )
    ;; Validate username
    (asserts! (is-valid-username username) ERR_INVALID_USERNAME)
    
    ;; Check if username is already taken
    (asserts! (is-none (map-get? username-to-profile-id { username: username })) ERR_PROFILE_EXISTS)
    
    ;; Check if user already has a profile
    (asserts! (is-none (map-get? owner-to-profile-id { owner: tx-sender })) ERR_PROFILE_EXISTS)
    
    ;; Create the profile
    (map-set profiles
      { profile-id: profile-id }
      {
        owner: tx-sender,
        username: username,
        display-name: display-name,
        bio: bio,
        avatar-url: avatar-url,
        is-verified: false,
        theme-primary: "#F4D03F",
        theme-secondary: "#87CEEB",
        theme-background: "#FFFFFF",
        theme-text: "#1B365D",
        theme-button-style: "rounded",
        theme-layout: "centered",
        created-at: current-block-height,
        updated-at: current-block-height
      }
    )
    
    ;; Update mappings
    (map-set username-to-profile-id { username: username } { profile-id: profile-id })
    (map-set owner-to-profile-id { owner: tx-sender } { profile-id: profile-id })
    
    ;; Increment next profile ID
    (var-set next-profile-id (+ profile-id u1))
    
    (ok profile-id)
  )
)

;; Update profile information
(define-public (update-profile
  (display-name (optional (string-utf8 100)))
  (bio (optional (string-utf8 500)))
  (avatar-url (optional (string-ascii 200)))
)
  (let 
    (
      (profile-lookup (map-get? owner-to-profile-id { owner: tx-sender }))
      (current-block-height block-height)
    )
    ;; Check if profile exists
    (asserts! (is-some profile-lookup) ERR_PROFILE_NOT_FOUND)
    
    (let 
      (
        (profile-id (get profile-id (unwrap! profile-lookup ERR_PROFILE_NOT_FOUND)))
        (current-profile (unwrap! (map-get? profiles { profile-id: profile-id }) ERR_PROFILE_NOT_FOUND))
      )
      ;; Update profile
      (map-set profiles
        { profile-id: profile-id }
        (merge current-profile {
          display-name: (default-to (get display-name current-profile) display-name),
          bio: (if (is-some bio) bio (get bio current-profile)),
          avatar-url: (if (is-some avatar-url) avatar-url (get avatar-url current-profile)),
          updated-at: current-block-height
        })
      )
      
      (ok true)
    )
  )
)

;; Update profile theme
(define-public (update-theme
  (primary-color (string-ascii 7))
  (secondary-color (string-ascii 7))
  (background-color (string-ascii 7))
  (text-color (string-ascii 7))
  (button-style (string-ascii 20))
  (layout (string-ascii 20))
)
  (let 
    (
      (profile-lookup (map-get? owner-to-profile-id { owner: tx-sender }))
      (current-block-height block-height)
    )
    ;; Check if profile exists
    (asserts! (is-some profile-lookup) ERR_PROFILE_NOT_FOUND)
    
    (let 
      (
        (profile-id (get profile-id (unwrap! profile-lookup ERR_PROFILE_NOT_FOUND)))
        (current-profile (unwrap! (map-get? profiles { profile-id: profile-id }) ERR_PROFILE_NOT_FOUND))
      )
      ;; Update theme
      (map-set profiles
        { profile-id: profile-id }
        (merge current-profile {
          theme-primary: primary-color,
          theme-secondary: secondary-color,
          theme-background: background-color,
          theme-text: text-color,
          theme-button-style: button-style,
          theme-layout: layout,
          updated-at: current-block-height
        })
      )
      
      (ok true)
    )
  )
)

;; Read-only functions

;; Get profile by username
(define-read-only (get-profile-by-username (username (string-ascii 50)))
  (match (map-get? username-to-profile-id { username: username })
    profile-lookup (map-get? profiles { profile-id: (get profile-id profile-lookup) })
    none
  )
)

;; Get profile by owner
(define-read-only (get-profile-by-owner (owner principal))
  (match (map-get? owner-to-profile-id { owner: owner })
    profile-lookup (map-get? profiles { profile-id: (get profile-id profile-lookup) })
    none
  )
)

;; Get profile by ID
(define-read-only (get-profile-by-id (profile-id uint))
  (map-get? profiles { profile-id: profile-id })
)

;; Check if username is available
(define-read-only (is-username-available (username (string-ascii 50)))
  (is-none (map-get? username-to-profile-id { username: username }))
)

;; Get total number of profiles
(define-read-only (get-total-profiles)
  (- (var-get next-profile-id) u1)
)

;; Admin functions (only contract owner)

;; Verify a profile
(define-public (verify-profile (profile-id uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    
    (match (map-get? profiles { profile-id: profile-id })
      current-profile 
        (begin
          (map-set profiles
            { profile-id: profile-id }
            (merge current-profile { is-verified: true, updated-at: block-height })
          )
          (ok true)
        )
      ERR_PROFILE_NOT_FOUND
    )
  )
)

;; Unverify a profile
(define-public (unverify-profile (profile-id uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    
    (match (map-get? profiles { profile-id: profile-id })
      current-profile 
        (begin
          (map-set profiles
            { profile-id: profile-id }
            (merge current-profile { is-verified: false, updated-at: block-height })
          )
          (ok true)
        )
      ERR_PROFILE_NOT_FOUND
    )
  )
)
