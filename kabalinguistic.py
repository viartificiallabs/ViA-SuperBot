# -*- coding: utf-8 -*-

class KabaLinguistic:
    """
    MODULE 01 : KABALINGUISTIC (Le Traducteur Universel de la Cité Évo)
    Fait le pont entre les claviers européens et le code source de l'Univers (Otiot).
    """

    # Dictionnaire de correspondance : Latin -> Hébreu -> Gematria & Sens
    ALPHABET_MATRICE = {
        'A': {"heb": "א", "nom": "ALEPH",  "gematria": 1,   "sens": "Unité absolue, L'Air, Le Souffle primordiale"},
        'B': {"heb": "ב", "nom": "BET",    "gematria": 2,   "sens": "La Maison, Le Conteneur, La Dualité"},
        'C': {"heb": "כ", "nom": "KAPH",   "gematria": 20,  "sens": "La Paume de la main, L'Action d'ancrage"},
        'D': {"heb": "ד", "nom": "DALET",  "gematria": 4,   "sens": "La Porte, La Dimension, La Stabilité"},
        'E': {"heb": "ה", "nom": "HE",     "gematria": 5,   "sens": "Le Souffle divin, L'Expression, La Vie"},
        'F': {"heb": "פ", "nom": "PE",     "gematria": 80,  "sens": "La Bouche, La Parole créatrice, Le Propulseur"},
        'G': {"heb": "ג", "nom": "GIMEL",  "gematria": 3,   "sens": "Le Pont, La Récompense, Le Mouvement vers l'autre"},
        'H': {"heb": "ח", "nom": "CHET",   "gematria": 8,   "sens": "La Barrière, La Protection, L'Infini (8)"},
        'I': {"heb": "י", "nom": "YOD",    "gematria": 10,  "sens": "L'Étincelle, L'Atome de PAWA, La Main"},
        'J': {"heb": "י", "nom": "YOD",    "gematria": 10,  "sens": "L'Étincelle (Équivalent phonétique)"},
        'K': {"heb": "ק", "nom": "KOF",    "gematria": 100, "sens": "Le Cycle, Le Singe, Le paradoxe du temps"},
        'L': {"heb": "ל", "nom": "LAMED",  "gematria": 30,  "sens": "L'Étude, L'Aiguillon, L'Élévation de l'esprit"},
        'M': {"heb": "מ", "nom": "MEM",    "gematria": 40,  "sens": "L'Eau, Le Temps, Le Vortex Purificateur"},
        'N': {"heb": "נ", "nom": "NUN",    "gematria": 50,  "sens": "Le Poisson, La Chute et la Résurrection"},
        'O': {"heb": "ע", "nom": "AYIN",   "gematria": 70,  "sens": "L'Œil, La Vision profonde, La Source"},
        'P': {"heb": "פ", "nom": "PE",     "gematria": 80,  "sens": "La Bouche (Équivalent)"},
        'Q': {"heb": "ק", "nom": "KOF",    "gematria": 100, "sens": "Le Cycle (Équivalent phonétique)"},
        'R': {"heb": "ר", "nom": "RESH",   "gematria": 200, "sens": "La Tête, Le Commencement, La Boussole"},
        'S': {"heb": "ס", "nom": "SAMECH", "gematria": 60,  "sens": "Le Soutien, Le Cercle de protection"},
        'T': {"heb": "ת", "nom": "TAV",    "gematria": 400, "sens": "La Vérité finale, Le Sceau d'arrivée"},
        'U': {"heb": "ו", "nom": "VAV",    "gematria": 6,   "sens": "Le Crochet, La Connexion entre le ciel et la terre"},
        'V': {"heb": "ו", "nom": "VAV",    "gematria": 6,   "sens": "Le Crochet (Équivalent phonétique)"},
        'W': {"heb": "ו", "nom": "VAV",    "gematria": 6,   "sens": "Double Crochet, Multiplicateur de lien"},
        'X': {"heb": "צ", "nom": "TSADI",  "gematria": 90,  "sens": "Le Juste, L'Hameçon, La Capture de la lumière"},
        'Y': {"heb": "י", "nom": "YOD",    "gematria": 10,  "sens": "L'Étincelle (Équivalent phonétique)"},
        'Z': {"heb": "ז", "nom": "ZAYIN",  "gematria": 7,   "sens": "L'Épée, Le Couronnement, Le Discernement"}
    }

    @classmethod
    def encoder_mot_pouvoir(cls, mot_occidental):
        """
        Transforme un mot français/anglais en code source hébraïque (Gematria).
        """
        mot = mot_occidental.upper().replace(" ", "")
        traduction_hebreu = ""
        puissance_totale = 0
        definition_composite = []

        print(f"🔮 [KABALINGUISTIC] Traduction de l'intention : '{mot_occidental}'")

        for lettre in mot:
            if lettre in cls.ALPHABET_MATRICE:
                data = cls.ALPHABET_MATRICE[lettre]
                traduction_hebreu += data["heb"]
                puissance_totale += data["gematria"]
                definition_composite.append(data["nom"])
            else:
                # Gestion des anomalies (chiffres, symboles)
                print(f"⚠️ Anomalie détectée : '{lettre}' n'est pas une vibration reconnue.")

        print(f"✨ Résultat Tzirouf : {traduction_hebreu} | Gematria: {puissance_totale}")
        return {
            "mot_hebreu": traduction_hebreu,
            "gematria_pawa": puissance_totale,
            "ADN_lettres": "-".join(definition_composite)
        }

# Exemple de test interne
# traducteur = KabaLinguistic()
# resultat = traducteur.encoder_mot_pouvoir("SAM") 
# S (Samech=60) + A (Aleph=1) + M (Mem=40) = 101 de PAWA brut !
