;; StacksBio Analytics Contract
;; Tracks clicks, views, and performance metrics

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u300))
(define-constant ERR_INVALID_INPUT (err u301))
(define-constant ERR_PROFILE_NOT_FOUND (err u302))

;; Data Variables
(define-data-var next-event-id uint u1)

;; Data Maps

;; Daily analytics for profiles
(define-map daily-profile-analytics
  { profile-id: uint, date: uint }
  {
    views: uint,
    clicks: uint,
    unique-visitors: uint
  }
)

;; Daily analytics for individual links
(define-map daily-link-analytics
  { link-id: uint, date: uint }
  {
    clicks: uint,
    unique-clicks: uint
  }
)

;; Profile total analytics
(define-map profile-totals
  { profile-id: uint }
  {
    total-views: uint,
    total-clicks: uint,
    total-visitors: uint,
    first-view-date: uint,
    last-activity-date: uint
  }
)

;; Link total analytics
(define-map link-totals
  { link-id: uint }
  {
    total-clicks: uint,
    unique-clicks: uint,
    first-click-date: (optional uint),
    last-click-date: (optional uint)
  }
)

;; Visitor tracking (simplified - in production might use more sophisticated tracking)
(define-map visitor-sessions
  { visitor-hash: (buff 32), profile-id: uint, date: uint }
  {
    session-start: uint,
    last-activity: uint,
    page-views: uint,
    clicks: uint
  }
)

;; Event log for detailed analytics
(define-map analytics-events
  { event-id: uint }
  {
    event-type: (string-ascii 20), ;; "view", "click", "share"
    profile-id: (optional uint),
    link-id: (optional uint),
    visitor-hash: (buff 32),
    timestamp: uint,
    metadata: (optional (string-ascii 200))
  }
)

;; Private Functions
(define-private (get-current-date)
  ;; Simplified date calculation - in production might want more sophisticated date handling
  (/ block-height u144) ;; Assuming ~144 blocks per day (10 min blocks)
)

(define-private (hash-visitor-info (user-agent (string-ascii 200)) (ip-hash (buff 32)))
  ;; Simple visitor identification - in production would be more sophisticated
  (sha256 (concat ip-hash (as-max-len? (unwrap-panic (to-consensus-buff? user-agent)) u200)))
)

;; Public Functions

;; Record a profile view
(define-public (record-profile-view 
  (profile-id uint)
  (visitor-hash (buff 32))
)
  (let 
    (
      (current-date (get-current-date))
      (event-id (var-get next-event-id))
      (current-block block-height)
    )
    ;; Record the event
    (map-set analytics-events
      { event-id: event-id }
      {
        event-type: "view",
        profile-id: (some profile-id),
        link-id: none,
        visitor-hash: visitor-hash,
        timestamp: current-block,
        metadata: none
      }
    )
    
    ;; Update daily analytics
    (let 
      (
        (current-daily (default-to 
          { views: u0, clicks: u0, unique-visitors: u0 }
          (map-get? daily-profile-analytics { profile-id: profile-id, date: current-date })
        ))
      )
      (map-set daily-profile-analytics
        { profile-id: profile-id, date: current-date }
        (merge current-daily { views: (+ (get views current-daily) u1) })
      )
    )
    
    ;; Update profile totals
    (let 
      (
        (current-totals (default-to
          { total-views: u0, total-clicks: u0, total-visitors: u0, first-view-date: current-date, last-activity-date: current-date }
          (map-get? profile-totals { profile-id: profile-id })
        ))
      )
      (map-set profile-totals
        { profile-id: profile-id }
        (merge current-totals {
          total-views: (+ (get total-views current-totals) u1),
          last-activity-date: current-date
        })
      )
    )
    
    ;; Update visitor session
    (let 
      (
        (session-key { visitor-hash: visitor-hash, profile-id: profile-id, date: current-date })
        (current-session (map-get? visitor-sessions session-key))
      )
      (match current-session
        existing-session
          ;; Update existing session
          (map-set visitor-sessions
            session-key
            (merge existing-session {
              last-activity: current-block,
              page-views: (+ (get page-views existing-session) u1)
            })
          )
        ;; Create new session
        (map-set visitor-sessions
          session-key
          {
            session-start: current-block,
            last-activity: current-block,
            page-views: u1,
            clicks: u0
          }
        )
      )
    )
    
    ;; Increment event ID
    (var-set next-event-id (+ event-id u1))
    
    (ok event-id)
  )
)

