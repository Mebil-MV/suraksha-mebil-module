def seed_preparedness_content(db):
    from preparedness.models import SafetyTipModel, MicroChallengeModel
    if db.query(SafetyTipModel).count() > 0:
        return
    # Seed comprehensive safety tips for landslide, flood, earthquake - before/during/after
    tips = [
        # === LANDSLIDE ===
        SafetyTipModel(hazard_type="landslide", phase="before", title="Know Your Risk Zone", content="Check if your area is in a landslide-prone zone. Look for signs: tilted trees, cracks in ground, new springs.", content_hi="जानें कि क्या आपका क्षेत्र भूस्खलन-प्रवण क्षेत्र में है। संकेत देखें: झुके हुए पेड़, जमीन में दरारें, नए जलस्रोत।", icon="🏔️", order_index=1),
        SafetyTipModel(hazard_type="landslide", phase="before", title="Prepare Emergency Kit", content="Keep a grab bag ready with water, medicines, documents, flashlight, and a whistle.", content_hi="पानी, दवाइयाँ, दस्तावेज़, टॉर्च और सीटी के साथ एक आपातकालीन बैग तैयार रखें।", icon="🎒", order_index=2),
        SafetyTipModel(hazard_type="landslide", phase="during", title="Move Away Immediately", content="If you notice ground moving, get away from the path of the slide. Move to higher, stable ground.", content_hi="अगर जमीन हिलती दिखे, तो भूस्खलन के रास्ते से हट जाएँ। ऊँची, स्थिर जगह पर जाएँ।", icon="🏃", order_index=1),
        SafetyTipModel(hazard_type="landslide", phase="during", title="Protect Your Head", content="If escape is not possible, curl into a ball and protect your head with your arms.", content_hi="अगर भागना संभव नहीं है, तो गेंद की तरह सिकुड़ जाएँ और अपने सिर को बाहों से बचाएँ।", icon="🛡️", order_index=2),
        SafetyTipModel(hazard_type="landslide", phase="after", title="Stay Away from Slide Area", content="Do not go near the landslide area. There may be additional slides. Report to authorities.", content_hi="भूस्खलन क्षेत्र के पास न जाएँ। और भूस्खलन हो सकते हैं। अधिकारियों को सूचित करें।", icon="⚠️", order_index=1),
        # === FLOOD ===
        SafetyTipModel(hazard_type="flood", phase="before", title="Identify Evacuation Routes", content="Know the highest ground near your home. Plan multiple evacuation routes in advance.", content_hi="अपने घर के पास सबसे ऊँची जगह जानें। पहले से कई निकासी मार्ग तय करें।", icon="🗺️", order_index=1),
        SafetyTipModel(hazard_type="flood", phase="before", title="Waterproof Important Documents", content="Store important documents in waterproof bags. Keep digital copies on your phone.", content_hi="महत्वपूर्ण दस्तावेज़ वॉटरप्रूफ बैग में रखें। फोन पर डिजिटल कॉपी रखें।", icon="📄", order_index=2),
        SafetyTipModel(hazard_type="flood", phase="during", title="Move to Higher Ground", content="Never walk or drive through floodwater. 6 inches of water can knock you down. Move uphill immediately.", content_hi="बाढ़ के पानी में कभी न चलें या गाड़ी न चलाएँ। 6 इंच पानी आपको गिरा सकता है। तुरंत ऊँचाई पर जाएँ।", icon="⛰️", order_index=1),
        SafetyTipModel(hazard_type="flood", phase="after", title="Avoid Contaminated Water", content="Floodwater is often contaminated. Use only boiled or purified water for drinking.", content_hi="बाढ़ का पानी अक्सर दूषित होता है। पीने के लिए केवल उबला या शुद्ध पानी उपयोग करें।", icon="💧", order_index=1),
        # === EARTHQUAKE ===
        SafetyTipModel(hazard_type="earthquake", phase="before", title="Secure Heavy Objects", content="Bolt bookshelves and heavy furniture to walls. Store heavy objects on lower shelves.", content_hi="किताबों की अलमारी और भारी फर्नीचर को दीवारों से बोल्ट करें।", icon="🔧", order_index=1),
        SafetyTipModel(hazard_type="earthquake", phase="during", title="Drop, Cover, and Hold On", content="Drop to the ground, take cover under a sturdy desk or table, and hold on until shaking stops.", content_hi="जमीन पर गिरें, मजबूत मेज के नीचे छिपें, और हिलना बंद होने तक पकड़े रहें।", icon="🛡️", order_index=1),
        SafetyTipModel(hazard_type="earthquake", phase="after", title="Check for Injuries", content="Check yourself and others for injuries. Provide first aid if trained. Call emergency services for serious injuries.", content_hi="खुद और दूसरों की चोटों की जाँच करें। प्रशिक्षित हों तो प्राथमिक चिकित्सा दें।", icon="🏥", order_index=1),
    ]
    db.add_all(tips)

    micro_challenges = [
        MicroChallengeModel(title="Build an Emergency Kit", title_hi="आपातकालीन किट बनाएँ", description="Gather water, food, flashlight, first-aid kit, whistle, and important documents in a grab bag.", description_hi="एक बैग में पानी, खाना, टॉर्च, प्राथमिक चिकित्सा किट, सीटी और महत्वपूर्ण दस्तावेज़ इकट्ठा करें।", category="kit", points=15, icon="🎒"),
        MicroChallengeModel(title="Family Emergency Plan", title_hi="परिवार आपातकालीन योजना", description="Discuss and write down a family emergency plan. Include meeting points, emergency contacts, and evacuation routes.", description_hi="परिवार आपातकालीन योजना पर चर्चा करें और लिखें। मिलने के स्थान, आपातकालीन संपर्क और निकासी मार्ग शामिल करें।", category="plan", points=20, icon="👨‍👩‍👧‍👦"),
        MicroChallengeModel(title="Learn Basic First Aid", title_hi="बुनियादी प्राथमिक चिकित्सा सीखें", description="Learn CPR, wound dressing, and how to treat burns. Take an online first-aid course.", description_hi="CPR, घाव पर पट्टी बाँधना और जलने का इलाज सीखें।", category="knowledge", points=20, icon="🏥"),
        MicroChallengeModel(title="Earthquake Drop Drill", title_hi="भूकंप ड्रॉप ड्रिल", description="Practice the Drop-Cover-Hold drill with your family. Time yourself getting under a sturdy table.", description_hi="अपने परिवार के साथ ड्रॉप-कवर-होल्ड ड्रिल का अभ्यास करें।", category="drill", points=15, icon="🏋️"),
        MicroChallengeModel(title="Know Your Evacuation Route", title_hi="अपना निकासी मार्ग जानें", description="Walk your evacuation route from home to the nearest safe assembly point. Note landmarks and alternatives.", description_hi="अपने घर से निकटतम सुरक्षित स्थान तक निकासी मार्ग पर चलकर देखें।", category="plan", points=15, icon="🗺️"),
        MicroChallengeModel(title="Emergency Contact Card", title_hi="आपातकालीन संपर्क कार्ड", description="Create a waterproof card with emergency numbers: police, ambulance, fire, disaster helpline, and family contacts.", description_hi="आपातकालीन नंबरों के साथ वॉटरप्रूफ कार्ड बनाएँ: पुलिस, एम्बुलेंस, फायर, आपदा हेल्पलाइन।", category="kit", points=10, icon="📇"),
        MicroChallengeModel(title="Water Purification Knowledge", title_hi="पानी शुद्धिकरण ज्ञान", description="Learn 3 methods to purify water in emergencies: boiling, chlorine tablets, and solar disinfection (SODIS).", description_hi="आपातकाल में पानी शुद्ध करने के 3 तरीके सीखें: उबालना, क्लोरीन टैबलेट, और सोलर डिसइन्फेक्शन।", category="knowledge", points=15, icon="💧"),
    ]
    db.add_all(micro_challenges)
    db.commit()
