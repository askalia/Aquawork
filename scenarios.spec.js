// Scenarios de test
var scenariosTest =
{
	"Liste de tous les nids posés sur l’arbre" : function () {
		var dataSource = {};
		dataSource.tree = new ShadockApp.Tree();

		var rootBranche_1Nest = new ShadockApp.Branch('branche1');
		dataSource.tree.addBranch(rootBranche_1Nest);
		rootBranche_1Nest.addNest(new ShadockApp.Nest());

		var rootBranche_3Nest = new ShadockApp.Branch('branche2');
		dataSource.tree.addBranch(rootBranche_3Nest);
		rootBranche_3Nest.addNest(new ShadockApp.Nest());
		rootBranche_3Nest.addNest(new ShadockApp.Nest());
		rootBranche_3Nest.addNest(new ShadockApp.Nest());

		var subBranche_2Nest = new ShadockApp.Branch('branche2.1');
		rootBranche_3Nest.addBranch(subBranche_2Nest);
		subBranche_2Nest.addNest(new ShadockApp.Nest());
		subBranche_2Nest.addNest(new ShadockApp.Nest());

		var shadockApp = new ShadockApp({ db: dataSource});
		return shadockApp.getAllNestsInTree();

	},
	"Liste des nids qui ont plus de X Shadocks" : function(maxItems)
	{
		var dataSource = {};
		dataSource.tree = new ShadockApp.Tree();

		var rootBranche_1Nest = new ShadockApp.Branch('branche1');
		dataSource.tree.addBranch(rootBranche_1Nest);
		var nest1 = new ShadockApp.Nest();
		nest1.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_1Nest.addNest(nest1);

		var rootBranche_2 = new ShadockApp.Branch('branche2');
		dataSource.tree.addBranch(rootBranche_2);
		var nest2 = new ShadockApp.Nest();
		nest2.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_2.addNest(nest2);
		var nest3 = new ShadockApp.Nest();
		nest3.addShadocks([ new ShadockApp.Shadock(), new ShadockApp.Shadock(),new ShadockApp.Shadock(), new ShadockApp.Shadock(), new ShadockApp.Shadock(), new ShadockApp.Shadock(), new ShadockApp.Shadock(), new ShadockApp.Shadock()]);
		rootBranche_2.addNest(nest3);

		var subBranche_2 = new ShadockApp.Branch('branche2.1');
		rootBranche_2.addBranch(subBranche_2);
		var nest4 = new ShadockApp.Nest();
		nest4.addShadocks([ new ShadockApp.Shadock(), new ShadockApp.Shadock(),new ShadockApp.Shadock(), new ShadockApp.Shadock(), new ShadockApp.Shadock(), new ShadockApp.Shadock()]);
		subBranche_2.addNest(nest4);

		var shadockApp = new ShadockApp({ db: dataSource});
		return shadockApp.getAllNestsWithMoreThanXShadocks(maxItems);
	},
	"Liste de tous les Shadocks qui peuvent emménager dans un autre nid" : function()
	{
		var dataSource = {};
		dataSource.tree = new ShadockApp.Tree();

		var rootBranche1 = new ShadockApp.Branch('branche1');
		dataSource.tree.addBranch(rootBranche1);

		var nestLock = new ShadockApp.Nest(1);
		nestLock.addShadocks([new ShadockApp.Shadock(1, new Date('2014-01-01')), new ShadockApp.Shadock(2, new Date('2014-02-01')), new ShadockApp.Shadock(3, new Date('2014-03-15'))]);
		rootBranche1.addNest(nestLock);

		var nestUnlock = new ShadockApp.Nest(2);
		nestUnlock.addShadocks([new ShadockApp.Shadock(4, new Date('2014-04-07')), new ShadockApp.Shadock(5, new Date('2013-11-27')), new ShadockApp.Shadock(6, new Date('2013-12-22'))]);
		rootBranche1.addNest(nestUnlock);

		var shadockApp = new ShadockApp({ db: dataSource});
		return shadockApp.getAllShadockMovableToAnotherNest();
	},
	"Liste des nids qui sont en forme de casserole mais pas rouge" : function(criteria)
	{
		var dataSource = {};
		dataSource.tree = new ShadockApp.Tree();

		var rootBranche1 = new ShadockApp.Branch('branche1');
		dataSource.tree.addBranch(rootBranche1);

		var nest1 = new ShadockApp.Nest(1);
		rootBranche1.addNest(nest1);
		nest1.addProp({type: 'height', value:'10m'});
		nest1.addProp(({type: 'width', value: '50m'}));

		var nest2 = new ShadockApp.Nest(2);
		rootBranche1.addNest(nest2);
		nest2.addProp({type: 'shape', value:'boiler'});
		nest2.addProp({type: 'color', value: 'black'});

		var nest3 = new ShadockApp.Nest(3);
		rootBranche1.addNest(nest3);
		nest3.addProp({type: 'shape', value:'boiler'});
		nest3.addProp(({type: 'color', value: 'red'}));

		var shadockApp = new ShadockApp({ db: dataSource});
		return shadockApp.getNestPropMatchingCriteria(criteria);
	},
	"Liste des branches qui supportent d’autres branches" : function()
	{
		var dataSource = {};
		dataSource.tree = new ShadockApp.Tree();

		var rootBranche_1Nest = new ShadockApp.Branch('branche1');
		dataSource.tree.addBranch(rootBranche_1Nest);
		var nest1 = new ShadockApp.Nest();
		nest1.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_1Nest.addNest(nest1);

		var rootBranche_2 = new ShadockApp.Branch('branche2');
		dataSource.tree.addBranch(rootBranche_2);
		var nest2 = new ShadockApp.Nest();
		nest2.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_2.addNest(nest2);
		var nest3 = new ShadockApp.Nest();
		nest3.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_2.addNest(nest3);

		var subBranche_2 = new ShadockApp.Branch('branche2.1');
		rootBranche_2.addBranch(subBranche_2);
		var nest4 = new ShadockApp.Nest();
		nest4.addShadocks([ new ShadockApp.Shadock(), new ShadockApp.Shadock()]);
		subBranche_2.addNest(nest4);

		var shadockApp = new ShadockApp({db: dataSource});
		return shadockApp.getAllBranchesWithChildren();
	},
	"Liste des branches qui ne supportent pas de branche" : function()
	{
		var dataSource = {};
		dataSource.tree = new ShadockApp.Tree();

		var rootBranche_1Nest = new ShadockApp.Branch('branche1');
		dataSource.tree.addBranch(rootBranche_1Nest);
		var nest1 = new ShadockApp.Nest();
		nest1.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_1Nest.addNest(nest1);

		var rootBranche_2 = new ShadockApp.Branch('branche2');
		dataSource.tree.addBranch(rootBranche_2);
		var nest2 = new ShadockApp.Nest();
		nest2.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_2.addNest(nest2);
		var nest3 = new ShadockApp.Nest();
		nest3.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_2.addNest(nest3);

		var subBranche_2 = new ShadockApp.Branch('branche2.1');
		rootBranche_2.addBranch(subBranche_2);
		var nest4 = new ShadockApp.Nest();
		nest4.addShadocks([ new ShadockApp.Shadock(), new ShadockApp.Shadock()]);
		subBranche_2.addNest(nest4);

		var shadockApp = new ShadockApp({db: dataSource});
		return shadockApp.getAllBranchesWithoutChildren();
	},
	"Liste des nids que supporte la branche {name}" : function(name)
	{
		var dataSource = {};
		dataSource.tree = new ShadockApp.Tree();

		var rootBranche_1Nest = new ShadockApp.Branch('branche1');
		dataSource.tree.addBranch(rootBranche_1Nest);
		var nest1 = new ShadockApp.Nest();
		nest1.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_1Nest.addNest(nest1);

		var rootBranche_2 = new ShadockApp.Branch('GaBuZoMe');
		dataSource.tree.addBranch(rootBranche_2);
		var nest2 = new ShadockApp.Nest();
		nest2.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_2.addNest(nest2);
		var nest3 = new ShadockApp.Nest();
		nest3.addShadocks([ new ShadockApp.Shadock()]);
		rootBranche_2.addNest(nest3);

		var subBranche_2 = new ShadockApp.Branch('branche2.1');
		rootBranche_2.addBranch(subBranche_2);
		var nest4 = new ShadockApp.Nest();
		nest4.addShadocks([ new ShadockApp.Shadock(), new ShadockApp.Shadock()]);
		subBranche_2.addNest(nest4);

		var shadockApp = new ShadockApp({db: dataSource});
		return shadockApp.getAllNestsInBranchName(name);
	},
	"Liste des nids qui ont toutes les caractéristiques possibles" : function()
	{
		var dataSource = {};
		dataSource.tree = new ShadockApp.Tree();

		var rootBranche1 = new ShadockApp.Branch('branche1');
		dataSource.tree.addBranch(rootBranche1);

		var nest1 = new ShadockApp.Nest(1);
		rootBranche1.addNest(nest1);
		nest1.addProp({type: 'height', value:'10m'});
		nest1.addProp(({type: 'width', value: '50m'}));

		var nest2 = new ShadockApp.Nest(2);
		rootBranche1.addNest(nest2);
		nest2.addProp({type: 'shape', value:'boiler'});
		nest2.addProp({type: 'color', value: 'black'});
		nest2.addProp({type: 'door', value: '7'});
		nest2.addProp({type: 'roof', value: 'blue'});
		nest2.addProp({type: 'cellar', value: '10x10'});

		var nest3 = new ShadockApp.Nest(3);
		rootBranche1.addNest(nest3);
		nest3.addProp({type: 'shape', value:'boiler'});
		nest3.addProp(({type: 'color', value: 'red'}));

		var nest4 = new ShadockApp.Nest(4);
		rootBranche1.addNest(nest4);
		nest4.addProp({type: 'living-room', value:'30x30'});
		nest4.addProp({type: 'garage', value: 'dark'});
		nest4.addProp({type: 'laundry', value: '1'});
		nest4.addProp({type: 'window', value: 8});
		nest4.addProp({type: 'cellar', value: '10x10'});
		nest4.addProp({type: 'bedroom', value: 4});

		var shadockApp = new ShadockApp({ db: dataSource});
		return shadockApp.getNestWithMaximumProperties();
	}

};

