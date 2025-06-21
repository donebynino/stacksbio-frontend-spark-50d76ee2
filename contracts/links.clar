;; StacksBio Links Contract
;; Manages user links and their ordering

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u200))
(define-constant ERR_LINK_NOT_FOUND (err u201))
(define-constant ERR_INVALID_INPUT (err u202))
(define-constant ERR_PROFILE_NOT_FOUND (err u203))
(define-constant ERR_MAX_LINKS_REACHED (err u204))

;; Maximum links per profile
(define-constant MAX_LINKS_PER_PROFILE u50)

;; Data Variables
(define-data-var next-link-id uint u1)

;; Data Maps
(define-map links
  { link-id: uint }
  {
    owner: principal,
    profile-id: uint,
    title: (string-utf8 100),
    url: (string-ascii 500),
    description: (optional (string-utf8 200)),
    icon: (optional (string-utf8 10)),
    is-active: bool,
    click-count: uint,
    order: uint,
    style-background: (string-ascii 7),
    style-text: (string-ascii 7),
    style-border: (optional (string-ascii 7)),
    style-border-width: uint,
    style-border-radius: (string-ascii 10),
    style-shadow: (string-ascii 10),
    created-at: uint
  }
)

(define-map profile-links
  { profile-id: uint, order: uint }
  { link-id: uint }
)

(define-map profile-link-count
  { profile-id: uint }
  { count: uint }
)

;; Private Functions
(define-private (is-valid-url (url (string-ascii 500)))
  (and 
    (>= (len url) u7) ;; Minimum "http://"
    (<= (len url) u500)
  )
)

(define-private (get-profile-id-by-owner (owner principal))
  ;; This would typically call the profile contract
  ;; For now, we'll use a simple mapping approach
  ;; In production, this should be a contract call
  (some u1) ;; Placeholder - should be replaced with actual profile lookup
)

;; Public Functions

;; Create a new link
(define-public (create-link
  (title (string-utf8 100))
  (url (string-ascii 500))
  (description (optional (string-utf8 200)))
  (icon (optional (string-utf8 10)))
  (style-background (string-ascii 7))
  (style-text (string-ascii 7))
  (style-border (optional (string-ascii 7)))
  (style-border-width uint)
  (style-border-radius (string-ascii 10))
  (style-shadow (string-ascii 10))
)
  (let 
    (
      (link-id (var-get next-link-id))
      (profile-id-opt (get-profile-id-by-owner tx-sender))
      (current-block-height block-height)
    )
    ;; Validate inputs
    (asserts! (is-valid-url url) ERR_INVALID_INPUT)
    (asserts! (> (len title) u0) ERR_INVALID_INPUT)
    (asserts! (is-some profile-id-opt) ERR_PROFILE_NOT_FOUND)
    
    (let 
      (
        (profile-id (unwrap! profile-id-opt ERR_PROFILE_NOT_FOUND))
        (current-count (default-to u0 (get count (map-get? profile-link-count { profile-id: profile-id }))))
        (new-order (+ current-count u1))
      )
      ;; Check max links limit
      (asserts! (< current-count MAX_LINKS_PER_PROFILE) ERR_MAX_LINKS_REACHED)
      
      ;; Create the link
      (map-set links
        { link-id: link-id }
        {
          owner: tx-sender,
          profile-id: profile-id,
          title: title,
          url: url,
          description: description,
          icon: icon,
          is-active: true,
          click-count: u0,
          order: new-order,
          style-background: style-background,
          style-text: style-text,
          style-border: style-border,
          style-border-width: style-border-width,
          style-border-radius: style-border-radius,
          style-shadow: style-shadow,
          created-at: current-block-height
        }
      )
      
      ;; Update profile-links mapping
      (map-set profile-links
        { profile-id: profile-id, order: new-order }
        { link-id: link-id }
      )
      
      ;; Update link count
      (map-set profile-link-count
        { profile-id: profile-id }
        { count: new-order }
      )
      
      ;; Increment next link ID
      (var-set next-link-id (+ link-id u1))
      
      (ok link-id)
    )
  )
)

