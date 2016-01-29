'use strict';

/* Directives */


angular.module('theastrologist.directives').
directive('timeline', [function () {
    const options = {
        orientation: {axis: 'top', item: 'top'}
    };

    const groups = new vis.DataSet([
        {"content": "Conjonctions", "id": "conj", "value": 1, className: 'aspect-group-conj'},
        {"content": "Opp. / Trigones", "id": "princ", "value": 2, className: 'aspect-group-princ'},
        {"content": "Carrés / Sextiles", "id": "second", "value": 3, className: 'aspect-group-second'}
    ]);

    const aspectGroups = {
        CONJONCTION: { groupId: 'conj', groupItemClass: 'item-conjonction' },
        OPPOSITION: { groupId: 'princ', groupItemClass: 'item-negatif' },
        TRIGONE: { groupId: 'princ', groupItemClass: 'item-positif' },
        CARRE: { groupId: 'second', groupItemClass: 'item-negatif' },
        SEXTILE: { groupId: 'second', groupItemClass: 'item-positif' }
    };

    const aspectOrders = {
        CONJONCTION: 0,
        OPPOSITION: 1,
        TRIGONE: 1,
        CARRE: 2,
        SEXTILE: 2
    };

    var fillPlanetPeriods = function (periods, items, planet) {
        angular.forEach(periods, function (value, index) {
            var el = {
                id: planet + '-' + index,
                content: value.natalPlanet,
                start: value.startDate,
                end: value.endDate,
                group: aspectGroups[value.aspect].groupId,
                order: aspectOrders[value.aspect],
                className: aspectGroups[value.aspect].groupItemClass
            };
            items.add(el);
        });
    };

    var fillHousePeriods = function (periods, items, planet) {
        angular.forEach(periods, function (value, index) {
            var el = {
                id: planet + '-' + value.natalHouse + '-' + index,
                content: value.natalHouse,
                start: value.startDate,
                end: value.endDate,
                type: 'background',
                className: value.natalHouse
            };
            items.add(el);
        });
    };

    return {
        restrict: 'E',
        replace: true,
        scope: {
            planet: '@',
            data: '='
        },
        template: '<md-card id="{{planet}}-viz">' +
        '   <md-card-content>' +
        '       <h2 class="md-title">{{planet}}</h2>' +
        '       <div class="planet-timeline"></div>' +
        '   </md-card-content>' +
        '</md-card>',
        compile: function (element, attribut) {
            return function (scope, elm, attr) {
                scope.$watchGroup(['planet', 'data'], function (newValues, oldValues, scope) {
                    var planet = newValues[0];
                    var data = newValues[1];
                    if (planet && data) {
                        var planetPeriods = data.planetPeriods[planet];
                        var housePeriods = data.housePeriods[planet];

                        var items = new vis.DataSet();
                        fillPlanetPeriods(planetPeriods, items, planet);
                        fillHousePeriods(housePeriods, items, planet);

                        var myElement = document.querySelector('#' + planet + '-viz .planet-timeline');
                        var localFrise = new vis.Timeline(myElement);
                        localFrise.setOptions(options);
                        localFrise.setGroups(groups);
                        localFrise.setItems(items);
                    }
                });
            };
        }
    };
}]);
