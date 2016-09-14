
var scenariosTest = require('./scenarios.spec');

function TestRunner(scenariosTest)
{

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

    function runAll()
    {
        // Appel des méthodes API
        runScenario("Liste de tous les nids posés sur l’arbre", null, function (nests) {
            return (nests.length == 6);
        });

        runScenario("Liste des nids qui ont plus de X Shadocks", 5, function (nests) {
            return (nests.length == 2);
        });

        runScenario("Liste de tous les Shadocks qui peuvent emménager dans un autre nid", null, function (movableShadocks) {
            return (movableShadocks.length == 2);
        });
        runScenario("Liste des nids qui sont en forme de casserole mais pas rouge",
            [
                { type: 'shape', value: 'boiler'},
                { type: 'color', value: '!red' }
            ],
            function (restNest) {
                return (restNest.id === 2);
            }
        );
        runScenario("Liste des branches qui supportent d’autres branches", null, function (branches) {
            return (branches.length == 1);
        });

        runScenario("Liste des branches qui ne supportent pas de branche", null, function (branches) {
            return (branches.length == 2);
        });

        runScenario("Liste des nids que supporte la branche {name}", 'GaBuZoMe', function (nests) {
            return (nests.length == 2);
        });

        runScenario("Liste des nids qui ont toutes les caractéristiques possibles", null, function (nests) {
            return (nests.length == 4 && (nests[0].id == 4 && nests[1].id == 2 && nests[2].id == 1 && nests[3].id == 3));
        });
    }

    return {
        runAll        
    };
}

TestRunner(scenariosTest).runAll();