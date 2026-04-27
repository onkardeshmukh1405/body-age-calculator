# Project File Structure

Next.js 13 (Pages Router) app — React 18, Tailwind CSS, Redux Toolkit, TypeScript/JSX mix.

---

## Root

```
/
├── src/                        # All application source code
├── public/                     # Static assets (images, icons, sw.js)
├── services/                   # Shared API service helpers (generalApis.js)
├── utils/                      # Root-level utilities
│   ├── apiClient.js            # Axios/fetch wrapper — use this for all API calls
│   ├── commonFunction.js
│   ├── device.js
│   ├── gtag.js
│   └── gtm.js
├── build/                      # Dockerfiles + buildspec YAMLs + ECS task defs
│   └── signup/                 # Signup variant deployment configs
├── docs/
│   ├── plans/                  # Implementation plan docs
│   └── specs/                  # Feature spec docs
├── .github/workflows/          # GitHub Actions CI/CD (ECS deployments)
├── next.config.js              # Next.js config — env vars, basePath, rewrites
├── jest.config.js
├── jest.setup.js
├── postcss.config.js
├── .eslintrc.js
├── sentry.server.config.js
├── sentry.edge.config.js
└── package.json
```

---

## src/

```
src/
├── pages/                      # Next.js file-based routing
├── features/                   # Self-contained feature modules (primary code location)
├── components/                 # Shared legacy UI components
│   ├── atoms/                  # Small reusable UI pieces
│   ├── molecules/              # Composed UI sections
│   └── common/                 # Generic cross-feature components (SEO, ElementVisibilitySensor)
├── store/                      # Redux Toolkit store
├── context/                    # Legacy React Context (GlobalContextProvider)
├── core/                       # App-wide infrastructure
└── constants/                  # App-level constants
```

---

## src/pages/

```
src/pages/
├── _app.js                     # App bootstrap — Redux, GrowthBook, GTM, Mixpanel, Auth providers
├── _document.js
├── _error.jsx
├── index.js                    # Home / landing page
├── api/                        # Next.js API routes
│   ├── hello.js
│   ├── blog.js
│   ├── headers.js
│   ├── image-proxy.ts
│   ├── leaderboard.js
│   └── pincode/[pincode].js
│
├── dashboard.tsx               # Member dashboard
├── dashboard/[leaduid].js
├── login.jsx
├── otp-verification/index.tsx
├── challengeVerify.jsx
├── outsidesession/             # Session fallback pages
│   ├── index.tsx
│   └── stories/[id].tsx
├── membershipBenefits/
│   ├── index.tsx
│   ├── faq.tsx
│   └── stories/[id].tsx
├── certificate/
│   ├── index.tsx
│   ├── [event].jsx
│   ├── download.tsx
│   └── poster.jsx
├── buy/index.tsx
├── challengePaidEnrollment.tsx
├── challengePaidEnrollmentVerify.tsx
├── MOAChallengeCompleted/index.tsx
├── feedback/
├── feedbackForm.jsx
├── referals.jsx
├── rewards.jsx
├── profile/
│   ├── index.jsx
│   ├── [leadslug].js
│   └── update.jsx
├── [referslug].js              # Referral slug pages
│
│   # Festival / campaign pages
├── Diwali/
├── holi/
├── newyear/
├── ganeshChaturthi/
├── festive/
├── campaign/
├── celebrate/
├── karketohdekho/
├── pledge/
├── promise/
├── spreadlove/
├── walloflove/
│
│   # Misc
├── blog/
├── breathing/
├── language/
├── resources/
├── sm/                         # Share message pages
├── c/                          # Campaign short URLs
└── ...                         # Other pages (batches, live, invite, etc.)
```

---

## src/features/

Each feature is self-contained with its own subdirectories:

