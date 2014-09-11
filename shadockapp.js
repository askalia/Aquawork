
var shadockApp = (function ShadockApp()
{
	"use strict";

	this.dbData = null;
	this._this = this;

	this.common = {};

	this.common.getAllBranchesWithOrWithoutChildren = function()
	{
		var list = { children: [], nochildren: []};
		for (var b in this.dbData.tree.branches)
		{
			var currBranch = this.dbData.tree.branches[b];
			this.common.getBranchChildren(currBranch, list);
		}
		return list;
	};

	/**
	 * @private
	 */
	this.common.getBranchByName = function(name)
	{
		var filterFunc = function(branch){
			return branch.name == name;
		};
		var filteredList = this.dbData.tree.branches.filter(filterFunc);
		return (filteredList.length ==1) ? filteredList[0] : null;
	};
	this.common.getNestById = function(id)
	{
		var filterFunc = function(nest){
			return nest.id == id;
		};
		var filteredList = this.api.getAllNestsInTree.filter(filterFunc);
		return (filteredList.length ==1) ? filteredList[0] : null;
	};
	this.common.getBranchChildren = function(branch, list)
	{
		if ('branches' in branch && typeof(list.children) != 'undefined')
		{
			if (branch.branches.length >0){
				list.children.push(branch);
				this.common.getBranchChildren(branch.branches, list);	
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
	this.common.getNestsInBranch = function(branch, execRule)
	{
		if (branch === null){
			throw new Error('La branche est indéfinie');
		}
		// on vérifie d'abord l'intégrité de la fonction de gestion
		if ('function' !== typeof(execRule)){
			throw new Error("le paramètre 'execRule' doit être une Fonction");
		}
		// la verif de l'existance des nids et leur nombre est à la charge de la présente fonction
		if ('nests' in branch && branch.nests.length >0){
			// on exécute la règle de gestion
			execRule.call(this, branch);
		}

		// on vérifie si la branche contient à son tour des branches
		if ('branches' in branch && branch.branches.length >0){
			this.api.getNestInBranch(branch.branches, execRule);
		}
	};

	this.common.isShadockMovable = function(movingShadock)
	{
		if (null !== movingShadock.nextNest)
		{
			throw new Error("Le prochain nid du shadock est inconnu");
		}
		var willHaveAllGoneAtDayD = true;
		for (var s in movingShadock.nextNest.shadocks)
		{
			var otherShadock = movingShadock.nextNest.shadocks[s];
			willHaveAllGoneAtDayD &= (parseInt((otherShadock.arrivalDate.getTime() - movingShadock.departureDate.getTime())/(24*3600*1000*7)) >1);
		}
		return (willHaveAllGoneAtDayD ==1);
	};

	/**************************************************************************/

	this.api = {};
	this.api.DB_NAME = 'shadockapp';

	this.api.start = function(args)
	{
		if (typeof(args) != 'undefined')
		{
			if ('datasource' in args && Array.isArray(args.datasource) && args.datasource.length >0){
				this.dbData = args.datasource;
			}
			return;
		}

		if (this.dbData === null){
			this.dbData = JSON.parse(window.localStorage.get(ShadockApp.DB_NAME));
		}
	};
	/**
	 * @describe Liste de tous les nids posés sur l’arbre.
	 * @public
	 * Cette fonction recense tous les nids posés sur l'arbre
	 * toutes branches confondues
	 * @return Array<nest> retListNests
	 */
	this.api.getAllNestsInTree = function getAllNestsInTree()
	{
		if (typeof getAllNestsInTree.retListNests == 'undefined')
		{
			var execRule = function(branch)
				{
					getAllNestsInTree.retListNests.push(branch.nests);
				};

			for (var b in this.dbData.tree.branches)
			{
				var currBranch = this.dbData.tree.branches[b];
				this.api.getNestsInBranch(currBranch, execRule);
			}
		}
		return getAllNestsInTree.retListNests;

	};
	/**
	 * @describe Liste des nids qui ont plus de 5 Shadocks
	 * @public
	 */
	this.api.getAllNestsWithMoreThanFiveShadocks = function()
	{
		var retListNests = [];
		var execRule = function(branch)
			{
				var MAX_ITEMS = 5;
				for (var n in branch.nests){
					if (branch.nests[n].shadocks.length > MAX_ITEMS){
						retListNests.push(branch.nests[n]);
					}
				}
			};

		for (var t in this.dbData.tree.branches)
		{
			var currBranch = this.dbData.tree.branches[t];
			this.api.getNestsInBranch(currBranch, execRule);
		}
		return retListNests;
	};
	/**
	 * @describe Liste de tous les Shadocks qui peuvent emménager dans un autre nid
	 * @public
	 */
	this.api.getAllShadockMovableToAnotherNest = function()
	{
		var retListMovableShadocks = [];
		var allNests = this.api.getAllNestsInTree();
		for (var n in allNests)
		{
			var currNest = allNests[n];
			for (var s in currNest.shadocks)
			{
				var currShadock = currNest.shadocks[s];
				if (true === this.common.isShadockMovable(currShadock)){
					retListMovableShadocks.push(currShadock);
				}
			}
		}
		return retListMovableShadocks;
	};
	/**
	 * @describe Liste des nids qui sont en forme de casserole mais pas rouge
	 * @public
	 */
	this.api.getNestWithBoilerShapeAndNotRed = function()
	{
		var retListNests = [];
		var allNests = this.api.getAllNestsInTree();
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
		for (var n in allNests)
		{
			var currNest = allNests[n];
			var isValid = true;
			// pour chaque propriété du nid, on vérifie les critères
			for (var p in currNest.props)
			{
				isValid &= meetReqsRule(currNest.props[p]);
			}
			if (isValid){
				retListNests.push(currNest);
			}		
			
		}
		return retListNests;
	};
	/**
	 * @describe Liste des branches qui supportent d’autres branches
	 * @public
	 */
	this.api.getAllBranchesWithChildren = function()
	{
		return this.api.getAllBranchesWithOrWithoutChildren().children;
	};
	/**
	 * @describe Liste des branches qui ne supportent pas de branche
	 * @public
	 */
	this.api.getAllBranchesWithoutChildren = function()
	{
		return this.api.getAllBranchesWithOrWithoutChildren().nochildren;
	};
	/*
	 * @describe  Liste des nids que supporte la branche “GaBuZoMe”
	 * @public
	 * @param {String} name
	 */
	this.api.getNestsInBranchName = function(name)
	{
		return this.common.getNestsInBranch(this.getBranchByName(name));
	};
	/**
	 * @describe La liste des nids qui ont toutes les caractéristiques possibles
	 * @public
	 * @return {Object} Nest
	 */
	this.api.getBranchWithMaximumOfProperties = function()
	{
		var listNests = this.api.getAllNestsInTree();
		var retListNests = [];
		// Récupération de compteurs de propriétés pour tous les nids 
		for (var n in listNests)
		{
			var currNest = listNests[n];
			retListNests[currNest.id] = currNest.props.length;
		}
		// renversement de la collection et récup de l'ID du nid
		var nestId = retListNests.reverse().shift();
		// renvoit de l'objet Nid
		return this.common.getNestById(nestId);
	};
	
	
	return this.api;	
	
})();

shadockApp.start();
shadockApp.getAllNestsInTree();
shadockApp.getAllNestsWithMoreThanFiveShadocks();
shadockApp.getAllShadockMovableToAnotherNest();
shadockApp.getNestWithBoilerShapeAndNotRed();
shadockApp.getAllBranchesWithChildren();
shadockApp.getAllBranchesWithoutChildren();
shadockApp.getNestsInBranchName('GaBuZoMe');