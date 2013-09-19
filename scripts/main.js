require.config({
    shim: {
        "lib/typo/typo": {
            exports: "Typo"
        }
    }
});
require([
    "Controller"
], function (Controller) {
    var c = new Controller();
});
