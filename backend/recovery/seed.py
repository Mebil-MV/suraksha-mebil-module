def seed_recovery_schemes(db):
    from recovery.models import RecoverySchemeModel
    if db.query(RecoverySchemeModel).count() > 0:
        return
    schemes = [
        RecoverySchemeModel(
            name="State Disaster Response Fund (SDRF)",
            description="Financial assistance for immediate relief to disaster-affected families including house damage, loss of life, and livelihood support.",
            eligibility="Families affected by notified natural disasters in the state. Damage must be verified by local authorities.",
            authority="State Disaster Management Authority",
            contact_info="District Collector Office / SDMA Helpline",
            link="https://sdma.gov.in",
            hazard_type="all",
            max_compensation=100000.0,
        ),
        RecoverySchemeModel(
            name="National Disaster Response Fund (NDRF)",
            description="Central government fund for severe calamities. Provides additional assistance beyond SDRF for large-scale disasters.",
            eligibility="Applicable when state disaster is of severe nature and SDRF is insufficient. Requires central team assessment.",
            authority="National Disaster Management Authority (NDMA)",
            contact_info="NDMA Control Room: 011-26701728",
            link="https://ndma.gov.in",
            hazard_type="all",
            max_compensation=500000.0,
        ),
        RecoverySchemeModel(
            name="PM Awas Yojana - Disaster Housing",
            description="Housing reconstruction support for families whose houses were fully destroyed in natural disasters.",
            eligibility="BPL families with fully destroyed houses. Must not own pucca house elsewhere.",
            authority="Ministry of Housing and Urban Affairs",
            contact_info="PMAY Helpline: 1800-11-6163",
            link="https://pmaymis.gov.in",
            hazard_type="all",
            max_compensation=250000.0,
        ),
        RecoverySchemeModel(
            name="Landslide Damage Compensation",
            description="Special compensation for agricultural land and property damage due to landslides in hilly regions.",
            eligibility="Residents of notified landslide-prone areas with documented damage to property or agricultural land.",
            authority="District Administration / Revenue Department",
            contact_info="District Collector Office",
            hazard_type="landslide",
            max_compensation=200000.0,
        ),
        RecoverySchemeModel(
            name="Flood Relief Assistance",
            description="Emergency relief and rehabilitation for flood-affected families including temporary shelter, food supplies, and livelihood restoration.",
            eligibility="Families residing in flood-affected areas as declared by the district administration.",
            authority="State Flood Control Department",
            contact_info="State Emergency Operations Center",
            hazard_type="flood",
            max_compensation=150000.0,
        ),
    ]
    db.add_all(schemes)
    db.commit()
