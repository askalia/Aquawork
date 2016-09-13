// Modèle de données
module.exports = function models(ShadockApp)
{
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
        this.addProp = function(prop)
        {
            if (!'type' in prop && !'value' in prop){
                throw new Error("La propriété est invalide");
            }
            this.props.push(prop);
        };
        this.addShadocks = function(shadocks)
        {
            shadocks.forEach(function(shad){
                shad.nest = _this;
                _this.shadocks.push(shad);
            });
        };
    };

    ShadockApp.Shadock = function(id, installedDate, nest)
    {
        this.CLASS = 'Shadock';
        this.id= id || 0;
        this.nest = nest;
        this.installedDate = installedDate;
    };

    return ShadockApp;
};