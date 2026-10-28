<!-- 🤖 TÂCHE IA — AVANT de créer la MR :
Analyse la gravité des changements (diff vs branche cible) et remplace la ligne /label en fin de template par UNE seule étiquette :
- review::quick : diff réduit (< ~50 lignes), périmètre unique, aucune logique métier (typo, i18n, config, renommage, fix trivial)
- review::standard : feature/fix classique, diff modéré, logique métier touchée, tests à jour
- review::complex : gros diff ou multi-composants, migration/schéma de données, sécurité, perf, architecture, API publique, risque de régression élevé
En cas de doute entre deux niveaux, choisir le plus élevé.
-->

## Bug / Problème

#### Fonctionnel
<!-- Ce que l'utilisateur observe, l'impact métier -->

#### Technique
 <!-- Cause racine, composant concerné, pourquoi ça casse -->

## Solution
<!-- Explique l'approche choisie et pourquoi -->

## Comment tester

## Screenshots (si applicable)
<!--

|  before  |  after  |
|----|----|
| <insert before screenshot here> | <insert after screenshot here> |

-->

## Ticket lié

<!-- Convention "Fixes <REF>" dans la DESCRIPTION de la MR : une ref déclenche
     la résolution seulement avec un mot-clé de résolution (Fixes / Closes /
     Resolves, etc). Formats : Fixes MOBILE-XXX (short ID Sentry) ou Fixes
     RM-XXXXXX. Une URL nue sans mot-clé = simple mention, aucune action.
     Multi-refs OK. -->

Fixes MOBILE-XXX

## Checklist

- [ ] J'ai ajouté/modifié les tests unitaires pour cette feature/bug
- [ ] J'ai vérifié que les tests existants passent

<!-- IA : remplacer la ligne ci-dessous par UNE seule étiquette : review::quick, review::standard ou review::complex -->
/label review::standard

/assign me  
/reviewer @boris.trombert @aurelien.sberro @eliott.scherrer
/remove_reviewer me  
