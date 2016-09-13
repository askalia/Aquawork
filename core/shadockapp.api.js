'use strict';

module.exports = function(appInstance)
{
// namespace privé
    var API = {};
    appInstance.API = API;

    /**
     * Cette fonction proxy renvoie aussi bien les branches avec enfant(s) que les branches sans enfant(s)
     * @private
     * @returns {Object} list:{children: Array<Branch>, nochildren: Array<Branch>}
     */
    API.getAllBranchesWithOrWithoutChildren = function()
    {
        var list = { children: [], nochildren: []};
        for (var b in appInstance.dbData.tree.branches)
        {
            var currBranch = appInstance.dbData.tree.branches[b];
            API.getBranchChildren(currBranch, list);
        }
        return list;
    };

    /**
     * Cette fonction trouve (résoud) une Branch d'après son nom
     * @private
     * @returns Branch || null
     */
    API.getBranchByName = function(name)
    {
        // Callback (filtre) appliqué pour identifier la branche demandée
        var filterFunc = function(branch){
            return (branch.name == name);
        };
        // On applique le filtre sur la liste des branches pour enlever les données "bruitées"
        var filteredList = appInstance.dbData.tree.branches.filter(filterFunc);

        // le tableau est réduit à 1 seul item, mais ça reste un tableau : on extrait et renvoie l'objet qu'il contient
        return (filteredList.length ==1) ? filteredList[0] : null;
    };
    /**
     * Cette fonction trouve (résoud) un nid d'après son ID
     * @private
     * @param {Int} id   ID du nid
     * @returns {Object} Nest || null
     */
    API.getNestById = function(id)
    {
        // Callback (filtre) appliqué pour identifier le nid demandé
        var filterFunc = function(nest){
            return (nest.id === id);
        };
        // On applique le filtre sur la liste des nids pour enlever les données "bruitées
        var filteredList = this.getAllNestsInTree.filter(filterFunc);
        // le tableau est réduit à 1 seul item, mais ça reste un tableau : on extrait et renvoie l'objet qu'il contient
        return (filteredList.length ==1) ? filteredList[0] : null;
    };
    /**
     * cette fonction retourne les sous-branches d'une brance
     * @private
     * @param {Object}  branch la branche à parcourir
     * @param {Array}   list    contient les "matching" (les éléments trouvés)
     * @returns void
     */
    API.getBranchChildren = function(branch, list)
    {
        // On vérifie que la branche contient des sous-branche
        // et que la List contient bien le container requis
        if ('branches' in branch && branch.branches.length >0 && typeof(list.children) != 'undefined')
        {
            // On vérifie à la fois le container de sous-branche et nombre de sous-branches qu'il contient
            if (branch.branches.length >0)
            {
                list.children.push(branch);
                // Appel récursif pour creuser plus profond
                API.getBranchChildren(branch.branches, list);
            }
        }
        else if (typeof( list.nochildren) != 'undefined'){
            list.nochildren.push(branch);
        }
    };

    /**
     * @private
     * Cette fonction récursive recense des nids en fonction d'une règle de gestion
     * @param {Branch}   branch     la branche à parcourir
     * @param {Function} execRule   la règle de gestion à exécuter
     *
     * @returns void
     * @throws Error
     */
    API.getNestsInBranch = function(branch, execRule)
    {
        // Si la branche est invalide, on stoppe.
        if (typeof branch !=='object'){
            throw new Error('La branche est indéfinie');
        }
        // on vérifie l'intégrité de la fonction de gestion
        if (typeof execRule !== 'function'){
            throw new Error("le paramètre 'execRule' doit être une Fonction");
        }
        // la vérification de l'existance des nids et leur nombre dans la branche est le job de cette fonction
        // et pas le job de la fonction "règle de gestion"
        if ('nests' in branch && branch.nests.length >0){
            // on exécute la règle de gestion avec l'argument requis
            execRule.call(this, branch);
        }

        // on vérifie si la sous-branche contient à son tour des sous-branches. Appel récursif.
        if ('branches' in branch && branch.branches.length >0){
            branch.branches.forEach(function(subBranch, bIdx){
                API.getNestsInBranch(subBranch, execRule);
            });

        }
    };
    /**
     * Cette fonction vérifie si le shadock est apte à changer de nid
     * @param {Object}  movingShadock   le shadock migrateur
     * @returns {Boolean}
     */
    API.isShadockMovable = function(movingShadock)
    {
        // les occupants du nid actuel du shadock migrateur
        var occupiers = movingShadock.nest.shadocks;
        // le compteur conditionnel d'occupants
        var countOnesInstalledLater = 0;
        /*
         * La règle ci-dessous vérifie que le nid actuel du shadock migrateur n'est pas occupé
         * par d'autres shadock installé à une date ultérieure à la sienne
         *
         * @param occupier  autre shadock
         * @param movingShadock shadock migrateur
         * @returns {Boolean}
         */
        var checkIfOccupierInstalledLater = function(occupier, movingShadock)
        {
            // On vérifie les date d'installation entre occupant et migrateur
            return +(occupier.installedDate.getTime() > movingShadock.installedDate.getTime());
        };

        // On vérifie l'état de chaque occupant
        occupiers.forEach(function(occupier, sIdx)
        {
            // le shadock migrateur ne doit pas être comparé à lui-même
            if (occupier === movingShadock){
                return;
            }
            countOnesInstalledLater += checkIfOccupierInstalledLater(occupier, movingShadock);
        });

        return (countOnesInstalledLater === 0);
    };    
    
};