
function ShadockApp(args)
{
	"use strict";

	var dbData = [];
	var _this = this;
	var DB_NAME = 'shadockapp';

	/**
	 * @describe Liste de tous les nids posés sur l’arbre.
	 * @public
	 * Cette fonction recense tous les nids posés sur l'arbre
	 * toutes branches confondues
	 * @return {Array<nest>}
	 */
	this.getAllNestsInTree = function getAllNestsInTree()
	{
		if (typeof retListNests == 'undefined')
		{
			var retListNests = [];
			var execRule = function(branch){
				retListNests = retListNests.concat(branch.nests);
			};
			dbData.tree.branches.forEach(function(currBranch, bIdx)
			{
				COMMON.getNestsInBranch(currBranch, execRule);
			});
		}
		return retListNests;
	};
	/**
	 * @describe Liste des nids qui ont plus de X Shadocks
	 * @public
	 * @returns {Array<Nest>}
	 */
	this.getAllNestsWithMoreThanXShadocks = function(maxItems)
	{
		var retListNests = [];
		var execRule = function(branch)
		{
			branch.nests.forEach(function(currNest, cIdx)
			{
				if (currNest.shadocks.length > maxItems){
					retListNests.push(currNest);
				}
			});
		};

		dbData.tree.branches.forEach(function(currBranch, bIdx)
		{
			COMMON.getNestsInBranch(currBranch, execRule);
		});
		return retListNests;
	};
	/**
	 * @describe Liste de tous les Shadocks qui peuvent emménager dans un autre nid
	 * @public
	 * @returns {Array<Shadock>}
	 */
	this.getAllShadockMovableToAnotherNest = function()
	{
		var retListMovableShadocks = [];
		var allNests = this.getAllNestsInTree();
		// On parcourre tous les nids de l'arbre
		allNests.forEach(function(currNest, nIdx)
		{
			// On vérifie l'éligibilité migratoire de chaque shadock
			currNest.shadocks.forEach(function(currShadock, sIdx)
			{
				if (true === COMMON.isShadockMovable(currShadock)){
					retListMovableShadocks.push(currShadock);
				}
			});
		});
		return retListMovableShadocks;
	};
	/**
	 * @describe Liste des nids qui sont en forme de casserole mais pas rouge
	 * @public
	 * @returns {Array<Nest>}
	 */
	this.getNestWithBoilerShapeAndColorNotRed = function()
	{
		var retListNests = [];
		var allNests = this.getAllNestsInTree();
		// Cette règle vérifie les popriété d'un nid
		// (ne suit pas ici le principe SOLID 'open/close' pour la gestion des critères)
		var meetReqsRule = function(prop)
		{
			// si type de propriété non pertinent, on bypasse
			if (prop.type !='shape' && prop.type != 'color') {
				return true;
			}
			return 	(prop.type == 'shape' && prop.value =='boiler') ||
				(prop.type == 'color' && prop.value != 'red');
		};
		// on parcourre tous les nids
		allNests.forEach(function(currNest, nIdx)
		{
			var arePropsValid = true;
			// pour chaque propriété du nid, on vérifie les critères
			currNest.props.forEach(function(prop, pIdx)
			{
				arePropsValid &= meetReqsRule(prop);
			});

			if (true === (!!arePropsValid)) {
				retListNests.push(currNest);
			}

		});
		return retListNests;
	};
	/**
	 * @describe Liste des branches qui supportent d’autres branches
	 * @public
	 */
	this.getAllBranchesWithChildren = function()
	{
		return this.getAllBranchesWithOrWithoutChildren().children;
	};
	/**
	 * @describe Liste des branches qui ne supportent pas de branche
	 * @public
	 */
	this.getAllBranchesWithoutChildren = function()
	{
		return this.getAllBranchesWithOrWithoutChildren().nochildren;
	};
	/*
	 * @describe Liste des nids que supporte la branche {name}
	 * @public
	 * @param {String} name
	 * @throws Error
	 * @return {Array<Nest>}
	 */
	this.getNestsInBranchName = function(name)
	{
		var retListNest = [];
		var execRule = function(branch){
			retListNest.push(branch.nest);
		};
		var branch = COMMON.getBranchByName(name);
		if (branch === null){
			throw new Error("La branche '"+name+"' est introuvable");
		}
		COMMON.getNestsInBranch(branch, execRule);
		return retListNest;
	};
	/**
	 * @describe Liste des nids qui ont toutes les caractéristiques possibles
	 * @public
	 * @return {Object} Nest
	 */
	this.getNestWithMaximumProperties = function()
	{
		// On récupère tous les nids
		var listNests = this.getAllNestsInTree();
		var retListNests = {};

		// On vérifie quel nid a le maximum de propriétés
		var currNest = listNests[0];
		listNests.forEach(function(nextNest, nIdx)
		{
			currNest = (nextNest.props.length > currNest.props.length) ? nextNest : currNest;
		});
		return currNest;
	};
	/**
	 * Résoud une fonction de l'this.d'après sa description textuelle {describer}
	 * @public
	 * @param {String} describer	le descripteur de la fonction
	 * @param {mixed}  [arg] 		paramètre optionnel
	 * @returns void
	 * @throws Error
	 */
	this.callActionByDesc = function(describer, arg)
	{
		if (typeof mapper =='undefined')
		{
			var mapper =  {
				"Liste de tous les nids posés sur l’arbre" : shadockApp.getAllNestsInTree,
				"Liste des nids qui ont plus de 5 Shadocks" : this.getAllNestsWithMoreThanFiveShadocks,
				"Liste de tous les Shadocks qui peuvent emménager dans un autre nid" : this.getAllShadockMovableToAnotherNest,
				"Liste des nids qui sont en forme de casserole mais pas rouge" : this.getNestWithBoilerShapeAndColorNotRed,
				"Liste des branches qui supportent d’autres branches" : this.getAllBranchesWithChildren,
				"Liste des branches qui ne supportent pas de branche" : this.getAllBranchesWithoutChildren,
				"Liste des nids que supporte la branche {name}" : this.getNestsInBranchName,
				"Liste des nids qui ont toutes les caractéristiques possibles" : this.getNestWithMaximumProperties
			}
		};
		if (! describer in mapper){
			throw new Error('Le describer demandé est introuvable : "'+ describer+'"');
		}

		if (! this.isStarted()){
			this.start();
		}
		return mapper[describer].call(this, arg);
	};
	
	/**************************************************************************/

	// namespace privé
	var COMMON = {};

	/**
	 * Constructeur de l'application
	 * @private
	 * @returns void
	 * @throws Error
	 */
	COMMON.start = function(args)
	{
		dbData = args.db;
	};
	/**
	 * On vérifie que les prérequis de l'application sont bien initialisés
	 * @private
	 * @returns {Boolean}
	 */
	COMMON.isStarted = function()
	{
		return (null !== dbData);
	};
	/**
	 * Cette fonction proxy renvoie aussi bien les branches avec enfant(s) que les branches sans enfant(s)
	 * @private
	 * @returns {Object} list:{children: Array<Branch>, nochildren: Array<Branch>}
	 */
	COMMON.getAllBranchesWithOrWithoutChildren = function()
	{
		var list = { children: [], nochildren: []};
		for (var b in dbData.tree.branches)
		{
			var currBranch = dbData.tree.branches[b];
			COMMON.getBranchChildren(currBranch, list);
		}
		return list;
	};

	/**
	 * Cette fonction trouve (résoud) une Branch d'après son nom
	 * @private
	 * @returns Branch || null
	 */
	COMMON.getBranchByName = function(name)
	{
		// Callback (filtre) appliqué pour identifier la branche demandée
		var filterFunc = function(branch){
			return (branch.name == name);
		};
		// On applique le filtre sur la liste des branches pour enlever les données "bruitées"
		var filteredList = dbData.tree.branches.filter(filterFunc);

		// le tableau est réduit à 1 seul item, mais ça reste un tableau : on extrait et renvoie l'objet qu'il contient
		return (filteredList.length ==1) ? filteredList[0] : null;
	};
	/**
	 * Cette fonction trouve (résoud) un nid d'après son ID
	 * @private
	 * @param {Int} id   ID du nid
	 * @returns {Object} Nest || null
	 */
	COMMON.getNestById = function(id)
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
	COMMON.getBranchChildren = function(branch, list)
	{
		// On vérifie que la branche contient des sous-branche
		// et que la List contient bien le container requis
		if ('branches' in branch && typeof(list.children) != 'undefined')
		{
			// On vérifie à la fois le container de sous-branche et nombre de sous-branches qu'il contient
			if (branch.branches.length >0)
			{
				list.children.push(branch);
				// Appel récursif pour creuser plus profond
				COMMON.getBranchChildren(branch.branches, list);
			}
		}
		else if (typeof( list.nochildren) != 'undefined'){
			list.nochildren.push(branch);
		}
	};

	/**
	 * @private
	 * Cette fonction récursive recense des nids en fonction d'une règle de gestion
	 * @param {Branch} 	 branch 	la branche à parcourir
	 * @param {Function} execRule 	la règle de gestion à exécuter
	 *
	 * @returns void
	 * @throws Error
	 */
	COMMON.getNestsInBranch = function(branch, execRule)
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
				COMMON.getNestsInBranch(subBranch, execRule);
			});

		}
	};
	/**
	 * Cette fonction vérifie si le shadock est apte à changer de nid
	 * @param {Object}  movingShadock   le shadock migrateur
	 * @returns {Boolean}
	 */
	COMMON.isShadockMovable = function(movingShadock)
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

	COMMON.start(args);
	
};

