
var shadockApp = (function ShadockApp()
{
	"use strict";

	this.dbData = null
	this._this = this;

	this.common = {};

	this.common.getAllBranchesWithOrWithoutChildren = function()
	{
		var list = { children: [], nochildren: []};
		for (var b in this.dbData.tree.branches)
		{
			currBranch = branches[b];
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
			throw new Error "le paramètre 'execRule' doit être une Fonction");
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
		var haveAllGone = true;
		for (var s in movingShadock.nextNest.shadocks)
		{
			otherShadock = movingShadock.nextNest.shadocks[s];
			willHaveAllGoneAtDayD &= parseInt((otherShadock.arrivalDate.getTime()-movingShadock.departureDate.getTime())/(24*3600*1000*7))
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
	/*
	 * @public
	 * Cette fonction recense tous les nids posés sur l'arbre
	 * toutes branches confondues
	 * @return Array<nest> retListNests
	 */
	this.api.getAllNestsInTree = function()
	{
		var _this = this;
		this.retListNests;
		if (this.retListNests === null)
		{
			var execRule = function(branch)
				{
					_this.retListNests.push(branch.nests);
				};

			for (var b in this.dbData.tree.branches)
			{
				currBranch = this.dbData.tree.branches[b];
				this.api.getNestsInBranch(currBranch, ruleCallback);
			}
		}
		return this.retListNests;

	};
	/**
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
			currBranch = this.dbData.tree.branches[t];
			this.api.getNestsInBranch(currBranch, execRule);
		}
		return retListNests;
	};
	/**
	 * @public
	 */
	this.api.getAllShadockMovableToAnotherNest = function()
	{
		var retListShadocks = [];
		var allNests = this.api.getAllNestsInTree();
		for (var n in allNests)
		{
			currNest = allNests[n];
			for (var s in currNest.shadocks)
			{
				if (true === this.common.isShadockMovable(shadock[s]))
				listMovableShadocks.push(shadock[s]);
			}
		}
		return retListShadocks;
	};
	/**
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
			return (prop.type == 'shape' && prop.value =='boiler')
				|| (prop.type == 'color' && prop.value != 'red');
		};
		// on parcourre tous les nids
		for (var n in allNests)
		{
			currNest = allNests[n];
			isValid = true;
			// pour chaque propriété du nid, on vérifie les critères
			for (var p in currNest.props)
			{
				isValid &= meetReqs(currNest.props[p])){
			}
			if (isValid){
				retListNests.push(currNest);
			}		
			
		}
		return retListNests;
	};
	/**
	 * @public
	 */
	this.api.getAllBranchesWithChildren = function()
	{
		return this.api.getAllBranchesWithOrWithoutChildren().children;
	}
	/**
	 * @public
	 */
	this.api.getAllBranchesWithoutChildren = function()
	{
		return this.api.getAllBranchesWithOrWithoutChildren().nochildren;
	};

	this.api.getNestsInBranchName = function(name)
	{
		return this.common.getNestsInBranch(this.getBranchByName(name));
	};

	this.api.getBranchWithMaximumOfProperties = function()
	{
		var listNests = this.api.getAllNestsInTree();
		retListNests = []; 
		for (var n in listNests)
		{
			currNest = listNests[n];
			retListNests[currNest.id] = currNest.props.length;
		}
		var nestId = retListNests.reverse().shift();
		return this.common.getNestById(nestId);
	};
	
	
	return this.api;	
	
})();

ShadockApp.start();
ShadockApp.getAllNestsInTree();
ShadockApp.getAllNestsWithMoreThanFiveShadocks();
ShadockApp.getAllShadockMovableToAnotherNest();
ShadockApp.getNestWithBoilerShapeAndNotRed();
ShadockApp.getAllBranchesWithChildren();
ShadockApp.getAllBranchesWithoutChildren();
ShadockApp.getNestsInBranchName('GaBuZoMe'));