;; Update a link
(define-public (update-link
  (link-id uint)
  (title (optional (string-utf8 100)))
  (url (optional (string-ascii 500)))
  (description (optional (string-utf8 200)))
  (icon (optional (string-utf8 10)))
  (is-active (optional bool))
)
  (let 
    (
      (current-link (unwrap! (map-get? links { link-id: link-id }) ERR_LINK_NOT_FOUND))
    )
    ;; Check ownership
    (asserts! (is-eq tx-sender (get owner current-link)) ERR_NOT_AUTHORIZED)
    
    ;; Validate URL if provided
    (asserts! 
      (match url
        new-url (is-valid-url new-url)
        true
      ) 
      ERR_INVALID_INPUT
    )
    
    ;; Update the link
    (map-set links
      { link-id: link-id }
      (merge current-link {
        title: (default-to (get title current-link) title),
        url: (default-to (get url current-link) url),
        description: (if (is-some description) description (get description current-link)),
        icon: (if (is-some icon) icon (get icon current-link)),
        is-active: (default-to (get is-active current-link) is-active)
      })
    )
    
    (ok true)
  )
)

;; Update link style
(define-public (update-link-style
  (link-id uint)
  (style-background (string-ascii 7))
  (style-text (string-ascii 7))
  (style-border (optional (string-ascii 7)))
  (style-border-width uint)
  (style-border-radius (string-ascii 10))
  (style-shadow (string-ascii 10))
)
  (let 
    (
      (current-link (unwrap! (map-get? links { link-id: link-id }) ERR_LINK_NOT_FOUND))
    )
    ;; Check ownership
    (asserts! (is-eq tx-sender (get owner current-link)) ERR_NOT_AUTHORIZED)
    
    ;; Update the link style
    (map-set links
      { link-id: link-id }
      (merge current-link {
        style-background: style-background,
        style-text: style-text,
        style-border: style-border,
        style-border-width: style-border-width,
        style-border-radius: style-border-radius,
        style-shadow: style-shadow
      })
    )
    
    (ok true)
  )
)

;; Delete a link
(define-public (delete-link (link-id uint))
  (let 
    (
      (current-link (unwrap! (map-get? links { link-id: link-id }) ERR_LINK_NOT_FOUND))
      (profile-id (get profile-id current-link))
      (link-order (get order current-link))
    )
    ;; Check ownership
    (asserts! (is-eq tx-sender (get owner current-link)) ERR_NOT_AUTHORIZED)
    
    ;; Remove the link
    (map-delete links { link-id: link-id })
    
    ;; Remove from profile-links mapping
    (map-delete profile-links { profile-id: profile-id, order: link-order })
    
    ;; Update link count
    (let 
      (
        (current-count (default-to u0 (get count (map-get? profile-link-count { profile-id: profile-id }))))
      )
      (map-set profile-link-count
        { profile-id: profile-id }
        { count: (if (> current-count u0) (- current-count u1) u0) }
      )
    )
    
    (ok true)
  )
)

;; Increment click count
(define-public (increment-click-count (link-id uint))
  (let 
    (
      (current-link (unwrap! (map-get? links { link-id: link-id }) ERR_LINK_NOT_FOUND))
    )
    ;; Update click count
    (map-set links
      { link-id: link-id }
      (merge current-link {
        click-count: (+ (get click-count current-link) u1)
      })
    )
    
    (ok true)
  )
)

;; Read-only functions

;; Get link by ID
(define-read-only (get-link (link-id uint))
  (map-get? links { link-id: link-id })
)

;; Get links by profile ID (simplified - in production would need pagination)
(define-read-only (get-profile-links (profile-id uint))
  (let 
    (
      (link-count (default-to u0 (get count (map-get? profile-link-count { profile-id: profile-id }))))
    )
    ;; This is a simplified version - in production, you'd want to implement proper pagination
    ;; and return a list of links ordered by their order field
    link-count
  )
)

;; Get link count for profile
(define-read-only (get-profile-link-count (profile-id uint))
  (default-to u0 (get count (map-get? profile-link-count { profile-id: profile-id })))
)

;; Get total number of links
(define-read-only (get-total-links)
  (- (var-get next-link-id) u1)
)

;; Check if user owns link
(define-read-only (is-link-owner (link-id uint) (user principal))
  (match (map-get? links { link-id: link-id })
    link-data (is-eq user (get owner link-data))
    false
  )
)