// Modèle de données

ShadockApp.Tree = function(id, branches)
{
	this.CLASS = 'Tree';
	this.id = id || 0;
	this.branches = branches || [];
	var _this = this;
	this.addBranch = function(branch) {
		branch.tree = _this;
		_this.branches.push(branch);
	};
};


ShadockApp.Branch = function(name, tree, parentBranch)
{
	this.CLASS = 'Branch';
	this.id= 0;
	this.name = name;
	this.tree = tree;
	this.parentBranch = parentBranch || null;
	this.branches = [];
	this.nests = [];
	var _this = this;
	this.addNest = function(nest){
		nest.branch = _this;
		_this.nests.push(nest);
	};
	this.addBranch = function(branch)
	{
		branch.parentBranch = _this;
		_this.branches.push(branch);
	};
};

ShadockApp.Nest = function(id, branch, props, shadocks)
{
	this.CLASS = 'Nest';
	this.id = id || 0;
	this.branch = branch || null;
	this.props = props || [];
	this.shadocks = shadocks || [];
	var _this = this;
	this.addShadocks = function(shadocks)
	{
		shadocks.forEach(function(shad){
			shad.nest = _this;
			_this.shadocks.push(shad);
		});
	};
	this.getShadocksIds = function()
	{
		var ids = [];
		this.shadocks.forEach(function(shadock){
			ids.push(shadock.id);
		});
		return ids;
	};
};

ShadockApp.Shadock = function(id, installedDate, nest)
{
	this.CLASS = 'Shadock';
	this.id= id || 0;
	this.nest = nest;
	this.installedDate = installedDate;
};