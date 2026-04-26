import { createBrowserRouter } from "react-router";
import { StudioLayout } from "./components/studio/StudioLayout";
import { StudioDashboard } from "./components/studio/StudioDashboard";
import { GuidesList } from "./components/studio/GuidesList";
import { CreateGuide } from "./components/studio/CreateGuide";
import { GuideEditor } from "./components/studio/GuideEditor";
import { PublishFlow } from "./components/studio/PublishFlow";
import { POIsManager } from "./components/studio/POIsManager";
import { DocumentsManager } from "./components/studio/DocumentsManager";
import { MediaLibrary } from "./components/studio/MediaLibrary";
import { Settings } from "./components/studio/Settings";
import { Map } from "./components/studio/Map";
import { Translations } from "./components/studio/Translations";
import { VoiceTalent } from "./components/studio/VoiceTalent";
import { Reviews } from "./components/studio/Reviews";
import { Surveys } from "./components/studio/Surveys";
import { Hunt } from "./components/studio/Hunt";
import { Marketing } from "./components/studio/Marketing";
import { Monetization } from "./components/studio/Monetization";
import { Team } from "./components/studio/Team";
import { Profile } from "./components/studio/Profile";
import { VisitorPlayer } from "./components/visitor/VisitorPlayer";
import { TenantOnboarding } from "./components/onboarding/TenantOnboarding";
import { UserOnboarding } from "./components/onboarding/UserOnboarding";
import { SuperAdminLayout } from "./components/superadmin/SuperAdminLayout";
import { SuperAdminDashboard } from "./components/superadmin/SuperAdminDashboard";
import { SuperAdminTenants } from "./components/superadmin/SuperAdminTenants";
import { SuperAdminTenantDetail } from "./components/superadmin/SuperAdminTenantDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StudioLayout,
    children: [
      { index: true, Component: StudioDashboard },
      { path: "guides", Component: GuidesList },
      { path: "guides/new", Component: CreateGuide },
      { path: "guides/:id", Component: GuideEditor },
      { path: "guides/:id/publish", Component: PublishFlow },
      { path: "pois", Component: POIsManager },
      { path: "map", Component: Map },
      { path: "translations", Component: Translations },
      { path: "documents", Component: DocumentsManager },
      { path: "media", Component: MediaLibrary },
      { path: "media/images", Component: MediaLibrary },
      { path: "voice-talent", Component: VoiceTalent },
      { path: "reviews", Component: Reviews },
      { path: "surveys", Component: Surveys },
      { path: "hunt", Component: Hunt },
      { path: "marketing", Component: Marketing },
      { path: "monetization", Component: Monetization },
      { path: "settings", Component: Settings },
      { path: "team", Component: Team },
      { path: "profile", Component: Profile },
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
    ],
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