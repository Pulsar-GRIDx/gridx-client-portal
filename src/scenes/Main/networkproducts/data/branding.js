// Official Africa Online Namibia brand assets.
//
//   - africaonline-logo.png <- https://africaonline.com.na/wp-content/uploads/
//                              2021/11/AfricaOnline-Logo-2026-01-1.png
//                              (Africa Online's own wordmark, taken straight off
//                              africaonline.com.na)
//
// The file is 2417x983 RGBA with a genuinely transparent background — verified,
// not assumed — so it drops onto any surface without a white box around it.
// The ink is a dark #0032AD though, so on the dark hero it still needs a light
// chip behind it to stay legible; that treatment lives in NetworkProducts.jsx
// rather than being baked into the asset, so light mode can use the logo bare.
import africaOnlineLogo from "../assets/africaonline-logo.png";

export const brandAssets = {
  africaOnlineLogo,
};

// Single source of truth for partner naming/links, so the hero, the source
// list and every card CTA can't drift apart.
export const AFRICA_ONLINE = {
  name: "Africa Online",
  tagline: "Africa's digital Resilience Partner",
  site: "https://africaonline.com.na",
  productsUrl: "https://africaonline.com.na/products/",
  ink: "#0032AD",
};
