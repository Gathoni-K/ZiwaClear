import { beaches } from "./beaches";

function isWithinWinamGulf(lat: number, lng: number): boolean {
  return lat >= -1.0 && lat <= -0.05 && lng >= 34.0 && lng <= 35.0;
}

export function verifyCoordinates() {
  let allValid = true;
  for (const beach of beaches) {
    if (!isWithinWinamGulf(beach.latitude, beach.longitude)) {
      console.error(`Invalid coordinates for beach: ${beach.name}`);
      allValid = false;
    }
  }
  if (allValid) {
    console.log("All beach coordinates verified within Winam Gulf bounding box.");
  }
}

if (require.main === module) {
  verifyCoordinates();
}