```
src/features/<FeatureName>/
├── index.tsx                   # Feature entry point / root component
├── api/                        # API call functions
├── components/                 # Feature-specific UI components
│   └── <ComponentName>/
│       ├── index.tsx
│       ├── constant.ts         # Component-level constants
│       └── __tests__/
├── hooks/                      # Custom React hooks
├── utils/                      # Helper functions
├── types/                      # TypeScript types/interfaces
├── constants/                  # Feature-level constants + localization keys
├── locales/                    # i18n translations
│   ├── en.json
│   └── hi.json
├── slice/                      # Redux slice (if feature has own state)
├── pages/                      # Sub-pages (if feature owns multiple pages)
└── __tests__/                  # Integration-level tests
```

### Features list

```
src/features/
├── Auth/
│   ├── Login/
│   ├── OTP/
│   ├── ProtectedRoute/
│   ├── context/AuthProvider.tsx
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constant/
├── attendanceWidget/
├── attendanceMilestone/
├── buildConsistency/
├── certificate/
├── challengeVerification/
├── ChallengePaidEnrollment/
├── SessionTimeFallback/
├── Membership-Benefits/
├── Buy/
├── feedbackForm/
├── Monday/
├── BrickDonation/
├── campaigns/
│   ├── certificates/
│   └── components/
└── festival/
    └── NavratriTools/
        ├── aartiTool/
        └── garbaTool/
```

---

## src/store/

```
src/store/
├── index.ts                    # Redux store setup
├── rootReducer.ts              # Combines all slices
├── constants/actionTypes.js
└── slices/
    ├── userSlice.js
    ├── featureFlagsSlice.ts    # GrowthBook feature flags + configs
    ├── experimentsSlice.ts     # A/B experiment data
    ├── festivalSlice.js
    ├── leaderboardSlice.ts
    ├── addressSlice.ts
    ├── staticDataSlice.ts
    └── userEvent.js
```

---

## src/core/

App-wide infrastructure — shared across all features.

```
src/core/
├── analytics/
│   ├── Index.ts
│   ├── experimentAnalytics.ts
│   └── mixpanel/
│       ├── mixpanel.ts
│       └── helpers/
│           ├── init.ts
│           ├── buttons.ts      # Auto-tracks button clicks
│           └── utils.ts
├── configs/
│   ├── i18n.ts                 # i18n setup (en/hi)
│   ├── en.json
│   └── hi.json
├── constants/
│   ├── index.ts
│   ├── analytics.ts
│   ├── mixpanel.ts
│   └── localizationKeys.ts    # Translation key constants
├── helpers/
│   ├── index.ts
│   ├── phone.ts
│   ├── storage.ts
│   ├── userSession.ts          # Cookie-based session (sessiontoken + leadId)
│   └── experimentMeta.ts
├── hooks/
│   ├── useDomain.ts
│   ├── usePageViewTracking.ts
│   ├── useGrowthBook.ts        # Read feature flags
│   ├── useAuthLink.ts
│   ├── useLocaleFont.ts
│   ├── useLocaleStyle.ts
│   └── usePricingPlans.ts
└── types/index.ts
```

---

## src/constants/

```
src/constants/
├── user.js                     # GTM ID and user constants
├── flags.ts                    # Feature flag names
├── moa.ts
├── seo.ts
├── analytics/index.ts
└── routes/index.ts
```

---

## src/context/

```
src/context/
└── GlobalContextProvider.js    # Legacy React Context — leadDetails, challenge dates,
                                # leaderboard data, payment/referral flags
                                # (prefer Redux slices for new state)
```

---

## Key Conventions

| Rule | Detail |
|------|--------|
| New files | Use `.ts` / `.tsx`, not `.js` / `.jsx` |
| API calls | Always use `utils/apiClient.js`, never raw `fetch` |
| State | New state goes in `src/store/slices/`, not GlobalContextProvider |
| Feature flags | Read via `useGrowthBook` hook or Redux selectors |
| Shared UI | Truly generic → `src/components/atoms` or `molecules`; feature-specific → stays in `src/features/<name>/components/` |
| Tests | Live in `__tests__/` inside each feature/component folder |
| Locales | Each feature with i18n has its own `locales/en.json` + `locales/hi.json` |
