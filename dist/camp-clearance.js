// Leave a canopy margin around the central island's building area.
export function treeTooCloseToCamp(x,z){return Math.hypot(x,z)<24||Math.hypot(x+6,z-12)<8;}
