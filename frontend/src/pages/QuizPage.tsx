import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import SpeechButton from '../components/SpeechButton';

/* ─────────────── Types ─────────────── */
type Difficulty = "easy" | "medium" | "hard";

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  points: number;
}

interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
}

/* ─────────────── Category Meta ─────────────── */
const CATEGORIES: Record<string, CategoryInfo> = {
  "Earthquake": { name: "Earthquake", icon: "🏚️", color: "#ef4444" },
  "Flood": { name: "Flood Safety", icon: "🌊", color: "#3b82f6" },
  "Fire": { name: "Fire Safety", icon: "🔥", color: "#f97316" },
  "Tornado": { name: "Tornado / Cyclone", icon: "🌪️", color: "#8b5cf6" },
  "Tsunami": { name: "Tsunami Safety", icon: "🌊", color: "#0891b2" },
  "Landslide": { name: "Landslide Safety", icon: "⛰️", color: "#a16207" },
  "First Aid": { name: "First Aid & Medical", icon: "🏥", color: "#16a34a" },
  "Emergency Kit": { name: "Emergency Kit & Planning", icon: "🎒", color: "#7c3aed" },
};

/* ─────────────── Question Bank (50+) ─────────────── */
const ALL_QUESTIONS: QuizQuestion[] = [
  // ========== EARTHQUAKE (8 questions) ==========
  { id: 1, category: "Earthquake", difficulty: "easy", points: 5, question: "During an earthquake, what is the safest action?", options: ["Run outside immediately", "Drop, Cover, and Hold On", "Stand in a doorway", "Get in an elevator"], correctAnswer: 1, explanation: "The 'Drop, Cover, and Hold On' technique is recommended by seismologists worldwide. Get under a sturdy desk or table, cover your head and neck, and hold on until the shaking stops." },
  { id: 2, category: "Earthquake", difficulty: "easy", points: 5, question: "What should you do if you are outdoors during an earthquake?", options: ["Run inside the nearest building", "Move away from buildings, trees, and power lines", "Lie flat on the ground", "Climb a tree for safety"], correctAnswer: 1, explanation: "If outdoors, move to an open area away from buildings, trees, streetlights, and utility wires. Drop to the ground and protect your head." },
  { id: 3, category: "Earthquake", difficulty: "medium", points: 10, question: "What is the Richter scale used for?", options: ["Measuring wind speed", "Measuring earthquake magnitude", "Measuring tsunami height", "Measuring temperature"], correctAnswer: 1, explanation: "The Richter scale (now largely replaced by the Moment Magnitude Scale) measures the magnitude or energy released by an earthquake. Each whole number increase represents roughly 31.6 times more energy." },
  { id: 4, category: "Earthquake", difficulty: "medium", points: 10, question: "After an earthquake, what should you check first?", options: ["Your phone for messages", "Gas leaks and structural damage", "The news on TV", "Whether the internet is working"], correctAnswer: 1, explanation: "After an earthquake, immediately check for gas leaks (smell/hissing sounds), structural damage, and fires. Gas leaks can cause explosions. If you smell gas, open windows, leave, and call authorities." },
  { id: 5, category: "Earthquake", difficulty: "hard", points: 15, question: "What is liquefaction in the context of earthquakes?", options: ["When buildings melt from heat", "When solid ground behaves like liquid due to shaking", "When water levels rise after a quake", "When lava flows from cracks"], correctAnswer: 1, explanation: "Liquefaction occurs when saturated, loosely packed soil loses its strength during intense shaking and behaves like a liquid. This can cause buildings to sink, tilt, or collapse even if structurally sound." },
  { id: 6, category: "Earthquake", difficulty: "medium", points: 10, question: "If you are driving when an earthquake strikes, what should you do?", options: ["Speed up to escape the area", "Pull over safely, stop, and stay in the car", "Abandon the car and run", "Drive under an overpass for shelter"], correctAnswer: 1, explanation: "Pull over to a clear area, stop, set the parking brake, and stay inside with your seatbelt on. Avoid stopping near buildings, trees, overpasses, or utility wires. The car provides protection from falling debris." },
  { id: 7, category: "Earthquake", difficulty: "hard", points: 15, question: "What are P-waves and S-waves in earthquake seismology?", options: ["Pressure waves and Sound waves", "Primary (compressional) and Secondary (shear) waves", "Power waves and Strength waves", "Parallel and Serial waves"], correctAnswer: 1, explanation: "P-waves (Primary) are compressional waves that travel fastest and arrive first. S-waves (Secondary) are shear waves that arrive later but cause more damage. The time difference between them helps locate the earthquake's epicenter." },
  { id: 8, category: "Earthquake", difficulty: "easy", points: 5, question: "Where is the safest place during an earthquake if you are indoors?", options: ["Next to an outside wall", "Under a sturdy table or desk", "In a doorway", "Near large windows"], correctAnswer: 1, explanation: "The safest place indoors is under a sturdy piece of furniture like a heavy desk or table. This protects you from falling objects and debris. The 'doorway myth' is outdated — modern doorways are no stronger than other parts of a building." },

  // ========== FLOOD (8 questions) ==========
  { id: 9, category: "Flood", difficulty: "easy", points: 5, question: "How much moving water can knock a person off their feet?", options: ["3 feet", "6 inches", "2 feet", "5 feet"], correctAnswer: 1, explanation: "Just 6 inches (15 cm) of fast-moving water can knock adults off their feet. Never attempt to walk, swim, or drive through floodwaters. The force of moving water is extremely powerful and deceptive." },
  { id: 10, category: "Flood", difficulty: "easy", points: 5, question: "What does the phrase 'Turn Around, Don't Drown' refer to?", options: ["A swimming technique", "Never drive through flooded roads", "A flood warning signal", "An evacuation procedure"], correctAnswer: 1, explanation: "'Turn Around, Don't Drown' is a safety campaign reminding people never to drive, walk, or swim through floodwaters. More than half of all flood-related drownings occur when a vehicle is driven into hazardous water." },
  { id: 11, category: "Flood", difficulty: "medium", points: 10, question: "What is a flash flood?", options: ["A flood caused by a dam break", "A rapid flooding within 6 hours of heavy rain", "A flood that only occurs at night", "Flooding that lasts less than a minute"], correctAnswer: 1, explanation: "A flash flood is a rapid rise of water, usually within 6 hours of heavy rainfall or a dam/levee failure. Flash floods are the most dangerous type because they combine the destructive power of a flood with incredible speed." },
  { id: 12, category: "Flood", difficulty: "medium", points: 10, question: "How much water can carry away a vehicle?", options: ["6 feet", "1 foot", "2 feet", "4 feet"], correctAnswer: 2, explanation: "Just 2 feet (60 cm) of water can carry away most vehicles, including SUVs and pickup trucks. The buoyancy and force of water easily overwhelms a vehicle's weight and traction." },
  { id: 13, category: "Flood", difficulty: "hard", points: 15, question: "What is a storm surge?", options: ["High waves during a thunderstorm", "An abnormal rise in water level caused by a storm's winds", "Heavy rain that floods streets", "River water overflowing its banks"], correctAnswer: 1, explanation: "A storm surge is an abnormal rise in seawater level generated by a storm's winds pushing water onshore. Storm surges can reach 20+ feet and are the greatest threat to life and property from hurricanes." },
  { id: 14, category: "Flood", difficulty: "easy", points: 5, question: "During a flood warning, what should you do?", options: ["Wait to see if water reaches your house", "Move to higher ground immediately", "Go to the basement", "Stand on the roof and wait"], correctAnswer: 1, explanation: "When a flood warning is issued, move to higher ground immediately. Do not wait for water to reach you. Floodwaters can rise rapidly and escape routes can be cut off quickly." },
  { id: 15, category: "Flood", difficulty: "medium", points: 10, question: "Which is the most common natural disaster in India?", options: ["Earthquakes", "Floods", "Cyclones", "Landslides"], correctAnswer: 1, explanation: "Floods are the most common natural disaster in India, affecting millions of people annually. India receives about 75% of its annual rainfall during the monsoon season (June-September), making flood management critical." },
  { id: 16, category: "Flood", difficulty: "hard", points: 15, question: "What is a flood plain?", options: ["An area that never floods", "A flat area adjacent to a river that is subject to flooding", "A type of dam", "An irrigation canal"], correctAnswer: 1, explanation: "A flood plain is a flat area of land adjacent to a river that is naturally subject to periodic flooding. Building on flood plains significantly increases flood risk. Many cities worldwide are built on flood plains." },

  // ========== FIRE (8 questions) ==========
  { id: 17, category: "Fire", difficulty: "easy", points: 5, question: "In a smoke-filled room, how should you move?", options: ["Run standing upright", "Crawl low to the floor", "Jump over the smoke", "Stand still and wait"], correctAnswer: 1, explanation: "Smoke and heat rise, so the cleanest air is near the floor. Crawl on your hands and knees to stay below the smoke layer. Cover your nose and mouth with a wet cloth if possible." },
  { id: 18, category: "Fire", difficulty: "easy", points: 5, question: "What should you do if your clothes catch fire?", options: ["Run to find water", "Stop, Drop, and Roll", "Fan the flames with your hands", "Remove all clothing immediately"], correctAnswer: 1, explanation: "Stop, Drop, and Roll: Stop immediately, drop to the ground, cover your face with your hands, and roll back and forth to smother the flames. Running fans the flames and makes the fire worse." },
  { id: 19, category: "Fire", difficulty: "medium", points: 10, question: "Before opening a door during a fire, what should you do?", options: ["Kick it open quickly", "Feel the door and handle with the back of your hand", "Open it slowly with gloves", "Always leave all doors open"], correctAnswer: 1, explanation: "Use the back of your hand to feel the door and doorknob. If they are hot, there is likely fire on the other side. Do NOT open it — find an alternate escape route. If cool, open carefully." },
  { id: 20, category: "Fire", difficulty: "medium", points: 10, question: "What does PASS stand for when using a fire extinguisher?", options: ["Push, Aim, Squeeze, Sweep", "Pull, Aim, Squeeze, Sweep", "Pull, Activate, Spray, Stop", "Push, Activate, Squeeze, Stop"], correctAnswer: 1, explanation: "PASS: Pull the pin, Aim at the base of the fire, Squeeze the handle, and Sweep from side to side. Always aim at the base of the flames, not the top, and stand 6-8 feet away." },
  { id: 21, category: "Fire", difficulty: "hard", points: 15, question: "What is a flashover in firefighting?", options: ["When a firefighter uses a flashlight", "When all combustible materials in a room simultaneously ignite", "When lightning strikes a building", "When a fire is extinguished with water"], correctAnswer: 1, explanation: "Flashover occurs when heat radiation causes all combustible surfaces in an enclosed space to ignite nearly simultaneously, typically at temperatures of 500-600°C. It is one of the most dangerous phenomena in firefighting." },
  { id: 22, category: "Fire", difficulty: "easy", points: 5, question: "How often should you test your smoke detectors?", options: ["Once a year", "Every month", "Only when moving to a new house", "Every 5 years"], correctAnswer: 1, explanation: "Test smoke detectors monthly by pressing the test button. Replace batteries at least once a year (or when the low-battery chirp sounds). Replace the entire unit every 10 years." },
  { id: 23, category: "Fire", difficulty: "medium", points: 10, question: "What type of fire extinguisher should you NEVER use on an electrical fire?", options: ["CO2 extinguisher", "Water extinguisher", "Dry chemical extinguisher", "Halon extinguisher"], correctAnswer: 1, explanation: "Never use a water extinguisher on an electrical fire — water conducts electricity and can cause electrocution. Use CO2 or dry chemical extinguishers for electrical fires. Always disconnect power if safely possible." },
  { id: 24, category: "Fire", difficulty: "hard", points: 15, question: "What is the fire triangle?", options: ["A firefighting formation", "The three elements needed for fire: heat, fuel, and oxygen", "A type of fire alarm", "Three fire stations arranged in a triangle"], correctAnswer: 1, explanation: "The fire triangle represents the three elements needed for combustion: Heat (ignition source), Fuel (combustible material), and Oxygen. Removing any one element will extinguish the fire. This is the fundamental principle of firefighting." },

  // ========== TORNADO (6 questions) ==========
  { id: 25, category: "Tornado", difficulty: "easy", points: 5, question: "Where is the safest place during a tornado?", options: ["In a car", "A basement or interior room on the lowest floor", "Near large windows", "On the roof"], correctAnswer: 1, explanation: "The safest place is in a basement or a small interior room on the lowest floor (bathroom, closet, hallway). Stay away from windows, doors, and outside walls. Cover yourself with thick padding." },
  { id: 26, category: "Tornado", difficulty: "medium", points: 10, question: "What does a tornado watch mean?", options: ["A tornado has been spotted", "Conditions are favorable for tornado formation", "The tornado has passed", "Evacuate immediately"], correctAnswer: 1, explanation: "A Tornado Watch means atmospheric conditions are favorable for tornado development. Stay alert and be ready to take shelter. A Tornado Warning means a tornado has been sighted or detected by radar — take shelter immediately." },
  { id: 27, category: "Tornado", difficulty: "medium", points: 10, question: "What scale measures tornado intensity?", options: ["Richter Scale", "Enhanced Fujita (EF) Scale", "Beaufort Scale", "Saffir-Simpson Scale"], correctAnswer: 1, explanation: "The Enhanced Fujita (EF) Scale rates tornadoes from EF0 (light damage, 65-85 mph winds) to EF5 (incredible destruction, 200+ mph winds). It estimates wind speeds based on the damage caused." },
  { id: 28, category: "Tornado", difficulty: "hard", points: 15, question: "What is a supercell thunderstorm?", options: ["A very large regular thunderstorm", "A rotating thunderstorm with a persistent updraft that can produce tornadoes", "A storm with excessive lightning", "Two thunderstorms colliding"], correctAnswer: 1, explanation: "A supercell is a thunderstorm with a deep, persistently rotating updraft called a mesocyclone. Supercells are the most likely type of thunderstorm to produce severe weather including large hail, damaging winds, and tornadoes." },
  { id: 29, category: "Tornado", difficulty: "easy", points: 5, question: "If you are in a mobile home during a tornado warning, you should:", options: ["Stay inside and hold on", "Go outside and lie in a low ditch", "Leave and go to a sturdy building or designated shelter", "Park the mobile home facing the tornado"], correctAnswer: 2, explanation: "Mobile homes are extremely unsafe during tornadoes. Leave immediately and go to a nearby sturdy building or designated storm shelter. If no shelter is available, lie flat in a low ditch and cover your head." },
  { id: 30, category: "Tornado", difficulty: "medium", points: 10, question: "What are common signs that a tornado may be approaching?", options: ["Clear blue skies", "Dark greenish sky, large hail, and a loud roar like a freight train", "Gentle rain and fog", "Snow and freezing temperatures"], correctAnswer: 1, explanation: "Warning signs include: dark or greenish sky, large hail, a loud continuous roar (like a freight train), a visible rotating funnel, debris cloud at ground level, and a sudden calm after a thunderstorm." },

  // ========== TSUNAMI (6 questions) ==========
  { id: 31, category: "Tsunami", difficulty: "easy", points: 5, question: "What is the first natural warning sign of a tsunami?", options: ["Heavy rainfall", "The ocean receding unusually far from shore", "Thunder and lightning", "Dense fog rolling in"], correctAnswer: 1, explanation: "If the ocean suddenly recedes and exposes the sea floor far beyond normal low tide, it is a major natural warning sign of an incoming tsunami. Move to high ground immediately — you may only have minutes." },
  { id: 32, category: "Tsunami", difficulty: "medium", points: 10, question: "A tsunami can travel across the open ocean at speeds of:", options: ["30-50 mph", "100-200 mph", "Up to 500 mph (as fast as a jet)", "5-10 mph"], correctAnswer: 2, explanation: "In deep ocean water, tsunamis can travel at speeds up to 500 mph (800 km/h), as fast as a commercial jet airplane. In deep water, they may be less than 1 foot tall, but they slow down and grow enormously tall as they approach shallow coastal waters." },
  { id: 33, category: "Tsunami", difficulty: "easy", points: 5, question: "How should you respond to a tsunami warning?", options: ["Wait to see the wave first", "Move to high ground immediately, at least 100 feet above sea level", "Go to the beach to watch", "Hide in a basement"], correctAnswer: 1, explanation: "Immediately move to high ground (at least 100 feet / 30 meters above sea level) or as far inland as possible. Do not wait — every second counts. Never go to the beach to watch a tsunami." },
  { id: 34, category: "Tsunami", difficulty: "hard", points: 15, question: "What causes most tsunamis?", options: ["Strong winds", "Undersea earthquakes displacing the ocean floor", "Heavy monsoon rains", "Extreme tides"], correctAnswer: 1, explanation: "About 80% of tsunamis are caused by large undersea earthquakes (typically magnitude 7.0+) along subduction zones, where one tectonic plate slides under another, suddenly displacing massive volumes of water." },
  { id: 35, category: "Tsunami", difficulty: "medium", points: 10, question: "Can a tsunami consist of multiple waves?", options: ["No, it is always a single wave", "Yes, the first wave may not be the largest", "Only during earthquakes above 9.0", "Only in the Pacific Ocean"], correctAnswer: 1, explanation: "A tsunami is a series of waves, and the first wave is often NOT the largest. Later waves can be much more dangerous. Waves can continue arriving for hours. Do not return to low-lying areas until authorities say it is safe." },
  { id: 36, category: "Tsunami", difficulty: "medium", points: 10, question: "The 2004 Indian Ocean tsunami was triggered by an earthquake of what magnitude?", options: ["7.5", "8.2", "9.1", "6.8"], correctAnswer: 2, explanation: "The 2004 Indian Ocean tsunami was triggered by a magnitude 9.1 earthquake off the coast of Sumatra, Indonesia. It killed approximately 230,000 people across 14 countries, making it one of the deadliest natural disasters in recorded history." },

  // ========== LANDSLIDE (5 questions) ==========
  { id: 37, category: "Landslide", difficulty: "easy", points: 5, question: "What is the most common trigger for landslides?", options: ["Strong winds", "Heavy or prolonged rainfall", "Solar eclipses", "Extreme cold"], correctAnswer: 1, explanation: "Heavy or prolonged rainfall is the most common trigger for landslides. Water saturates the soil, making it heavy and reducing the friction that holds it in place on slopes. Other triggers include earthquakes, volcanic activity, and human activities like deforestation." },
  { id: 38, category: "Landslide", difficulty: "medium", points: 10, question: "What are warning signs of an imminent landslide?", options: ["Birds flying in circles", "Cracks in the ground, tilting trees, bulging ground, unusual water flow", "Clear skies after rain", "Strong winds from the south"], correctAnswer: 1, explanation: "Warning signs include: new cracks or bulges in the ground, tilting trees/fences/walls, sudden changes in water flow in streams, doors/windows that stick, faint rumbling sounds that increase in volume, and springs or wet spots appearing on slopes." },
  { id: 39, category: "Landslide", difficulty: "medium", points: 10, question: "If you suspect a landslide is about to occur near your home, you should:", options: ["Dig a trench to redirect the landslide", "Evacuate immediately and alert neighbors", "Climb to the roof", "Water the garden to stabilize the soil"], correctAnswer: 1, explanation: "If you suspect an imminent landslide, evacuate immediately. Alert neighbors and contact local authorities. Do not attempt to stay and protect property. Move away from the path of the landslide, generally uphill and perpendicular to the slide direction." },
  { id: 40, category: "Landslide", difficulty: "hard", points: 15, question: "What is the difference between a landslide and a mudflow?", options: ["They are the same thing", "A landslide moves rock and debris; a mudflow is a rapid flow of saturated soil", "A mudflow is always larger", "Landslides only happen in mountains"], correctAnswer: 1, explanation: "A landslide involves the downslope movement of rock, debris, or earth. A mudflow (or debris flow) is a specific type involving a rapid flow of water-saturated soil and debris that moves like wet concrete. Mudflows can travel faster and further than typical landslides." },
  { id: 41, category: "Landslide", difficulty: "easy", points: 5, question: "Which of these human activities can increase landslide risk?", options: ["Planting trees on slopes", "Deforestation and construction on steep slopes", "Building retaining walls", "Installing drainage systems"], correctAnswer: 1, explanation: "Deforestation removes root systems that hold soil in place, while construction on steep slopes can destabilize them. Other activities like improper drainage, mining, and overloading slopes with fill material also increase landslide risk." },

  // ========== FIRST AID (5 questions) ==========
  { id: 42, category: "First Aid", difficulty: "easy", points: 5, question: "What is the first step in providing first aid?", options: ["Start CPR immediately", "Ensure the scene is safe for yourself and the victim", "Call for an ambulance", "Move the victim to a comfortable position"], correctAnswer: 1, explanation: "Always ensure scene safety first. Check for hazards like traffic, fire, electrical wires, or unstable structures. You cannot help anyone if you become a victim yourself. Then check the victim's responsiveness and call for help." },
  { id: 43, category: "First Aid", difficulty: "medium", points: 10, question: "For an adult, what is the correct rate for CPR chest compressions?", options: ["60 per minute", "100 to 120 per minute", "80 per minute", "150 per minute"], correctAnswer: 1, explanation: "For adult CPR, perform chest compressions at a rate of 100-120 per minute, about 2 inches (5 cm) deep. Push hard and fast on the center of the chest. The beat of the song 'Stayin' Alive' by the Bee Gees is approximately 100 BPM." },
  { id: 44, category: "First Aid", difficulty: "medium", points: 10, question: "How should you treat a severe bleeding wound?", options: ["Pour alcohol on it", "Apply direct pressure with a clean cloth and elevate if possible", "Remove any embedded objects", "Apply a tourniquet as the first step"], correctAnswer: 1, explanation: "Apply firm, direct pressure with a clean cloth or bandage. Do NOT remove embedded objects. Elevate the injured area above the heart if possible. If blood soaks through, add more layers — do not remove the original cloth. A tourniquet is a last resort." },
  { id: 45, category: "First Aid", difficulty: "hard", points: 15, question: "What are the signs of a stroke (using the FAST method)?", options: ["Fever, Appetite loss, Sore throat, Tiredness", "Face drooping, Arm weakness, Speech difficulty, Time to call emergency", "Foot pain, Arm numbness, Stomach ache, Thirst", "Fainting, Anxiety, Sweating, Tremors"], correctAnswer: 1, explanation: "FAST: Face drooping (one side), Arm weakness (one arm drifts down), Speech difficulty (slurred or strange), Time to call emergency services immediately. Stroke treatment is time-critical — every minute matters for brain damage prevention." },
  { id: 46, category: "First Aid", difficulty: "easy", points: 5, question: "What should you do for a minor burn?", options: ["Apply butter or oil", "Cool the burn under cool running water for at least 10 minutes", "Pop any blisters", "Cover with cotton wool"], correctAnswer: 1, explanation: "Cool the burn under cool (not cold/ice) running water for at least 10-20 minutes. Do NOT apply butter, oil, toothpaste, or ice. Do not pop blisters. Cover loosely with a sterile, non-stick bandage after cooling." },

  // ========== EMERGENCY KIT & PLANNING (5+ questions) ==========
  { id: 47, category: "Emergency Kit", difficulty: "easy", points: 5, question: "How many days of supplies should an emergency kit contain at minimum?", options: ["1 day", "3 days (72 hours)", "1 week", "1 month"], correctAnswer: 1, explanation: "Every household should have an emergency kit with at least 72 hours (3 days) of supplies for each family member. This includes water (1 gallon per person per day), non-perishable food, medications, first aid supplies, flashlight, batteries, and important documents." },
  { id: 48, category: "Emergency Kit", difficulty: "medium", points: 10, question: "How much water should you store per person per day in an emergency kit?", options: ["2 cups", "1 liter", "1 gallon (3.8 liters)", "Half a gallon"], correctAnswer: 2, explanation: "Store at least 1 gallon (3.8 liters) of water per person per day. This accounts for drinking AND sanitation needs. For a family of four, that's 12 gallons for a 3-day supply. Store water in clean, food-grade containers." },
  { id: 49, category: "Emergency Kit", difficulty: "medium", points: 10, question: "What documents should be included in an emergency kit?", options: ["Only your passport", "Copies of ID, insurance policies, bank records, and medical records", "Just your phone with photos of documents", "Only property papers"], correctAnswer: 1, explanation: "Keep waterproof copies of: government IDs, insurance policies (home, health, vehicle), bank account numbers, medical records and prescriptions, emergency contacts, property deeds, and family photos for identification. Store in a waterproof bag." },
  { id: 50, category: "Emergency Kit", difficulty: "easy", points: 5, question: "What is the purpose of a family emergency communication plan?", options: ["To plan family vacations", "To ensure family members can contact each other and know meeting points during disasters", "To save on phone bills", "To monitor children's screen time"], correctAnswer: 1, explanation: "A family communication plan ensures everyone knows: emergency contacts, designated meeting points (near home and outside neighborhood), out-of-area contact person, how to communicate if local lines are down, and each person's responsibilities." },
  { id: 51, category: "Emergency Kit", difficulty: "hard", points: 15, question: "Why should you have a battery-powered or hand-crank radio in your emergency kit?", options: ["For entertainment", "To receive official emergency broadcasts when power and internet are down", "To communicate with neighbors", "To charge your phone"], correctAnswer: 1, explanation: "During disasters, power outages can knock out TV, internet, and cell service. A battery-powered or hand-crank NOAA Weather Radio receives official emergency broadcasts, warnings, and instructions from authorities — it may be your only source of information." },
  { id: 52, category: "Emergency Kit", difficulty: "medium", points: 10, question: "What should you do about medications in your emergency kit?", options: ["Store a 1-year supply", "Keep at least a 7-day supply of essential medications and rotate them regularly", "Medications don't need to be in the kit", "Only keep pain relievers"], correctAnswer: 1, explanation: "Keep at least a 7-day supply of essential prescription medications in your kit. Rotate them regularly so they don't expire. Also include basic OTC medications: pain relievers, anti-diarrheal, antacids, and any allergy medications." },

  // ========== BONUS QUESTIONS (mixed categories) ==========
  { id: 53, category: "Earthquake", difficulty: "medium", points: 10, question: "What is the 'Triangle of Life' and is it recommended?", options: ["A recommended earthquake survival technique", "A debunked myth — Drop, Cover, Hold On is the correct method", "A way to build earthquake-resistant houses", "An emergency signal formation"], correctAnswer: 1, explanation: "The 'Triangle of Life' theory (lying next to large objects) has been debunked by earthquake safety experts. Official agencies worldwide recommend Drop, Cover, and Hold On. The Triangle of Life does not account for falling and flying objects." },
  { id: 54, category: "Flood", difficulty: "medium", points: 10, question: "What is the safest thing to do if floodwater enters your home rapidly?", options: ["Try to plug the leaks", "Move to the highest level of your home, not the attic unless you have roof access", "Open all doors to let water flow through", "Pump water out immediately"], correctAnswer: 1, explanation: "Move to the highest floor, but avoid attics unless you have a way to break through the roof — many people have drowned being trapped in attics by rising water. Signal for help from an upper window or roof. Never try to swim through floodwaters." },
  { id: 55, category: "Fire", difficulty: "easy", points: 5, question: "What is the recommended escape time for a house fire?", options: ["10 minutes", "Under 2 minutes", "5 minutes", "30 seconds"], correctAnswer: 1, explanation: "You may have less than 2 minutes to escape a house fire once the smoke alarm sounds. Modern furnishings and materials burn much faster than older ones. This is why having a practiced escape plan with two ways out of every room is critical." },
  { id: 56, category: "Tornado", difficulty: "hard", points: 15, question: "What is a derecho?", options: ["A type of tornado", "A widespread, long-lived windstorm associated with fast-moving bands of severe thunderstorms", "A tornado that occurs over water", "A small dust devil"], correctAnswer: 1, explanation: "A derecho is a widespread, long-lived windstorm with straight-line winds (not rotating like a tornado) exceeding 58 mph across a swath at least 250 miles long. Derechos can cause tornado-like damage over a much wider area." },
  { id: 57, category: "First Aid", difficulty: "medium", points: 10, question: "What should you do if someone is choking and cannot cough, speak, or breathe?", options: ["Give them water to drink", "Perform abdominal thrusts (Heimlich maneuver)", "Slap their back once", "Wait for them to recover on their own"], correctAnswer: 1, explanation: "Perform abdominal thrusts (Heimlich maneuver): Stand behind the person, place your fist above their navel, grasp with other hand, and give quick upward thrusts. For pregnant women or obese individuals, use chest thrusts instead." },
  { id: 58, category: "Landslide", difficulty: "medium", points: 10, question: "Which areas are most prone to landslides?", options: ["Flat desert regions", "Steep slopes, especially those that have been deforested, burned, or modified", "Open plains near rivers", "Frozen tundra"], correctAnswer: 1, explanation: "Areas most prone to landslides include: steep slopes, deforested hillsides, areas recently burned by wildfire, slopes modified by construction or mining, areas with weak rock or soil, and slopes that receive heavy rainfall. Mountain regions are particularly vulnerable." },
];

