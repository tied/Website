'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Weekdays: define([
        'MON',
        'TUE',
        'WED',
        'THU',
        'FRI',
        'SAT',
        'SUN'
    ]),
    weekDaysNumber: {
        0: 'SUN',
        1: 'MON',
        2: 'TUE',
        3: 'WED',
        4: 'THU',
        5: 'FRI',
        6: 'SAT'
    },
    weekDayLabel: function(wd) {
        return ({
            MON: 'Lundi',
            TUE: 'Mardi',
            WED: 'Mercredi',
            THU: 'Jeudi',
            FRI: 'Vendredi',
            SAT: 'Samedi',
            SUN: 'Dimanche'
        })[wd];
    },
    weekDayLabelFromInt: function(i) {
        return module.exports.weekDayLabel(module.exports.weekDaysNumber[i]);
    }
};
