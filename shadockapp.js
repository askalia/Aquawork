"use strict";

module.exports = (function()
{

	function ShadockApp(args)
	{	
		require('./core/shadockapp.api')(this);
		var _this = this;
		_this.dbData = args.db || {};
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
			if (typeof retListNests === 'undefined')
			{
				var retListNests = [];
				var execRule = function(branch){
					retListNests = retListNests.concat(branch.nests);
				};
				_this.dbData.tree.branches.forEach(function(currBranch, bIdx)
				{
					_this.API.getNestsInBranch(currBranch, execRule);
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
			if (isNaN(maxItems)){
				throw new Error("Le nombre max n'estpas indiqué");
			}
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

			_this.dbData.tree.branches.forEach(function(currBranch, bIdx)
			{
				_this.API.getNestsInBranch(currBranch, execRule);
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
					if (true === _this.API.isShadockMovable(currShadock)){
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
		this.getNestPropMatchingCriteria = function(criteria)
		{
			var allNests = this.getAllNestsInTree();

			var runComparator = function (nestProp, criterion) {
				var ret = false;
				var operator = criterion.value.replace(/[^(!|>|<|>=|<=)]/g, '');
				var term = criterion.value.replace(/(!|>|<|>=|<=)/g, '');
				switch (operator) {
					case '!' : ret = (nestProp.value !== term); break;
					case '>' : ret = (nestProp.value > term); break;
					case '>=': ret = (nestProp.value >= term); break;
					case '<' : ret = (nestProp.value < term);break;
					default : ret = (nestProp.value === term);
				}
				return ret;
			};

			var getMatchingCriterion = function(nestProp)
			{
				var retCriterion = null;
				criteria.forEach(function(criterion){
					if (criterion.type == nestProp.type){
						retCriterion = criterion;
					}
				});
				return retCriterion;
			};

			var retNest = null;

			allNests.forEach(function(currNest)
			{
				var isMatchingAll = true;
				currNest.props.forEach(function(nestProp)
				{
					var matchingCriterion = getMatchingCriterion(nestProp);
					if (matchingCriterion !== null){
						isMatchingAll &= runComparator(nestProp, matchingCriterion);
					}
					else if (matchingCriterion === null){
						isMatchingAll &= true;
					}
				});

				if (true === (!!isMatchingAll)){
					retNest = currNest;
					return;
				}
			});

			return retNest;
		};
		/**
		 * @describe Liste des branches qui supportent d’autres branches
		 * @public
		 */
		this.getAllBranchesWithChildren = function()
		{
			return _this.API.getAllBranchesWithOrWithoutChildren().children;
		};
		/**
		 * @describe Liste des branches qui ne supportent pas de branche
		 * @public
		 */
		this.getAllBranchesWithoutChildren = function()
		{
			return _this.API.getAllBranchesWithOrWithoutChildren().nochildren;
		};
		/*
		 * @describe Liste des nids que supporte la branche {name}
		 * @public
		 * @param {String} name
		 * @throws Error
		 * @return {Array<Nest>}
		 */
		this.getAllNestsInBranchName = function(name)
		{
			var retListNest = [];
			var execRule = function(branch){
				retListNest.push(branch.nests);
			};
			var branch = _this.API.getBranchByName(name);
			if (branch === null){
				throw new Error("La branche '"+name+"' est introuvable");
			}
			_this.API.getNestsInBranch(branch, execRule);
			return retListNest;
		};
		/**
		 * @describe Liste des nids qui ont toutes les caractéristiques possibles
		 * @public
		 * @return {Object} Nest
		 * @throws Error
		 */
		this.getNestWithMaximumProperties = function()
		{
			// On récupère tous les nids
			var listNests = this.getAllNestsInTree();
			if (listNests.length === 0){
				throw new Error("L'arbre ne contient aucun nid");
			}
			var retListNests = [];

			function sortPattern(a,b) {
				if (a.props.length < b.props.length)
					return 1;
				if (a.props.length > b.props.length)
					return -1;
				return 0;
			}

			listNests = listNests.sort(sortPattern);
			return listNests.slice(0, 5);

		};
		
		
	};

	// extends the app's blueprint with entities models
	require('./core/shadockapp.models')(ShadockApp);
	

	// Static methods
	ShadockApp.factoryShadocks = function(size, datatype)
	{
		return Array(size).fill( new ShadockApp.Shadock() ); 
	};

	ShadockApp.newApp = function(args)
	{
		return new ShadockApp(args);
	};

	// Here we gotta retun the app's blueprint for assignment in module.exports
	return ShadockApp;

})();