/* ─────────────── Helpers ─────────────── */
const TIMER_SECONDS = 30;

function getGrade(pct: number): { grade: string; color: string } {
  if (pct >= 95) return { grade: "A+", color: "#16a34a" };
  if (pct >= 85) return { grade: "A", color: "#22c55e" };
  if (pct >= 75) return { grade: "B", color: "#3b82f6" };
  if (pct >= 60) return { grade: "C", color: "#f59e0b" };
  if (pct >= 45) return { grade: "D", color: "#f97316" };
  return { grade: "F", color: "#ef4444" };
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* ─────────────── Component ─────────────── */
export default function QuizPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  // Phase
  const [phase, setPhase] = useState<"start" | "quiz" | "result">("start");

  // Start screen
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Category stats
  const categoryNames = Object.keys(CATEGORIES);
  const categoryCounts = categoryNames.reduce((acc, cat) => {
    acc[cat] = ALL_QUESTIONS.filter((q) => q.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  // Start quiz
  const handleStart = useCallback((category: string | null) => {
    let filtered = category
      ? ALL_QUESTIONS.filter((q) => q.category === category)
      : [...ALL_QUESTIONS];
    filtered = shuffleArray(filtered);
    setQuestions(filtered);
    setAnswers(new Array(filtered.length).fill(null));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setTimer(TIMER_SECONDS);
    startTimeRef.current = Date.now();
    setPhase("quiz");
  }, []);

  // Timer logic
  useEffect(() => {
    if (phase !== "quiz" || answered) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Time's up — auto-submit as wrong
          clearInterval(timerRef.current!);
          setAnswered(true);
          setAnswers((prev) => {
            const copy = [...prev];
            copy[currentIndex] = -1; // timeout
            return copy;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, answered, currentIndex]);

  // Select answer
  const handleAnswer = (optionIdx: number) => {
    if (answered) return;
    setSelectedAnswer(optionIdx);
    setAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = optionIdx;
      return copy;
    });
  };

  // Next question
  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setTotalTime(Math.round((Date.now() - startTimeRef.current) / 1000));
      setPhase("result");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
    setAnswered(false);
    setTimer(TIMER_SECONDS);
  };

  // Results computation
  const computeResults = () => {
    let correct = 0;
    let totalPoints = 0;
    let maxPoints = 0;
    const byCategory: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, i) => {
      maxPoints += q.points;
      if (!byCategory[q.category]) byCategory[q.category] = { correct: 0, total: 0 };
      byCategory[q.category].total++;
      if (answers[i] === q.correctAnswer) {
        correct++;
        totalPoints += q.points;
        byCategory[q.category].correct++;
      }
    });

    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return { correct, wrong: questions.length - correct, totalPoints, maxPoints, pct, byCategory };
  };

  // ─── Render: Start Screen ───
  if (phase === "start") {
    return (
      <div className="quiz-page">
        <div className="quiz-start">
          <h1>📝 Disaster Preparedness Quiz</h1>
          <p>{t('quiz_page.subtitle')} {ALL_QUESTIONS.length} {t('quiz_page.questions_in')} {categoryNames.length} {t('quiz_page.categories')}</p>

          <div className="quiz-start-actions">
            <button className="btn btn-primary" onClick={() => handleStart(null)}>
              🚀 {t('quiz_page.start_all')} ({ALL_QUESTIONS.length})
            </button>
          </div>

          <h2 style={{ margin: "32px 0 16px", fontSize: "1.1rem" }}>{t('quiz_page.or_choose')}</h2>
          <div className="quiz-category-grid">
            {categoryNames.map((cat) => (
              <div
                key={cat}
                className={`quiz-category-card ${selectedCategory === cat ? "selected" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  handleStart(cat);
                }}
              >
                <span className="category-icon">{CATEGORIES[cat].icon}</span>
                <span className="category-name">{CATEGORIES[cat].name}</span>
                <span className="category-count">{categoryCounts[cat]} questions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Quiz Active ───
  if (phase === "quiz" && questions.length > 0) {
    const q = questions[currentIndex];
    const progress = ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100;
    const catInfo = CATEGORIES[q.category] || { icon: "❓", name: q.category, color: "#6b7280" };
    const timerPct = (timer / TIMER_SECONDS) * 100;
    const timerClass = timer <= 5 ? "danger" : timer <= 10 ? "warning" : "";

    return (
      <div className="quiz-page">
        <div className="quiz-active">
          {/* Header */}
          <div className="quiz-header">
            <div className="quiz-meta">
              <span className="quiz-category-tag" style={{ background: catInfo.color + "22", color: catInfo.color, borderColor: catInfo.color }}>
                {catInfo.icon} {catInfo.name}
              </span>
              <span className={`quiz-difficulty-badge ${q.difficulty}`}>
                {q.difficulty.toUpperCase()} • {q.points} {t('quiz_page.pts')}
              </span>
            </div>
            <span style={{ fontWeight: 600, color: "#64748b", fontSize: "0.9rem" }}>
              {t('quiz_page.question')} {currentIndex + 1} {t('quiz_page.of')} {questions.length}
            </span>
          </div>

          {/* Progress */}
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Timer */}
          <div className="quiz-timer">
            <span className="quiz-timer-text">⏱️ {timer}s</span>
            <div className={`quiz-timer-bar ${timerClass}`}>
              <div className="quiz-timer-fill" style={{ width: `${timerPct}%`, transition: "width 1s linear" }} />
            </div>
          </div>

          {/* Question Card */}
          <div className="quiz-question-card">
            <p className="quiz-question-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{q.question} <SpeechButton text={q.question} lang="en-US" /></p>

            <div className="quiz-options-grid">
              {q.options.map((opt, i) => {
                let cls = "quiz-option-btn";
                if (answered) {
                  cls += " disabled";
                  if (i === q.correctAnswer) cls += " correct";
                  else if (i === selectedAnswer && selectedAnswer !== q.correctAnswer) cls += " wrong";
                } else if (i === selectedAnswer) {
                  cls += " selected";
                }
                return (
                  <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={answered}>
                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className={`quiz-explanation ${selectedAnswer === q.correctAnswer ? "correct" : "wrong"}`}>
                <strong>{selectedAnswer === q.correctAnswer ? "✅ {t('quiz_page.correct')}" : timer === 0 && selectedAnswer === null ? "⏰ {t('quiz_page.times_up')}" : "❌ {t('quiz_page.incorrect')}"}</strong>
                <p>{q.explanation}</p>
              </div>
            )}
          </div>

          {/* Nav */}
          {answered && (
            <div className="quiz-nav">
              <button className="btn btn-primary" onClick={handleNext}>
                {currentIndex + 1 >= questions.length ? "View Results 🏆" : "{t('quiz_page.next')}"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Render: Results ───
  if (phase === "result") {
    const { correct, wrong, totalPoints, maxPoints, pct, byCategory } = computeResults();
    const { grade, color: gradeColor } = getGrade(pct);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    return (
      <div className="quiz-page">
        <div className="quiz-result">
          <div className="quiz-result-header">
            <h1>{t('quiz_page.complete')} 🎉</h1>
          </div>

          {/* Score Circle */}
          <div className="quiz-score-circle" style={{ borderColor: gradeColor }}>
            <span className="quiz-score-number">{pct}%</span>
            <span className="quiz-score-label">{t('quiz_page.score')}</span>
          </div>

          <div className="quiz-grade" style={{ color: gradeColor }}>
            {t('quiz_page.grade')} {grade}
          </div>

          {/* Stats Row */}
          <div className="quiz-stats-row">
            <div className="quiz-stat-card">
              <span className="stat-icon">✅</span>
              <span className="stat-num">{correct}</span>
              <span className="stat-label">{t('quiz_page.correct_ans')}</span>
            </div>
            <div className="quiz-stat-card">
              <span className="stat-icon">❌</span>
              <span className="stat-num">{wrong}</span>
              <span className="stat-label">{t('quiz_page.wrong_ans')}</span>
            </div>
            <div className="quiz-stat-card">
              <span className="stat-icon">⭐</span>
              <span className="stat-num">{totalPoints}/{maxPoints}</span>
              <span className="stat-label">{t('quiz_page.total_points')}</span>
            </div>
            <div className="quiz-stat-card">
              <span className="stat-icon">⏱️</span>
              <span className="stat-num">{minutes}m {seconds}s</span>
              <span className="stat-label">Time</span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="quiz-category-breakdown">
            <h3>Category Breakdown</h3>
            {Object.entries(byCategory).map(([cat, { correct: c, total: t }]) => {
              const catPct = t > 0 ? Math.round((c / t) * 100) : 0;
              const catInfo = CATEGORIES[cat] || { icon: "❓", name: cat, color: "#6b7280" };
              return (
                <div key={cat} className="quiz-breakdown-item">
                  <div className="breakdown-label">
                    <span>{catInfo.icon} {catInfo.name}</span>
                    <span>{c}/{t} ({catPct}%)</span>
                  </div>
                  <div className="quiz-breakdown-bar">
                    <div
                      className="quiz-breakdown-fill"
                      style={{ width: `${catPct}%`, background: catInfo.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="quiz-actions">
            <button className="btn btn-primary" onClick={() => { setPhase("start"); setSelectedCategory(null); }}>
              🔄 {t('quiz_page.retake')}
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              🏠 {t('quiz_page.back_home')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
