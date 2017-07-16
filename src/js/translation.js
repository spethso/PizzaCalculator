const i18n = require('i18n');

// TODO: Get Arrays from backend
var ingredients = [];
var templates = [];

// Setup i18n translation
i18n.configure({
    locales: ['en', 'de', 'ch'],
    directory: __dirname + '/locales',
    register: global
});
i18n.setLocale('de'); // Standard language is german
// TODO: Change language on demand

translate();

function translate() {
    for(let n = 0; n < ingredients.length; n++) {
        ingredients[n] = __(ingredients[n]);
    }
    ingredients.sort();
    templates.forEach(function (template) {
        let ing = template.ingredients;
        for (let n = 0; n < ing.length; n++) {
            ing[n] = __(ing[n]);
        }
    });
};