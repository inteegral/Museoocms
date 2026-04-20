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
import { Analytics } from "./components/studio/Analytics";
import { Settings } from "./components/studio/Settings";
import { Map } from "./components/studio/Map";
import { Translations } from "./components/studio/Translations";
import { VoiceTalent } from "./components/studio/VoiceTalent";
import { Reviews } from "./components/studio/Reviews";
import { Marketing } from "./components/studio/Marketing";
import { Monetization } from "./components/studio/Monetization";
import { VisitorPlayer } from "./components/visitor/VisitorPlayer";
import { LandingPage } from "./components/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/studio",
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
      { path: "voice-talent", Component: VoiceTalent },
      { path: "reviews", Component: Reviews },
      { path: "marketing", Component: Marketing },
      { path: "monetization", Component: Monetization },
      { path: "analytics", Component: Analytics },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/:museumSlug/:guideId",
    Component: VisitorPlayer,
  },
]);