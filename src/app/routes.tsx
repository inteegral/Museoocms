import { createBrowserRouter } from "react-router";
import { StudioLayout } from "./components/studio/_layout/StudioLayout";
import { StudioDashboard } from "./components/studio/_layout/StudioDashboard";
import { GuidesList } from "./components/studio/guides/GuidesList";
import { CreateGuide } from "./components/studio/guides/CreateGuide";
import { GuideEditor } from "./components/studio/production/GuideEditor";
import { POIsManager } from "./components/studio/pois/POIsManager";
import { Events } from "./components/studio/engagement/Events";
import { DocumentsManager } from "./components/studio/content/DocumentsManager";
import { MediaLibrary } from "./components/studio/content/MediaLibrary";
import { Settings } from "./components/studio/settings/Settings";
import { Map } from "./components/studio/pois/Map";
import { Translations } from "./components/studio/production/translation/Translations";
import { VoiceTalent } from "./components/studio/production/voicing/VoiceTalent";
import { Reviews } from "./components/studio/engagement/Reviews";
import { Surveys } from "./components/studio/engagement/Surveys";
import { Challenge } from "./components/studio/engagement/Challenge";
import { Marketing } from "./components/studio/growth/Marketing";
import { Monetization } from "./components/studio/growth/Monetization";
import { Team } from "./components/studio/settings/Team";
import { Profile } from "./components/studio/settings/Profile";
import { VisitorPlayer } from "./components/visitor/VisitorPlayer";
import { TenantOnboarding } from "./components/onboarding/TenantOnboarding";
import { UserOnboarding } from "./components/onboarding/UserOnboarding";
import { SuperAdminLayout } from "./components/superadmin/SuperAdminLayout";
import { SuperAdminDashboard } from "./components/superadmin/SuperAdminDashboard";
import { SuperAdminTenants } from "./components/superadmin/SuperAdminTenants";
import { SuperAdminTenantDetail } from "./components/superadmin/SuperAdminTenantDetail";
import { SuperAdminPlans } from "./components/superadmin/SuperAdminPlans";
import { SuperAdminBilling } from "./components/superadmin/SuperAdminBilling";
import { ReviewMode } from "./components/studio/guides/ReviewMode";
import { Connectors } from "./components/studio/growth/Connectors";
import { DesignSystem } from "./components/studio/DesignSystem";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StudioLayout,
    children: [
      { index: true, Component: StudioDashboard },
      { path: "guides", Component: GuidesList },
      { path: "guides/new", Component: CreateGuide },
      { path: "guides/:id", Component: GuideEditor },
      { path: "pois", Component: POIsManager },
      { path: "events", Component: Events },
      { path: "map", Component: Map },
      { path: "translations", Component: Translations },
      { path: "documents", Component: DocumentsManager },
      { path: "media", Component: MediaLibrary },
      { path: "media/images", Component: MediaLibrary },
      { path: "voice-talent", Component: VoiceTalent },
      { path: "reviews", Component: Reviews },
      { path: "surveys", Component: Surveys },
      { path: "challenge", Component: Challenge },
      { path: "marketing", Component: Marketing },
      { path: "monetization", Component: Monetization },
      { path: "connectors", Component: Connectors },
      { path: "settings", Component: Settings },
      { path: "team", Component: Team },
      { path: "profile", Component: Profile },
      { path: "design-system", Component: DesignSystem },
    ],
  },
  {
    path: "/visitor/:museumSlug/:guideId",
    Component: VisitorPlayer,
  },
  {
    path: "/superadmin",
    Component: SuperAdminLayout,
    children: [
      { index: true, Component: SuperAdminDashboard },
      { path: "tenants", Component: SuperAdminTenants },
      { path: "tenants/:id", Component: SuperAdminTenantDetail },
      { path: "plans", Component: SuperAdminPlans },
      { path: "billing", Component: SuperAdminBilling },
    ],
  },
  {
    path: "/review/:guideId",
    Component: ReviewMode,
  },
  {
    path: "/onboarding",
    Component: TenantOnboarding,
  },
  {
    path: "/invite",
    Component: UserOnboarding,
  },
]);
