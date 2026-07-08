import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { FeaturesApp } from "./FeaturesApp"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FeaturesApp />
  </StrictMode>
)