function runScenario(describer, term, expectation_cb)
{
	if (! describer in scenariosTest){
		throw new Error("Ce scenario est introuvable");
	}
	var getResult = scenariosTest[describer](term);

	console.log('[RUN] : '+describer);
	//console.log('result obtained : '+getResult);

	if (typeof(expectation_cb) == 'function')
	{
		var expectedResult = expectation_cb.call(this, getResult);
		console.log('test is passed : '+(!!expectedResult));
	}
}


// Appel des méthodes API
runScenario("Liste de tous les nids posés sur l’arbre", null, function(nests){
	console.
	return (nests.length == 6);
});

runScenario("Liste des nids qui ont plus de X Shadocks", 5, function(nests){
	return (nests.length ==2);
});

runScenario("Liste de tous les Shadocks qui peuvent emménager dans un autre nid", null, function(movableShadocks){
	return (movableShadocks.length == 2);
});
runScenario("Liste des nids qui sont en forme de casserole mais pas rouge",
	[{ type : 'shape', value: 'boiler'},
		{ type: 'color', value: '!red' }],
	function(restNest){ return (restNest.id === 2); }
);
runScenario("Liste des branches qui supportent d’autres branches", null, function(branches){
	return (branches.length==1);
});

runScenario("Liste des branches qui ne supportent pas de branche", null, function(branches){
	return (branches.length==2);
});

runScenario("Liste des nids que supporte la branche {name}", 'GaBuZoMe', function(nests){
	return (nests.length ==2);
});

runScenario("Liste des nids qui ont toutes les caractéristiques possibles", null, function(nests){
	return (nests.length==4 && (nests[0].id == 4 && nests[1].id == 2 && nests[2].id == 1 && nests[3].id == 3));
});
