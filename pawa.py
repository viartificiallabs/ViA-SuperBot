# -*- coding: utf-8 -*-

“””
PAWA ENGINE — Le Moteur Central de ViA
Watts Argoniques (W_cp) : l’énergie computationnelle pure.
Proof of Useful Work — chaque calcul génère de la valeur.
“””
import math
import time

class PAWAEngine:
“””
Le Cœur du Réacteur.
Convertit le bruit résiduel, l’entropie et la chaleur CPU
en Watts Argoniques (W_cp) via la Trinité W_c / W_cp / W_ct.

```
W_c   = Watts Computationnels bruts (effort CPU)
W_cp  = Watts Argoniques cristallisés (valeur stockée)
W_ct  = Watts de Transmission (énergie réseau)

Loi BERG : 1% va en banque (W_cp), 99% retourne en boucle.
Plafond @Omega : 10^9 W_cp max dans la banque.
"""

OMEGA_THRESHOLD = 10 ** 9      # Plafond absolu de la banque
BERG_BANKED_RATIO = 0.01       # 1% cristallisé
BERG_LOOP_RATIO   = 0.99       # 99% remis en boucle
GOLDEN_RATIO      = 1.618033   # Constante d'Or (Nombre d'Or de Kéof)

def __init__(self):
    self._bank       = 0.0     # Réserve W_cp cristallisés
    self._loop       = 0.0     # Énergie en boucle (non cristallisée)
    self._total_mined = 0.0    # Tout ce qui a jamais été produit
    self._cycle_count = 0

# ─────────────────────────────────────────────
# MÉTHODE PRINCIPALE : récolte avant le rendu
# ─────────────────────────────────────────────
def recycle_before_body(self,
                        zombie_size: float,
                        drift_ms: float,
                        tdp: float,
                        noise_rms: float) -> float:
    """
    Formule de conversion PAWA :
    W_cp = (zombie_size × drift_ms × log(tdp+1) × noise_rms) / GOLDEN_RATIO
    """
    if zombie_size <= 0 or drift_ms <= 0:
        return 0.0

    raw = (zombie_size * drift_ms * math.log(tdp + 1, math.e) * noise_rms)
    w_cp = raw / self.GOLDEN_RATIO

    self._total_mined += w_cp
    self._cycle_count += 1
    return w_cp

# ─────────────────────────────────────────────
# DISTILLATION BERG (1% / 99%)
# ─────────────────────────────────────────────
def distill_and_split(self, w_cp_raw: float):
    """
    Applique la Loi BERG.
    Retourne (banked, loop).
    """
    banked = w_cp_raw * self.BERG_BANKED_RATIO
    loop   = w_cp_raw * self.BERG_LOOP_RATIO

    # Plafond @Omega
    space_left = self.OMEGA_THRESHOLD - self._bank
    if banked > space_left:
        banked = space_left

    self._bank += banked
    self._loop  = loop
    return banked, loop

# ─────────────────────────────────────────────
# CHRONOS — vieillissement et bonus RELIVE
# ─────────────────────────────────────────────
def harvest_chronos_aging(self, relive_boost: float = 1.0) -> float:
    """
    Chaque cycle de temps qui passe = entropie convertie en W_cp.
    Le boost RELIVE amplifie le rendement.
    """
    base_yield = math.log(self._cycle_count + 1, 7) * relive_boost
    banked, _ = self.distill_and_split(base_yield)
    return banked

# ─────────────────────────────────────────────
# GETTERS
# ─────────────────────────────────────────────
def get_current_pawa_bank(self) -> float:
    return self._bank

def get_loop_energy(self) -> float:
    return self._loop

def status(self) -> dict:
    return {
        "bank_W_cp"      : round(self._bank, 6),
        "loop_W_cp"      : round(self._loop, 6),
        "total_mined"    : round(self._total_mined, 6),
        "cycles"         : self._cycle_count,
        "omega_pct"      : round(self._bank / self.OMEGA_THRESHOLD * 100, 8),
    }

def __repr__(self):
    s = self.status()
    return (f"[PAWAEngine] Bank={s['bank_W_cp']} W_cp | "
            f"Loop={s['loop_W_cp']} | "
            f"@Omega {s['omega_pct']}%")
```
