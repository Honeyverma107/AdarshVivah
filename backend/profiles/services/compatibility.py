"""
Compatibility Engine Service for AdarshVivah
Calculates dynamic match score (0 to 100%) and generates matching reasons ('why_match')
based on actual database values of Profile, PartnerPreferences, Education, Lifestyle, etc.
Handles incomplete profiles and None values safely.
"""

def calculate_compatibility(viewer_profile, target_profile):
    """
    Calculates dynamic compatibility score between viewer_profile and target_profile.
    Returns tuple: (score_percentage: int, why_match: list[str])
    """
    if not viewer_profile or not target_profile or getattr(viewer_profile, 'id', None) == getattr(target_profile, 'id', None):
        return (70, [])

    score = 70  # Base compatibility baseline
    why_match = []

    viewer_gender = (getattr(viewer_profile, 'gender', '') or '').strip().lower()
    target_gender = (getattr(target_profile, 'gender', '') or '').strip().lower()

    # 1. Gender check (opposite gender preference default boost)
    if viewer_gender and target_gender and viewer_gender != target_gender:
        score += 5

    # 2. Partner Preferences Check (if viewer has set PartnerPreferences)
    pref = getattr(viewer_profile, 'partner_preferences', None)
    if pref:
        # Age check (only when target_age, min_age, and max_age are all valid integers)
        target_age = getattr(target_profile, 'age', None)
        min_age = getattr(pref, 'min_age', None)
        max_age = getattr(pref, 'max_age', None)

        if target_age is not None and min_age is not None and max_age is not None:
            if min_age <= target_age <= max_age:
                score += 6
                why_match.append(f"Age ({target_age} yrs) matches your preferred age range ({min_age}-{max_age} yrs)")
            elif abs(target_age - min_age) <= 2 or abs(target_age - max_age) <= 2:
                score += 2

        # Religion check (safely handle None / empty values)
        pref_religion = (getattr(pref, 'religion', '') or '').strip().lower()
        target_religion = (getattr(target_profile, 'religion', '') or '').strip().lower()
        if pref_religion and target_religion and (pref_religion in target_religion or target_religion in pref_religion):
            score += 5
            why_match.append(f"Shares your preferred religion ({target_profile.religion})")

        # Caste / Community check (safely handle None / empty values)
        pref_caste = (getattr(pref, 'caste', '') or '').strip().lower()
        target_caste = (getattr(target_profile, 'caste', '') or '').strip().lower()
        if pref_caste and target_caste and ('open' in pref_caste or pref_caste in target_caste or target_caste in pref_caste):
            score += 4
            why_match.append(f"Matches community preferences ({target_profile.caste})")

        # Marital Status check (safely handle None / empty values)
        pref_marital = (getattr(pref, 'marital_status', '') or '').strip().lower()
        target_marital = (getattr(target_profile, 'marital_status', '') or '').strip().lower()
        if pref_marital and target_marital and pref_marital in target_marital:
            score += 3

    # 3. Religion & Caste direct alignment
    viewer_religion = (getattr(viewer_profile, 'religion', '') or '').strip().lower()
    target_religion = (getattr(target_profile, 'religion', '') or '').strip().lower()
    if viewer_religion and target_religion and viewer_religion == target_religion:
        rel_match_msg = f"Shares your preferred religion ({target_profile.religion})"
        if rel_match_msg not in why_match:
            why_match.append(f"Same religion background ({target_profile.religion})")
        
        viewer_caste = (getattr(viewer_profile, 'caste', '') or '').strip().lower()
        target_caste = (getattr(target_profile, 'caste', '') or '').strip().lower()
        if viewer_caste and target_caste and viewer_caste == target_caste:
            why_match.append(f"Same community ({target_profile.caste})")
            score += 3

    # 4. Mother Tongue alignment
    viewer_tongue = (getattr(viewer_profile, 'mother_tongue', '') or '').strip().lower()
    target_tongue = (getattr(target_profile, 'mother_tongue', '') or '').strip().lower()
    if viewer_tongue and target_tongue and viewer_tongue == target_tongue:
        score += 4
        why_match.append(f"Shares native mother tongue ({target_profile.mother_tongue})")

    # 5. Location / City / State proximity
    viewer_city = (getattr(viewer_profile, 'city', '') or '').strip().lower()
    target_city = (getattr(target_profile, 'city', '') or '').strip().lower()
    viewer_state = (getattr(viewer_profile, 'state', '') or '').strip().lower()
    target_state = (getattr(target_profile, 'state', '') or '').strip().lower()

    if viewer_city and target_city and viewer_city == target_city:
        score += 5
        why_match.append(f"Both based in {target_profile.city}")
    elif viewer_state and target_state and viewer_state == target_state:
        score += 3
        why_match.append(f"Located in same state ({target_profile.state})")

    # 6. Education Details alignment
    viewer_edu = getattr(viewer_profile, 'education_details', None)
    target_edu = getattr(target_profile, 'education_details', None)
    if target_edu:
        target_edu_level = (getattr(target_edu, 'education_level', '') or '').strip().lower()
        target_degree = getattr(target_edu, 'degree', '') or ''
        viewer_edu_level = (getattr(viewer_edu, 'education_level', '') or '').strip().lower() if viewer_edu else ''

        if viewer_edu_level and target_edu_level:
            if ('master' in viewer_edu_level or 'doctorate' in viewer_edu_level) and ('master' in target_edu_level or 'doctorate' in target_edu_level):
                score += 4
                if target_degree:
                    why_match.append(f"Higher education background ({target_degree})")
            elif target_degree:
                why_match.append(f"Strong educational qualification ({target_degree})")
        elif target_degree:
            why_match.append(f"Strong educational qualification ({target_degree})")

    # 7. Lifestyle alignment (Diet, Drinking, Smoking)
    viewer_life = getattr(viewer_profile, 'lifestyle_details', None)
    target_life = getattr(target_profile, 'lifestyle_details', None)
    if viewer_life and target_life:
        v_diet = (getattr(viewer_life, 'diet', '') or '').strip().lower()
        t_diet = (getattr(target_life, 'diet', '') or '').strip().lower()
        if v_diet and t_diet and v_diet == t_diet:
            score += 4
            why_match.append(f"Similar dietary preferences ({target_life.diet})")

        v_smoking = (getattr(viewer_life, 'smoking', '') or '').strip().lower()
        t_smoking = (getattr(target_life, 'smoking', '') or '').strip().lower()
        if v_smoking == 'never' and t_smoking == 'never':
            score += 2

        v_drinking = (getattr(viewer_life, 'drinking', '') or '').strip().lower()
        t_drinking = (getattr(target_life, 'drinking', '') or '').strip().lower()
        if v_drinking == 'never' and t_drinking == 'never':
            score += 2

    # 8. Family Values alignment
    viewer_fam = getattr(viewer_profile, 'family_details', None)
    target_fam = getattr(target_profile, 'family_details', None)
    if viewer_fam and target_fam:
        v_fam = (getattr(viewer_fam, 'family_values', '') or '').strip().lower()
        t_fam = (getattr(target_fam, 'family_values', '') or '').strip().lower()
        if v_fam and t_fam and v_fam == t_fam:
            score += 3
            why_match.append(f"Similar family background ({target_fam.family_values})")

    # Ensure score stays between 65 and 98
    final_score = min(max(score, 65), 98)
    return (final_score, why_match)
