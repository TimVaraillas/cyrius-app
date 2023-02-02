# Backoffice vue users

## Models schemas

+ Org : 
  ```
  {
    id: string, 
    name: string 
  }
  ```

+ User : 
  ```
  {
    id: string, 
    first_name: string, 
    last_name: string, 
    email: string, 
    org: string (org id), 
    labels: string[], 
  }
  ```

## Route de l'API

+ `GET /orgs?page&per_page`
  + Query params :
      + page : index de la page à récupérer
      + per_page : nombre de réponses par page (limité à 50)
  + Response schema :
    ```
    { 
      meta: { 
        count: number,
        first: number,
        prev: number | undefined,
        next: number | undefined,
        last: number, 
      }, 
      data: Org[] 
    }
    ```
  
+ `GET /orgs/:orgId/users?page&per_page`
  + Path params :
    + orgId : Identifiant de l'organisation
  + Query params :
    + page : index de la page à récupérer
    + per_page : nombre de réponses par page (limité à 50)
  + Response schema :
    ```
    { 
      meta: { 
        count: number,
        first: number,
        prev: number | undefined,
        next: number | undefined,
        last: number, 
      }, 
      data: User[] 
    }
    ```
  
+ `PATCH /orgs/:oid/users/:uid?mask=first_name,email`
  + Path params :
    + orgId : Identifiant de l'organisation
    + uId : Identifiant de l'utilisateur
  + Query params :
    + mask : liste des champs à modifier
  + Body params : 
    + seuls les champs du mask seront mis à jours, exemple : `{ first_name: "edfnsk", email: "edfnsk@bla.com" }`

+ `DELETE /orgs/:oid/users/:uid`
  + Path params :
    + orgId : Identifiant de l'organisation
    + uId : Identifiant de l'utilisateur

+ `GET /orgs/:oid/labels`
  + Path params :
    + orgId : Identifiant de l'organisation
  + Response schema : string[]

- `POST /orgs/:oid/labels`
  + Path params :
    + orgId : Identifiant de l'organisation
  + Body params : `label : string` 

## Création de la vue


### Tableau des utilisateurs

Cette vue est un tableau qui liste les utilisateurs sans distinction d'organisation :

+ `first name` 
+ `last name` 
+ `email` 
+ `org` 
+ `labels`
+ `action` : 
  + bouton d'affichage de l'utilisateur (readonly) (icône: oeil)
  + bouton d'édition de l'utilisateur (icône: crayon)
  + bouton de suppression de l'utilisateur (icône: poubelle)


### Vertical menu

#### Contenu et style

+ Style du vertical menu : md-2/3, sm-100

+ Bouton d'édition en bas du menu

+ Bouton de suppresion en bas du menu

#### Actions

+ Lorsque l'ops clique sur la ligne de l'utilisateur (ou sur le bouton d'affichage de la colonne `action`), un vertical menu s'ouvre à droite avec les données en readonly 

+ Lorsque l'ops clique sur le bouton d'affichage de la colonne `action` ou sur le bouton d'édition en bas du menu, les données deviennent éditables (sauf l'id).
Le formulaire s'il est `dirty` peut-être soumis à l'API via un bouton `Modifier`.

+ Lorsque l'ops clique sur le bouton de supression de la colonne `action` ou sur le bouton de supression en bas du menu, l'utilisateur doit être supprimé. Lorsque l'utilisateur est supprimé le menu se ferme, et le menu se met à jour dès le retour de l'API.

+ Quand le menu est ouvert, on voit encore le tableau users donc le vertical menu doit être mis à jour si on clique sur un autre utilisateur (avec les données en read only)


#### Formulaire d'édition de l'utilisateur

+ `first name` : input text
+ `last name` : input text
+ `email` : input text
+ `labels` : combobox qui permet de :
  + de choisir parmis les labels existants
  + de filtrer les labels existants on keypress
  + de créer un nouveau label (tab / enter) si la value n'existe pas dans les labels
  + de faire du multiselect
  + de deselect un label, soit qui était déjà présent, soit qui vient d'être ajouté
