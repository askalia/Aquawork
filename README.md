
My Shadock homework for Aquafadas
=================================
 ---------

## Les méthodes de l'API ShadockApp
####> shadockapp.js
------------
###Liste de tous les nids posés sur l’arbre

 ```sh
ShadockApp.getAllNestsInTree()
 ```
###Liste des nids qui ont plus de 5 Shadocks
 ```sh
ShadockApp.getAllNestsWithMoreThanXShadocks()
 ```
###Liste de tous les Shadocks qui peuvent emménager dans un autre nid
```sh
ShadockApp.getAllShadockMovableToAnotherNest()
 ```
###Liste des nids qui sont en forme de casserole mais pas rouge
```sh
ShadockApp.getNestPropMatchingCriteria()
 ```
###Liste des branches qui supportent d’autres branches
```sh
ShadockApp.getAllBranchesWithChildren()
 ```
###Liste des branches qui ne supportent pas de branche
```sh
ShadockApp.getAllBranchesWithoutChildren()
 ```
###Liste des nids que supporte la branche {name}
```sh
ShadockApp.getNestsInBranchName(name)
 ```
###Liste des nids qui ont toutes les caractéristiques possibles
 ```sh
ShadockApp.getNestWithMaximumProperties()
 ```
------------
##Les scenarios
####> scenarios.spec.js
```sh
runScenario(description, param, assertCallback)
 ```
 exemple: 
 ```sh
runScenario("Liste de tous les nids posés sur l'arbre", null, function(){...})
 ```