;; Record a link click
(define-public (record-link-click
  (profile-id uint)
  (link-id uint)
  (visitor-hash (buff 32))
)
  (let 
    (
      (current-date (get-current-date))
      (event-id (var-get next-event-id))
      (current-block block-height)
    )
    ;; Record the event
    (map-set analytics-events
      { event-id: event-id }
      {
        event-type: "click",
        profile-id: (some profile-id),
        link-id: (some link-id),
        visitor-hash: visitor-hash,
        timestamp: current-block,
        metadata: none
      }
    )
    
    ;; Update daily profile analytics
    (let 
      (
        (current-daily (default-to 
          { views: u0, clicks: u0, unique-visitors: u0 }
          (map-get? daily-profile-analytics { profile-id: profile-id, date: current-date })
        ))
      )
      (map-set daily-profile-analytics
        { profile-id: profile-id, date: current-date }
        (merge current-daily { clicks: (+ (get clicks current-daily) u1) })
      )
    )
    
    ;; Update daily link analytics
    (let 
      (
        (current-link-daily (default-to 
          { clicks: u0, unique-clicks: u0 }
          (map-get? daily-link-analytics { link-id: link-id, date: current-date })
        ))
      )
      (map-set daily-link-analytics
        { link-id: link-id, date: current-date }
        (merge current-link-daily { clicks: (+ (get clicks current-link-daily) u1) })
      )
    )
    
    ;; Update profile totals
    (let 
      (
        (current-totals (default-to
          { total-views: u0, total-clicks: u0, total-visitors: u0, first-view-date: current-date, last-activity-date: current-date }
          (map-get? profile-totals { profile-id: profile-id })
        ))
      )
      (map-set profile-totals
        { profile-id: profile-id }
        (merge current-totals {
          total-clicks: (+ (get total-clicks current-totals) u1),
          last-activity-date: current-date
        })
      )
    )
    
    ;; Update link totals
    (let 
      (
        (current-link-totals (default-to
          { total-clicks: u0, unique-clicks: u0, first-click-date: none, last-click-date: none }
          (map-get? link-totals { link-id: link-id })
        ))
      )
      (map-set link-totals
        { link-id: link-id }
        (merge current-link-totals {
          total-clicks: (+ (get total-clicks current-link-totals) u1),
          first-click-date: (if (is-none (get first-click-date current-link-totals)) (some current-date) (get first-click-date current-link-totals)),
          last-click-date: (some current-date)
        })
      )
    )
    
    ;; Update visitor session
    (let 
      (
        (session-key { visitor-hash: visitor-hash, profile-id: profile-id, date: current-date })
        (current-session (map-get? visitor-sessions session-key))
      )
      (match current-session
        existing-session
          ;; Update existing session
          (map-set visitor-sessions
            session-key
            (merge existing-session {
              last-activity: current-block,
              clicks: (+ (get clicks existing-session) u1)
            })
          )
        ;; Create new session with click
        (map-set visitor-sessions
          session-key
          {
            session-start: current-block,
            last-activity: current-block,
            page-views: u0,
            clicks: u1
          }
        )
      )
    )
    
    ;; Increment event ID
    (var-set next-event-id (+ event-id u1))
    
    (ok event-id)
  )
)

;; Read-only functions

;; Get profile analytics for a specific date
(define-read-only (get-daily-profile-analytics (profile-id uint) (date uint))
  (map-get? daily-profile-analytics { profile-id: profile-id, date: date })
)

;; Get link analytics for a specific date
(define-read-only (get-daily-link-analytics (link-id uint) (date uint))
  (map-get? daily-link-analytics { link-id: link-id, date: date })
)

;; Get profile total analytics
(define-read-only (get-profile-totals (profile-id uint))
  (map-get? profile-totals { profile-id: profile-id })
)

;; Get link total analytics
(define-read-only (get-link-totals (link-id uint))
  (map-get? link-totals { link-id: link-id })
)

;; Get visitor session info
(define-read-only (get-visitor-session (visitor-hash (buff 32)) (profile-id uint) (date uint))
  (map-get? visitor-sessions { visitor-hash: visitor-hash, profile-id: profile-id, date: date })
)

;; Get analytics event
(define-read-only (get-analytics-event (event-id uint))
  (map-get? analytics-events { event-id: event-id })
)

;; Get total number of events
(define-read-only (get-total-events)
  (- (var-get next-event-id) u1)
)

;; Get current date (for external use)
(define-read-only (get-current-analytics-date)
  (get-current-date)
)
