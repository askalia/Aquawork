// Scenarios de test
var scenariosTest = {
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
		return shadockApp.getAllNestsInTree().length;

	},
	"Liste des nids qui ont plus de 5 Shadocks" : function()
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
		return shadockApp.getAllNestsWithMoreThanFiveShadocks();
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
	"Liste des nids qui sont en forme de casserole mais pas rouge" : function()
	{

	}

};

function runScenario(describer, term)
{
	console.log('run > '+describer +' > ' + scenariosTest[describer](term));
}


// Appel des méthodes API

//runScenario("Liste de tous les nids posés sur l’arbre");
//runScenario("Liste des nids qui ont plus de X Shadocks", 5);
runScenario("Liste de tous les Shadocks qui peuvent emménager dans un autre nid");
