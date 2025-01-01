# Spécifications de l'application de gestion de contrats

## Objectif

L'objectif de l'application est de permettre la gestion des contrats au sein d'organisations multiples tout en respectant les droits et les permissions des utilisateurs.

## Fonctionnalités principales

### Gestion des utilisateurs et des organisations

-   Lors de la création d’un compte utilisateur :
    -   Une première organisation est automatiquement créée et l’utilisateur y est rattaché.
    -   L’utilisateur peut créer d’autres organisations par la suite.
-   Possibilité pour l’utilisateur de basculer rapidement entre organisations via un menu déroulant.

### Gestion des employés

-   L’utilisateur peut ajouter des employés rattachés à l’organisation actuellement sélectionnée.

### Gestion des clauses

-   Les clauses sont rattachées à un compte utilisateur, indépendamment des organisations.
-   Fonctionnalités :
    -   Modifier ses propres clauses.
    -   Voir les clauses des autres utilisateurs dans la même organisation avec un label "Auteur".
    -   Filtrer pour afficher ses propres clauses ou celles de l’organisation sélectionnée.

### Gestion des contrats

-   Les contrats sont rattachés aux employés d’une organisation.
-   L’utilisateur peut :
    -   Créer des contrats.
    -   Ajouter des clauses à un contrat et en modifier l’ordre.
    -   Modifier uniquement les contrats qu’il a créés.
    -   Voir les contrats des autres utilisateurs dans la même organisation avec un label "Auteur" et un bouton "Voir".

## Considérations techniques

-   Optimiser les performances pour le changement d’organisation.
-   Séparer les données des organisations tout en partageant les clauses au sein d’une organisation.
-   Garantir la sécurité des données avec des vérifications robustes.
